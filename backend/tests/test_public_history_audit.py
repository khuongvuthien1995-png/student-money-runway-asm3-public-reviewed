"""Offline checks that the public-publication gate detects unsafe bytes."""
import runpy
from pathlib import Path

classifications = runpy.run_path(str(Path(__file__).resolve().parents[2] / "tools/audit-public-history.py"))["classifications"]


def test_generated_server_secret_is_flagged():
    assert classifications(b"sb_secret_" + b"X" * 30) == ["credential-pattern-or-local-value"]


def test_private_value_and_peer_identifier_are_distinct_findings():
    assert classifications(b"private-marker; peer-marker", [b"private-marker"], [b"peer-marker"]) == [
        "credential-pattern-or-local-value", "peer-student-identifier-consent-unverified"]


def test_binary_local_secret_and_private_key_are_flagged():
    assert classifications(b"\x00\xffprivate-marker\x00", [b"private-marker"])
    assert classifications(b"-----BEGIN " + b"PRIVATE KEY-----")


def test_public_template_is_not_a_credential():
    assert classifications(b"SUPABASE_SECRET_KEY=\nTEST_USER_A_PASSWORD=\n") == []
