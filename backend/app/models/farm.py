from datetime import date, datetime, timezone

from sqlalchemy import Date, DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


def _now():
    return datetime.now(timezone.utc)


class Farmer(Base):
    __tablename__ = "farmers"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    preferred_language: Mapped[str] = mapped_column(String(2), default="mr")  # mr | hi | en
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
    farms: Mapped[list["Farm"]] = relationship(back_populates="farmer", cascade="all, delete-orphan")


class Farm(Base):
    __tablename__ = "farms"
    id: Mapped[int] = mapped_column(primary_key=True)
    farmer_id: Mapped[int] = mapped_column(ForeignKey("farmers.id"))
    name: Mapped[str] = mapped_column(String(120))
    area_hectares: Mapped[float] = mapped_column(Float)
    state: Mapped[str] = mapped_column(String(60), default="Maharashtra")
    district: Mapped[str] = mapped_column(String(80))
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    irrigation_source: Mapped[str | None] = mapped_column(String(60), nullable=True)
    farmer: Mapped[Farmer] = relationship(back_populates="farms")
    soil_tests: Mapped[list["SoilTest"]] = relationship(back_populates="farm", cascade="all, delete-orphan")


class SoilTest(Base):
    __tablename__ = "soil_tests"
    id: Mapped[int] = mapped_column(primary_key=True)
    farm_id: Mapped[int] = mapped_column(ForeignKey("farms.id"))
    tested_on: Mapped[date] = mapped_column(Date)
    ph: Mapped[float | None] = mapped_column(Float, nullable=True)
    organic_carbon_pct: Mapped[float | None] = mapped_column(Float, nullable=True)
    lab_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    provenance: Mapped[str] = mapped_column(String(20), default="USER_PROVIDED")
    farm: Mapped[Farm] = relationship(back_populates="soil_tests")
