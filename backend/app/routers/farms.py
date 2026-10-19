from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import schemas
from app.core.provenance import Provenance
from app.db import get_db
from app.models import Farm, Farmer, SoilTest

router = APIRouter(tags=["farm-management"])


@router.post("/farmers", response_model=schemas.FarmerOut, status_code=201)
def create_farmer(body: schemas.FarmerIn, db: Session = Depends(get_db)):
    f = Farmer(**body.model_dump())
    db.add(f); db.commit(); db.refresh(f)
    return f


@router.post("/farmers/{farmer_id}/farms", response_model=schemas.FarmOut, status_code=201)
def create_farm(farmer_id: int, body: schemas.FarmIn, db: Session = Depends(get_db)):
    if not db.get(Farmer, farmer_id):
        raise HTTPException(404, "Farmer not found")
    farm = Farm(farmer_id=farmer_id, **body.model_dump())
    db.add(farm); db.commit(); db.refresh(farm)
    return farm


@router.get("/farms/{farm_id}", response_model=schemas.FarmOut)
def get_farm(farm_id: int, db: Session = Depends(get_db)):
    farm = db.get(Farm, farm_id)
    if not farm:
        raise HTTPException(404, "Farm not found")
    return farm


@router.post("/farms/{farm_id}/soil-tests", response_model=schemas.SoilTestOut, status_code=201)
def add_soil_test(farm_id: int, body: schemas.SoilTestIn, db: Session = Depends(get_db)):
    if not db.get(Farm, farm_id):
        raise HTTPException(404, "Farm not found")
    t = SoilTest(farm_id=farm_id, provenance=Provenance.USER_PROVIDED.value, **body.model_dump())
    db.add(t); db.commit(); db.refresh(t)
    return t


@router.get("/farms/{farm_id}/soil-tests", response_model=list[schemas.SoilTestOut])
def list_soil_tests(farm_id: int, db: Session = Depends(get_db)):
    if not db.get(Farm, farm_id):
        raise HTTPException(404, "Farm not found")
    return db.query(SoilTest).filter_by(farm_id=farm_id).order_by(SoilTest.tested_on).all()
