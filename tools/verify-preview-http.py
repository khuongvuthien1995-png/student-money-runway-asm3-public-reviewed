"""Read-only HTTPS checks of the explicitly approved C6 Preview deployment."""
import json
import re
import subprocess
from pathlib import Path

ORIGIN = "https://student-money-runway-asm3-preview.vercel.app"
results = []


def request(path, *options):
    result = subprocess.run(
        ["vercel.cmd", "curl", ORIGIN + path, "--scope", "khuong-projects", "--",
         "--silent", "--show-error", "--include", *options],
        capture_output=True, text=True, timeout=60,
    )
    if result.returncode:
        raise RuntimeError("Protected Preview request failed; raw output withheld")
    blocks = re.split(r"\r?\n\r?\n", result.stdout)
    headers, body = blocks[-2], blocks[-1]
    status = int(headers.splitlines()[0].split()[1])
    return status, headers.lower(), body


def check(name, condition):
    if not condition:
        raise AssertionError(name)
    results.append({"check": name, "passed": True})


status, headers, body = request("/api/health")
check("health", status == 200 and json.loads(body) == {"status": "ok"})
check("API cache disabled", "cache-control: private, no-store" in headers)
for path in ["/login", "/setup", "/essentials", "/runway", "/purchase", "/result"]:
    status, headers, body = request(path)
    check("SPA " + path, status == 200 and "text/html" in headers and 'id="root"' in body)
for path, method in [("/api/plans/current", "GET"), ("/api/plans/current", "PUT"),
                     ("/api/plans/current/purchases", "GET"), ("/api/plans/current/purchases", "POST")]:
    status, headers, body = request(path, "-X", method)
    payload = json.loads(body)
    check(method + " bearer rejection", status == 401 and set(payload) == {"error"} and set(payload["error"]) == {"code", "message"})
status, headers, body = request("/api/health", "-X", "OPTIONS", "-H", "Origin: " + ORIGIN,
                                "-H", "Access-Control-Request-Method: GET")
check("Exact Preview CORS", status == 200 and "access-control-allow-origin: " + ORIGIN in headers)
status, headers, body = request("/api/missing")
check("Unknown API is JSON 404", status == 404 and "application/json" in headers)
evidence = Path("docs/implementation/evidence/c6")
evidence.mkdir(parents=True, exist_ok=True)
(evidence / "preview-http-results.json").write_text(json.dumps({"origin": ORIGIN, "category": "REAL HTTPS; NO VALID AUTH OR FINANCIAL WRITES", "results": results}, indent=2), encoding="utf-8")
print(f"Preview HTTPS PASS: {len(results)} checks; no financial writes authenticated.")
