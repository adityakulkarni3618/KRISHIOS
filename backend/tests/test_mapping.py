def test_classification_is_flagged_for_review(client):
    r = client.post("/mapping/classify", json={"title": "Smart irrigation using soil moisture", "description": "drip water scheduling"}).json()
    assert "water_management" in r["candidate_domains"]
    assert r["needs_human_review"] is True
    assert r["verification_status"].startswith("UNVERIFIED")


def test_unimplemented_modules_reported_as_missing(client):
    r = client.post("/mapping/classify", json={"title": "Crop disease detection from leaf images"}).json()
    assert "D_disease_pest" in r["missing_capabilities"]


def test_source_url_marks_verified(client):
    r = client.post("/mapping/classify", json={"title": "Mandi price tool", "evidence_sources": ["https://example.org"]}).json()
    assert r["verification_status"] == "VERIFIED"


def test_unknown_text_has_no_domain(client):
    r = client.post("/mapping/classify", json={"title": "Quantum widget"}).json()
    assert r["candidate_domains"] == [] and "No domain matched" in " ".join(r["notes"])
