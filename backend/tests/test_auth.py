def _auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def _register(client, username="farmer1", email="farmer1@example.com", password="password123", role="farmer"):
    return client.post(
        "/auth/register",
        json={
            "username": username,
            "email": email,
            "password": password,
            "full_name": f"Test {username.title()}",
            "role": role,
        },
    )


def test_register_success(client):
    r = _register(client, "kailas", "kailas@example.com")
    assert r.status_code == 201
    data = r.json()
    assert "access_token" in data
    assert data["role"] == "farmer"
    assert data["username"] == "kailas"


def test_duplicate_registration_rejected(client):
    r1 = _register(client, "anita", "anita@example.com")
    assert r1.status_code == 201
    # duplicate username
    r2 = _register(client, "anita", "anita2@example.com")
    assert r2.status_code == 400
    assert "already registered" in r2.json()["detail"]
    # duplicate email
    r3 = _register(client, "anita3", "anita@example.com")
    assert r3.status_code == 400


def test_login_success_and_failure(client):
    _register(client, "suresh", "suresh@example.com", "mypassword")
    # Correct password
    r_ok = client.post("/auth/login", json={"username": "suresh", "password": "mypassword"})
    assert r_ok.status_code == 200
    assert "access_token" in r_ok.json()

    # Wrong password
    r_bad = client.post("/auth/login", json={"username": "suresh", "password": "wrongpassword"})
    assert r_bad.status_code == 401

    # Non-existent user
    r_none = client.post("/auth/login", json={"username": "nobody", "password": "password"})
    assert r_none.status_code == 401


def test_unauthenticated_requests_return_401(client):
    assert client.get("/auth/me").status_code == 401
    assert client.get("/farms").status_code == 401
    assert client.post("/farmers", json={"name": "A", "preferred_language": "mr"}).status_code == 401
    assert client.get("/farms/1").status_code == 401


def test_me_endpoint_returns_user_info(client):
    reg = _register(client, "radha", "radha@example.com", role="expert").json()
    headers = _auth_headers(reg["access_token"])
    r = client.get("/auth/me", headers=headers)
    assert r.status_code == 200
    data = r.json()
    assert data["username"] == "radha"
    assert data["role"] == "expert"


def test_cross_user_access_returns_403(client):
    # Farmer 1 creates farm
    u1 = _register(client, "farmer_a", "fa@example.com").json()
    h1 = _auth_headers(u1["access_token"])
    farmer1 = client.post("/farmers", json={"name": "Farmer A", "preferred_language": "mr"}, headers=h1).json()
    farm1 = client.post(
        f"/farmers/{farmer1['id']}/farms",
        json={"name": "Plot A", "area_hectares": 2.0, "district": "Nashik"},
        headers=h1,
    ).json()

    # Farmer 2 tries to access Farmer 1's farm -> 403
    u2 = _register(client, "farmer_b", "fb@example.com").json()
    h2 = _auth_headers(u2["access_token"])
    r_get = client.get(f"/farms/{farm1['id']}", headers=h2)
    assert r_get.status_code == 403

    # Farmer 2 tries to add soil test to Farmer 1's farm -> 403
    r_soil = client.post(
        f"/farms/{farm1['id']}/soil-tests",
        json={"tested_on": "2026-06-01", "ph": 6.8},
        headers=h2,
    )
    assert r_soil.status_code == 403

    # Admin user can access Farmer 1's farm -> 200
    u_admin = _register(client, "admin_user", "admin@example.com", role="admin").json()
    h_admin = _auth_headers(u_admin["access_token"])
    r_admin = client.get(f"/farms/{farm1['id']}", headers=h_admin)
    assert r_admin.status_code == 200
