from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.db import get_db
from app.models import Farm, SoilTest, User
from app.modules.soil.interpretation import SoilInterpretationResult, SoilMetricsIn, evaluate_soil_health
from app.routers.farms import _check_farm_access

router = APIRouter(prefix="/soil", tags=["soil-health"])


@router.post("/interpret", response_model=SoilInterpretationResult)
def interpret_soil_metrics(body: SoilMetricsIn):
    return evaluate_soil_health(body)


@router.get("/farms/{farm_id}/interpretation", response_model=SoilInterpretationResult)
def get_farm_soil_interpretation(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    farm = db.get(Farm, farm_id)
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    _check_farm_access(farm, current_user)

    latest_test = (
        db.query(SoilTest)
        .filter_by(farm_id=farm_id)
        .order_by(SoilTest.tested_on.desc())
        .first()
    )
    if not latest_test:
        raise HTTPException(
            status_code=404,
            detail="No soil tests recorded for this farm yet. Please add a soil test first.",
        )

    metrics = SoilMetricsIn(
        ph=latest_test.ph,
        organic_carbon_pct=latest_test.organic_carbon_pct,
    )
    return evaluate_soil_health(metrics)
