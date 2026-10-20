from fastapi import APIRouter, Query

from app.modules.weather.adapter import WeatherAdvisoryResponse, weather_service

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/advisory", response_model=WeatherAdvisoryResponse)
def get_weather_advisory(
    latitude: float | None = Query(default=None, ge=-90.0, le=90.0),
    longitude: float | None = Query(default=None, ge=-180.0, le=180.0),
    district: str | None = Query(default=None, description="Maharashtra district name, e.g., Pune, Nashik"),
):
    return weather_service.get_weather_advisory(latitude=latitude, longitude=longitude, district=district)
