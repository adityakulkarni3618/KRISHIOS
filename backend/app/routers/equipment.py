from typing import List
from fastapi import APIRouter

from app.modules.equipment.chc import (
    EquipmentCostEstimateRequest,
    EquipmentCostEstimateResult,
    EquipmentRentalItem,
    estimate_equipment_cost,
    list_chc_equipment,
)

router = APIRouter(prefix="/equipment", tags=["custom-hiring-center"])


@router.get("/catalog", response_model=List[EquipmentRentalItem])
def get_equipment_catalog():
    return list_chc_equipment()


@router.post("/estimate-cost", response_model=EquipmentCostEstimateResult)
def estimate_rental_cost(payload: EquipmentCostEstimateRequest):
    return estimate_equipment_cost(payload)
