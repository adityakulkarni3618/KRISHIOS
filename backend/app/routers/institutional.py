from typing import List
from fastapi import APIRouter

from app.modules.institutional.kcc_loan import (
    KCCLoanRequest,
    KCCLoanResult,
    calculate_kcc_eligibility,
)
from app.modules.institutional.kisan_nyay import (
    LegalRemedyGuide,
    list_legal_guides,
)
from app.modules.institutional.omnichannel import (
    OmnichannelGatewayInfo,
    get_omnichannel_info,
)

router = APIRouter(prefix="/institutional", tags=["institutional-finance-legal"])


@router.post("/kcc-eligibility", response_model=KCCLoanResult)
def calculate_kcc(payload: KCCLoanRequest):
    return calculate_kcc_eligibility(payload)


@router.get("/legal-guides", response_model=List[LegalRemedyGuide])
def get_legal_guides():
    return list_legal_guides()


@router.get("/omnichannel", response_model=OmnichannelGatewayInfo)
def get_omnichannel_access():
    return get_omnichannel_info()
