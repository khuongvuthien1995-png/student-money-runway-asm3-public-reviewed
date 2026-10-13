"""Guarded, explicitly opted-in Gmail SMTP setup for the approved project only.

Credentials stay in ignored configuration and process memory. No test email,
signup, account modification or financial operation is performed by this tool.
"""
import argparse
import ctypes
import os
import re
import smtplib
import ssl
import subprocess
from dataclasses import dataclass
from pathlib import Path

import httpx
from dotenv import dotenv_values

ROOT = Path(__file__).resolve().parents[1]
PROJECT = "mnjmugwkjtihqswssiwa"
ORIGIN = "https://student-money-runway-asm3-preview.vercel.app"
ENDPOINT = f"https://api.supabase.com/v1/projects/{PROJECT}/config/auth"
SMTP_FIELDS = {"smtp_host", "smtp_port", "smtp_user", "smtp_pass", "smtp_admin_email", "smtp_sender_name", "rate_limit_email_sent"}


class SetupError(ValueError):
    """A safe locally-authored message; provider exceptions are never printed."""


@dataclass(frozen=True, repr=False)
class Credentials:
    username: str
    password: str


def parse_credentials(values):
    username = (values.get("SMTP_USERNAME") or "").strip()
    password = (values.get("SMTP_PASSWORD") or "").replace(" ", "").strip()
    if not re.fullmatch(r"[^\s@]+@(?:gmail|googlemail)\.com", username, re.IGNORECASE):
        raise SetupError("SMTP_USERNAME requires your permitted Gmail address.")
    if not re.fullmatch(r"[A-Za-z]{16}", password):
        raise SetupError("SMTP_PASSWORD requires a 16-letter Google app password.")
    return Credentials(username, password)


def build_patch(credentials):
    return {"smtp_host": "smtp.gmail.com", "smtp_port": "587", "smtp_user": credentials.username,
            "smtp_pass": credentials.password, "smtp_admin_email": credentials.username,
            "smtp_sender_name": "Student Money Runway", "rate_limit_email_sent": 30}


def protect_current_settings(current, patch):
    if current.get("mailer_autoconfirm") is not False or current.get("disable_signup") is not False:
        raise SetupError("Required confirmation/signup configuration differs; no change applied.")
    if current.get("site_url") != ORIGIN or current.get("uri_allow_list") != ORIGIN + "/login":
        raise SetupError("Approved Auth URLs differ; no change applied.")
    if set(patch) != SMTP_FIELDS:
        raise SetupError("Unapproved configuration fields; no change applied.")
    if current.get("smtp_host") and any(str(current.get(k)) != str(patch[k])
                                        for k in ("smtp_host", "smtp_port", "smtp_user", "smtp_admin_email")):
        raise SetupError("Existing custom SMTP differs; refusing replacement.")


def cli_token():
    if os.environ.get("SUPABASE_ACCESS_TOKEN"):
        return os.environ["SUPABASE_ACCESS_TOKEN"]
    if os.name != "nt":
        raise SetupError("An existing authorized CLI session is required.")
    from ctypes import wintypes as w
    class Credential(ctypes.Structure):
        _fields_ = [("Flags", w.DWORD), ("Type", w.DWORD), ("TargetName", w.LPWSTR),
                    ("Comment", w.LPWSTR), ("LastWritten", w.FILETIME), ("BlobSize", w.DWORD),
                    ("Blob", ctypes.POINTER(ctypes.c_ubyte)), ("Persist", w.DWORD),
                    ("AttributeCount", w.DWORD), ("Attributes", ctypes.c_void_p),
                    ("TargetAlias", w.LPWSTR), ("UserName", w.LPWSTR)]
    result = subprocess.run(["cmdkey", "/list"], capture_output=True, text=True, check=True)
    targets = [line.split("target=", 1)[1].strip() for line in result.stdout.splitlines()
               if "supabase cli" in line.lower() and "target=" in line]
    if len(targets) != 1:
        raise SetupError("One identified existing Supabase CLI credential is required.")
    api = ctypes.WinDLL("advapi32", use_last_error=True)
    api.CredReadW.argtypes = [w.LPCWSTR, w.DWORD, w.DWORD, ctypes.POINTER(ctypes.POINTER(Credential))]
    api.CredReadW.restype = w.BOOL
    api.CredFree.argtypes = [ctypes.c_void_p]
    pointer = ctypes.POINTER(Credential)()
    if not api.CredReadW(targets[0], 1, 0, ctypes.byref(pointer)):
        raise SetupError("Existing CLI credential is unavailable.")
    try:
        blob = ctypes.string_at(pointer.contents.Blob, pointer.contents.BlobSize)
    finally:
        api.CredFree(pointer)
    for encoding in ("utf-8", "utf-16-le"):
        try:
            match = re.search(r"sbp_[A-Za-z0-9]+", blob.decode(encoding))
            if match:
                return match.group()
        except UnicodeError:
            pass
    raise SetupError("Existing CLI credential format is unsupported.")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="Apply the already-authorized SMTP-only change")
    args = parser.parse_args()
    path = ROOT / ".env.smtp.local"
    ignored = subprocess.run(["git", "check-ignore", str(path)], cwd=ROOT, capture_output=True)
    tracked = subprocess.run(["git", "ls-files", "--error-unmatch", str(path)], cwd=ROOT, capture_output=True)
    if ignored.returncode or not tracked.returncode:
        print("Refusing SMTP credentials outside the ignored/untracked local file.")
        return 1
    try:
        credentials = parse_credentials(dotenv_values(path, interpolate=False))
        patch = build_patch(credentials)
        if not args.apply:
            print("Private SMTP configuration passes local checks. No provider operation performed.")
            return 0
        with httpx.Client(headers={"Authorization": "Bearer " + cli_token()}, timeout=30) as client:
            response = client.get(ENDPOINT)
            response.raise_for_status()
            before = response.json()
            protect_current_settings(before, patch)
            # TLS and credential validation occur before the hosted configuration change.
            with smtplib.SMTP("smtp.gmail.com", 587, timeout=20) as smtp:
                smtp.ehlo()
                smtp.starttls(context=ssl.create_default_context())
                smtp.ehlo()
                smtp.login(credentials.username, credentials.password)
            response = client.patch(ENDPOINT, json=patch)
            response.raise_for_status()
            response = client.get(ENDPOINT)
            response.raise_for_status()
            after = response.json()
            if any(str(after.get(key)) != str(value) for key, value in patch.items() if key != "smtp_pass"):
                raise SetupError("SMTP readback differs; inspect before retrying.")
            if any(after.get(key) != value for key, value in before.items() if key not in SMTP_FIELDS):
                raise SetupError("Unrelated Auth setting differs after readback; inspect before retrying.")
        print("SMTP-only change independently verified; required confirmation and other Auth settings preserved.")
        print("No email delivery or successful user login is claimed by this configuration check.")
        return 0
    except SetupError as error:
        print(str(error))
    except Exception:
        print("SMTP setup failed; raw provider response and credential details withheld.")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
