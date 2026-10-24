"""Crop Recommendation & Sowing Window Engine for Maharashtra.

Grounded in ICAR guidelines and State Agricultural Universities
(MPKV Rahuri, Dr. PDKV Akola, VNMKV Parbhani).
Evaluates agro-climatic zones, soil pH, organic carbon, rainfall/irrigation,
and season to produce scientifically validated crop choices and intercropping pairs.
"""
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

from app.core.provenance import Provenance


class Season(str, Enum):
    KHARIF = "kharif"
    RABI = "rabi"
    SUMMER = "summer"


class SoilTexture(str, Enum):
    LIGHT_SANDY = "light_sandy"
    MEDIUM_BLACK = "medium_black"
    DEEP_BLACK = "deep_black"
    RED_LATERITE = "red_laterite"


class IrrigationAvailability(str, Enum):
    RAINFED = "rainfed"
    PROTECTIVE_1_2 = "protective_1_2"
    WELL_IRRIGATED = "well_irrigated"


class CropRecommendationRequest(BaseModel):
    district: str = Field(..., description="District in Maharashtra, e.g. Nashik, Pune, Latur, Nagpur")
    season: Season = Field(default=Season.KHARIF, description="Cropping season")
    soil_ph: Optional[float] = Field(default=7.0, ge=3.5, le=11.0, description="Soil pH value")
    organic_carbon_pct: Optional[float] = Field(default=0.6, ge=0.0, le=5.0, description="Soil organic carbon %")
    soil_texture: SoilTexture = Field(default=SoilTexture.MEDIUM_BLACK, description="Soil type")
    irrigation: IrrigationAvailability = Field(default=IrrigationAvailability.PROTECTIVE_1_2)


class IntercropOption(BaseModel):
    companion_crop: str
    companion_crop_mr: str
    row_ratio: str
    rationale: str
    rationale_mr: str


class CropRecommendationItem(BaseModel):
    crop_id: str
    name: str
    name_mr: str
    name_hi: str
    suitability_score: int = Field(..., ge=0, le=100)
    suitability_grade: str  # Highly Suitable, Suitable, Moderately Suitable
    sowing_window: str
    sowing_window_mr: str
    duration_days: str
    expected_yield_quintals_per_acre: float
    recommended_varieties: List[str]
    intercrop: Optional[IntercropOption] = None
    water_requirement_mm: int
    key_advantages: List[str]
    key_advantages_mr: List[str]
    provenance: Provenance = Provenance.HISTORICAL
    source_citation: str


