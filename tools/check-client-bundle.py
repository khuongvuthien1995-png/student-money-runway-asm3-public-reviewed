"""Check the built browser graph without printing local credentials or tokens."""
import re
from pathlib import Path

from dotenv import dotenv_values


ROOT = Path(__file__).resolve().parents[1]
PATTERNS = (
    rb"sb_secret_[A-Za-z0-9_-]{24,}",
    rb"gh[pousr]_[A-Za-z0-9]{30,}",
    rb"github_pat_[A-Za-z0-9_]{30,}",
    rb"sbp_[A-Za-z0-9]{30,}",
    rb"postgres(?:ql)?://[^\s\"']+:[^\s\"']+@",
)
TEST_MARKERS = (b"test-only-browser-token", b"test-only-browser-password", b"test-only-bearer-", b"browser-test@example.invalid",
                b"c4-test-only-", b"__C4_AUTH__", b"__C4_OPTIONS__")


def main() -> int:
    private_values = set()
    for name in (".env.local", ".env.live-tests.local", ".env.smtp.local"):
        path = ROOT / name
        if path.exists():
            for key, value in dotenv_values(path, interpolate=False).items():
                if value and len(value) >= 6 and ("PASSWORD" in key or key in ("SUPABASE_SECRET_KEY", "SUPABASE_JWT_SECRET")
                                                 or (name == ".env.smtp.local" and key == "SMTP_USERNAME")):
                    private_values.add(value.encode())
                    if name == ".env.smtp.local" and key == "SMTP_PASSWORD":
                        private_values.add(value.replace(" ", "").encode())
    files = [path for path in (ROOT / "dist").rglob("*") if path.is_file()]
    if not files:
        print("Build the production frontend before checking its bundle.")
        return 1
    hits = []
    for path in files:
        data = path.read_bytes()
        if any(value in data for value in private_values) or any(re.search(pattern, data) for pattern in PATTERNS) or any(marker in data for marker in TEST_MARKERS):
            hits.append(str(path.relative_to(ROOT)))
    for path in hits:
        print(f"Unsafe credential or test-only marker in build file: {path}")
    print(f"Checked {len(files)} production files; {len(hits)} unsafe paths. Public Auth configuration is permitted.")
    return 1 if hits else 0


if __name__ == "__main__":
    raise SystemExit(main())
