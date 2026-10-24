import pytest
from app.modules.equipment.chc import (
    EquipmentCostEstimateRequest,
    estimate_equipment_cost,
    list_chc_equipment,
)
from app.modules.livestock.dairy import (
    FeedRationRequest,
    calculate_feed_ration,
    get_livestock_vaccine_schedule,
)


def test_chc_catalog_and_cost_estimation():
    catalog = list_chc_equipment()
    assert len(catalog) >= 5
    tractor = next(e for e in catalog if e.id == "tractor_45hp")
    assert tractor.rate_per_hour_inr > 0

    req = EquipmentCostEstimateRequest(
        equipment_id="drone_sprayer_16l",
        district="Nashik",
        area_acres=4.0,
        include_operator=True,
        include_fuel=True,
    )
    res = estimate_equipment_cost(req)
    assert res.area_acres == 4.0
    assert res.estimated_hours_required == 1.0  # 4 acres / 4 acres/hr
    assert res.total_estimated_cost_inr > 0
    assert len(res.nearby_centers) >= 1


def test_livestock_vaccination_schedule():
    schedule = get_livestock_vaccine_schedule()
    assert len(schedule) >= 4
    diseases = [v.disease_name for v in schedule]
    assert any("Foot and Mouth" in d for d in diseases)
    assert any("Lumpy Skin" in d for d in diseases)


def test_feed_ration_calculation():
    req = FeedRationRequest(
        species="Crossbred Cow (HF)",
        body_weight_kg=400.0,
        daily_milk_litres=14.0,
        fat_percentage=4.2,
    )
    ration = calculate_feed_ration(req)
    assert ration.dry_matter_requirement_kg > 10.0
    assert ration.green_fodder_kg > 0
    assert ration.dry_fodder_kg > 0
    assert ration.concentrate_cattle_feed_kg > 0
    assert ration.fresh_drinking_water_litres >= 50
    assert ration.estimated_daily_milk_revenue_inr > ration.estimated_daily_feed_cost_inr