# Knowledge base of crops across Maharashtra agro-ecological zones
CROP_DATABASE = [
    {
        "crop_id": "soybean",
        "name": "Soybean",
        "name_mr": "सोयाबीन",
        "name_hi": "सोयाबीन",
        "seasons": [Season.KHARIF],
        "favored_soils": [SoilTexture.MEDIUM_BLACK, SoilTexture.DEEP_BLACK],
        "min_ph": 6.0,
        "max_ph": 8.0,
        "min_irrigation": IrrigationAvailability.RAINFED,
        "sowing_window": "June 20 - July 15 (After 75-100mm monsoon rain)",
        "sowing_window_mr": "२० जून ते १५ जुलै (७५-१०० मिमी समाधानकारक पाऊस झाल्यानंतर)",
        "duration_days": "90 - 105 days",
        "expected_yield_per_acre": 10.5,
        "varieties": ["JS-335", "Phule Kimaya (KDS-753)", "Phule Sangam (KDS-726)", "MACS-1407", "JS-9305"],
        "intercrop": {
            "companion_crop": "Pigeonpea (Tur / तूर)",
            "companion_crop_mr": "तूर (Pigeonpea)",
            "row_ratio": "4:2 or 3:1",
            "rationale": "Deep-rooted pigeonpea utilizes subsoil moisture without shading soybean canopy, boosting land equivalent ratio (LER) by 28%.",
            "rationale_mr": "तुरीचे खोल मूळ जमिनीतील खालचा ओलावा घेतात व सोयाबीनला सावली पडत नाही. जमिनीची उत्पादकता २८% वाढते."
        },
        "water_mm": 450,
        "advantages": ["Fixes atmospheric nitrogen (30-40 kg N/ha)", "Short duration allows double cropping with gram/wheat"],
        "advantages_mr": ["हवेतील नत्र जमिनीत स्थिर करते (३०-४० किलो/हेक्टर)", "कमी कालावधीमुळे रब्बी हरभरा/गहू घेता येतो"],
        "citation": "MPKV Rahuri & ICAR-IISR Indore Package of Practices"
    },
    {
        "crop_id": "cotton",
        "name": "Cotton (Bt / Desi)",
        "name_mr": "कापूस",
        "name_hi": "कपास",
        "seasons": [Season.KHARIF],
        "favored_soils": [SoilTexture.MEDIUM_BLACK, SoilTexture.DEEP_BLACK],
        "min_ph": 6.5,
        "max_ph": 8.5,
        "min_irrigation": IrrigationAvailability.PROTECTIVE_1_2,
        "sowing_window": "June 15 - July 10",
        "sowing_window_mr": "१५ जून ते १० जुलै",
        "duration_days": "150 - 180 days",
        "expected_yield_per_acre": 8.5,
        "varieties": ["Ajeet-155", "Bhakti", "RCH-659", "Dr. PDKV Suvarna", "Phule Pratibha"],
        "intercrop": {
            "companion_crop": "Green Gram (Mung) / Black Gram (Urad)",
            "companion_crop_mr": "मूग / उडीद",
            "row_ratio": "1:2 (Between two cotton rows)",
            "rationale": "Early pulse maturity (60 days) provides early cash-flow while smothering weeds and replenishing soil nitrogen.",
            "rationale_mr": "मूग/उडीद ६० दिवसांत निघून शेतकऱ्यास त्वरित उत्पन्न देतो, तण दाबून ठेवतो व नत्र वाढवतो."
        },
        "water_mm": 700,
        "advantages": ["High commercial market value", "Deep taproot system tolerates intermittent dry spells"],
        "advantages_mr": ["उच्च व्यावसायिक बाजारभाव", "खोल सोटमूळ असल्याने पावसाचा खंड सहन करण्याची ताकद"],
        "citation": "CICR Nagpur & Dr. PDKV Akola Cotton Agronomy"
    },
    {
        "crop_id": "pigeonpea",
        "name": "Pigeonpea (Tur / Red Gram)",
        "name_mr": "तूर",
        "name_hi": "अरहर / तूर",
        "seasons": [Season.KHARIF],
        "favored_soils": [SoilTexture.MEDIUM_BLACK, SoilTexture.DEEP_BLACK, SoilTexture.LIGHT_SANDY],
        "min_ph": 6.0,
        "max_ph": 8.2,
        "min_irrigation": IrrigationAvailability.RAINFED,
        "sowing_window": "June 15 - July 15",
        "sowing_window_mr": "१५ जून ते १५ जुलै",
        "duration_days": "140 - 170 days",
        "expected_yield_per_acre": 7.5,
        "varieties": ["BDN-711", "BDN-716", "BSMR-736", "Phule Rajeshwari", "PKV Tara"],
        "intercrop": {
            "companion_crop": "Soybean or Pearl Millet (Bajra)",
            "companion_crop_mr": "सोयाबीन किंवा बाजरी",
            "row_ratio": "2:4 or 1:3",
            "rationale": "Ideal intercropping balance with excellent drought resilience across Marathwada & Vidarbha.",
            "rationale_mr": "मराठवाडा व विदर्भात दुष्काळ सहन करणारी उत्तम आंतरपीक पद्धत."
        },
        "water_mm": 400,
        "advantages": ["Extremely drought tolerant", "Restores subsoil phosphorus and adds leaf litter organic matter"],
        "advantages_mr": ["अतिशय दुष्काळ सहनशील", "जमिनीतील अविद्राव्य स्फुरद विरघळवून सेंद्रिय कर्ब वाढवते"],
        "citation": "VNMKV Parbhani Pulses Research Directorate"
    },
    {
        "crop_id": "gram_chickpea",
        "name": "Chickpea (Harbhara / Bengal Gram)",
        "name_mr": "हरभरा",
        "name_hi": "चना / हरभरा",
        "seasons": [Season.RABI],
        "favored_soils": [SoilTexture.MEDIUM_BLACK, SoilTexture.DEEP_BLACK],
        "min_ph": 6.5,
        "max_ph": 8.5,
        "min_irrigation": IrrigationAvailability.RAINFED,
        "sowing_window": "October 10 - November 15",
        "sowing_window_mr": "१० ऑक्टोबर ते १५ नोव्हेंबर",
        "duration_days": "95 - 110 days",
        "expected_yield_per_acre": 9.0,
        "varieties": ["Vijay (Phule Vijay)", "Digvijay", "Vishwaraj", "JAKI-9218", "Phule Vikram (Combine friendly)"],
        "intercrop": {
            "companion_crop": "Safflower (Kardai / करडई) or Mustard",
            "companion_crop_mr": "करडई किंवा मोहरी",
            "row_ratio": "6:2 or 3:1",
            "rationale": "Safflower spines along field borders deter wild boars while extracting residual deep moisture.",
            "rationale_mr": "करडईच्या काट्यांमुळे रानडुकरांचा उपद्रव टळतो व खोलवरचा ओलावा वापरला जातो."
        },
        "water_mm": 300,
        "advantages": ["High cold tolerance and minimal irrigation requirement", "High protein staple with assured MSP"],
        "advantages_mr": ["कमी पाण्यावर येणारे व थंडीस अनुकूल पीक", "हमीभाव (MSP) हमी असलेले हमखास नगदी पीक"],
        "citation": "MPKV Rahuri Pulses Improvement Project"
    },
    {
        "crop_id": "onion_kharif",
        "name": "Onion (Kharif / Pol)",
        "name_mr": "कांदा (खरीप / पोळ)",
        "name_hi": "प्याज (खरीफ)",
        "seasons": [Season.KHARIF, Season.RABI],
        "favored_soils": [SoilTexture.MEDIUM_BLACK, SoilTexture.LIGHT_SANDY],
        "min_ph": 6.5,
        "max_ph": 7.8,
        "min_irrigation": IrrigationAvailability.WELL_IRRIGATED,
        "sowing_window": "Nursery: May-June; Transplanting: July-August",
        "sowing_window_mr": "रोपवाटिका: मे-जून; पुनर्लागवड: जुलै-ऑगस्ट",
        "duration_days": "110 - 120 days",
        "expected_yield_per_acre": 95.0,
        "varieties": ["Bhima Super", "Bhima Dark Red", "Baswant-780", "Phule Samarth"],
        "intercrop": None,
        "water_mm": 550,
        "advantages": ["High commercial cash realization in festival window (Diwali)", "Compatible with drip fertigation"],
        "advantages_mr": ["दिवाळी हंगामात उत्तम बाजारभावाची संधी", "ठिबक सिंचनावर भरघोस उत्पादन"],
        "citation": "ICAR-Directorate of Onion and Garlic Research (DOGR) Rajgurunagar"
    },
    {
        "crop_id": "sugarcane",
        "name": "Sugarcane (Adsali / Pre-seasonal)",
        "name_mr": "ऊस",
        "name_hi": "गन्ना",
        "seasons": [Season.KHARIF, Season.RABI, Season.SUMMER],
        "favored_soils": [SoilTexture.MEDIUM_BLACK, SoilTexture.DEEP_BLACK],
        "min_ph": 6.5,
        "max_ph": 8.2,
        "min_irrigation": IrrigationAvailability.WELL_IRRIGATED,
        "sowing_window": "Adsali: July-August; Pre-seasonal: Oct-Nov; Suru: Jan-Feb",
        "sowing_window_mr": "आडसाली: जुलै-ऑगस्ट; पूर्वहंगामी: ऑक्टोबर-नोव्हेंबर; सुरू: जाने-फेब्रु",
        "duration_days": "360 - 450 days",
        "expected_yield_per_acre": 480.0,
        "varieties": ["Co-86032 (Nira)", "Co-0265 (Phule 265)", "MS-10001", "VSI-08005"],
        "intercrop": {
            "companion_crop": "Potato or Onion or Cabbage in early rows",
            "companion_crop_mr": "बटाटा / कांदा / कोबी (सुरुवातीच्या पट्ट्यात)",
            "row_ratio": "1:2 in wide-row furrow (5 ft)",
            "rationale": "Short duration vegetable intercrop offsets initial field preparation cost during first 90 days.",
            "rationale_mr": "पहिले ९० दिवस आंतरपीक भाजीपाल्यामुळे मशागतीचा खर्च निघून येतो."
        },
        "water_mm": 2000,
        "advantages": ["Guaranteed factory FRP payment", "High total biomass and ratoon crop potential"],
        "advantages_mr": ["साखर कारखान्याकडून हमखास एफआरपी (FRP) दर", "खोडावा पिकाची सोय"],
        "citation": "Vasantdada Sugar Institute (VSI) Pune & MPKV Rahuri"
    },
    {
        "crop_id": "pearl_millet",
        "name": "Pearl Millet (Bajra)",
        "name_mr": "बाजरी",
        "name_hi": "बाजरा",
        "seasons": [Season.KHARIF, Season.SUMMER],
        "favored_soils": [SoilTexture.LIGHT_SANDY, SoilTexture.MEDIUM_BLACK],
        "min_ph": 6.2,
        "max_ph": 8.5,
        "min_irrigation": IrrigationAvailability.RAINFED,
        "sowing_window": "June 15 - July 15",
        "sowing_window_mr": "१५ जून ते १५ जुलै",
        "duration_days": "75 - 85 days",
        "expected_yield_per_acre": 12.0,
        "varieties": ["Shraddha (RHRBH-8609)", "Saburi (RHRBH-8924)", "Phule Aadi", "Dhanashakti (Biofortified Iron-rich)"],
        "intercrop": {
            "companion_crop": "Pigeonpea or Moth Bean (Matki)",
            "companion_crop_mr": "तूर किंवा मटकी",
            "row_ratio": "2:1 or 4:2",
            "rationale": "High heat tolerance; guarantees green fodder even in severe monsoon breaks.",
            "rationale_mr": "पावसाचा खंड पडला तरी जनावरांसाठी चारा व धान्य हमखास देणारे पीक."
        },
        "water_mm": 350,
        "advantages": ["Nutri-cereal (Millet) with high iron and zinc content", "Extremely low cost of cultivation"],
        "advantages_mr": ["पौष्टिक तृणधान्य (लोह व जस्त समृद्ध)", "अतिशय कमी उत्पादन खर्च"],
        "citation": "AICRP on Pearl Millet & MPKV Rahuri"
    }
]


