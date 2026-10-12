"""Real HTTP, Auth, database and concurrency tests. Skipped without explicit opt-in.

Failures deliberately omit request bodies, response bodies, tokens and passwords.
Fixtures refuse users with pre-existing financial rows and clean only captured plan IDs.
"""

import base64
import json
import os
import subprocess
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from dataclasses import replace
from datetime import datetime, timezone
from pathlib import Path
from uuid import UUID, uuid4

import httpx
import jwt
import pytest

from backend.app.errors import AuthenticationError
from backend.app.security import SupabaseTokenVerifier

ROOT = Path(__file__).resolve().parents[3]


def require(condition, message):
    if not condition:
        pytest.fail(message, pytrace=False)


def cli_sql(sql):
    r = subprocess.run(
        ["node", str(ROOT / "node_modules/supabase/dist/supabase.js"), "db", "query",
         "--linked", sql], cwd=ROOT, capture_output=True, timeout=45,
    )
    require(r.returncode == 0, "Hosted SQL validation failed; raw output suppressed.")
    return json.loads(r.stdout)["rows"]


@pytest.fixture(scope="module")
def live(live_settings):
    settings = live_settings
    base = settings.supabase_url.rstrip("/")
    public_key = os.environ["SUPABASE_PUBLISHABLE_KEY"]
    db_headers = {"apikey": settings.supabase_secret_key}
    if not settings.supabase_secret_key.startswith("sb_secret_"):
        db_headers["Authorization"] = f"Bearer {settings.supabase_secret_key}"
    db = httpx.Client(base_url=f"{base}/rest/v1", timeout=20, headers=db_headers)
    auth_client = httpx.Client(base_url=base, timeout=20, headers={"apikey": public_key})
    users = []
    created = set()
    process = None
    api = None
    try:
        public_settings = auth_client.get("/auth/v1/settings")
        require(public_settings.status_code == 200, "Public Auth settings endpoint failed.")
        auth_settings = public_settings.json()
        require(auth_settings.get("external", {}).get("email") is True, "Email Auth provider is not enabled.")
        require(auth_settings.get("mailer_autoconfirm") is False, "Email confirmation setting differs from reviewed hosted configuration.")
        for label in ("A", "B"):
            try:
                response = auth_client.post("/auth/v1/token?grant_type=password", json={
                    "email": os.environ[f"TEST_USER_{label}_EMAIL"],
                    "password": os.environ[f"TEST_USER_{label}_PASSWORD"],
                })
            except httpx.HTTPError:
                pytest.fail(f"User {label} login transport failed; details suppressed.", pytrace=False)
            require(response.status_code == 200, f"User {label} cannot sign in; check confirmation/password/CAPTCHA directly.")
            session = response.json()
            token = session.get("access_token")
            require(bool(token), f"User {label} sign-in returned no access token.")
            try:
                verified = SupabaseTokenVerifier(settings).verify(token)
            except Exception:
                pytest.fail(f"User {label} token failed real JWKS verification.", pytrace=False)
            require(str(verified.id) == session["user"]["id"], "Verified subject differs from Auth identity.")
            require(jwt.get_unverified_header(token).get("alg") == "ES256", "Actual session is not signed with ES256.")
            users.append({"id": str(verified.id), "token": token})
        require(users[0]["id"] != users[1]["id"], "Two distinct Auth users are required.")
        for user in users:
            for table in ("plans", "purchases"):
                r = db.get(f"/{table}", params={"user_id": f"eq.{user['id']}", "select": "id"})
                require(r.status_code == 200 and r.json() == [], "Dedicated test account has financial data; refusing mutations.")
        # Bind to a free loopback port, then start a real Uvicorn HTTP server.
        import socket
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]
        process = subprocess.Popen(
            [str(ROOT / ".venv/Scripts/python.exe"), "-m", "backend.dev", "--port", str(port)],
            cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        api = httpx.Client(base_url=f"http://127.0.0.1:{port}", timeout=30)
        ready = False
        for _ in range(100):
            if process.poll() is not None:
                break
            try:
                ready = api.get("/api/health").status_code == 200
            except httpx.HTTPError:
                pass
            if ready:
                break
            time.sleep(0.1)
        require(ready, "Configured Uvicorn did not become healthy; output suppressed.")
        yield {"settings": settings, "users": users, "api": api, "db": db,
               "public_key": public_key, "created": created}
    finally:
        # Only delete IDs returned by this run, with an additional owner filter.
        cleanup_failed = False
        for plan_id, user_id in created:
            try:
                result = db.delete("/plans", params={"id": f"eq.{plan_id}", "user_id": f"eq.{user_id}"})
                check = db.get("/plans", params={"id": f"eq.{plan_id}", "select": "id"})
                children = db.get("/purchases", params={"plan_id": f"eq.{plan_id}", "select": "id"})
                cleanup_failed |= result.status_code not in (200, 204) or check.status_code != 200 or check.json() != [] or children.status_code != 200 or children.json() != []
            except Exception:
                cleanup_failed = True
        if api is not None:
            api.close()
        if process is not None:
            process.terminate()
            try:
                process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)
        db.close()
        auth_client.close()
        if cleanup_failed:
            pytest.fail("Fixture cleanup incomplete; inspect dedicated test accounts before rerunning.", pytrace=False)


