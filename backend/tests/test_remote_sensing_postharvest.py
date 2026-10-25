import pytest
from app.modules.postharvest.warehouses import (
    PledgeLoanEstimateRequest,
    calculate_pledge_loan,
    list_warehouses_by_district,
)
from app.modules.remote_sensing.ndvi import (
    SatelliteAnalysisRequest,
    analyze_field_remote_sensing,
)


def test_satellite_remote_sensing_ndvi_enabled(monkeypatch):
    import json
    from fastapi.testclient import TestClient
    from app.main import app
    from app.core.config import settings
    from app.core.provenance import Provenance

    monkeypatch.setattr(settings, "demo_mode", True)

    req = SatelliteAnalysisRequest(
        district="Nashik",
        crop="Soybean",
        farm_area_acres=3.0,
    )
    result = analyze_field_remote_sensing(req)
    assert result.mean_ndvi > 0.5
    assert len(result.zonal_distribution) >= 2
    assert "sentinel" not in result.satellite_source.lower()
    assert result.provenance == Provenance.SIMULATED
    assert "SIMULATED" in result.warning
    assert result.overall_recommendation != ""

    client = TestClient(app)
    res = client.post("/remote-sensing/field-ndvi", json={
        "district": "Nashik",
        "crop": "Soybean",
        "farm_area_acres": 3.0
    })
    assert res.status_code == 200
    data = res.json()
    # Verify simulated response does not claim downlink satellite identity
    text_content = json.dumps(data)
    assert "sentinel" not in text_content.lower(), f"Found 'Sentinel' text in NDVI response: {text_content}"


def test_satellite_remote_sensing_ndvi_disabled(monkeypatch):
    from fastapi.testclient import TestClient
    from app.main import app
    from app.core.config import settings

    monkeypatch.setattr(settings, "demo_mode", False)

    client = TestClient(app)
    res_disabled = client.post("/remote-sensing/field-ndvi", json={
        "district": "Nashik",
        "crop": "Soybean",
        "farm_area_acres": 3.0
    })
    assert res_disabled.status_code == 404
    assert "disabled" in res_disabled.json()["detail"].lower()


def test_warehouse_listing_and_pledge_loan():
    warehouses = list_warehouses_by_district("Nashik")
    assert len(warehouses) >= 1
    assert any("MSWC" in w.agency or "CWC" in w.agency for w in warehouses)

    req = PledgeLoanEstimateRequest(
        commodity="Soybean",
        quantity_quintals=100.0,
        current_modal_price_per_qtl=4800.0,
        planned_storage_months=3,
    )
    res = calculate_pledge_loan(req)
    assert res.total_crop_value_inr == 480000.0
    assert res.max_pledge_loan_eligible_inr == 480000.0 * 0.75  # 75% limit
    assert res.interest_rate_pct_annual == 7.0
    assert res.warehouse_storage_cost_inr > 0
    assert res.net_economic_gain_by_holding_inr > 0
