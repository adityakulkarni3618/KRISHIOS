from typing import List
from fastapi import APIRouter

from app.modules.crops.recommendation import (
    CropRecommendationItem,
    CropRecommendationRequest,
    recommend_crops,
)

router = APIRouter(prefix="/crops", tags=["crop-recommendation"])


@router.post("/recommend", response_model=List[CropRecommendationItem])
def get_crop_recommendations(payload: CropRecommendationRequest):
    return recommend_crops(payload)
