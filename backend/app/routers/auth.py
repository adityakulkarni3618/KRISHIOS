from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas
from app.core.auth import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.db import get_db
from app.models import Farmer, User

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(body: schemas.UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter((User.username == body.username) | (User.email == body.email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered",
        )
    user = User(
        username=body.username,
        email=body.email,
        hashed_password=hash_password(body.password),
        full_name=body.full_name or body.username,
        role=body.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Automatically create a corresponding Farmer profile if role is farmer
    if user.role == "farmer":
        farmer = Farmer(
            user_id=user.id,
            name=user.full_name or user.username,
            preferred_language="mr",
        )
        db.add(farmer)
        db.commit()

    token = create_access_token(data={"sub": str(user.id), "role": user.role, "username": user.username})
    return schemas.Token(
        access_token=token,
        token_type="bearer",
        role=user.role,
        username=user.username,
        user_id=user.id,
    )


@router.post("/login", response_model=schemas.Token)
def login(body: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == body.username).first()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User account is disabled")

    token = create_access_token(data={"sub": str(user.id), "role": user.role, "username": user.username})
    return schemas.Token(
        access_token=token,
        token_type="bearer",
        role=user.role,
        username=user.username,
        user_id=user.id,
    )


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