def test_real_bearer_verification(live, monkeypatch):
    settings = live["settings"]
    token = live["users"][0]["token"]
    verifier = SupabaseTokenVerifier(settings)
    for user in live["users"]:
        require(str(verifier.verify(user["token"]).id) == user["id"], "Real bearer subject verification failed.")
    parts = token.split(".")
    signature = bytearray(base64.urlsafe_b64decode(parts[2] + "=" * (-len(parts[2]) % 4)))
    signature[0] ^= 1
    forged = ".".join(parts[:2] + [base64.urlsafe_b64encode(signature).decode().rstrip("=")])
    for bad in ("malformed", forged):
        with pytest.raises(AuthenticationError):
            verifier.verify(bad)
    for changed in (replace(settings, supabase_jwt_issuer="https://wrong.invalid/auth/v1"),
                    replace(settings, supabase_jwt_audience="wrong-audience")):
        with pytest.raises(AuthenticationError):
            SupabaseTokenVerifier(changed).verify(token)
    # Preserve the authentic signature; move verifier time beyond actual exp.
    claims = jwt.decode(token, options={"verify_signature": False})
    class AfterExpiry(datetime):
        @classmethod
        def now(cls, tz=None):
            return datetime.fromtimestamp(claims["exp"] + 1, tz=timezone.utc)
    with monkeypatch.context() as patch:
        patch.setattr(jwt.api_jwt, "datetime", AfterExpiry)
        with pytest.raises(AuthenticationError):
            verifier.verify(token)
    api = live["api"]
    for headers in ({}, {"Authorization": "Bearer malformed"}, {"Authorization": f"Bearer {forged}"}):
        require(api.get("/api/plans/current", headers=headers).status_code == 401, "Invalid/missing bearer was not rejected by HTTP API.")


