"""Seeds EXPLICITLY SYNTHETIC data for demos. Run from backend/: python ../scripts/seed_synthetic.py"""
import sys, datetime
sys.path.insert(0, ".")
from app.db import Base, SessionLocal, engine
from app.models import Farm, Farmer, SoilTest

Base.metadata.create_all(engine)
db = SessionLocal()
f = Farmer(name="SYNTHETIC Demo Farmer", preferred_language="mr")
f.farms.append(Farm(name="SYNTHETIC Plot", area_hectares=1.0, district="Pune",
                    soil_tests=[SoilTest(tested_on=datetime.date(2026, 6, 1), ph=7.0, provenance="SIMULATED")]))
db.add(f); db.commit()
print("Seeded synthetic data (provenance=SIMULATED).")
