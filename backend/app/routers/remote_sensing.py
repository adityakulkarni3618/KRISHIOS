from fastapi import APIRouter, HTTPException
from app.core.config import settings

from app.modules.remote_sensing.ndvi import (
    SatelliteAnalysisRequest,
    SatelliteAnalysisResult,
    analyze_field_remote_sensing,
)

router = APIRouter(prefix="/remote-sensing", tags=["satellite-remote-sensing"])


@router.post("/field-ndvi", response_model=SatelliteAnalysisResult)
def get_field_satellite_ndvi(payload: SatelliteAnalysisRequest):
    if not settings.demo_mode:
        raise HTTPException(
            status_code=404,
            detail="Simulated remote sensing endpoint disabled when DEMO_MODE is False"
        )
    return analyze_field_remote_sensing(payload)
