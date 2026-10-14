"""Read-only public-publication gate. Report paths/object IDs, never matched values."""
import json
import re
import subprocess
from pathlib import Path

from dotenv import dotenv_values

ROOT = Path(__file__).resolve().parents[1]
SECRET_PATTERNS = (
    rb"sb_secret_[A-Za-z0-9_-]{24,}",
    rb"(?:gh[pousr]_|github_pat_|sbp_)[A-Za-z0-9_]{30,}",
    rb"(?:vcp_|vercel_)[A-Za-z0-9_-]{30,}",
    rb"eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}",
    rb"postgres(?:ql)?://[^\s\"']+:[^\s\"']+@",
    rb"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",
)


def classifications(data, private_values=(), peer_identifiers=()):
    findings = []
    if any(value in data for value in private_values) or any(re.search(p, data) for p in SECRET_PATTERNS):
        findings.append("credential-pattern-or-local-value")
    if any(value in data for value in peer_identifiers):
        findings.append("peer-student-identifier-consent-unverified")
    return findings


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT)


def main():
    values = set()
    for name in (".env.local", ".env.live-tests.local", ".env.smtp.local"):
        path = ROOT / name
        if path.exists():
            for key, value in dotenv_values(path, interpolate=False).items():
                if value and len(value) >= 6 and (any(w in key for w in ("SECRET", "PASSWORD", "EMAIL")) or key == "SMTP_USERNAME"):
                    values.add(value.encode())
                    if "PASSWORD" in key:
                        values.add(value.replace(" ", "").encode())
    peer_ids = set()
    # Derive private identifiers from historical templates too: sanitizing HEAD
    # must never make the history gate silently forget earlier disclosures.
    for path in (ROOT / "docs/assessment/c7").glob("PEER_REVIEW_*.md"):
        relative = path.relative_to(ROOT).as_posix()
        versions = [path.read_bytes()]
        for commit in git("log", "--all", "--format=%H", "--", relative).splitlines():
            content = subprocess.run(["git", "show", commit.decode() + ":" + relative],
                                     cwd=ROOT, capture_output=True)
            if content.returncode == 0:
                versions.append(content.stdout)
        for data in versions:
            for identity in re.findall(rb"Application owner: \*\*(.*?)\*\*", data):
                identifiers = re.findall(rb"\b\d{8}\b", identity)
                if identifiers:
                    peer_ids.update(identifiers)
                    peer_ids.add(re.split(rb"\s(?:\xe2\x80\x94|-)\s", identity)[0])
    objects = git("rev-list", "--objects", "--all").splitlines()
    findings = []
    blobs = 0
    # Batch mode reads exact byte lengths, including binary files and embedded newlines.
    proc = subprocess.Popen(["git", "cat-file", "--batch"], cwd=ROOT,
                            stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    try:
        for line in objects:
            parts = line.split(b" ", 1)
            oid = parts[0].decode("ascii")
            proc.stdin.write(parts[0] + b"\n")
            proc.stdin.flush()
            header = proc.stdout.readline().split()
            kind, size = header[1], int(header[2])
            data = proc.stdout.read(size)
            assert len(data) == size and proc.stdout.read(1) == b"\n"
            if kind != b"blob":
                continue
            blobs += 1
            for category in classifications(data, values, peer_ids):
                findings.append({"scope": "reachable-history", "object": oid,
                                 "path": parts[1].decode("utf-8") if len(parts) > 1 else "(unnamed)",
                                 "category": category})
    finally:
        proc.stdin.close()
        proc.stdout.close()
        assert proc.wait(timeout=30) == 0
    for name in git("ls-files", "--cached", "--others", "--exclude-standard", "-z").split(b"\0"):
        if not name:
            continue
        path = ROOT / name.decode("utf-8")
        if path.is_file():
            for category in classifications(path.read_bytes(), values, peer_ids):
                findings.append({"scope": "working", "path": name.decode("utf-8"), "category": category})
    result = {"reachableCommits": len(git("rev-list", "--all").splitlines()),
              "reachableBlobsScanned": blobs, "findings": findings,
              "credentialFindings": sum(f["category"] == "credential-pattern-or-local-value" for f in findings),
              "publicPublication": "BLOCKED" if findings else "PATTERN SCAN CLEAR; MANUAL MEDIA/RIGHTS REVIEW STILL REQUIRED",
              "limitations": "Pattern/equality scans cannot certify binary visual privacy, rights or undiscovered credentials. No values printed; history unchanged."}
    output = ROOT / "docs/assessment/c7/evidence/public-history-audit.json"
    output.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))
    return 1 if findings else 0


if __name__ == "__main__":
    raise SystemExit(main())
