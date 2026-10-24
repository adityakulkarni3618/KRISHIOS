from fastapi import FastAPI

from app.core.config import settings
from app.db import Base, engine
from app.routers import (
    assistant,
    auth,
    calculator,
    crops,
    disease,
    equipment,
    farms,
    fertilizer,
    institutional,
    insurance,
    livestock,
    mapping,
    market,
    market_linkage,
    operations,
    postharvest,
    remote_sensing,
    rural_ops,
    schemes,
    soil,
    weather,
)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title=settings.app_name, version="0.1.0")
Base.metadata.create_all(engine)  # dev convenience; Alembic migrations come in Milestone 1b

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(farms.router)
app.include_router(mapping.router)
app.include_router(weather.router)
app.include_router(market.router)
app.include_router(calculator.router)
app.include_router(soil.router)
app.include_router(schemes.router)
app.include_router(disease.router)
app.include_router(crops.router)
app.include_router(fertilizer.router)
app.include_router(insurance.router)
app.include_router(equipment.router)
app.include_router(livestock.router)
app.include_router(remote_sensing.router)
app.include_router(postharvest.router)
app.include_router(assistant.router)
app.include_router(rural_ops.router)
app.include_router(operations.router)
app.include_router(market_linkage.router)
app.include_router(institutional.router)


@app.get("/health", tags=["system"])
def health():
    return {"status": "ok", "app": settings.app_name, "environment": settings.environment}
