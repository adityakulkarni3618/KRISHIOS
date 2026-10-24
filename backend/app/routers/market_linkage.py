from typing import List, Optional
from fastapi import APIRouter, Query

from app.modules.market_linkage.food_processing import (
    ProcessingUnitProfile,
    list_processing_projects,
)
from app.modules.market_linkage.kisan_bazaar import (
    FarmProduceListing,
    list_bazaar_produce,
)

router = APIRouter(prefix="/market-linkage", tags=["direct-bazaar-food-processing"])


@router.get("/bazaar-listings", response_model=List[FarmProduceListing])
def get_bazaar_listings(district: Optional[str] = Query(None)):
    return list_bazaar_produce(district)


@router.get("/processing-profiles", response_model=List[ProcessingUnitProfile])
def get_processing_profiles():
    return list_processing_projects()
