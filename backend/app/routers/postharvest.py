from typing import List, Optional
from fastapi import APIRouter, Query

from app.modules.postharvest.warehouses import (
    PledgeLoanEstimateRequest,
    PledgeLoanEstimateResult,
    WarehouseFacility,
    calculate_pledge_loan,
    list_warehouses_by_district,
)

router = APIRouter(prefix="/postharvest", tags=["postharvest-warehouses-wdra"])


@router.get("/warehouses", response_model=List[WarehouseFacility])
def get_warehouses(district: Optional[str] = Query(None)):
    return list_warehouses_by_district(district)


@router.post("/pledge-loan", response_model=PledgeLoanEstimateResult)
def estimate_warehouse_pledge_loan(payload: PledgeLoanEstimateRequest):
    return calculate_pledge_loan(payload)
