from app.core.provenance import Provenance
from app.modules.schemes.catalog import SchemesService
from app.modules.soil.interpretation import SoilMetricsIn, evaluate_soil_health


def test_soil_acidic_interpretation():
    m = SoilMetricsIn(ph=5.2, organic_carbon_pct=0.42)
    res = evaluate_soil_health(m)
    assert res.provenance == Provenance.ESTIMATED
    assert "ICAR" in res.citation
    ph_eval = next(e for e in res.evaluations if "pH" in e.parameter)
    assert ph_eval.rating == "Strongly Acidic"
    assert "lime" in ph_eval.recommendation.lower()

    oc_eval = next(e for e in res.evaluations if "Organic Carbon" in e.parameter)
    assert "Low" in oc_eval.rating
    assert "farmyard manure" in oc_eval.recommendation.lower()


def test_soil_optimal_and_alkaline():
    # Optimal
    m_opt = SoilMetricsIn(ph=7.0, organic_carbon_pct=0.85)
    res_opt = evaluate_soil_health(m_opt)
    assert "Optimal" in res_opt.evaluations[0].rating
    assert "High" in res_opt.evaluations[1].rating

    # Sodic / Alkaline
    m_alk = SoilMetricsIn(ph=8.8)
    res_alk = evaluate_soil_health(m_alk)
    assert "Strongly Alkaline" in res_alk.evaluations[0].rating
    assert "gypsum" in res_alk.evaluations[0].recommendation.lower()


def test_farm_soil_interpretation_endpoint(client):
    # Register and create farm
    reg = client.post(
        "/auth/register",
        json={"username": "soil_user", "email": "soil@example.com", "password": "password123", "role": "farmer"},
    ).json()
    headers = {"Authorization": f"Bearer {reg['access_token']}"}

    f = client.post("/farmers", json={"name": "Soil Farmer", "preferred_language": "mr"}, headers=headers).json()
    farm = client.post(
        f"/farmers/{f['id']}/farms",
        json={"name": "Plot Soil", "area_hectares": 3.0, "district": "Kolhapur"},
        headers=headers,
    ).json()

    # Before soil test: 404
    r_empty = client.get(f"/soil/farms/{farm['id']}/interpretation", headers=headers)
    assert r_empty.status_code == 404

    # Add soil test
    client.post(
        f"/farms/{farm['id']}/soil-tests",
        json={"tested_on": "2026-10-15", "ph": 7.8, "organic_carbon_pct": 0.65},
        headers=headers,
    )

    # After soil test: 200 with scientific interpretation
    r_ok = client.get(f"/soil/farms/{farm['id']}/interpretation", headers=headers)
    assert r_ok.status_code == 200
    data = r_ok.json()
    assert len(data["evaluations"]) == 2
    assert data["provenance"] == "ESTIMATED"


def test_schemes_listing_and_filtering():
    svc = SchemesService()
    all_schemes = svc.list_schemes()
    assert len(all_schemes) >= 5

    # Every scheme must have official portal URL and provenance
    for s in all_schemes:
        assert s.official_portal_url.startswith("http")
        assert s.provenance == Provenance.HISTORICAL
        assert len(s.eligibility_checklist) > 0

    # Filter by category
    ins_schemes = svc.list_schemes(category="Insurance")
    assert any("PMFBY" in s.name for s in ins_schemes)

    # Search filter
    search_schemes = svc.list_schemes(search="shet tale")
    assert len(search_schemes) >= 1
    assert "Shet Tale" in search_schemes[0].name


def test_schemes_api_endpoints(client):
    r_list = client.get("/schemes")
    assert r_list.status_code == 200
    assert len(r_list.json()) >= 5

    r_cats = client.get("/schemes/categories")
    assert r_cats.status_code == 200
    assert "Direct Income" in r_cats.json()["categories"]
