"""Student-invoked signup through normal Supabase email confirmation."""

import argparse

import httpx
from dotenv import dotenv_values

from backend.dev import PROJECT_URL, ROOT, load_local_settings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--signup", action="store_true", required=True,
                        help="Submit signups for the two locally configured test identities.")
    parser.parse_args()
    settings = load_local_settings()
    values = dotenv_values(ROOT / ".env.live-tests.local")
    fields = ("TEST_USER_A_EMAIL", "TEST_USER_A_PASSWORD", "TEST_USER_B_EMAIL", "TEST_USER_B_PASSWORD")
    if (settings.supabase_url or "").rstrip("/") != PROJECT_URL:
        print("Refusing an unidentified project.")
        return 1
    if not settings.supabase_publishable_key or any(not values.get(name) for name in fields):
        print("Fill the ignored publishable-key and test-account fields locally first.")
        return 1
    if values[fields[0]].strip().lower() == values[fields[2]].strip().lower():
        print("Two distinct student-controlled email addresses are required.")
        return 1
    try:
        with httpx.Client(base_url=PROJECT_URL, timeout=20,
                          headers={"apikey": settings.supabase_publishable_key}) as client:
            response = client.get("/auth/v1/settings")
            if response.status_code != 200:
                print("Cannot verify Auth settings; no signup submitted.")
                return 1
            config = response.json()
            if config.get("disable_signup") is not False or config.get("external", {}).get("email") is not True:
                print("Email signup unavailable; inspect dashboard settings directly.")
                return 1
            if config.get("mailer_autoconfirm") is not False:
                print("Email-confirmation setting differs from reviewed configuration; no signup submitted.")
                return 1
            for label in ("A", "B"):
                response = client.post("/auth/v1/signup", json={
                    "email": values[f"TEST_USER_{label}_EMAIL"],
                    "password": values[f"TEST_USER_{label}_PASSWORD"],
                })
                if response.status_code not in (200, 201):
                    print(f"User {label} signup rejected (HTTP {response.status_code}); inspect password, rate-limit or CAPTCHA requirements directly.")
                    return 1
                print(f"User {label} signup request accepted. Complete email confirmation in your browser. Existing-account status is verified only by login.")
        return 0
    except Exception:
        print("Signup transport failed; details suppressed. Verify account state directly before retrying.")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
