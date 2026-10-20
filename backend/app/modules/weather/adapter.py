import time
from datetime import datetime, timezone
from typing import Any

import httpx
from pydantic import BaseModel

from app.core.provenance import Provenance

MAHARASHTRA_DISTRICT_COORDS: dict[str, tuple[float, float]] = {
    "pune": (18.5204, 73.8567),
    "nashik": (19.9975, 73.7898),
    "nagpur": (21.1458, 79.0882),
    "chhatrapati sambhajinagar": (19.8762, 75.3433),
    "aurangabad": (19.8762, 75.3433),
    "solapur": (17.6599, 75.9064),
    "kolhapur": (16.7050, 74.2433),
    "amravati": (20.9374, 77.7796),
    "jalgaon": (21.0077, 75.5626),
    "ahmednagar": (19.0952, 74.7496),
    "satara": (17.6805, 73.9997),
    "nanded": (19.1383, 77.3210),
    "sangli": (16.8524, 74.5815),
    "latur": (18.4088, 76.5604),
    "parbhani": (19.2644, 76.7767),
    "osmanabad": (18.1856, 76.0419),
    "dharashiv": (18.1856, 76.0419),
    "akola": (20.7002, 77.0082),
    "yavatmal": (20.3888, 78.1204),
    "washim": (20.1095, 77.1350),
    "wardha": (20.7453, 78.6022),
    "chandrapur": (19.9615, 79.2961),
    "gadchiroli": (20.1849, 79.9948),
    "gondia": (21.4602, 80.1961),
    "bhandara": (21.1714, 79.6548),
    "beed": (18.9891, 75.7601),
    "jalna": (19.8347, 75.8816),
    "hingoli": (19.7173, 77.1486),
    "dhule": (20.9042, 74.7749),
    "nandurbar": (21.3694, 74.2403),
    "buldhana": (20.5312, 76.1848),
    "ratnagiri": (16.9902, 73.3120),
    "sindhudurg": (16.1264, 73.7042),
    "raigad": (18.5158, 73.1822),
    "thane": (19.2183, 72.9781),
    "palghar": (19.6967, 72.7699),
}


class DailyForecast(BaseModel):
    date: str
    temp_max: float
    temp_min: float
    precipitation_sum: float
    precipitation_probability: float | None = None


class WeatherAdvisoryResponse(BaseModel):
    latitude: float
    longitude: float
    district: str | None = None
    temperature: float | None = None
    relative_humidity: float | None = None
    precipitation: float | None = None
    wind_speed: float | None = None
    daily_forecast: list[DailyForecast] = []
    advisories: list[str] = []
    source: str
    attribution: str
    fetched_at: str
    provenance: Provenance
    is_available: bool = True
    error_message: str | None = None


class WeatherCacheEntry:
    def __init__(self, data: WeatherAdvisoryResponse, expires_at: float):
        self.data = data
        self.expires_at = expires_at


