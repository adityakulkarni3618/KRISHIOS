import pytest
from app.modules.crops.recommendation import (
    CropRecommendationRequest,
    IrrigationAvailability,
    Season,
    SoilTexture,
    recommend_crops,
)


def test_kharif_soybean_and_cotton_recommended():
    req = CropRecommendationRequest(
        district="Latur",
        season=Season.KHARIF,
        soil_ph=7.2,
        organic_carbon_pct=0.65,
        soil_texture=SoilTexture.MEDIUM_BLACK,
        irrigation=IrrigationAvailability.PROTECTIVE_1_2,
    )
    results = recommend_crops(req)
    assert len(results) > 0
    crop_ids = [r.crop_id for r in results]
    assert "soybean" in crop_ids
    assert "cotton" in crop_ids

    # Top crop check
    top = results[0]
    assert top.suitability_score >= 80
    assert len(top.recommended_varieties) > 0
    assert top.sowing_window != ""
    assert top.source_citation != ""


def test_rabi_gram_recommended():
    req = CropRecommendationRequest(
        district="Pune",
        season=Season.RABI,
        soil_ph=7.5,
        soil_texture=SoilTexture.MEDIUM_BLACK,
        irrigation=IrrigationAvailability.RAINFED,
    )
    results = recommend_crops(req)
    crop_ids = [r.crop_id for r in results]
    assert "gram_chickpea" in crop_ids
    chickpea = next(r for r in results if r.crop_id == "gram_chickpea")
    assert chickpea.intercrop is not None
    assert "Safflower" in chickpea.intercrop.companion_crop


def test_high_water_crop_penalized_without_irrigation():
    # Sugarcane under rainfed condition should have lower suitability score
    rainfed_req = CropRecommendationRequest(
        district="Kolhapur",
        season=Season.KHARIF,
        soil_texture=SoilTexture.DEEP_BLACK,
        irrigation=IrrigationAvailability.RAINFED,
    )
    irrigated_req = CropRecommendationRequest(
        district="Kolhapur",
        season=Season.KHARIF,
        soil_texture=SoilTexture.DEEP_BLACK,
        irrigation=IrrigationAvailability.WELL_IRRIGATED,
    )
    rainfed_sugar = next((r for r in recommend_crops(rainfed_req) if r.crop_id == "sugarcane"), None)
    irrigated_sugar = next((r for r in recommend_crops(irrigated_req) if r.crop_id == "sugarcane"), None)

    assert rainfed_sugar is not None and irrigated_sugar is not None
    assert irrigated_sugar.suitability_score > rainfed_sugar.suitability_score
