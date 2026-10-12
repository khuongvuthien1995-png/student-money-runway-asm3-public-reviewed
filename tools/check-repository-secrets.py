"""Scan working candidates and staged blobs. Report paths only, never values."""

import re
import subprocess
from pathlib import Path

from dotenv import dotenv_values


ROOT = Path(__file__).resolve().parents[1]
PATTERNS = [
    rb"sb_secret_[A-Za-z0-9_-]{24,}",
    rb"gh[pousr]_[A-Za-z0-9]{30,}",
    rb"github_pat_[A-Za-z0-9_]{30,}",
    rb"sbp_[A-Za-z0-9]{30,}",
    rb"eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}",
    rb"postgres(?:ql)?://[^\s\"']+:[^\s\"']+@",
]


def git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, check=True).stdout


def main():
    local_values = []
    for filename in (".env.local", ".env.live-tests.local"):
        path = ROOT / filename
        if path.exists():
            local_values.extend(value.encode() for name, value in dotenv_values(path, interpolate=False).items()
                                if value and len(value) >= 6 and any(word in name for word in ("KEY", "PASSWORD", "EMAIL")))
    def sensitive(data):
        return any(value in data for value in local_values) or any(re.search(pattern, data) for pattern in PATTERNS)
    candidates = set(path.decode("utf-8") for path in git("ls-files", "--cached", "--others", "--exclude-standard", "-z").split(b"\0") if path)
    staged = [path.decode("utf-8") for path in git("diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z").split(b"\0") if path]
    hits = []
    for name in sorted(candidates):
        path = ROOT / name
        if path.is_file() and sensitive(path.read_bytes()):
            hits.append(("working", name))
    for name in staged:
        if sensitive(git("show", ":" + name)):
            hits.append(("staged", name))
    for scope, name in hits:
        print(f"Potential secret in {scope} file: {name}")
    print(f"Scanned {len(candidates)} working candidates and {len(staged)} staged blobs; flagged {len(hits)} paths.")
    print("This combines local-value equality and token-pattern checks; binary raster contents also require visual review.")
    return 1 if hits else 0


if __name__ == "__main__":
    raise SystemExit(main())
