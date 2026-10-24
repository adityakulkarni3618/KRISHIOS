from fastapi import APIRouter

from app.modules.fertilizer.calculator import (
    FertilizerPlanRequest,
    FertilizerPlanResult,
    calculate_fertilizer_plan,
)

router = APIRouter(prefix="/fertilizer", tags=["fertilizer-dosage-engine"])


@router.post("/calculate", response_model=FertilizerPlanResult)
def calculate_fertilizer_dosages(payload: FertilizerPlanRequest):
    return calculate_fertilizer_plan(payload)
