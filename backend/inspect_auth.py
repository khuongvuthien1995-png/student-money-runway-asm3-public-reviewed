"""Read-only, allowlisted Auth inspection; never print raw CLI/API responses."""

import json
import subprocess

import httpx

from backend.dev import PROJECT_URL, ROOT, load_local_settings


def main() -> int:
    settings = load_local_settings()
    if (settings.supabase_url or "").rstrip("/") != PROJECT_URL:
        print("Refusing an unidentified project.")
        return 1
    command = ["node", str(ROOT / "node_modules/supabase/dist/supabase.js"),
               "config", "diff", "--project-ref", "mnjmugwkjtihqswssiwa"]
    try:
        result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True, timeout=40)
        if result.returncode:
            print("CLI Auth configuration inspection failed; raw output suppressed.")
        else:
            data = json.loads(result.stdout)
            allowed = {"auth.email.enable_confirmations", "auth.enable_signup",
                       "auth.email.enable_signup", "auth.jwt_expiry"}
            for change in data.get("changes", []):
                path = change["path"]
                path = ".".join(path) if isinstance(path, list) else path
                if path in allowed and isinstance(change.get("remote"), (bool, int)):
                    print(f"Hosted {path}: {change['remote']}")
            print("CLI configuration inspection completed. Unchanged fields require comparison with local config; no configuration was written.")
        with httpx.Client(timeout=20) as client:
            response = client.get(f"{PROJECT_URL}/auth/v1/.well-known/jwks.json")
            print(f"JWKS HTTP status: {response.status_code}")
            if response.status_code == 200:
                keys = response.json().get("keys", [])
                print(f"JWKS key count: {len(keys)}")
                print("JWKS algorithms:", ", ".join(sorted({key.get("alg", "unspecified") for key in keys})))
            if not settings.supabase_publishable_key:
                print("Email/password provider inspection awaits SUPABASE_PUBLISHABLE_KEY.")
                return 1
            response = client.get(f"{PROJECT_URL}/auth/v1/settings",
                                  headers={"apikey": settings.supabase_publishable_key})
            print(f"Public Auth settings HTTP status: {response.status_code}")
            if response.status_code != 200:
                return 1
            data = response.json()
            for name in ("disable_signup", "mailer_autoconfirm"):
                if isinstance(data.get(name), bool):
                    print(f"Hosted {name}: {data[name]}")
            print("Hosted email provider enabled:", data.get("external", {}).get("email") is True)
        return 0
    except Exception:
        print("Read-only Auth inspection failed; credential and response details suppressed.")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
