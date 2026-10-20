from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas
from app.core.auth import get_current_user
from app.core.provenance import Provenance
from app.db import get_db
from app.models import Farm, Farmer, SoilTest, User, UserRole

router = APIRouter(tags=["farm-management"])


def _check_farm_access(farm: Farm, user: User):
    if user.role in [UserRole.ADMIN.value, UserRole.EXPERT.value]:
        return
    if farm.user_id and farm.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: you do not have permission to access this farm",
        )


@router.post("/farmers", response_model=schemas.FarmerOut, status_code=201)
def create_farmer(
    body: schemas.FarmerIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    f = Farmer(user_id=current_user.id, **body.model_dump())
    db.add(f)
    db.commit()
    db.refresh(f)
    return f


@router.get("/farms", response_model=list[schemas.FarmOut])
def list_farms(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role in [UserRole.ADMIN.value, UserRole.EXPERT.value]:
        return db.query(Farm).all()
    return db.query(Farm).filter((Farm.user_id == current_user.id) | (Farm.user_id.is_(None))).all()


@router.post("/farmers/{farmer_id}/farms", response_model=schemas.FarmOut, status_code=201)
def create_farm(
    farmer_id: int,
    body: schemas.FarmIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    farmer = db.get(Farmer, farmer_id)
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    if (
        farmer.user_id
        and farmer.user_id != current_user.id
        and current_user.role not in [UserRole.ADMIN.value, UserRole.EXPERT.value]
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: cannot add farm to another farmer's profile",
        )

    farm = Farm(farmer_id=farmer_id, user_id=current_user.id, **body.model_dump())
    db.add(farm)
    db.commit()
    db.refresh(farm)
    return farm


@router.get("/farms/{farm_id}", response_model=schemas.FarmOut)
def get_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    farm = db.get(Farm, farm_id)
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    _check_farm_access(farm, current_user)
    return farm


@router.post("/farms/{farm_id}/soil-tests", response_model=schemas.SoilTestOut, status_code=201)
def add_soil_test(
    farm_id: int,
    body: schemas.SoilTestIn,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    farm = db.get(Farm, farm_id)
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    _check_farm_access(farm, current_user)

    t = SoilTest(farm_id=farm_id, provenance=Provenance.USER_PROVIDED.value, **body.model_dump())
    db.add(t)
    db.commit()
    db.refresh(t)
    return t


@router.get("/farms/{farm_id}/soil-tests", response_model=list[schemas.SoilTestOut])
def list_soil_tests(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    farm = db.get(Farm, farm_id)
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    _check_farm_access(farm, current_user)

    return db.query(SoilTest).filter_by(farm_id=farm_id).order_by(SoilTest.tested_on).all()