class WeatherService:
    def __init__(self, cache_ttl_seconds: int = 900, request_timeout_seconds: float = 4.0):
        self.cache_ttl = cache_ttl_seconds
        self.timeout = request_timeout_seconds
        self._cache: dict[str, WeatherCacheEntry] = {}

    def _get_cache_key(self, lat: float, lon: float) -> str:
        return f"{round(lat, 2)}_{round(lon, 2)}"

    def _generate_advisories(
        self,
        temp: float | None,
        humidity: float | None,
        wind_speed: float | None,
        precip: float | None,
        daily: list[DailyForecast],
    ) -> list[str]:
        advisories: list[str] = []
        if wind_speed is not None and wind_speed > 15.0:
            advisories.append("High wind speed (>15 km/h): Avoid spraying chemical pesticides or foliar nutrients to prevent drift loss.")
        elif wind_speed is not None and wind_speed <= 15.0 and (precip or 0.0) == 0.0:
            advisories.append("Favorable conditions for field operations and preventive spraying.")

        if precip is not None and precip > 2.0:
            advisories.append(f"Precipitation detected ({precip} mm): Postpone scheduled irrigation to avoid waterlogging.")
        elif daily and any(d.precipitation_sum > 10.0 for d in daily[:2]):
            advisories.append("Heavy rainfall expected within 48 hours: Ensure farm drainage channels are open and suspend fertilizer broadcasting.")

        if temp is not None and temp >= 38.0:
            advisories.append("High heat stress warning (>38°C): Irrigate in early morning or late evening; apply mulch to conserve soil moisture.")
        elif temp is not None and temp <= 10.0:
            advisories.append("Low temperature alert (<10°C): Risk of cold injury for sensitive vegetable/horticulture crops.")

        if humidity is not None and humidity > 80.0 and temp is not None and 20.0 <= temp <= 30.0:
            advisories.append("Warm and humid conditions (>80% RH): Elevated risk of fungal infections (blight/powdery mildew); scout crops closely.")

        if not advisories:
            advisories.append("Normal weather conditions: Proceed with standard agronomic schedule.")
        return advisories

    def get_weather_advisory(
        self,
        latitude: float | None = None,
        longitude: float | None = None,
        district: str | None = None,
        client: httpx.Client | None = None,
    ) -> WeatherAdvisoryResponse:
        # Resolve coordinates from district if lat/lon not provided
        matched_district = None
        if (latitude is None or longitude is None) and district:
            norm_district = district.strip().lower()
            if norm_district in MAHARASHTRA_DISTRICT_COORDS:
                latitude, longitude = MAHARASHTRA_DISTRICT_COORDS[norm_district]
                matched_district = district.strip().title()

        if latitude is None or longitude is None:
            now_iso = datetime.now(timezone.utc).isoformat()
            return WeatherAdvisoryResponse(
                latitude=0.0,
                longitude=0.0,
                district=district,
                source="Open-Meteo",
                attribution="Weather data by Open-Meteo.com under CC BY 4.0",
                fetched_at=now_iso,
                provenance=Provenance.UNAVAILABLE,
                is_available=False,
                error_message="Neither valid coordinates nor a recognized Maharashtra district were provided.",
            )

        cache_key = self._get_cache_key(latitude, longitude)
        now_ts = time.time()

        # Check cache
        if cache_key in self._cache:
            entry = self._cache[cache_key]
            if now_ts < entry.expires_at:
                return entry.data

        now_iso = datetime.now(timezone.utc).isoformat()
        url = "https://api.open-meteo.com/v1/forecast"
        params: dict[str, Any] = {
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max",
            "timezone": "Asia/Kolkata",
        }

        try:
            http = client or httpx.Client(timeout=self.timeout)
            resp = http.get(url, params=params)
            if resp.status_code != 200:
                raise httpx.HTTPStatusError(f"HTTP {resp.status_code}", request=resp.request, response=resp)
            data = resp.json()

            current = data.get("current", {})
            daily_raw = data.get("daily", {})

            daily_list: list[DailyForecast] = []
            dates = daily_raw.get("time", [])
            t_max = daily_raw.get("temperature_2m_max", [])
            t_min = daily_raw.get("temperature_2m_min", [])
            p_sum = daily_raw.get("precipitation_sum", [])
            p_prob = daily_raw.get("precipitation_probability_max", [])

            for i in range(len(dates)):
                daily_list.append(
                    DailyForecast(
                        date=dates[i],
                        temp_max=t_max[i] if i < len(t_max) else 0.0,
                        temp_min=t_min[i] if i < len(t_min) else 0.0,
                        precipitation_sum=p_sum[i] if i < len(p_sum) else 0.0,
                        precipitation_probability=p_prob[i] if i < len(p_prob) else None,
                    )
                )

            temp = current.get("temperature_2m")
            humidity = current.get("relative_humidity_2m")
            precip = current.get("precipitation")
            wind_speed = current.get("wind_speed_10m")

            advisories = self._generate_advisories(temp, humidity, wind_speed, precip, daily_list)

            result = WeatherAdvisoryResponse(
                latitude=latitude,
                longitude=longitude,
                district=matched_district or district,
                temperature=temp,
                relative_humidity=humidity,
                precipitation=precip,
                wind_speed=wind_speed,
                daily_forecast=daily_list[:7],
                advisories=advisories,
                source="Open-Meteo",
                attribution="Weather data by Open-Meteo.com under CC BY 4.0",
                fetched_at=now_iso,
                provenance=Provenance.LIVE,
                is_available=True,
            )

            # Store in cache
            self._cache[cache_key] = WeatherCacheEntry(data=result, expires_at=now_ts + self.cache_ttl)
            return result

        except Exception as e:
            # Fallback according to AGENTS.md rule: return UNAVAILABLE without fabricating numbers
            return WeatherAdvisoryResponse(
                latitude=latitude,
                longitude=longitude,
                district=matched_district or district,
                source="Open-Meteo",
                attribution="Weather data by Open-Meteo.com under CC BY 4.0",
                fetched_at=now_iso,
                provenance=Provenance.UNAVAILABLE,
                is_available=False,
                error_message=f"Weather service unavailable: {type(e).__name__} ({str(e)})",
            )


weather_service = WeatherService()
