"""Offline SMTP setup safety guards; no provider/network operation."""
import pytest

from tools.configure_supabase_smtp import ORIGIN, SMTP_FIELDS, build_patch, parse_credentials, protect_current_settings


def config():
    return {"mailer_autoconfirm": False, "disable_signup": False, "site_url": ORIGIN,
            "uri_allow_list": ORIGIN + "/login", "smtp_host": None, "jwt_exp": 3600}


def credentials():
    return parse_credentials({"SMTP_USERNAME": "offline-test@gmail.com", "SMTP_PASSWORD": "abcd efgh ijkl mnop"})


def test_patch_preserves_auth_and_uses_owned_sender_with_app_credential():
    before = config()
    original = dict(before)
    credential = credentials()
    patch = build_patch(credential)
    protect_current_settings(before, patch)
    assert before == original
    assert set(patch) == SMTP_FIELDS
    assert patch["smtp_admin_email"] == patch["smtp_user"]
    assert patch["smtp_host"] == "smtp.gmail.com" and patch["smtp_port"] == "587"
    assert patch["smtp_pass"] == "abcdefghijklmnop"
    assert patch["rate_limit_email_sent"] == 30
    assert not any(key in patch for key in ("mailer_autoconfirm", "disable_signup", "site_url", "jwt_exp"))
    assert "abcdefghijklmnop" not in repr(credential)


@pytest.mark.parametrize("field,value", [("mailer_autoconfirm", True), ("disable_signup", True),
                                          ("site_url", "https://unapproved.invalid"), ("uri_allow_list", "")])
def test_refuses_security_or_target_drift(field, value):
    before = config()
    before[field] = value
    with pytest.raises(ValueError):
        protect_current_settings(before, build_patch(credentials()))


def test_refuses_unexpected_smtp_replacement_and_unapproved_patch_fields():
    before = config()
    before["smtp_host"] = "existing-provider.invalid"
    with pytest.raises(ValueError):
        protect_current_settings(before, build_patch(credentials()))
    patch = build_patch(credentials())
    patch["mailer_autoconfirm"] = True
    with pytest.raises(ValueError):
        protect_current_settings(config(), patch)


@pytest.mark.parametrize("values", [{}, {"SMTP_USERNAME": "unapproved@provider.invalid", "SMTP_PASSWORD": "abcdefghijklmnop"},
                                    {"SMTP_USERNAME": "offline-test@gmail.com", "SMTP_PASSWORD": "short"}])
def test_rejects_missing_or_wrong_credentials_without_printing_values(values):
    with pytest.raises(ValueError) as error:
        parse_credentials(values)
    assert "unapproved@provider.invalid" not in str(error.value)
    assert "short" not in str(error.value)
