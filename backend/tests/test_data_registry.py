"""Test suite for the /data-registry endpoint auditing all data sources and provenance."""
import pytest
from app.core.provenance import Provenance


def test_data_registry_endpoint(client):
    r = client.get("/data-registry")
    assert r.status_code == 200
    data = r.json()

    assert "total_modules" in data
    assert "modules" in data
    assert "last_audited" in data
    assert data["total_modules"] >= 20
    assert len(data["modules"]) == data["total_modules"]

    valid_provenances = {p.value for p in Provenance}

    for item in data["modules"]:
        assert item["module_id"]
        assert item["module_name"]
        assert item["route_prefix"]
        assert item["data_origin"] in {"LIVE_HTTP", "CURATED_REFERENCE", "COMPUTED_FORMULA", "SIMULATED", "USER_PROVIDED"}
        assert item["provenance"] in valid_provenances
        assert item["reviewer_status"]
        assert item["description"]

        # If data is LIVE, it must have a source_url
        if item["provenance"] == Provenance.LIVE.value:
            assert item["source_url"] is not None
            assert item["last_verified"] is not None
