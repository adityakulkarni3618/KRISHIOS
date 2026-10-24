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
    assert "108" in sos.snakebite_protocol.medical_action_info
    assert "hospital immediately" in sos.snakebite_protocol.medical_action_info.lower()
    assert "sample directory - call to confirm availability" in sos.hospital_directory_note
    assert len(sos.nearby_asv_hospitals) >= 2
    hospital = sos.nearby_asv_hospitals[0]
    assert hospital.ambulance_available is True
    assert hospital.emergency_phone != ""


def test_emergency_sos_has_no_numeric_stock_or_drug_dose_text():
    """Fails if any numeric stock field (e.g. vials) or drug dose text (e.g. atropine, mg) reappears."""
    sos = get_emergency_sos_data("Nashik")

    # Assert no numeric stock field on EmergencyHospital model
    for h in sos.nearby_asv_hospitals:
        assert not hasattr(h, "available_asv_vials"), "Hospital must not have available_asv_vials field"
        assert not hasattr(h, "vials"), "Hospital must not have vials field"

    # Assert no drug names, doses, or vial counts in the serialized response
    dump_text = sos.model_dump_json().lower()
    forbidden_terms = ["atropine", "pam", "vial", "vials", "dose", " डोस", "ॲट्रोपिन"]
    for term in forbidden_terms:
        # Check forbidden drug / vial / dose strings
        assert term not in dump_text, f"Forbidden term '{term}' found in emergency SOS output"


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
