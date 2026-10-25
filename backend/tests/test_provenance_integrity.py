"""Rigorous integrity tests for provenance labels and source attribution.

Enforces platform governance rules:
1. Any response or record with Provenance.LIVE must have non-empty `fetched_at` and `source` (or `source_url`).
2. Any record with Provenance.CURATED_REFERENCE must have non-empty `last_verified`.
3. No module may return or accept a custom provenance string outside the canonical Provenance enum.
"""
import pytest
from pydantic import ValidationError

from app.core.provenance import Provenance
from app.routers.data_registry import REGISTRY_CATALOG
from app.modules.schemes.catalog import SCHEMES_CATALOG
from app.modules.rural_ops.electricity import FeederScheduleItem, PowerShift
from app.modules.market_linkage.food_processing import PROCESSING_PROJECTS
from app.modules.postharvest.warehouses import MAHARASHTRA_WAREHOUSE_DIRECTORY


def test_custom_provenance_string_is_strictly_rejected():
    """Ensure that arbitrary strings outside the canonical Provenance enum cannot be used."""
    canonical_values = {p.value for p in Provenance}
    assert "CUSTOM_LABEL" not in canonical_values
    assert "AI_GENERATED" not in canonical_values

    # Test Pydantic model rejects unregistered provenance strings
    with pytest.raises(ValidationError):
        FeederScheduleItem(
            district="Nashik",
            substation_name="Sub",
            feeder_name="Feed",
            current_status="POWER_ACTIVE",
            active_shift=PowerShift.DAY_SHIFT,
            shift_hours="08:00 AM to 04:00 PM",
            shift_hours_mr="08:00 AM to 04:00 PM",
            next_shift_rotation_date="Next Monday",
            current_voltage=415,
            voltage_health="OPTIMAL_NORMAL",
            irrigation_advisory="Advisory",
            irrigation_advisory_mr="Advisory",
            helpline_number="1800",
            provenance="UNOFFICIAL_CUSTOM_STRING",  # Must fail
        )


def test_live_data_must_have_fetched_at_and_source(client):
    """Any response returning LIVE provenance must include fetched_at and source."""
    # Test live weather endpoint
    resp = client.get("/weather/advisory?district=Nashik")
    assert resp.status_code == 200
    data = resp.json()

    if data.get("provenance") == Provenance.LIVE.value:
        assert data.get("source") is not None, "LIVE data must have a non-null source"
        assert len(str(data.get("source")).strip()) > 0, "LIVE data must have a non-empty source"
        assert data.get("fetched_at") is not None, "LIVE data must have a non-null fetched_at"
        assert len(str(data.get("fetched_at")).strip()) > 0, "LIVE data must have a non-empty fetched_at"


def test_curated_reference_data_must_have_last_verified():
    """Every static dataset catalog entry marked CURATED_REFERENCE must include last_verified."""
    # 1. Schemes catalog
    for s in SCHEMES_CATALOG:
        prov = s.get("provenance")
        if prov == Provenance.CURATED_REFERENCE or prov == Provenance.CURATED_REFERENCE.value:
            assert s.get("last_verified") is not None, f"Scheme {s.get('id')} missing last_verified"
            assert len(str(s.get("last_verified")).strip()) > 0

    # 2. Food processing PMFME blueprints
    for p in PROCESSING_PROJECTS:
        if p.provenance == Provenance.CURATED_REFERENCE:
            assert p.last_verified is not None, f"Processing project {p.id} missing last_verified"
            assert len(p.last_verified.strip()) > 0

    # 3. Warehouses directory
    for w in MAHARASHTRA_WAREHOUSE_DIRECTORY:
        if w.provenance == Provenance.CURATED_REFERENCE:
            assert w.last_verified is not None, f"Warehouse {w.id} missing last_verified"
            assert len(w.last_verified.strip()) > 0


def test_data_registry_provenance_labels_are_canonical():
    """All entries in the system data registry must only use canonical Provenance enum members."""
    canonical_values = {p.value for p in Provenance}

    for item in REGISTRY_CATALOG:
        assert item.provenance.value in canonical_values

        if item.provenance == Provenance.LIVE:
            assert item.source_url is not None, f"Module {item.module_id} marked LIVE lacks source_url"
            assert item.last_verified is not None, f"Module {item.module_id} marked LIVE lacks last_verified"

        if item.provenance == Provenance.CURATED_REFERENCE and item.last_verified is not None:
            assert len(item.last_verified.strip()) > 0
