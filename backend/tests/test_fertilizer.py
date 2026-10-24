import pytest
from app.modules.fertilizer.calculator import (
    FertilizerPlanRequest,
    NutrientLevel,
    calculate_fertilizer_plan,
)


def test_fertilizer_soybean_dosage():
    req = FertilizerPlanRequest(
        crop="Soybean",
        area_acres=2.0,
        soil_n_status=NutrientLevel.MEDIUM,
        soil_p_status=NutrientLevel.MEDIUM,
        soil_k_status=NutrientLevel.MEDIUM,
    )
    result = calculate_fertilizer_plan(req)
    assert result.area_acres == 2.0
    assert result.total_pure_nutrients_kg["N"] > 0
    assert result.total_pure_nutrients_kg["P2O5"] > 0
    assert len(result.recommended_options) >= 2
    assert len(result.split_schedule) == 3

    # Check that DAP and Urea bags are calculated
    opt1 = result.recommended_options[0]
    assert opt1.dap_bags_50kg > 0
    assert opt1.estimated_cost_inr > 0


def test_fertilizer_soil_deficiency_increases_dose():
    # If soil P is low, required P should be 25% higher than medium
    req_med = FertilizerPlanRequest(
        crop="Cotton",
        area_acres=1.0,
        soil_p_status=NutrientLevel.MEDIUM,
    )
    req_low = FertilizerPlanRequest(
        crop="Cotton",
        area_acres=1.0,
        soil_p_status=NutrientLevel.LOW,
    )
    res_med = calculate_fertilizer_plan(req_med)
    res_low = calculate_fertilizer_plan(req_low)

    assert res_low.total_pure_nutrients_kg["P2O5"] > res_med.total_pure_nutrients_kg["P2O5"]
    assert pytest.approx(res_low.total_pure_nutrients_kg["P2O5"], 0.1) == res_med.total_pure_nutrients_kg["P2O5"] * 1.25
