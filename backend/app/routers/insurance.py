from fastapi import APIRouter

from app.modules.insurance.pmfby import (
    InsuranceClaimEstimateRequest,
    InsuranceClaimEstimateResult,
    estimate_pmfby_claim,
)

router = APIRouter(prefix="/insurance", tags=["crop-insurance-pmfby"])


@router.post("/estimate-claim", response_model=InsuranceClaimEstimateResult)
def get_insurance_claim_estimate(payload: InsuranceClaimEstimateRequest):
    return estimate_pmfby_claim(payload)
