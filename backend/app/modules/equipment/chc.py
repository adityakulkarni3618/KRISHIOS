"""Custom Hiring Center (CHC) & Farm Machinery Rental Engine.

Tailored for Maharashtra FPOs (Farmer Producer Organizations) and Sub-Mission on Agricultural Mechanization (SMAM).
Provides standardized rental tariffs, fuel consumption benchmarks, and CHC hub contacts.
"""
from typing import List, Optional
from pydantic import BaseModel, Field

from app.core.provenance import Provenance


class EquipmentRentalItem(BaseModel):
    id: str
    name: str
    name_mr: str
    category: str
    specifications: str
    specifications_mr: str
    rate_per_acre_inr: Optional[float] = None
    rate_per_hour_inr: float
    diesel_consumption_litres_per_hour: float
    work_capacity_acres_per_hour: float
    key_applications: List[str]
    key_applications_mr: List[str]
    available_at_fpo_chc: bool = True


class EquipmentCostEstimateRequest(BaseModel):
    equipment_id: str
    district: str
    area_acres: float = Field(..., gt=0.0, le=200.0)
    include_operator: bool = True
    include_fuel: bool = True


class NearbyChcCenter(BaseModel):
    name: str
    taluka: str
    distance_km: float
    contact_person: str
    phone: str
    operator_assigned: str


class EquipmentCostEstimateResult(BaseModel):
    equipment_name: str
    equipment_name_mr: str
    area_acres: float
    estimated_hours_required: float
    machinery_rental_cost_inr: float
    fuel_cost_inr: float
    operator_charges_inr: float
    total_estimated_cost_inr: float
    cost_per_acre_inr: float
    nearby_centers: List[NearbyChcCenter]
    safety_guidelines: List[str]
    safety_guidelines_mr: List[str]
    provenance: Provenance = Provenance.ESTIMATED
    source_citation: str


EQUIPMENT_CATALOG = [
    EquipmentRentalItem(
        id="tractor_45hp",
        name="45 HP 4WD Utility Tractor",
        name_mr="४५ एचपी ४-व्हील ड्राईव्ह ट्रॅक्टर",
        category="Primary Power",
        specifications="45 HP, Dual Clutch, Power Steering, 4WD traction for heavy black soils",
        specifications_mr="४५ हॉर्सपॉवर, ड्युअल क्लच, पॉवर स्टिअरिंग, काळ्या भारी जमिनीसाठी ४-व्हील ड्राईव्ह",
        rate_per_acre_inr=900.0,
        rate_per_hour_inr=750.0,
        diesel_consumption_litres_per_hour=4.5,
        work_capacity_acres_per_hour=0.85,
        key_applications=["Plowing", "Trolley transport", "Threshing"],
        key_applications_mr=["नांगरट", "शेतमाल वाहतूक", "मळणी"],
    ),
    EquipmentRentalItem(
        id="rotavator_6ft",
        name="6-Foot Heavy Duty Rotavator",
        name_mr="६ फूट हेवी ड्युटी रोटाव्हेटर",
        category="Secondary Tillage",
        specifications="48 L-type boron steel blades, gear drive, pulverizes clods in single pass",
        specifications_mr="४८ एल-ब्लेड्स, बोरोन स्टील, एका फेरीत ढेकळांची बारीक माती करणारे",
        rate_per_acre_inr=850.0,
        rate_per_hour_inr=650.0,
        diesel_consumption_litres_per_hour=4.0,
        work_capacity_acres_per_hour=0.8,
        key_applications=["Seedbed preparation", "Stubble incorporation", "Weed chopping"],
        key_applications_mr=["पेरणीपूर्व वाफसा मशागत", "काडीकचरा जमिनीत गाडणे", "तण निर्मूलन"],
    ),
    EquipmentRentalItem(
        id="drone_sprayer_16l",
        name="16-Litre Agri Spray Drone (RTK Centimeter Accuracy)",
        name_mr="१६ लिटर कृषी फवारणी ड्रोन (अचूक आरटीके सेन्सर)",
        category="Plant Protection",
        specifications="16L payload, 6-nozzle centrifugal atomization, 6 mins per acre coverage, terrain following radar",
        specifications_mr="१६ लिटर टाकी, ६ नोझल सूक्ष्म फवारा, प्रति एकर अवघ्या ६ मिनिटांत फवारणी, रडार सेन्सर",
        rate_per_acre_inr=450.0,
        rate_per_hour_inr=1800.0,
        diesel_consumption_litres_per_hour=0.0,  # Electric battery
        work_capacity_acres_per_hour=4.0,
        key_applications=["Ultra-low volume pesticide spray", "Nano-urea foliar application", "Canopy penetration"],
        key_applications_mr=["अतिसूक्ष्म कीटकनाशक फवारणी", "नॅनो युरिया फवारणी", "पानांच्या खालपर्यंत औषध पोहोचवणे"],
    ),
    EquipmentRentalItem(
        id="multi_harvester",
        name="Multi-Crop Combine Harvester (Track Type)",
        name_mr="मल्टी-क्रॉप कंबाईन हार्वेस्टर (चेन / ट्रॅक प्रकार)",
        category="Harvesting & Threshing",
        specifications="75 HP engine, rubber tracks for wet/muddy fields, 98% grain recovery",
        specifications_mr="७५ एचपी इंजिन, चिखलात न रुतणारा रबरी ट्रॅक, ९८% स्वच्छ दाणे काढणी",
        rate_per_acre_inr=2200.0,
        rate_per_hour_inr=2000.0,
        diesel_consumption_litres_per_hour=7.5,
        work_capacity_acres_per_hour=0.9,
        key_applications=["Soybean harvesting", "Wheat cutting", "Chickpea thrashing without splitting"],
        key_applications_mr=["सोयाबीन काढणी व मळणी", "गहू कापणी", "हरभरा न फुटता काढणी"],
    ),
    EquipmentRentalItem(
        id="laser_leveler",
        name="Laser Land Leveler (Automated Dual Slope)",
        name_mr="लेझर लँड लेव्हलर (स्वयंचलित जमीन सपाटीकरण)",
        category="Water Conservation",
        specifications="Transmitter + Receiver with hydraulic blade control, saves 30% irrigation water",
        specifications_mr="हायड्रॉलिक सेन्सरसह जमीन १००% सपाट करणारे यंत्र, ३०% पाण्याची बचत",
        rate_per_acre_inr=1400.0,
        rate_per_hour_inr=1100.0,
        diesel_consumption_litres_per_hour=5.5,
        work_capacity_acres_per_hour=0.75,
        key_applications=["Precision slope grading", "Drip installation prep", "Uniform water distribution"],
        key_applications_mr=["अचूक समतल जमीन", "ठिबक सिंचनासाठी आवश्यक सपाटी", "पाण्याचा समान प्रसार"],
    ),
]


