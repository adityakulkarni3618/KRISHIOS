from fastapi import APIRouter

from app.modules.remote_sensing.ndvi import (
    SatelliteAnalysisRequest,
    SatelliteAnalysisResult,
    analyze_field_remote_sensing,
)

router = APIRouter(prefix="/remote-sensing", tags=["satellite-remote-sensing"])


@router.post("/field-ndvi", response_model=SatelliteAnalysisResult)
def get_field_satellite_ndvi(payload: SatelliteAnalysisRequest):
    return analyze_field_remote_sensing(payload)