def recommend_crops(request: CropRecommendationRequest) -> List[CropRecommendationItem]:
    """Score and rank crops according to agro-climatic, soil, and water compatibility."""
    recommendations: List[CropRecommendationItem] = []

    for c in CROP_DATABASE:
        if request.season not in c["seasons"]:
            continue

        score = 80  # Base matching score

        # 1. Soil Texture Matching
        if request.soil_texture in c["favored_soils"]:
            score += 10
        else:
            score -= 15

        # 2. pH Suitability
        ph = request.soil_ph or 7.0
        if c["min_ph"] <= ph <= c["max_ph"]:
            score += 5
        elif abs(ph - 7.0) > 1.5:
            score -= 15

        # 3. Irrigation Alignment
        if c["min_irrigation"] == IrrigationAvailability.WELL_IRRIGATED:
            if request.irrigation != IrrigationAvailability.WELL_IRRIGATED:
                score -= 30  # Heavy penalty for high-water crop under rainfed
        elif c["min_irrigation"] == IrrigationAvailability.PROTECTIVE_1_2:
            if request.irrigation == IrrigationAvailability.RAINFED:
                score -= 10

        # Organic carbon bonus
        if (request.organic_carbon_pct or 0.5) >= 0.6:
            score += 5

        # Bound score between 20 and 98
        final_score = max(20, min(98, score))

        if final_score >= 80:
            grade = "Highly Suitable (अत्यंत योग्य)"
        elif final_score >= 65:
            grade = "Suitable (योग्य)"
        else:
            grade = "Moderately Suitable (मध्यम योग्य)"

        intercrop_obj = None
        if c["intercrop"]:
            intercrop_obj = IntercropOption(**c["intercrop"])

        recommendations.append(
            CropRecommendationItem(
                crop_id=c["crop_id"],
                name=c["name"],
                name_mr=c["name_mr"],
                name_hi=c["name_hi"],
                suitability_score=final_score,
                suitability_grade=grade,
                sowing_window=c["sowing_window"],
                sowing_window_mr=c["sowing_window_mr"],
                duration_days=c["duration_days"],
                expected_yield_quintals_per_acre=c["expected_yield_per_acre"],
                recommended_varieties=c["varieties"],
                intercrop=intercrop_obj,
                water_requirement_mm=c["water_mm"],
                key_advantages=c["advantages"],
                key_advantages_mr=c["advantages_mr"],
                provenance=Provenance.HISTORICAL,
                source_citation=c["citation"]
            )
        )

    # Sort descending by suitability score
    recommendations.sort(key=lambda x: x.suitability_score, reverse=True)
    return recommendations
