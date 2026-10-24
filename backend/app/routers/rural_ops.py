from typing import List, Optional
from fastapi import APIRouter, Query

from app.modules.rural_ops.bio_inputs import (
    BioInputRecipe,
    get_recipe_by_id,
    list_bio_input_recipes,
)
from app.modules.rural_ops.electricity import (
    FeederScheduleItem,
    get_feeder_schedule,
)
from app.modules.rural_ops.emergency_sos import (
    EmergencySOSResult,
    get_emergency_sos_data,
)

router = APIRouter(prefix="/rural-ops", tags=["rural-ground-operations"])


@router.get("/electricity", response_model=FeederScheduleItem)
def get_rural_electricity(district: str = Query("Nashik")):
    return get_feeder_schedule(district)


@router.get("/emergency-sos", response_model=EmergencySOSResult)
def get_emergency_sos(district: str = Query("Nashik")):
    return get_emergency_sos_data(district)


@router.get("/bio-recipes", response_model=List[BioInputRecipe])
def get_bio_recipes():
    return list_bio_input_recipes()


@router.get("/bio-recipes/{recipe_id}", response_model=BioInputRecipe)
def get_bio_recipe_detail(recipe_id: str):
    return get_recipe_by_id(recipe_id)
