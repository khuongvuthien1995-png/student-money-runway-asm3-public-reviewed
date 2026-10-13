"""Run C5 local routing model with the actual unconfigured FastAPI entrypoint."""
import os
from pathlib import Path
import runpy
import shutil
import subprocess
import sys

import httpx


ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    helpers = runpy.run_path(str(ROOT / "tools/verify-local-http.py"))
    for port in (8000, 5195):
        helpers["require_free_port"](port)
    environment = {key: value for key, value in os.environ.items() if not key.startswith(("SUPABASE_", "TEST_USER_", "VITE_"))}
    environment["RUN_SUPABASE_LIVE_TESTS"] = "0"
    process = subprocess.Popen([sys.executable, "-m", "uvicorn", "api.index:app", "--host", "127.0.0.1", "--port", "8000",
                                "--no-access-log", "--log-level", "info"], cwd=ROOT, env=environment,
                               stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True,
                               creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if sys.platform == "win32" else 0)
    try:
        with httpx.Client(timeout=2, trust_env=False) as client:
            helpers["wait_ready"](client, "http://127.0.0.1:8000/api/health", process)
        node = shutil.which("node")
        if not node:
            raise RuntimeError("Node is required for C5 routing verification.")
        return subprocess.run([node, str(ROOT / "tools/demo-recorder/verify-c5-deployment.mjs")],
                              cwd=ROOT, env=environment, timeout=90).returncode
    finally:
        _, output = helpers["stop_process"](process)
        assert "Application shutdown complete." in output, "Local API shutdown was incomplete."
        assert "Traceback" not in output and "not-a-token" not in output, "Unexpected local API log content."


if __name__ == "__main__":
    raise SystemExit(main())
