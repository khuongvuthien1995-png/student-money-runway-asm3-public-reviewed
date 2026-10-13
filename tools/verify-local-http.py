"""C4 actual loopback HTTP and Vite proxy checks; no provider configuration or writes."""

import json
import os
from pathlib import Path
import shutil
import signal
import socket
import subprocess
import sys
import time

import httpx


ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / "docs/implementation/evidence/c4/local-http-results.json"
API = "http://127.0.0.1:8000"
FRONTEND = "http://127.0.0.1:5194"


def require_free_port(port: int) -> None:
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", port))


def wait_ready(client: httpx.Client, url: str, process: subprocess.Popen) -> None:
    deadline = time.monotonic() + 20
    while time.monotonic() < deadline:
        if process.poll() is not None:
            raise RuntimeError("Local QA process exited before startup; raw output suppressed.")
        try:
            if client.get(url).status_code == 200:
                return
        except httpx.TransportError:
            pass
        time.sleep(0.1)
    raise RuntimeError("Local QA server did not become ready.")


def stop_process(process: subprocess.Popen) -> tuple[int, str]:
    if process.poll() is None:
        if sys.platform == "win32":
            process.send_signal(signal.CTRL_BREAK_EVENT)
        else:
            process.send_signal(signal.SIGTERM)
    try:
        output, _ = process.communicate(timeout=8)
    except subprocess.TimeoutExpired:
        process.kill()
        process.communicate()
        raise RuntimeError("Local QA process failed to stop gracefully.")
    return process.returncode, output or ""


