import pytest
from app.modules.insurance.pmfby import (
    CalamityType,
    InsuranceClaimEstimateRequest,
    estimate_pmfby_claim,
)


def test_pmfby_token_one_rupee_and_payout():
    req = InsuranceClaimEstimateRequest(
        crop="Soybean",
        district="Latur",
        area_hectares=2.0,
        calamity_type=CalamityType.EXCESS_RAIN,
        estimated_loss_percentage=60.0,
    )
    result = estimate_pmfby_claim(req)
    assert result.farmer_token_premium_inr == 1.0  # ₹1 Scheme guarantee
    assert result.total_sum_insured_inr == 54000.0 * 2.0  # 1,08,000 INR
    assert result.estimated_claim_payout_inr == 108000.0 * 0.60  # 64,800 INR
    assert result.state_subsidy_borne_inr > 0
    assert result.toll_free_helpline == "14447"
    assert "72" in result.intimation_deadline_warning
    assert len(result.action_checklist) >= 3
    assert len(result.required_documents) >= 4
