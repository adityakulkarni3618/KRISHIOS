def _get_auth(client):
    reg = client.post(
        "/auth/register",
        json={
            "username": "api_tester",
            "email": "tester@example.com",
            "password": "password123",
            "full_name": "API Tester",
            "role": "farmer",
        },
    ).json()
    return {"Authorization": f"Bearer {reg['access_token']}"}


def _farm(client):
    headers = _get_auth(client)
    fid = client.post(
        "/farmers",
        json={"name": "Test Farmer (synthetic)", "preferred_language": "mr"},
        headers=headers,
    ).json()["id"]
    r = client.post(
        f"/farmers/{fid}/farms",
        json={"name": "Plot 1", "area_hectares": 1.5, "district": "Pune"},
        headers=headers,
    )
    return fid, r, headers


def test_health(client):
    assert client.get("/health").json()["status"] == "ok"


def test_create_farm(client):
    _, r, _ = _farm(client)
    assert r.status_code == 201 and r.json()["area_hectares"] == 1.5


def test_farm_for_missing_farmer_404(client):
    headers = _get_auth(client)
    r = client.post(
        "/farmers/999/farms",
        json={"name": "x", "area_hectares": 1, "district": "Pune"},
        headers=headers,
    )
    assert r.status_code == 404


def test_invalid_coordinates_rejected(client):
    fid, _, headers = _farm(client)
    r = client.post(
        f"/farmers/{fid}/farms",
        json={"name": "x", "area_hectares": 1, "district": "Pune", "latitude": 95, "longitude": 10},
        headers=headers,
    )
    assert r.status_code == 422


def test_negative_area_rejected(client):
    fid, _, headers = _farm(client)
    r = client.post(
        f"/farmers/{fid}/farms",
        json={"name": "x", "area_hectares": -1, "district": "Pune"},
        headers=headers,
    )
    assert r.status_code == 422


def test_invalid_language_rejected(client):
    headers = _get_auth(client)
    assert client.post(
        "/farmers",
        json={"name": "a", "preferred_language": "fr"},
        headers=headers,
    ).status_code == 422


def test_soil_test_is_labelled_user_provided(client):
    _, r, headers = _farm(client)
    farm_id = r.json()["id"]
    t = client.post(
        f"/farms/{farm_id}/soil-tests",
        json={"tested_on": "2026-06-01", "ph": 7.2},
        headers=headers,
    )
    assert t.status_code == 201 and t.json()["provenance"] == "USER_PROVIDED"
    tests_list = client.get(f"/farms/{farm_id}/soil-tests", headers=headers).json()
    assert len(tests_list) == 1


def test_soil_ph_out_of_range_rejected(client):
    _, r, headers = _farm(client)
    t = client.post(
        f"/farms/{r.json()['id']}/soil-tests",
        json={"tested_on": "2026-06-01", "ph": 15},
        headers=headers,
    )
    assert t.status_code == 422
