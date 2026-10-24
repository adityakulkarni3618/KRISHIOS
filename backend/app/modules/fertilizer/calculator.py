"""Fertilizer & N-P-K Split Dosage Engine for Maharashtra Soils.

Benchmarked against ICAR and MPKV Rahuri Recommended Dose of Fertilizers (RDF).
Calculates exact chemical fertilizer bags (Urea, DAP, MOP, SSP, 10:26:26) and
stage-wise split applications based on Soil Health Card nutrient ratings.
"""
import math
from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel, Field

from app.core.provenance import Provenance


class NutrientLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class FertilizerPlanRequest(BaseModel):
    crop: str = Field(..., description="Crop name: soybean, cotton, sugarcane, onion, chickpea, wheat")
    area_acres: float = Field(..., gt=0, le=500.0, description="Cultivated land area in acres")
    soil_n_status: NutrientLevel = Field(default=NutrientLevel.MEDIUM)
    soil_p_status: NutrientLevel = Field(default=NutrientLevel.MEDIUM)
    soil_k_status: NutrientLevel = Field(default=NutrientLevel.MEDIUM)
    use_drip_fertigation: bool = Field(default=False)


class SplitStage(BaseModel):
    stage_name: str
    stage_name_mr: str
    timing: str
    timing_mr: str
    urea_kg: float
    dap_kg: float
    mop_kg: float
    notes: str
    notes_mr: str


class FertilizerOption(BaseModel):
    name: str
    name_mr: str
    description: str
    description_mr: str
    urea_bags_45kg: float
    dap_bags_50kg: float
    mop_bags_50kg: float
    ssp_bags_50kg: Optional[float] = 0.0
    complex_bags_50kg: Optional[float] = 0.0
    estimated_cost_inr: float


class FertilizerPlanResult(BaseModel):
    crop: str
    area_acres: float
    total_pure_nutrients_kg: Dict[str, float]  # N, P2O5, K2O
    recommended_options: List[FertilizerOption]
    split_schedule: List[SplitStage]
    micronutrient_advisories: List[str]
    micronutrient_advisories_mr: List[str]
    biofertilizer_seed_treatment: str
    biofertilizer_seed_treatment_mr: str
    provenance: Provenance = Provenance.ESTIMATED
    source_citation: str


# MPKV Rahuri standard RDF per acre (N : P2O5 : K2O in kg/acre)
CROP_RDF_PER_ACRE: Dict[str, Dict[str, float]] = {
    "soybean": {"N": 12.0, "P": 24.0, "K": 12.0, "has_rhizobium": True},
    "cotton": {"N": 48.0, "P": 24.0, "K": 24.0, "has_rhizobium": False},
    "sugarcane": {"N": 160.0, "P": 68.0, "K": 68.0, "has_rhizobium": False},
    "onion": {"N": 40.0, "P": 20.0, "K": 20.0, "has_rhizobium": False},
    "chickpea": {"N": 10.0, "P": 20.0, "K": 10.0, "has_rhizobium": True},
    "wheat": {"N": 48.0, "P": 24.0, "K": 16.0, "has_rhizobium": False},
}

# Approx subsidized retail prices in Maharashtra (INR per bag)
PRICE_UREA_45KG = 267.0
PRICE_DAP_50KG = 1350.0
PRICE_MOP_50KG = 1650.0
PRICE_SSP_50KG = 550.0
PRICE_10_26_26_50KG = 1470.0


def adjust_for_soil_status(nutrient_kg: float, status: NutrientLevel) -> float:
    if status == NutrientLevel.LOW:
        return nutrient_kg * 1.25  # Apply 25% extra if deficient
    elif status == NutrientLevel.HIGH:
        return nutrient_kg * 0.75  # Save 25% if already high
    return nutrient_kg


