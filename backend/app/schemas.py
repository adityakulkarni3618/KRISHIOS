from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


# User / Auth Schemas
class UserRegister(BaseModel):
    username: str = Field(min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_\-]+$")
    email: EmailStr | str = Field(min_length=5, max_length=120)
    password: str = Field(min_length=6, max_length=128)
    full_name: str = Field(default="", max_length=120)
    role: Literal["farmer", "expert", "fpo", "provider", "researcher", "admin"] = "farmer"


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    username: str
    user_id: int


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime
    model_config = {"from_attributes": True}


# Farm / Farmer Schemas
class FarmerIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    preferred_language: str = Field(default="mr", pattern="^(mr|hi|en)$")


class FarmerOut(FarmerIn):
    id: int
    user_id: int | None = None
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
    user_id: int | None = None
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
