def _farm(client):
    fid = client.post("/farmers", json={"name": "Test Farmer (synthetic)", "preferred_language": "mr"}).json()["id"]
    r = client.post(f"/farmers/{fid}/farms", json={"name": "Plot 1", "area_hectares": 1.5, "district": "Pune"})
    return fid, r


def test_health(client):
    assert client.get("/health").json()["status"] == "ok"


def test_create_farm(client):
    _, r = _farm(client)
    assert r.status_code == 201 and r.json()["area_hectares"] == 1.5


def test_farm_for_missing_farmer_404(client):
    r = client.post("/farmers/999/farms", json={"name": "x", "area_hectares": 1, "district": "Pune"})
    assert r.status_code == 404


def test_invalid_coordinates_rejected(client):
    fid, _ = _farm(client)
    r = client.post(f"/farmers/{fid}/farms", json={"name": "x", "area_hectares": 1, "district": "Pune", "latitude": 95, "longitude": 10})
    assert r.status_code == 422


def test_negative_area_rejected(client):
    fid, _ = _farm(client)
    r = client.post(f"/farmers/{fid}/farms", json={"name": "x", "area_hectares": -1, "district": "Pune"})
    assert r.status_code == 422


def test_invalid_language_rejected(client):
    assert client.post("/farmers", json={"name": "a", "preferred_language": "fr"}).status_code == 422


def test_soil_test_is_labelled_user_provided(client):
    _, r = _farm(client)
    farm_id = r.json()["id"]
    t = client.post(f"/farms/{farm_id}/soil-tests", json={"tested_on": "2026-06-01", "ph": 7.2})
    assert t.status_code == 201 and t.json()["provenance"] == "USER_PROVIDED"
    assert len(client.get(f"/farms/{farm_id}/soil-tests").json()) == 1


def test_soil_ph_out_of_range_rejected(client):
    _, r = _farm(client)
    t = client.post(f"/farms/{r.json()['id']}/soil-tests", json={"tested_on": "2026-06-01", "ph": 15})
    assert t.status_code == 422