def calculate_fertilizer_plan(request: FertilizerPlanRequest) -> FertilizerPlanResult:
    normalized_crop = request.crop.lower().strip()
    # Match crop key
    crop_key = "soybean"
    for key in CROP_RDF_PER_ACRE.keys():
        if key in normalized_crop:
            crop_key = key
            break

    rdf = CROP_RDF_PER_ACRE[crop_key]
    acres = request.area_acres

    # Adjust pure nutrients based on soil test
    pure_n_per_acre = adjust_for_soil_status(rdf["N"], request.soil_n_status)
    pure_p_per_acre = adjust_for_soil_status(rdf["P"], request.soil_p_status)
    pure_k_per_acre = adjust_for_soil_status(rdf["K"], request.soil_k_status)

    total_pure_n = round(pure_n_per_acre * acres, 1)
    total_pure_p = round(pure_p_per_acre * acres, 1)
    total_pure_k = round(pure_k_per_acre * acres, 1)

    # Calculation 1: DAP + MOP + Urea combo
    # DAP is 18% N and 46% P2O5. 50kg DAP gives 9kg N and 23kg P2O5.
    dap_bags_exact = total_pure_p / 23.0
    dap_bags = round(dap_bags_exact, 1)
    n_from_dap = dap_bags * 9.0

    # Remaining N from Urea (46% N in 45kg bag = 20.7kg N per bag)
    rem_n = max(0.0, total_pure_n - n_from_dap)
    urea_bags_exact = rem_n / 20.7
    urea_bags = round(urea_bags_exact, 1)

    # MOP is 60% K2O. 50kg MOP gives 30kg K2O.
    mop_bags_exact = total_pure_k / 30.0
    mop_bags = round(mop_bags_exact, 1)

    cost_option_1 = round(
        (urea_bags * PRICE_UREA_45KG) + (dap_bags * PRICE_DAP_50KG) + (mop_bags * PRICE_MOP_50KG)
    )

    # Calculation 2: SSP + Urea + MOP combo (Single Super Phosphate provides 16% P2O5 + 11% Sulfur)
    # 50kg SSP provides 8kg P2O5.
    ssp_bags_exact = total_pure_p / 8.0
    ssp_bags = round(ssp_bags_exact, 1)
    urea_for_ssp = round(total_pure_n / 20.7, 1)
    cost_option_2 = round(
        (urea_for_ssp * PRICE_UREA_45KG) + (ssp_bags * PRICE_SSP_50KG) + (mop_bags * PRICE_MOP_50KG)
    )

    options = [
        FertilizerOption(
            name="Popular DAP + Urea + MOP Combination",
            name_mr="डी.ए.पी. + युरिया + एम.ओ.पी. जोड (लोकप्रिय)",
            description=f"{dap_bags} bags DAP, {urea_bags} bags Urea, {mop_bags} bags MOP",
            description_mr=f"{dap_bags} पोती डीएपी, {urea_bags} पोती युरिया, {mop_bags} पोती म्युरेट ऑफ पोटॅश",
            urea_bags_45kg=urea_bags,
            dap_bags_50kg=dap_bags,
            mop_bags_50kg=mop_bags,
            ssp_bags_50kg=0.0,
            complex_bags_50kg=0.0,
            estimated_cost_inr=cost_option_1,
        ),
        FertilizerOption(
            name="SSP + Urea + MOP (Sulfur Enriched - Ideal for Oilseeds)",
            name_mr="सिंगल सुपर फॉस्फेट (एसएसपी) + युरिया + पोटॅश (गंधकयुक्त)",
            description=f"{ssp_bags} bags SSP, {urea_for_ssp} bags Urea, {mop_bags} bags MOP (Provides natural sulfur)",
            description_mr=f"{ssp_bags} पोती एसएसपी, {urea_for_ssp} पोती युरिया, {mop_bags} पोती पोटॅश (नैसर्गिक गंधक देणारे)",
            urea_bags_45kg=urea_for_ssp,
            dap_bags_50kg=0.0,
            mop_bags_50kg=mop_bags,
            ssp_bags_50kg=ssp_bags,
            complex_bags_50kg=0.0,
            estimated_cost_inr=cost_option_2,
        ),
    ]

    # Split Schedule (Basal, Vegetative, Flowering)
    schedule: List[SplitStage] = [
        SplitStage(
            stage_name="1. Basal Application (पेरणीच्या वेळी)",
            stage_name_mr="१. बेसल डोस (पेरणी/लागवडीच्या वेळी)",
            timing="At Sowing / Seed Placement",
            timing_mr="पेरणी करताना बियाण्याखाली ५ सेंमी",
            urea_kg=round(urea_bags * 45.0 * 0.3, 1),
            dap_kg=round(dap_bags * 50.0, 1),  # 100% P at basal
            mop_kg=round(mop_bags * 50.0, 1),  # 100% K at basal
            notes="Full Phosphorous and Potash must be placed deep; 30% Nitrogen only to avoid root burn.",
            notes_mr="संपूर्ण स्फुरद व पालाश पेरणीच्या वेळी द्यावा; नत्राचा फक्त ३०% भाग द्यावा जेणेकरून मुळे जळणार नाहीत."
        ),
        SplitStage(
            stage_name="2. First Top Dressing (पहिली खुरपणी/फुटवे फुटणे)",
            stage_name_mr="२. पहिली खत मात्रा (शाकीय वाढ/फुटवे अवस्था)",
            timing="30 to 35 Days After Sowing (DAS)",
            timing_mr="पेरणीनंतर ३० ते ३५ दिवसांनी (ओलावा असताना)",
            urea_kg=round(urea_bags * 45.0 * 0.4, 1),
            dap_kg=0.0,
            mop_kg=0.0,
            notes="Broadcast Urea when soil has adequate moisture. Do not apply on dry cracked soil.",
            notes_mr="जमिनीत पुरेसा ओलावा असताना युरियाची मात्रा द्यावी. वाफशावर खत देणे फायदेशीर ठरते."
        ),
        SplitStage(
            stage_name="3. Second Top Dressing (फुलोरा / शेंगा भरणे)",
            stage_name_mr="३. दुसरी खत मात्रा (फुलोरा/दाणे भरणे अवस्था)",
            timing="55 to 65 Days After Sowing (DAS)",
            timing_mr="पेरणीनंतर ५५ ते ६५ दिवसांनी",
            urea_kg=round(urea_bags * 45.0 * 0.3, 1),
            dap_kg=0.0,
            mop_kg=0.0,
            notes="Apply remaining Urea. For pulse/oilseed, supplement with 19:19:19 or 00:52:34 foliar spray @ 5g/L.",
            notes_mr="उरलेला युरिया द्यावा. सोबत १९:१९:१९ किंवा ००:५२:३४ ची फवारणी (५ ग्रॅम प्रति लिटर) केल्यास दाणे टपोरे होतात."
        ),
    ]

    # Micronutrients
    micro = [
        "Zinc Sulphate (21%) @ 10 kg/acre basal application prevents zinc deficiency chlorosis.",
        "Boron (Solubor 20%) @ 1.5 g/litre foliar spray during flowering stage enhances pod/boll setting."
    ]
    micro_mr = [
        "झिंक सल्फेट (२१%) प्रति एकर १० किलो बेसल डोसमध्ये दिल्यास पिवळेपणा थांबतो.",
        "फुलोरा अवस्थेत बोरॉन (बोरिक ॲसिड / सोलुबोर) १.५ ग्रॅम प्रति लिटर फवारणी केल्याने फुलगळ थांबते व फळधारणा वाढते."
    ]

    bio_treatment = "Treat seeds with Rhizobium culture (for pulses/soybean) @ 25g/kg seed + PSB culture @ 25g/kg seed using jaggery water."
    bio_treatment_mr = "पेरणीपूर्वी बियाण्यास रायझोबियम जिवाणू संवर्धन २५ ग्रॅम + पी.एस.बी. २५ ग्रॅम प्रति किलो बियाण्यास गुळाच्या थंड द्रावणातून चोळावे."

    return FertilizerPlanResult(
        crop=request.crop,
        area_acres=acres,
        total_pure_nutrients_kg={
            "N": total_pure_n,
            "P2O5": total_pure_p,
            "K2O": total_pure_k,
        },
        recommended_options=options,
        split_schedule=schedule,
        micronutrient_advisories=micro,
        micronutrient_advisories_mr=micro_mr,
        biofertilizer_seed_treatment=bio_treatment,
        biofertilizer_seed_treatment_mr=bio_treatment_mr,
        provenance=Provenance.ESTIMATED,
        source_citation="MPKV Rahuri Recommended Fertilizer Doses & ICAR Soil Health Guidelines"
    )