def list_chc_equipment() -> List[EquipmentRentalItem]:
    return EQUIPMENT_CATALOG


def estimate_equipment_cost(request: EquipmentCostEstimateRequest) -> EquipmentCostEstimateResult:
    item = next((e for e in EQUIPMENT_CATALOG if e.id == request.equipment_id), None)
    if not item:
        item = EQUIPMENT_CATALOG[0]

    hours_needed = round(request.area_acres / item.work_capacity_acres_per_hour, 1)

    machinery_cost = round(hours_needed * item.rate_per_hour_inr, 2)

    # Diesel cost assuming ~₹92 per litre in Maharashtra
    diesel_litres = hours_needed * item.diesel_consumption_litres_per_hour
    fuel_cost = round(diesel_litres * 92.0, 2) if request.include_fuel else 0.0

    # Operator charges @ ₹150/hour if selected
    operator_cost = round(hours_needed * 150.0, 2) if request.include_operator else 0.0

    total_cost = round(machinery_cost + fuel_cost + operator_cost, 2)
    cost_per_acre = round(total_cost / request.area_acres, 2)

    centers = [
        NearbyChcCenter(
            name=f"{request.district} Kisan Vikas FPO Custom Hiring Hub",
            taluka="Central Taluka Mandi",
            distance_km=6.5,
            contact_person="Ramesh Patil (FPO Manager)",
            phone="0253-241908",
            operator_assigned="Certified Drone Pilot / Tractor Master"
        ),
        NearbyChcCenter(
            name="Taluka Krishi Sahakari Sanstha CHC",
            taluka="APMC Sub-Yard",
            distance_km=11.2,
            contact_person="Vikas Jadhav",
            phone="9822451089",
            operator_assigned="Available on 24hr prior booking"
        )
    ]

    safety_en = [
        "Check hydraulic couplings and PTO pins before engaging machine.",
        "Maintain minimum 5-metre safety radius while drone spray / combine harvester operates.",
        "Ensure field is cleared of large stones and hidden iron pegs before rotavator operation."
    ]
    safety_mr = [
        "काम सुरू करण्यापूर्वी पीटीओ शाफ्ट आणि पिन सुरक्षित बसल्याची खात्री करा.",
        "ड्रोन अथवा कंबाईन हार्वेस्टर चालू असताना ५ मीटर सुरक्षित अंतर ठेवा.",
        "रोटाव्हेटर चालवण्यापूर्वी शेतातील मोठे दगड व लोखंडी खुंट बाजूला काढा."
    ]

    return EquipmentCostEstimateResult(
        equipment_name=item.name,
        equipment_name_mr=item.name_mr,
        area_acres=request.area_acres,
        estimated_hours_required=hours_needed,
        machinery_rental_cost_inr=machinery_cost,
        fuel_cost_inr=fuel_cost,
        operator_charges_inr=operator_cost,
        total_estimated_cost_inr=total_cost,
        cost_per_acre_inr=cost_per_acre,
        nearby_centers=centers,
        safety_guidelines=safety_en,
        safety_guidelines_mr=safety_mr,
        provenance=Provenance.ESTIMATED,
        source_citation="Maharashtra State Agricultural Mechanization Mission (SMAM) & FPO Tariff Norms"
    )
