"""C5 fresh setup from current audited Git candidates, including uncommitted source."""
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile
import time

from dotenv import dotenv_values


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs/implementation/evidence/c5/clean-setup-results.json"


def main() -> int:
    # Secrets stay in memory for equality checks; never written to the fresh copy or evidence.
    private_values = []
    for name in (".env.local", ".env.live-tests.local"):
        if (ROOT / name).exists():
            private_values.extend(value.encode() for key, value in dotenv_values(ROOT / name, interpolate=False).items()
                                  if value and len(value) >= 6 and any(word in key for word in ("KEY", "EMAIL", "PASSWORD")))
    scan = subprocess.run([sys.executable, "tools/check-repository-secrets.py"], cwd=ROOT, capture_output=True, text=True)
    if scan.returncode:
        print("Source secret check failed; no copy or installation performed.")
        return 1
    raw_paths = subprocess.check_output(["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"], cwd=ROOT)
    paths = sorted({value.decode("utf8") for value in raw_paths.split(b"\0") if value})
    copied = []
    clean = Path(tempfile.mkdtemp(prefix="student-money-runway-c5-")).resolve()
    assert not clean.is_relative_to(ROOT)
    for name in paths:
        relative = Path(name)
        if any(part in {".git", ".vercel", "node_modules", ".venv", "venv", "dist", "__pycache__"} for part in relative.parts):
            raise RuntimeError("Generated/private directory unexpectedly included in source candidates.")
        if relative.name.startswith(".env") and relative.name != ".env.example":
            raise RuntimeError("Populated environment file unexpectedly included in source candidates.")
        source = (ROOT / relative).resolve()
        assert source.is_relative_to(ROOT) and source.is_file()
        data = source.read_bytes()
        assert not any(value in data for value in private_values), "Unsafe source candidate; values suppressed."
        destination = clean / relative
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(data)
        copied.append({"path": name, "sha256": hashlib.sha256(data).hexdigest()})
    assert not (clean / ".env.local").exists() and not (clean / ".env.live-tests.local").exists()
    environment = {key: value for key, value in os.environ.items()
                   if not key.startswith(("SUPABASE_", "TEST_USER_", "VITE_"))
                   and key not in {"RUN_SUPABASE_LIVE_TESTS", "PYTHONPATH", "VIRTUAL_ENV", "ALLOWED_ORIGIN"}}
    environment["RUN_SUPABASE_LIVE_TESTS"] = "0"
    results = []
    failed = False

    def run(label, command, timeout=180):
        nonlocal failed
        print(f"Fresh setup: {label} RUNNING", flush=True)
        started = time.monotonic()
        result = subprocess.run(command, cwd=clean, env=environment, capture_output=True, text=True, encoding="utf8", errors="replace", timeout=timeout)
        # Package install logs can contain authenticated registry locations; never retain them.
        summary = None
        output = result.stdout + result.stderr
        if "pytest" in command:
            match = re.search(r"\d+ passed.*?in [\d.]+s", output)
            summary = match.group(0) if match else "No passing pytest summary."
        elif label in {"frontend tests", "C4 browser", "local HTTP", "deployment routing", "bundle secrets"}:
            summary = "\n".join(line.strip() for line in output.splitlines() if any(marker in line for marker in
                ("Tests ", "Test Files ", "C4 offline browser results:", "Local HTTP:", "C5 local deployment routing:", "production files;")))
        elif label == "Python consistency":
            summary = "No broken requirements found." if result.returncode == 0 else "Dependency mismatch."
        results.append({"check": label, "command": command, "exitCode": result.returncode,
                        "durationSeconds": round(time.monotonic() - started, 2), "summary": summary})
        print(f"Fresh setup: {label} {'PASS' if result.returncode == 0 else 'FAIL'}", flush=True)
        if result.returncode:
            failed = True
            # Locally retain failure diagnostics outside source, excluding installation output.
            if "install" not in label:
                safe = output
                for value in private_values:
                    safe = safe.replace(value.decode(), "[REDACTED]")
                (clean / "c5-failure.log").write_text(safe, encoding="utf8")
            return False
        return True

    npm = shutil.which("npm.cmd" if sys.platform == "win32" else "npm")
    node = shutil.which("node")
    py = shutil.which("py") if sys.platform == "win32" else sys.executable
    assert npm and node and py
    python = str(clean / ".venv" / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python"))
    commands = [
        ("frontend install", [npm, "ci"], 240),
        ("new Python environment", [py, "-3.12", "-m", "venv", ".venv"] if sys.platform == "win32" else [py, "-m", "venv", ".venv"], 120),
        ("production Python install", [python, "-m", "pip", "install", "-r", "requirements.txt"], 240),
        ("development Python install", [python, "-m", "pip", "install", "-r", "requirements-dev.txt", "-c", "requirements-lock.txt"], 240),
        ("Python consistency", [python, "-m", "pip", "check"], 30),
        ("frontend lint", [npm, "run", "lint"], 120),
        ("frontend build", [npm, "run", "build"], 120),
        ("frontend tests", [npm, "test"], 120),
        ("backend tests", [python, "-m", "pytest", "backend/tests", "-q"], 120),
        ("Python compilation", [python, "-m", "compileall", "-q", "backend", "api"], 60),
        ("Playwright dependency install", [npm, "ci", "--prefix", "tools/demo-recorder"], 240),
        ("Chromium install", [node, "tools/demo-recorder/node_modules/playwright/cli.js", "install", "chromium"], 240),
        ("local HTTP", [python, "tools/verify-local-http.py"], 60),
        ("deployment routing", [python, "tools/verify-deployment.py"], 90),
        ("C4 browser", [node, "tools/demo-recorder/verify-c4-integration.mjs"], 240),
        ("bundle secrets", [python, "tools/check-client-bundle.py"], 30),
    ]
    try:
        for label, command, timeout in commands:
            if not run(label, command, timeout):
                break
        if not failed:
            # The copied sources and resulting assets must not contain the original private values.
            for path in (clean / "dist").rglob("*"):
                if path.is_file():
                    assert not any(value in path.read_bytes() for value in private_values)
            assert not (clean / ".env.local").exists() and not (clean / ".env.live-tests.local").exists()
    finally:
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT.write_text(json.dumps({"mode": "FRESH COPY OF CURRENT LOCAL SOURCE; NOT A REMOTE CLONE OR CLOUD DEPLOYMENT",
                                      "copyDirectory": str(clean), "copiedFiles": len(copied), "sourceInventory": copied,
                                      "passedSteps": sum(result["exitCode"] == 0 for result in results), "failedSteps": sum(result["exitCode"] != 0 for result in results),
                                      "sourceCredentialsCopied": False, "privateValueScan": "PASS" if not failed else "NOT COMPLETED",
                                      "liveOptIn": False, "checks": results}, indent=2), encoding="utf8")
    print("Fresh source copy retained:", clean)
    return int(failed)


if __name__ == "__main__":
    raise SystemExit(main())