def main() -> int:
    require_free_port(8000)
    require_free_port(5194)
    # The real entrypoint does not load dotenv. Remove inherited cloud configuration too.
    environment = {key: value for key, value in os.environ.items()
                   if not key.startswith(("SUPABASE_", "TEST_USER_", "VITE_"))
                   and key not in {"RUN_SUPABASE_LIVE_TESTS", "ALLOWED_ORIGIN"}}
    environment["RUN_SUPABASE_LIVE_TESTS"] = "0"
    environment["ALLOWED_ORIGIN"] = "http://localhost:5173"
    creationflags = subprocess.CREATE_NEW_PROCESS_GROUP if sys.platform == "win32" else 0
    records = []
    processes = []
    stopped = []
    failure = None

    def record(name: str, response: httpx.Response, status: int) -> None:
        assert response.status_code == status, f"{name}: expected {status}, received {response.status_code}"
        records.append({"check": name, "status": response.status_code, "result": "PASS"})

    try:
        backend = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "api.index:app", "--host", "127.0.0.1", "--port", "8000",
             "--no-access-log", "--log-level", "info"], cwd=ROOT, env=environment,
            stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, creationflags=creationflags,
        )
        processes.append(("uvicorn", backend))
        with httpx.Client(timeout=2, trust_env=False) as client:
            wait_ready(client, API + "/api/health", backend)
            health = client.get(API + "/api/health")
            record("real entrypoint health envelope", health, 200)
            assert health.json() == {"status": "ok"}
            schema = client.get(API + "/openapi.json")
            record("OpenAPI path and response contracts", schema, 200)
            paths = schema.json()["paths"]
            assert set(paths) == {"/api/health", "/api/plans/current", "/api/plans/current/purchases"}
            assert sum(len(path) for path in paths.values()) == 5
            for path, method, model in [
                ("/api/plans/current", "get", "PlanEnvelope"),
                ("/api/plans/current", "put", "PlanEnvelope"),
                ("/api/plans/current/purchases", "get", "PurchasesEnvelope"),
                ("/api/plans/current/purchases", "post", "PurchaseConfirmationEnvelope"),
            ]:
                statuses = ["200", "201"] if method == "post" else ["200"]
                for status in statuses:
                    assert paths[path][method]["responses"][status]["content"]["application/json"]["schema"] == {"$ref": f"#/components/schemas/{model}"}
                assert paths[path][method]["responses"]["401"]["content"]["application/json"]["schema"] == {"$ref": "#/components/schemas/ErrorResponse"}
            assert paths["/api/plans/current/purchases"]["post"]["responses"]["422"]["content"]["application/json"]["schema"] == {"$ref": "#/components/schemas/ErrorResponse"}

            writes = {
                "PUT": {"planningDate": "2026-10-12", "availableFundsCents": 95000,
                        "safetyBufferCents": 10000, "fixedEssentialsCents": 45500, "flexibleEssentialsCents": 18000},
                "POST": {"name": "C4 unauthorized probe", "amountCents": 16000,
                         "idempotencyKey": "cccccccc-cccc-4ccc-8ccc-cccccccccccc"},
            }
            for method, path in [("GET", "/api/plans/current"), ("PUT", "/api/plans/current"),
                                 ("GET", "/api/plans/current/purchases"), ("POST", "/api/plans/current/purchases")]:
                for kind, header in [("missing", None), ("wrong scheme", "Basic c4-test-only"),
                                     ("malformed JWT", "Bearer not-a-token")]:
                    response = client.request(method, API + path, json=writes.get(method),
                                              headers={"Authorization": header} if header else {})
                    record(f"{method} {path}: {kind} bearer", response, 401)
                    body = response.json()
                    assert set(body) == {"error"} and set(body["error"]) == {"code", "message"}
                    assert body["error"]["code"] in {"UNAUTHENTICATED", "INVALID_ACCESS_TOKEN"}
                    assert "not-a-token" not in response.text and "c4-test-only" not in response.text

            preflight_headers = {"Origin": "http://localhost:5173", "Access-Control-Request-Method": "POST",
                                 "Access-Control-Request-Headers": "authorization,content-type"}
            permitted = client.options(API + "/api/plans/current/purchases", headers=preflight_headers)
            record("CORS permitted origin preflight", permitted, 200)
            assert permitted.headers.get("access-control-allow-origin") == "http://localhost:5173"
            assert "access-control-allow-credentials" not in permitted.headers
            assert set(permitted.headers["access-control-allow-methods"].split(", ")) == {"GET", "PUT", "POST"}
            denied = client.options(API + "/api/plans/current/purchases", headers={**preflight_headers, "Origin": "https://untrusted.invalid"})
            record("CORS unapproved origin preflight", denied, 400)
            assert "access-control-allow-origin" not in denied.headers
            denied_method = client.options(API + "/api/plans/current", headers={**preflight_headers, "Access-Control-Request-Method": "DELETE"})
            record("CORS unapproved method preflight", denied_method, 400)

            # Actual production Vite config, no mock plugin or intercepted API for this check.
            node = shutil.which("node")
            if not node:
                raise RuntimeError("Node is unavailable for the development proxy check.")
            frontend = subprocess.Popen(
                [node, str(ROOT / "node_modules/vite/bin/vite.js"), "--host", "127.0.0.1", "--port", "5194", "--strictPort"],
                cwd=ROOT, env=environment, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                text=True, creationflags=creationflags,
            )
            processes.append(("vite", frontend))
            wait_ready(client, FRONTEND, frontend)
            through_proxy = client.get(FRONTEND + "/api/health")
            record("actual Vite /api proxy forwards to local FastAPI", through_proxy, 200)
            assert through_proxy.json() == {"status": "ok"}
            record("proxy preserves unauthenticated API rejection", client.get(FRONTEND + "/api/plans/current"), 401)
    except Exception as error:
        failure = f"{type(error).__name__}: {error}"
    finally:
        for name, process in reversed(processes):
            try:
                code, output = stop_process(process)
                assert not any(value in output for value in ("not-a-token", "c4-test-only", "Authorization", "sb_secret_", "Traceback"))
                if name == "uvicorn":
                    assert "Application startup complete." in output and "Application shutdown complete." in output
                stopped.append({"process": name, "stopped": process.poll() is not None,
                                "exitCode": code, "safeLogs": True, "shutdown": "SIGBREAK (Windows) or SIGTERM; socket closed",
                                "applicationShutdownComplete": name == "uvicorn" and "Application shutdown complete." in output})
            except Exception as error:
                failure = failure or f"{type(error).__name__}: {error}"
        with httpx.Client(timeout=0.3, trust_env=False) as client:
            for url in (API, FRONTEND):
                try:
                    client.get(url + "/api/health")
                    failure = failure or "A QA server remained reachable after shutdown."
                except httpx.TransportError:
                    pass
        EVIDENCE.parent.mkdir(parents=True, exist_ok=True)
        EVIDENCE.write_text(json.dumps({"mode": "ACTUAL LOOPBACK HTTP; NO PROVIDER CONFIGURATION OR AUTHENTICATED DATABASE SUCCESS",
                                      "passed": len(records), "failed": int(failure is not None), "skipped": 0,
                                      "checks": records, "processes": stopped, "error": failure}, indent=2), encoding="utf-8")
    print(f"Local HTTP: {len(records)} checks passed; {int(failure is not None)} failures; 0 skipped.")
    if failure:
        print(failure)
    return int(failure is not None)


if __name__ == "__main__":
    raise SystemExit(main())
