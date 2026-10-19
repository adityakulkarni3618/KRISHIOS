from datetime import date

from pydantic import BaseModel, Field


class FarmerIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    preferred_language: str = Field(default="mr", pattern="^(mr|hi|en)$")


class FarmerOut(FarmerIn):
    id: int
    model_config = {"from_attributes": True}


class FarmIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    area_hectares: float = Field(gt=0, le=10000)
    state: str = "Maharashtra"
    district: str = Field(min_length=1)
    # Coarse India bounding box check only; NOT a boundary validation.
    latitude: float | None = Field(default=None, ge=6.0, le=38.0)
    longitude: float | None = Field(default=None, ge=68.0, le=98.0)
    irrigation_source: str | None = None


class FarmOut(FarmIn):
    id: int
    farmer_id: int
    model_config = {"from_attributes": True}


class SoilTestIn(BaseModel):
    tested_on: date
    ph: float | None = Field(default=None, ge=3.0, le=11.0)
    organic_carbon_pct: float | None = Field(default=None, ge=0, le=20)
    lab_name: str | None = None


class SoilTestOut(SoilTestIn):
    id: int
    farm_id: int
    provenance: str  # always USER_PROVIDED until a lab integration exists
    model_config = {"from_attributes": True}