def test_real_financial_lifecycle_isolation_and_concurrency(live):
    api, db = live["api"], live["db"]
    a, b = live["users"]
    def headers(user):
        return {"Authorization": f"Bearer {user['token']}"}
    def call(method, path, user=a, payload=None, expected=200):
        response = api.request(method, path, headers=headers(user), json=payload)
        require(response.status_code == expected, f"{method} {path} returned unexpected status {response.status_code} (expected {expected}); body suppressed.")
        return response.json()
    def plan(user, payload):
        data = call("PUT", "/api/plans/current", user, payload)["plan"]
        live["created"].add((data["id"], user["id"]))
        require(data["userId"] == user["id"], "Client identity overrode verified owner.")
        return data
    def rows(table, user):
        r = db.get(f"/{table}", params={"user_id": f"eq.{user['id']}", "select": "*"})
        require(r.status_code == 200, "Independent database read failed.")
        return r.json()
    canonical = {"planningDate": "2026-10-12", "availableFundsCents": 95000,
                 "safetyBufferCents": 10000, "fixedEssentialsCents": 45500,
                 "flexibleEssentialsCents": 18000}
    require(api.get("/api/health").json() == {"status": "ok"}, "Real HTTP health failed.")
    paths = api.get("/openapi.json").json()["paths"]
    operations = {(path, verb) for path, item in paths.items() for verb in item if verb in {"get", "put", "post"}}
    require(operations == {("/api/health", "get"), ("/api/plans/current", "get"),
                           ("/api/plans/current", "put"), ("/api/plans/current/purchases", "get"),
                           ("/api/plans/current/purchases", "post")}, "OpenAPI differs from five-operation contract.")
    require(call("GET", "/api/plans/current", expected=404)["error"]["code"] == "PLAN_NOT_FOUND", "No-plan response incorrect.")
    require(call("GET", "/api/plans/current", b, expected=404)["error"]["code"] == "PLAN_NOT_FOUND", "User B no-plan response incorrect.")
    pa = plan(a, {**canonical, "userId": b["id"], "user_id": b["id"]})
    require(pa["protectedTotalCents"] == 73500 and pa["runwayCents"] == 21500, "Canonical calculations incorrect.")
    got = call("GET", "/api/plans/current")["plan"]
    require(all(got[k] == v for k, v in canonical.items()), "Saved source fields did not round-trip.")
    updated = plan(a, {**canonical, "safetyBufferCents": 11000})
    require(updated["id"] == pa["id"] and len(rows("plans", a)) == 1, "Update violated one-plan-per-user.")
    plan(a, canonical)
    pb = plan(b, canonical)
    for user, own in ((a, pa), (b, pb)):
        require(call("GET", "/api/plans/current", user)["plan"]["id"] == own["id"], "Cross-user plan leakage.")
    purchase = {"name": "Test Purchase", "amountCents": 16000, "idempotencyKey": str(uuid4())}
    confirmed = call("POST", "/api/plans/current/purchases", payload=purchase, expected=201)
    require(confirmed["plan"]["availableFundsCents"] == 79000 and confirmed["plan"]["runwayCents"] == 5500, "Purchase deduction incorrect.")
    require(len(rows("purchases", a)) == 1 and rows("plans", a)[0]["available_funds_cents"] == 79000, "Committed purchase effects incorrect.")
    require(len(call("GET", "/api/plans/current/purchases")["purchases"]) == 1, "User A history incorrect.")
    require(call("GET", "/api/plans/current/purchases", b)["purchases"] == [], "User B saw User A history.")
    replay = call("POST", "/api/plans/current/purchases", payload=purchase)
    require(replay["replayed"] and replay["purchase"]["id"] == confirmed["purchase"]["id"], "Replay was not idempotent.")
    for changed in ({**purchase, "amountCents": 16001}, {**purchase, "name": "Modified"}):
        require(call("POST", "/api/plans/current/purchases", payload=changed, expected=409)["error"]["code"] == "IDEMPOTENCY_KEY_REUSED", "Mismatch error incorrect.")
    require(call("POST", "/api/plans/current/purchases", b, purchase, expected=409)["error"]["code"] == "IDEMPOTENCY_KEY_REUSED", "Cross-user replay was allowed.")
    excess = {"name": "Excess", "amountCents": 5501, "idempotencyKey": str(uuid4())}
    require(call("POST", "/api/plans/current/purchases", payload=excess, expected=409)["error"]["code"] == "PURCHASE_EXCEEDS_RUNWAY", "Excess purchase error incorrect.")
    require(len(rows("purchases", a)) == 1 and rows("plans", a)[0]["available_funds_cents"] == 79000, "Rejected/replayed request mutated finances.")
    # Prove rollback after a successful RPC has inserted and deducted inside a subtransaction.
    owner = str(UUID(a["id"]))
    key = str(uuid4())
    cli_sql(f"""begin; do $$ declare funds bigint; purchases bigint; begin
      select available_funds_cents into funds from public.plans where user_id='{owner}'::uuid;
      select count(*) into purchases from public.purchases where user_id='{owner}'::uuid;
      begin
        perform * from public.confirm_purchase('{owner}'::uuid,'Rollback Test',1,'{key}'::uuid);
        perform 1/0;
      exception when division_by_zero then null; end;
      if funds <> (select available_funds_cents from public.plans where user_id='{owner}'::uuid)
         or purchases <> (select count(*) from public.purchases where user_id='{owner}'::uuid)
      then raise exception 'Atomic rollback failed'; end if;
      end $$; rollback; select true as atomic_rollback_verified;""")
    require(len(rows("purchases", a)) == 1 and rows("plans", a)[0]["available_funds_cents"] == 79000, "Atomic rollback did not preserve state.")
    boundary = call("POST", "/api/plans/current/purchases", b,
                    {"name": "Exact boundary", "amountCents": 21500, "idempotencyKey": str(uuid4())}, expected=201)
    require(boundary["plan"]["runwayCents"] == 0, "Exact runway boundary failed.")
    plan(b, {**canonical, "availableFundsCents": 100, "safetyBufferCents": 0,
             "fixedEssentialsCents": 0, "flexibleEssentialsCents": 0})
    before = len(rows("purchases", b))
    barrier = threading.Barrier(2)
    def concurrent_confirm():
        with httpx.Client(base_url=str(api.base_url), timeout=30) as connection:
            payload = {"name": "Concurrent test", "amountCents": 80, "idempotencyKey": str(uuid4())}
            barrier.wait(timeout=10)
            response = connection.post("/api/plans/current/purchases", headers=headers(b), json=payload)
            return response.status_code, response.json().get("error", {}).get("code")
    with ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(lambda _: concurrent_confirm(), range(2)))
    require(sorted(status for status, _ in results) == [201, 409], "Concurrent confirmations did not serialize correctly.")
    require(any(code == "PURCHASE_EXCEEDS_RUNWAY" for _, code in results), "Concurrent rejection code incorrect.")
    require(len(rows("purchases", b)) == before + 1 and rows("plans", b)[0]["available_funds_cents"] == 20, "Concurrency caused overspend/lost update/wrong count.")
    for user in (a, b):
        user_headers = {"apikey": live["public_key"], **headers(user)}
        for table in ("plans", "purchases"):
            for method in ("GET", "POST"):
                r = httpx.request(method, f"{live['settings'].supabase_url}/rest/v1/{table}",
                                  headers=user_headers, json={} if method == "POST" else None, timeout=20)
                require(r.status_code in (401, 403), "Browser financial table access was not denied.")
        denied = httpx.post(f"{live['settings'].supabase_url}/rest/v1/rpc/confirm_purchase",
                            headers=user_headers, json={"p_user_id": user["id"], "p_name": "Denied",
                            "p_amount_cents": 1, "p_idempotency_key": str(uuid4())}, timeout=20)
        require(denied.status_code in (401, 403), "Browser could execute restricted RPC.")
    metadata = cli_sql("select version from supabase_migrations.schema_migrations order by version;")
    require(any(row["version"] == "20261012020847" for row in metadata), "Hosted migration version missing.")
