import pytest
from app.modules.institutional.kcc_loan import (
    KCCLoanRequest,
    calculate_kcc_eligibility,
)
from app.modules.institutional.kisan_nyay import list_legal_guides
from app.modules.institutional.omnichannel import get_omnichannel_info


def test_kcc_loan_eligibility_and_zero_interest():
    req = KCCLoanRequest(
        crop="Soybean",
        district="Nashik",
        area_acres=3.0,
        has_prompt_repayment_record=True,
    )
    res = calculate_kcc_eligibility(req)
    assert res.area_acres == 3.0
    assert res.scale_of_finance_per_acre_inr > 0
    assert res.total_sanctioned_credit_limit_inr > res.maximum_kcc_loan_limit_inr
    # Under 3 Lakhs in Maharashtra, effective rate should be 0.0%
    if res.total_sanctioned_credit_limit_inr <= 300000.0:
        assert res.effective_farmer_interest_rate_pct == 0.0
    assert len(res.required_bank_documents) >= 3


def test_kisan_nyay_farm_road_and_consumer():
    guides = list_legal_guides()
    assert len(guides) >= 2
    road_guide = next((g for g in guides if g.id == "farm_road_access"), None)
    assert road_guide is not None
    assert "143" in road_guide.applicable_law
    assert "Tehsildar" in road_guide.competent_authority


def test_omnichannel_ivr_and_whatsapp():
    omni = get_omnichannel_info()
    assert "1800" in omni.ivr_missed_call_number
    assert "WhatsApp" in omni.whatsapp_bot_number or "+91" in omni.whatsapp_bot_number
    assert len(omni.sample_ivr_menu_tree) >= 3
    assert len(omni.whatsapp_commands) >= 2
