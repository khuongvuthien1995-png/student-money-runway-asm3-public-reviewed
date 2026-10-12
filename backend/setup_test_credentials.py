"""Interactive identity/secret entry only; never echoes or reports values."""

import getpass
import subprocess

from dotenv import dotenv_values, set_key

from backend.dev import ROOT


def main() -> int:
    target = ROOT / ".env.live-tests.local"
    if (ROOT / "supabase/.temp/project-ref").read_text().strip() != "mnjmugwkjtihqswssiwa":
        print("Refusing an unidentified project.")
        return 1
    ignored = subprocess.run(["git", "check-ignore", "--quiet", str(target)], cwd=ROOT,
                             capture_output=True)
    if ignored.returncode or not target.exists():
        print("The existing test configuration must be Git-ignored.")
        return 1
    print("Enter two dedicated accounts you control. Input is hidden and stays local.")
    print("No signup or database operation will run from this prompt.")
    values = {}
    try:
        for label in ("A", "B"):
            while True:
                email = getpass.getpass(f"User {label} email (hidden): ").strip()
                if not email or "@" not in email:
                    print("A nonempty email address is required. Please re-enter it.")
                    continue
                if label == "B" and email.lower() == values["TEST_USER_A_EMAIL"].lower():
                    print("User B must use a different email. Please re-enter it.")
                    continue
                break
            while True:
                password = getpass.getpass(f"User {label} password (hidden): ")
                if password.strip():
                    break
                print("A nonempty password is required. Please re-enter it.")
            values[f"TEST_USER_{label}_EMAIL"] = email
            values[f"TEST_USER_{label}_PASSWORD"] = password
        for name, value in values.items():
            set_key(str(target), name, value, quote_mode="always")
        saved = dotenv_values(target, interpolate=False)
        if any(saved.get(name) != value for name, value in values.items()):
            print("Saved-value verification failed. Setup is incomplete; no Auth operation ran.")
            return 1
        print("All four test fields saved to the ignored workspace file. Values suppressed.")
        return 0
    except (KeyboardInterrupt, EOFError):
        print("Input cancelled. Nothing was saved.")
        return 1
    except OSError:
        print("Configuration could not be saved or verified. Details suppressed; setup incomplete.")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
