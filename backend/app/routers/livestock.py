from typing import List
from fastapi import APIRouter

from app.modules.livestock.dairy import (
    FeedRationRequest,
    FeedRationResult,
    VaccineEvent,
    calculate_feed_ration,
    get_livestock_vaccine_schedule,
)

router = APIRouter(prefix="/livestock", tags=["livestock-pashu-mitra"])


@router.get("/vaccination-schedule", response_model=List[VaccineEvent])
def get_vaccination_schedule():
    return get_livestock_vaccine_schedule()


@router.post("/feed-ration", response_model=FeedRationResult)
def calculate_cattle_feed_ration(payload: FeedRationRequest):
    return calculate_feed_ration(payload)
