from fastapi import FastAPI

from app.core.config import settings
from app.db import Base, engine
from app.routers import auth, farms, mapping, market, weather

app = FastAPI(title=settings.app_name, version="0.1.0")
Base.metadata.create_all(engine)  # dev convenience; Alembic migrations come in Milestone 1b

app.include_router(auth.router)
app.include_router(farms.router)
app.include_router(mapping.router)
app.include_router(weather.router)
app.include_router(market.router)


@app.get("/health", tags=["system"])
def health():
    return {"status": "ok", "app": settings.app_name, "environment": settings.environment}
