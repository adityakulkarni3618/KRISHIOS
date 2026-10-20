from fastapi import APIRouter

from app.modules.calculator.economics import EconomicsInput, EconomicsResult, calculate_farm_economics

router = APIRouter(prefix="/calculator", tags=["farm-economics"])


@router.post("/economics", response_model=EconomicsResult)
def evaluate_economics(body: EconomicsInput):
    return calculate_farm_economics(body)
