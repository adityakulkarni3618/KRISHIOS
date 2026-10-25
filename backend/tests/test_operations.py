import pytest
from app.modules.operations.groundwater import get_groundwater_data
from app.modules.operations.input_verification import (
    SeedVerificationRequest,
    list_authorized_dealers,
    verify_seed_lot,
)
from app.modules.operations.labor_hub import get_labor_hub_data


def test_labor_hub_wages_and_gangs():
    hub = get_labor_hub_data("Nashik")
    assert hub.district == "Nashik"
    assert len(hub.prevailing_wages) >= 3
    assert len(hub.available_labor_groups) >= 2
    shinde = hub.available_labor_groups[0]
    assert shinde.contact_phone != ""
    assert shinde.group_size > 0


def test_seed_authenticity_verification():
    from app.core.provenance import Provenance
    req = SeedVerificationRequest(
        crop="Soybean",
        company_name="Mahabeej",
        variety_name="JS-335",
        lot_number="MH-2026-K-8912",
        mrp_inr=3100.0,
    )
    res = verify_seed_lot(req)
    assert res.is_genuine_format is True
    assert res.status == "FORMAT_PLAUSIBLE"
    assert res.provenance == Provenance.CURATED_REFERENCE
    assert "format check only" in res.message.lower()
    assert res.recommended_germination_pct >= 70

    # Test invalid format
    invalid_req = SeedVerificationRequest(
        crop="Soybean",
        company_name="Unknown",
        variety_name="Test",
        lot_number="12",
        mrp_inr=100.0,
    )
    invalid_res = verify_seed_lot(invalid_req)
    assert invalid_res.is_genuine_format is False
    assert invalid_res.status == "FORMAT_INVALID"

    dealers = list_authorized_dealers("Nashik")
    assert len(dealers) >= 1
    assert "MH/NSK" in dealers[0].license_number


def test_groundwater_aquifer_advisory():
    gw = get_groundwater_data("Nashik")
    assert gw.district == "Nashik"
    assert gw.pre_monsoon_water_level_m > 0
    assert "Feet" in gw.recommended_borewell_depth_ft
    assert len(gw.borewell_recharge_design) >= 3
