import pytest
from app.modules.market_linkage.food_processing import list_processing_projects
from app.modules.market_linkage.kisan_bazaar import list_bazaar_produce


def test_kisan_bazaar_direct_listings():
    from app.core.provenance import Provenance
    listings = list_bazaar_produce()
    assert len(listings) >= 2
    onion_lot = next((b for b in listings if "Onion" in b.commodity), None)
    assert onion_lot is not None
    assert onion_lot.contact_phone != ""
    assert onion_lot.whatsapp_enabled is True
    assert onion_lot.provenance == Provenance.SIMULATED
    assert "SIMULATED" in onion_lot.warning


def test_food_processing_pmfme_profiles():
    projects = list_processing_projects()
    assert len(projects) >= 2
    dal_mill = next((p for p in projects if p.id == "mini_dal_mill"), None)
    assert dal_mill is not None
    assert dal_mill.pmfme_govt_subsidy_35_pct_inr == dal_mill.total_project_cost_inr * 0.35
    assert dal_mill.payback_period_years < 3.0
    assert len(dal_mill.key_machinery_required) >= 2
