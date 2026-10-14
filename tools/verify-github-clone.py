"""Install and verify a new authenticated clone; never claim it is anonymous/public."""
import argparse
import json
import os
from pathlib import Path
import re
import runpy
import shutil
import subprocess
import sys
import tempfile
import time

import httpx

ROOT = Path(__file__).resolve().parents[1]
REPOSITORY = "https://github.com/khuongvuthien1995-png/student-money-runway-asm3.git"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--expected-commit", required=True)
    args = parser.parse_args()
    if not re.fullmatch(r"[0-9a-f]{40}", args.expected_commit):
        parser.error("Expected a full commit SHA.")
    clean = Path(tempfile.mkdtemp(prefix="asm3-private-release-clone-")).resolve() / "source"
    assert not clean.is_relative_to(ROOT)
    (ROOT / ".git/final-private-clone-path.txt").write_text(str(clean), encoding="utf-8")
    environment = {key: value for key, value in os.environ.items()
                   if not key.startswith(("SUPABASE_", "TEST_USER_", "VITE_", "SMTP_", "C6_"))
                   and key not in {"PYTHONPATH", "VIRTUAL_ENV", "ALLOWED_ORIGIN"}}
    environment["RUN_SUPABASE_LIVE_TESTS"] = "0"
    environment["GIT_TERMINAL_PROMPT"] = "0"
    environment["GCM_INTERACTIVE"] = "Never"
    result = {"category": "AUTHENTICATED PRIVATE CLONE; NOT ANONYMOUS PUBLIC VERIFICATION",
              "repository": REPOSITORY, "expectedCommit": args.expected_commit,
              "status": "RUNNING", "checks": [], "credentialsCopied": False}
    output = ROOT / "docs/assessment/c7/evidence/private-fresh-clone.json"

    def save():
        output.write_text(json.dumps(result, indent=2), encoding="utf-8")

    def run(label, command, cwd, timeout=300, expected_exit=0):
        print(f"Private fresh clone: {label} RUNNING", flush=True)
        started = time.monotonic()
        process = subprocess.run(command, cwd=cwd, env=environment, capture_output=True,
                                 text=True, encoding="utf-8", errors="replace", timeout=timeout)
        text = process.stdout + process.stderr
        markers = ("Test Files", "Tests ", "passed,", "No broken requirements", "Local HTTP:",
                   "C5 local deployment routing:", "production files;", "flagged 0 paths")
        # No installation/credential-manager logs or raw failures are persisted.
        summary = [line.strip() for line in text.splitlines() if any(m in line for m in markers)] if "install" not in label else []
        passed = process.returncode == expected_exit
        result["checks"].append({"check": label, "exitCode": process.returncode,
                                 "expectedExitCode": expected_exit, "passed": passed,
                                 "seconds": round(time.monotonic() - started, 2), "summary": summary})
        save()
        print(f"Private fresh clone: {label} {'PASS' if passed else 'FAIL; RAW DETAILS WITHHELD'}", flush=True)
        if not passed:
            raise RuntimeError(label)
        return process.stdout

    try:
        run("Git clone", ["git", "clone", REPOSITORY, str(clean)], clean.parent)
        sha = run("HEAD", ["git", "rev-parse", "HEAD"], clean).strip()
        assert sha == args.expected_commit
        result["actualCommit"] = sha
        for name in ("README.md", "src/App.tsx", "api/index.py", "backend/app/main.py",
                     "backend/tests/test_public_history_audit.py", "package-lock.json", "requirements.txt",
                     "requirements-dev.txt", "requirements-lock.txt", ".env.example", "vercel.json",
                     "supabase/migrations/20261012020847_initial_schema.sql"):
            assert (clean / name).is_file()
        assert not any(p.name != ".env.example" for p in clean.glob(".env*"))
        assert not (clean / ".vercel").exists()
        npm = shutil.which("npm.cmd" if sys.platform == "win32" else "npm")
        node = shutil.which("node")
        assert npm and node
        python = str(clean / ".venv" / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python"))
        run("frontend install npm ci", [npm, "ci"], clean)
        run("new venv", ["py", "-3.12", "-m", "venv", ".venv"] if sys.platform == "win32"
            else [sys.executable, "-m", "venv", ".venv"], clean)
        run("runtime install", [python, "-m", "pip", "install", "-r", "requirements.txt"], clean)
        run("development install", [python, "-m", "pip", "install", "-r", "requirements-dev.txt", "-c", "requirements-lock.txt"], clean)
        for label, command in [
            ("pip consistency", [python, "-m", "pip", "check"]),
            ("frontend tests", [npm, "test"]),
            ("lint", [npm, "run", "lint"]),
            ("build", [npm, "run", "build"]),
            ("backend tests", [python, "-m", "pytest", "backend/tests", "-q"]),
            ("compile", [python, "-m", "compileall", "-q", "backend", "api"]),
            ("Playwright install dependencies", [npm, "ci", "--prefix", "tools/demo-recorder"]),
            ("Chromium install", [node, "tools/demo-recorder/node_modules/playwright/cli.js", "install", "chromium"]),
            ("local HTTP", [python, "tools/verify-local-http.py"]),
            ("deployment routing", [python, "tools/verify-deployment.py"]),
            ("bundle scan", [python, "tools/check-client-bundle.py"]),
            ("repository scan", [python, "tools/check-repository-secrets.py"]),
            ("assessment artifact validation", [python, "tools/validate-c7.py"]),
        ]:
            run(label, command, clean)
        run("history privacy gate remains blocked", [python, "tools/audit-public-history.py"], clean, expected_exit=1)
        # Execute the README's env-file startup using only the clone's blank template.
        # No permitted cloud credentials are supplied or copied for this smoke test.
        shutil.copyfile(clean / ".env.example", clean / ".env.local")
        helpers = runpy.run_path(str(clean / "tools/verify-local-http.py"))
        helpers["require_free_port"](8000)
        server = subprocess.Popen([python, "-m", "uvicorn", "api.index:app", "--env-file", ".env.local",
                                   "--host", "127.0.0.1", "--port", "8000", "--no-access-log"],
                                  cwd=clean, env=environment, stdout=subprocess.PIPE,
                                  stderr=subprocess.STDOUT, text=True,
                                  creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if sys.platform == "win32" else 0)
        try:
            with httpx.Client(timeout=3, trust_env=False) as client:
                helpers["wait_ready"](client, "http://127.0.0.1:8000/api/health", server)
                assert client.get("http://127.0.0.1:8000/api/health").json() == {"status": "ok"}
                assert client.get("http://127.0.0.1:8000/api/plans/current").status_code == 401
        finally:
            _, logs = helpers["stop_process"](server)
            assert "Application shutdown complete." in logs
        result["checks"].append({"check": "README env-file Uvicorn startup, health/401 and shutdown", "passed": True,
                                 "scope": "BLANK TEMPLATE; NO AUTHENTICATED DATABASE CLAIM"})
        result["status"] = "PASS PRIVATE REPRODUCIBILITY; PUBLIC PUBLICATION STILL BLOCKED"
    except Exception:
        result["status"] = "FAIL; SEE LAST CHECK; PRIVATE DETAILS WITHHELD"
        raise
    finally:
        save()
    print(result["status"], flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
