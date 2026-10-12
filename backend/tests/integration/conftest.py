"""Keep credentials and tokens in memory; never include them in pytest failures."""

import os
import subprocess
from pathlib import Path

import pytest
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[3]


def pytest_collection_modifyitems(items):
    if os.getenv("RUN_SUPABASE_LIVE_TESTS") != "1":
        for item in items:
            if "/integration/" in str(item.path).replace("\\", "/"):
                item.add_marker(pytest.mark.skip(reason="Live development tests require explicit opt-in."))


@pytest.fixture(scope="session")
def live_settings():
    from backend.dev import load_local_settings, validate_local_settings

    settings = load_local_settings()
    load_dotenv(ROOT / ".env.live-tests.local", override=True)
    errors = validate_local_settings(settings)
    required = ("SUPABASE_PUBLISHABLE_KEY", "TEST_USER_A_EMAIL", "TEST_USER_A_PASSWORD",
                "TEST_USER_B_EMAIL", "TEST_USER_B_PASSWORD")
    if errors or any(not os.getenv(name) for name in required):
        pytest.fail("Live configuration incomplete; run backend.dev --check and fill ignored test configuration.", pytrace=False)
    linked = ROOT / "supabase/.temp/project-ref"
    if not linked.exists() or linked.read_text().strip() != "mnjmugwkjtihqswssiwa":
        pytest.fail("Linked project differs from the approved development target.", pytrace=False)
    # Independently verify hosted history and schema before any financial fixture mutation.
    result = subprocess.run(
        ["node", str(ROOT / "node_modules/supabase/dist/supabase.js"), "db", "query",
         "--linked", "--file", str(ROOT / "supabase/tests/001_schema_assertions.sql")],
        cwd=ROOT, capture_output=True, timeout=45,
    )
    if result.returncode:
        pytest.fail("Hosted read-only schema assertions failed; output suppressed.", pytrace=False)
    return settings
