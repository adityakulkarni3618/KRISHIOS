from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_disease_catalog():
    res = client.get("/disease/catalog")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 3
    # Check item structure
    first = data[0]
    assert "crop" in first
    assert "disease_name" in first
    assert "organic_remedy" in first
    assert "chemical_remedy" in first
    assert "dosage_per_15l_pump" in first["organic_remedy"]


def test_disease_detail_and_not_found():
    res = client.get("/disease/cotton-pink-bollworm")
    assert res.status_code == 200
    assert res.json()["id"] == "cotton-pink-bollworm"

    res_404 = client.get("/disease/unknown-disease-xyz")
    assert res_404.status_code == 404


def test_disease_diagnose():
    res = client.post("/disease/diagnose", json={"crop": "Soybean", "symptom_description": "yellow leaves mosaic"})
    assert res.status_code == 200
    data = res.json()
    assert data["crop_mr"] is not None
    assert "confidence" not in data
    assert data["provenance"] == "CURATED_REFERENCE"
    assert "not a diagnosis" in data["disclaimer"].lower()
    assert "KVK" in data["disclaimer"]


def test_disease_response_has_no_confidence_and_no_ai_text():
    import json
    import re
    res = client.post("/disease/diagnose", json={"crop": "Cotton", "symptom_description": "pink bollworm rosette flowers"})
    assert res.status_code == 200
    data = res.json()
    assert "confidence" not in data
    text = json.dumps(data)
    assert not re.search(r"\bAI\b", text), f"Found 'AI' text in disease response: {text}"


def test_mandi_forecast_enabled(monkeypatch):
    from app.core.config import settings
    monkeypatch.setattr(settings, "demo_mode", True)

    res = client.get("/market/forecast?commodity=Soybean&district=Latur&market=Latur%20APMC&quantity_quintals=60")
    assert res.status_code == 200
    data = res.json()
    assert data["commodity"] == "Soybean"
    assert data["provenance"] == "SIMULATED"
    assert "SIMULATED" in data["warning"]
    assert "Agmarknet" not in data["source_citation"]
    assert data["scenario_title"] == "Illustrative price scenario"
    assert len(data["forecast_curve"]) >= 3
    assert data["storage_economics"]["net_profit_per_quintal"] is not None


def test_mandi_forecast_disabled(monkeypatch):
    from app.core.config import settings
    monkeypatch.setattr(settings, "demo_mode", False)

    res_disabled = client.get("/market/forecast?commodity=Soybean&district=Latur&market=Latur%20APMC&quantity_quintals=60")
    assert res_disabled.status_code == 404
    assert "disabled" in res_disabled.json()["detail"].lower()
