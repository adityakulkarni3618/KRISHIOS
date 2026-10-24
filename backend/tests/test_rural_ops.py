import pytest
from app.modules.rural_ops.bio_inputs import (
    get_recipe_by_id,
    list_bio_input_recipes,
)
from app.modules.rural_ops.electricity import get_feeder_schedule
from app.modules.rural_ops.emergency_sos import get_emergency_sos_data


def test_rural_electricity_schedule():
    item = get_feeder_schedule("Nashik")
    assert item.district == "Nashik"
    assert "Feeder" in item.feeder_name
    assert item.current_voltage > 350
    assert "MahaVitaran" in item.source_citation


def test_emergency_snakebite_and_asv_hospitals():
    sos = get_emergency_sos_data("Nashik")
    assert sos.emergency_toll_free.startswith("108")
    assert "Anti-Snake Venom" in sos.snakebite_protocol.medical_antidote_info
    assert len(sos.nearby_asv_hospitals) >= 2
    hospital = sos.nearby_asv_hospitals[0]
    assert hospital.available_asv_vials > 0
    assert hospital.ambulance_available is True


def test_diy_bio_recipes():
    recipes = list_bio_input_recipes()
    assert len(recipes) >= 3
    recipe_ids = [r.id for r in recipes]
    assert "jeevamrut" in recipe_ids
    assert "dashparni_ark" in recipe_ids

    jeev = get_recipe_by_id("jeevamrut")
    assert len(jeev.ingredients) >= 4
    assert jeev.preparation_time_days > 0
    assert jeev.cost_per_acre_inr < 100.0  # Ultra low-cost guarantee
