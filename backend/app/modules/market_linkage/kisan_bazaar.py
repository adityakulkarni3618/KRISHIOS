"""Direct Kisan Bazaar: Farm-to-Consumer / Vyapari Direct Board.

Bypasses predatory APMC middlemen and commission agents (आडत्या).
Allows farmers and FPOs to list freshly harvested commercial lots with quality grade,
expected price, and direct WhatsApp contact for bulk buyers and urban housing societies.
"""
from typing import List, Optional
from pydantic import BaseModel, Field

from app.core.provenance import Provenance


class FarmProduceListing(BaseModel):
    id: str
    farmer_or_fpo_name: str
    commodity: str
    commodity_mr: str
    variety: str
    quantity_available: str
    expected_price_per_unit: str
    quality_grade: str          # "Grade A Export / सुपर क्वालिटी", "Grade B Local Market"
    harvest_date: str
    village: str
    taluka: str
    district: str
    contact_phone: str
    whatsapp_enabled: bool = True
    fpo_verified: bool = True


BAZAAR_LISTINGS: List[FarmProduceListing] = [
    FarmProduceListing(
        id="listing_01",
        farmer_or_fpo_name="Sahyadri Shetkari FPO Group",
        commodity="Red Onion (लाल कांदा)",
        commodity_mr="लाल कांदा (पोळ)",
        variety="Bhima Super (भीमा सुपर)",
        quantity_available="250 Quintals (१५ टन)",
        expected_price_per_unit="₹2,400 / Quintal (शेतावर थेट भाव)",
        quality_grade="Grade A (Size 45-55mm, Cured)",
        harvest_date="Ready for immediate loading",
        village="Saikheda",
        taluka="Niphad",
        district="Nashik",
        contact_phone="9823901234",
        whatsapp_enabled=True,
        fpo_verified=True,
    ),
    FarmProduceListing(
        id="listing_02",
        farmer_or_fpo_name="Kisan Vikas Agro Producer Co.",
        commodity="Soybean (पिवळे सोयाबीन)",
        commodity_mr="पिवळे सोयाबीन (बियाणे प्रत)",
        variety="Phule Kimaya (KDS-753)",
        quantity_available="120 Quintals",
        expected_price_per_unit="₹4,950 / Quintal",
        quality_grade="10% Moisture, Cleaned & Graded",
        harvest_date="Cleaned machine lot in bags",
        village="Ausa",
        taluka="Ausa",
        district="Latur",
        contact_phone="9422891045",
        whatsapp_enabled=True,
        fpo_verified=True,
    ),
    FarmProduceListing(
        id="listing_03",
        farmer_or_fpo_name="Ganesh Ramesh Shinde (शेतकरी)",
        commodity="Green Chillies (हिरवी मिरची)",
        commodity_mr="हिरवी लवंगी मिरची",
        variety="Sitara Gold",
        quantity_available="40 Crates (८०० किलो)",
        expected_price_per_unit="₹45 / Kilogram",
        quality_grade="Fresh Dark Green, Pungent",
        harvest_date="Plucking daily morning",
        village="Shirur",
        taluka="Shirur",
        district="Pune",
        contact_phone="9860123456",
        whatsapp_enabled=True,
        fpo_verified=False,
    ),
]


def list_bazaar_produce(district: Optional[str] = None) -> List[FarmProduceListing]:
    if not district:
        return BAZAAR_LISTINGS
    matched = [b for b in BAZAAR_LISTINGS if b.district.lower() == district.lower()]
    return matched if matched else BAZAAR_LISTINGS
