"""Satellite Remote Sensing & Canopy Health Explorer (Synthetic Simulation Model).

Provides simulated spectral vegetative indices (NDVI, NDRE, NDWI) and zonal canopy stress analysis
grounded in mathematical canopy reflectance formulas for UI demonstration.
"""
from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel, Field

from app.core.provenance import Provenance


class VegetationVigor(str, Enum):
    HIGH_VIGOR = "high_vigor"         # NDVI >= 0.70
    MODERATE_VIGOR = "moderate_vigor" # 0.50 <= NDVI < 0.70
    MOISTURE_STRESS = "moisture_stress"# 0.35 <= NDVI < 0.50
    SEVERE_STRESS = "severe_stress"   # NDVI < 0.35


class FieldZoneMetric(BaseModel):
    zone_name: str
    zone_name_mr: str
    area_pct: float
    avg_ndvi: float
    vigor_status: str
    vigor_status_mr: str
    action_item: str
    action_item_mr: str


class SatelliteAnalysisRequest(BaseModel):
    district: str
    latitude: Optional[float] = 19.9975  # Nashik approx
    longitude: Optional[float] = 73.7898
    crop: str = "Soybean"
    farm_area_acres: float = 2.5


class SatelliteAnalysisResult(BaseModel):
    district: str
    crop: str
    satellite_source: str = "Synthetic Field Canopy Model (Not live satellite data)"
    mean_ndvi: float
    mean_ndre: float  # Red-edge chlorophyll index
    mean_ndwi: float  # Water index
    canopy_status: str
    canopy_status_mr: str
    zonal_distribution: List[FieldZoneMetric]
    overall_recommendation: str
    overall_recommendation_mr: str
    warning: str = "SIMULATED DATA: This is an illustrative demonstration and not a real satellite telemetry observation."
    provenance: Provenance = Provenance.SIMULATED
    source_citation: str = "Synthetic mathematical canopy model - for demonstration only"


def analyze_field_remote_sensing(req: SatelliteAnalysisRequest) -> SatelliteAnalysisResult:
    # Deterministic illustrative calculation based on crop and area
    mean_ndvi = 0.74 if "sugar" in req.crop.lower() else 0.68
    mean_ndre = round(mean_ndvi * 0.72, 2)
    mean_ndwi = 0.42

    zones = [
        FieldZoneMetric(
            zone_name="Northern Quadrant (Plot A1)",
            zone_name_mr="उत्तर विभाग (प्लॉट अ-१)",
            area_pct=55.0,
            avg_ndvi=0.76,
            vigor_status="High Vigor / हिरवेगार दाट पीक (Simulated)",
            vigor_status_mr="उत्कृष्ट वाढ, दाट पाने व योग्य प्रकाशसंश्लेषण (प्रात्यक्षिक)",
            action_item="Maintain standard fertigation cycle; no corrective spray needed.",
            action_item_mr="नियमित पाणी व खत सुरू ठेवावे; कोणत्याही उपचाराची गरज नाही."
        ),
        FieldZoneMetric(
            zone_name="Central Basin (Plot A2)",
            zone_name_mr="मध्यवर्ती भाग (प्लॉट अ-२)",
            area_pct=30.0,
            avg_ndvi=0.62,
            vigor_status="Optimal / मध्यम वाढ (Simulated)",
            vigor_status_mr="समाधानकारक वाढ, किंचित विरळ झाडे (प्रात्यक्षिक)",
            action_item="Inspect dripper lateral pressure; apply 19:19:19 foliar spray.",
            action_item_mr="ठिबक नळ्यांचा दाब तपासा; १९:१९:१९ विद्राव्य खताची फवारणी करा."
        ),
        FieldZoneMetric(
            zone_name="Southern Edge Slope (Plot A3)",
            zone_name_mr="दक्षिण बांधालगतचा पट्टा (प्लॉट अ-३)",
            area_pct=15.0,
            avg_ndvi=0.41,
            vigor_status="Moisture / Nutrient Stress (पाण्याचा ताण - Simulated)",
            vigor_status_mr="पाण्याचा किंवा नत्राचा ताण आढळला (प्रात्यक्षिक)",
            action_item="Check for root grubs or subsoil compaction; provide protective light irrigation.",
            action_item_mr="हुमणी कीड किंवा माती घट्ट झाल्याची शक्यता तपासा; हलके पाणी द्यावे."
        ),
    ]

    rec_en = "Illustrative simulation: Field canopy health modeled at 85% optimal. Ground truthing required before taking agronomic action."
    rec_mr = "प्रात्यक्षिक मॉडेल: शेतातील पिकाची प्रकृती ८५% निरोगी दर्शविली आहे. प्रत्यक्ष शेतात जाऊन खात्री केल्याशिवाय निर्णय घेऊ नये."

    return SatelliteAnalysisResult(
        district=req.district,
        crop=req.crop,
        satellite_source="Synthetic Field Canopy Model (Not live satellite data)",
        mean_ndvi=mean_ndvi,
        mean_ndre=mean_ndre,
        mean_ndwi=mean_ndwi,
        canopy_status="Lush & Healthy (निरोगी हरित आवरण - Simulated)",
        canopy_status_mr="उत्कृष्ट प्रकाशसंश्लेषण व हिरवेगार निरोगी पीक (प्रात्यक्षिक)",
        zonal_distribution=zones,
        overall_recommendation=rec_en,
        overall_recommendation_mr=rec_mr,
        provenance=Provenance.SIMULATED,
        source_citation="Synthetic mathematical canopy model - for demonstration only"
    )
