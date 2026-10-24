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
    req = SeedVerificationRequest(
        crop="Soybean",
        company_name="Mahabeej",
        variety_name="JS-335",
        lot_number="MH-2026-K-8912",
        mrp_inr=3100.0,
    )
    res = verify_seed_lot(req)
    assert res.is_genuine_format is True
    assert "VERIFIED" in res.status
    assert res.recommended_germination_pct >= 70

    dealers = list_authorized_dealers("Nashik")
    assert len(dealers) >= 1
    assert "MH/NSK" in dealers[0].license_number


def test_groundwater_aquifer_advisory():
    gw = get_groundwater_data("Nashik")
    assert gw.district == "Nashik"
    assert gw.pre_monsoon_water_level_m > 0
    assert "Feet" in gw.recommended_borewell_depth_ft
    assert len(gw.borewell_recharge_design) >= 3
