"""Local input/save tests only; no Auth or database access."""

from types import SimpleNamespace

from dotenv import dotenv_values

from backend import setup_test_credentials as setup


def prepare(tmp_path, monkeypatch):
    (tmp_path / "supabase/.temp").mkdir(parents=True)
    (tmp_path / "supabase/.temp/project-ref").write_text("mnjmugwkjtihqswssiwa")
    target = tmp_path / ".env.live-tests.local"
    target.write_text("# ignored local test fixture\n")
    monkeypatch.setattr(setup, "ROOT", tmp_path)
    monkeypatch.setattr(setup.subprocess, "run", lambda *a, **k: SimpleNamespace(returncode=0))
    return target


def test_empty_entries_and_duplicate_email_retry_before_save(tmp_path, monkeypatch, capsys):
    target = prepare(tmp_path, monkeypatch)
    entries = iter(["", "a@example.invalid", "", "local-A", "A@example.invalid",
                    "b@example.invalid", "   ", "local-B"])
    monkeypatch.setattr(setup.getpass, "getpass", lambda prompt: next(entries))
    assert setup.main() == 0
    saved = dotenv_values(target)
    assert all(saved.get(k) for k in ("TEST_USER_A_EMAIL", "TEST_USER_A_PASSWORD",
                                    "TEST_USER_B_EMAIL", "TEST_USER_B_PASSWORD"))
    assert saved["TEST_USER_A_EMAIL"] != saved["TEST_USER_B_EMAIL"]
    output = capsys.readouterr().out
    assert "saved" in output
    assert all(value not in output for value in ("a@example.invalid", "local-A", "local-B"))


def test_cancelled_input_preserves_existing_file(tmp_path, monkeypatch):
    target = prepare(tmp_path, monkeypatch)
    before = target.read_bytes()
    def cancel(prompt):
        raise EOFError
    monkeypatch.setattr(setup.getpass, "getpass", cancel)
    assert setup.main() == 1
    assert target.read_bytes() == before
