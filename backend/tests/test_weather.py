import httpx

from app.core.provenance import Provenance
from app.modules.weather.adapter import WeatherService


class MockSuccessClient:
    def get(self, url, params=None):
        return httpx.Response(
            200,
            json={
                "current": {
                    "temperature_2m": 31.5,
                    "relative_humidity_2m": 55,
                    "precipitation": 0.0,
                    "wind_speed_10m": 8.2,
                },
                "daily": {
                    "time": ["2026-10-20", "2026-10-21"],
                    "temperature_2m_max": [33.0, 32.5],
                    "temperature_2m_min": [21.0, 20.5],
                    "precipitation_sum": [0.0, 5.2],
                    "precipitation_probability_max": [10, 60],
                },
            },
            request=httpx.Request("GET", url),
        )


class MockTimeoutClient:
    def get(self, url, params=None):
        raise httpx.TimeoutException("Connection timed out after 3.0s")


class MockMalformedClient:
    def get(self, url, params=None):
        return httpx.Response(500, json={"error": "Internal upstream error"}, request=httpx.Request("GET", url))


def test_weather_success_response():
    svc = WeatherService(cache_ttl_seconds=60)
    mock = MockSuccessClient()
    res = svc.get_weather_advisory(latitude=18.52, longitude=73.85, client=mock)
    assert res.provenance == Provenance.LIVE
    assert res.is_available is True
    assert res.temperature == 31.5
    assert res.relative_humidity == 55
    assert len(res.daily_forecast) == 2
    assert res.source == "Open-Meteo"
    assert "Open-Meteo.com" in res.attribution
    assert len(res.advisories) > 0


def test_weather_cache_hit():
    svc = WeatherService(cache_ttl_seconds=600)
    mock = MockSuccessClient()
    # First call fills cache
    r1 = svc.get_weather_advisory(latitude=18.52, longitude=73.85, client=mock)
    assert r1.provenance == Provenance.LIVE

    # Second call uses cache even if client is a timeout client
    timeout_client = MockTimeoutClient()
    r2 = svc.get_weather_advisory(latitude=18.52, longitude=73.85, client=timeout_client)
    assert r2.provenance == Provenance.LIVE
    assert r2.temperature == 31.5


def test_weather_timeout_fallback_to_unavailable():
    svc = WeatherService(cache_ttl_seconds=0)
    timeout_client = MockTimeoutClient()
    res = svc.get_weather_advisory(latitude=18.52, longitude=73.85, client=timeout_client)
    assert res.provenance == Provenance.UNAVAILABLE
    assert res.is_available is False
    assert res.temperature is None
    assert "TimeoutException" in (res.error_message or "")


def test_weather_upstream_error_fallback():
    svc = WeatherService(cache_ttl_seconds=0)
    error_client = MockMalformedClient()
    res = svc.get_weather_advisory(latitude=18.52, longitude=73.85, client=error_client)
    assert res.provenance == Provenance.UNAVAILABLE
    assert res.is_available is False


def test_district_name_resolution():
    svc = WeatherService(cache_ttl_seconds=60)
    mock = MockSuccessClient()
    res = svc.get_weather_advisory(district="Nashik", client=mock)
    assert res.provenance == Provenance.LIVE
    assert round(res.latitude, 2) == 20.00
    assert round(res.longitude, 2) == 73.79
    assert res.district == "Nashik"


def test_missing_coordinates_and_district_handled():
    svc = WeatherService()
    res = svc.get_weather_advisory()
    assert res.provenance == Provenance.UNAVAILABLE
    assert res.is_available is False
    assert "Neither valid coordinates nor a recognized" in (res.error_message or "")


def test_weather_api_endpoint(client):
    r = client.get("/weather/advisory?district=Pune")
    assert r.status_code == 200
    data = r.json()
    assert "provenance" in data
    assert "source" in data
    assert "attribution" in data
