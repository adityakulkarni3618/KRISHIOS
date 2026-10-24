from typing import List, Optional
from fastapi import APIRouter, Query

from app.modules.operations.groundwater import (
    GroundWaterStatus,
    get_groundwater_data,
)
from app.modules.operations.input_verification import (
    AuthorizedDealer,
    SeedVerificationRequest,
    SeedVerificationResult,
    list_authorized_dealers,
    verify_seed_lot,
)
from app.modules.operations.labor_hub import (
    LaborHubResult,
    get_labor_hub_data,
)

router = APIRouter(prefix="/operations", tags=["farm-operations-labor-water"])


@router.get("/labor-hub", response_model=LaborHubResult)
def get_labor_hub(district: str = Query("Nashik")):
    return get_labor_hub_data(district)


@router.post("/verify-seed", response_model=SeedVerificationResult)
def verify_seed_authenticity(payload: SeedVerificationRequest):
    return verify_seed_lot(payload)


@router.get("/authorized-dealers", response_model=List[AuthorizedDealer])
def get_dealers(district: str = Query("Nashik")):
    return list_authorized_dealers(district)


@router.get("/groundwater", response_model=GroundWaterStatus)
def get_groundwater_info(district: str = Query("Nashik")):
    return get_groundwater_data(district)
