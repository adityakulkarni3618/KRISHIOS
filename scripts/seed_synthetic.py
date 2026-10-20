"""Seeds EXPLICITLY SYNTHETIC demo data.
Run from backend/: python ../scripts/seed_synthetic.py
"""
import datetime
import sys

sys.path.insert(0, ".")

from app.core.security import hash_password
from app.db import Base, SessionLocal, engine
from app.models import Farm, Farmer, SoilTest, User, UserRole

Base.metadata.create_all(engine)
db = SessionLocal()

# 1. Create or get Demo User
user = db.query(User).filter_by(username="demo_farmer").first()
if not user:
    user = User(
        username="demo_farmer",
        email="demo.farmer@krishios.gov.in",
        hashed_password=hash_password("krishi123"),
        full_name="Kailasrao Pawar (Demo Farmer)",
        role=UserRole.FARMER.value,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

# 2. Create Farmer profile linked to User
farmer = db.query(Farmer).filter_by(user_id=user.id).first()
if not farmer:
    farmer = Farmer(
        user_id=user.id,
        name="Kailasrao Pawar",
        preferred_language="mr",
    )
    db.add(farmer)
    db.commit()
    db.refresh(farmer)

# 3. Create Sample Maharashtra Farms
sample_farms = [
    {
        "name": "Gat No. 142 - Malegaon Onion Plot",
        "area_hectares": 2.5,
        "district": "Nashik",
        "irrigation_source": "Borewell & Drip",
        "latitude": 20.00,
        "longitude": 73.79,
        "soil_tests": [
            SoilTest(
                tested_on=datetime.date(2026, 9, 15),
                ph=7.2,
                organic_carbon_pct=0.68,
                lab_name="MPKV Krishi Vigyan Kendra, Nashik",
                provenance="SIMULATED",
            )
        ],
    },
    {
        "name": "Gat No. 88 - Baramati Soybean & Pomegranate",
        "area_hectares": 1.8,
        "district": "Pune",
        "irrigation_source": "Canal & Farm Pond",
        "latitude": 18.52,
        "longitude": 73.85,
        "soil_tests": [
            SoilTest(
                tested_on=datetime.date(2026, 8, 20),
                ph=8.1,
                organic_carbon_pct=0.52,
                lab_name="District Soil Testing Laboratory, Pune",
                provenance="SIMULATED",
            )
        ],
    },
    {
        "name": "Gat No. 204 - Hingna Cotton Farm",
        "area_hectares": 3.2,
        "district": "Nagpur",
        "irrigation_source": "Drip Irrigation",
        "latitude": 21.14,
        "longitude": 79.08,
        "soil_tests": [
            SoilTest(
                tested_on=datetime.date(2026, 10, 5),
                ph=7.6,
                organic_carbon_pct=0.74,
                lab_name="ICAR-CICR Soil Testing Facility, Nagpur",
                provenance="SIMULATED",
            )
        ],
    },
]

for sf in sample_farms:
    existing = db.query(Farm).filter_by(farmer_id=farmer.id, name=sf["name"]).first()
    if not existing:
        farm = Farm(
            farmer_id=farmer.id,
            user_id=user.id,
            name=sf["name"],
            area_hectares=sf["area_hectares"],
            district=sf["district"],
            irrigation_source=sf["irrigation_source"],
            latitude=sf["latitude"],
            longitude=sf["longitude"],
            soil_tests=sf["soil_tests"],
        )
        db.add(farm)

db.commit()
print("Successfully seeded synthetic demo user (demo_farmer / krishi123), farms, and soil tests (provenance=SIMULATED).")
