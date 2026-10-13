"""Offline cross-language fixtures are validated by the actual Pydantic models."""

import json
from pathlib import Path

import pytest

from backend.app.models import (PlanEnvelope, PlanUpsertRequest, PurchaseConfirmationEnvelope,
                                PurchaseConfirmationRequest, PurchasesEnvelope)

FIXTURES = json.loads((Path(__file__).resolve().parents[2] / "src/tests/fixtures/api.json").read_text())


@pytest.mark.parametrize("name,model", [
    ("saveRequest", PlanUpsertRequest), ("plan", PlanEnvelope),
    ("confirmationRequest", PurchaseConfirmationRequest),
    ("confirmation", PurchaseConfirmationEnvelope),
])
def test_frontend_fixtures_match_pydantic(name, model):
    body = FIXTURES[name]
    result = model.model_validate(body).model_dump(mode="json")
    assert result.keys() == body.keys()
    for key, value in result.items():
        if isinstance(value, dict):
            assert value.keys() == body[key].keys()


def test_frontend_history_and_money_contract():
    purchase = FIXTURES["confirmation"]["purchase"]
    PurchasesEnvelope.model_validate({"purchases": [purchase]})
    before = PlanEnvelope.model_validate(FIXTURES["plan"]).plan
    after = PurchaseConfirmationEnvelope.model_validate(FIXTURES["confirmation"])
    assert before.protectedTotalCents == 73500
    assert before.runwayCents == 21500
    assert after.plan.availableFundsCents == before.availableFundsCents - after.purchase.amountCents
    assert after.plan.runwayCents == 5500
