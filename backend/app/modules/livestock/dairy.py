"""Livestock & Dairy Companion ("Pashu-Mitra") for Maharashtra Cattle & Goat Farmers.

Benchmarked with ICAR-National Dairy Research Institute (NDRI) and
Maharashtra Animal & Fishery Sciences University (MAFSU) Nagpur.
Provides mandatory vaccination calendar (FMD, Lumpy Skin, HS) and
daily Total Mixed Ration (TMR) feed formulation based on milk yield.
"""
from typing import Dict, List, Optional
from pydantic import BaseModel, Field

from app.core.provenance import Provenance


class AnimalSpecies(str):
    COW_INDIGENOUS = "Indigenous Cow (गिर / साहिवाल / खिल्लार)"
    COW_CROSSBREED = "Crossbred Cow (HF / जर्सी संकरित)"
    BUFFALO = "Buffalo (मुऱ्हा / पंढरपुरी म्हैस)"
    GOAT = "Goat (उस्मानाबादी / संगमनेरी शेळी)"


class VaccineEvent(BaseModel):
    disease_name: str
    disease_name_mr: str
    schedule_timing: str
    schedule_timing_mr: str
    target_age_or_season: str
    target_age_or_season_mr: str
    importance: str
    importance_mr: str
    mandatory_govt_free: bool = True


class FeedRationRequest(BaseModel):
    species: str = Field(default="Cow Crossbred (HF / Jersey)", description="Species & breed type")
    body_weight_kg: float = Field(default=400.0, ge=100.0, le=900.0)
    daily_milk_litres: float = Field(default=12.0, ge=0.0, le=45.0)
    fat_percentage: float = Field(default=4.0, ge=2.5, le=9.5)


class FeedRationResult(BaseModel):
    species: str
    body_weight_kg: float
    daily_milk_litres: float
    dry_matter_requirement_kg: float
    green_fodder_kg: float  # e.g. Napier, Maize, Lucerne
    dry_fodder_kg: float    # e.g. Soybean straw, Kadba
    concentrate_cattle_feed_kg: float  # e.g. Cottonseed cake + balanced feed
    mineral_mixture_grams: float
    common_salt_grams: float
    fresh_drinking_water_litres: float
    estimated_daily_feed_cost_inr: float
    estimated_daily_milk_revenue_inr: float
    projected_daily_profit_inr: float
    nutritional_tips: List[str]
    nutritional_tips_mr: List[str]
    provenance: Provenance = Provenance.ESTIMATED
    source_citation: str


MAHARASHTRA_VACCINATION_SCHEDULE = [
    VaccineEvent(
        disease_name="Foot and Mouth Disease (FMD / लाळ्या खुरकूत)",
        disease_name_mr="लाळ्या खुरकूत (FMD)",
        schedule_timing="Twice a year (Pre-monsoon: April-May & Post-monsoon: Sept-Oct)",
        schedule_timing_mr="वर्षातून दोनदा (एप्रिल-मे आणि सप्टेंबर-ऑक्टोबर)",
        target_age_or_season="All cattle & buffaloes above 4 months of age",
        target_age_or_season_mr="४ महिन्यांवरील सर्व वासरे, गाई व म्हशी",
        importance="Prevents mouth ulcers, high fever, and permanent drop in milk production.",
        importance_mr="तोंडातील व खुरांतील फोड थांबवते, ताप व कायमस्वरूपी दूध घट टाळते.",
        mandatory_govt_free=True,
    ),
    VaccineEvent(
        disease_name="Lumpy Skin Disease (LSD / लंपी त्वचा रोग)",
        disease_name_mr="लंपी त्वचा रोग (LSD)",
        schedule_timing="Once a year (February to April - Prior to fly/tick breeding season)",
        schedule_timing_mr="वर्षातून एकदा (फेब्रुवारी ते एप्रिल महिन्यात)",
        target_age_or_season="All cattle (Goat Pox vaccine used as protection)",
        target_age_or_season_mr="सर्व गोवंश जनावरे (गोट पॉक्स लस)",
        importance="Prevents painful nodules on skin, edema, and high mortality in indigenous/milch animals.",
        importance_mr="अंगावर गाठी येणे, पाय सुजणे व जनावरे दगावणे यापासून १००% संरक्षण.",
        mandatory_govt_free=True,
    ),
    VaccineEvent(
        disease_name="Haemorrhagic Septicaemia (HS / घटसर्प)",
        disease_name_mr="घटसर्प (HS)",
        schedule_timing="Annually (May - June, strictly before first monsoon showers)",
        schedule_timing_mr="पावसाळ्यापूर्वी मे-जून महिन्यात",
        target_age_or_season="Cattle & especially Buffaloes (highly vulnerable in waterlogged fields)",
        target_age_or_season_mr="गाई व विशेषतः म्हशी (पावसाळ्यात चिखलात फिरणाऱ्या)",
        importance="Acute bacterial infection with 80% fatality within 24 hours if unvaccinated.",
        importance_mr="गळा सुजून जनावर गुदमरते. लस टोचल्यास हमखास बचाव होतो.",
        mandatory_govt_free=True,
    ),
    VaccineEvent(
        disease_name="Black Quarter (BQ / एकटांग्या / फऱ्या)",
        disease_name_mr="एकटांग्या / फऱ्या (BQ)",
        schedule_timing="Annually (Pre-monsoon: May-June)",
        schedule_timing_mr="पावसाळ्यापूर्वी मे-जून महिन्यात",
        target_age_or_season="Young healthy growing cattle between 6 months to 2 years",
        target_age_or_season_mr="६ महिने ते २ वर्षे वयाची धष्टपुष्ट वासरे",
        importance="Clostridial bacterial toxins cause gangrene in thigh muscle; vaccination gives immunity.",
        importance_mr="मांडीला सूज येऊन जनावर लंगडते. वेळेवर लस दिल्यास संसर्ग टळतो.",
        mandatory_govt_free=True,
    ),
    VaccineEvent(
        disease_name="Brucellosis (ब्रुसेलोसिस)",
        disease_name_mr="ब्रुसेलोसिस (गर्भपात प्रतिबंधक लस)",
        schedule_timing="Once in lifetime (Only for female calves at 4 to 8 months age)",
        schedule_timing_mr="आयुष्यात फक्त एकदाच (४ ते ८ महिन्यांच्या कालवडींना)",
        target_age_or_season="Female calves only (Never administer to male or adult animals)",
        target_age_or_season_mr="फक्त मादी कालवडींना (नर वासरांना अथवा मोठ्या गाईंना देऊ नये)",
        importance="Prevents late-stage pregnancy abortions and zoonotic transmission to farmers.",
        importance_mr="शेवटच्या टप्प्यातील गर्भपात रोखते व मानवामध्ये होणारा संसर्ग टाळते.",
        mandatory_govt_free=True,
    ),
]


def get_livestock_vaccine_schedule() -> List[VaccineEvent]:
    return MAHARASHTRA_VACCINATION_SCHEDULE


def calculate_feed_ration(req: FeedRationRequest) -> FeedRationResult:
    weight = req.body_weight_kg
    milk = req.daily_milk_litres
    fat = req.fat_percentage

    # Dry Matter (DM) requirement: 2.5% to 3.0% of body weight + 0.35kg DM per kg milk produced
    maintenance_dm = weight * 0.025
    production_dm = milk * 0.35
    total_dm = round(maintenance_dm + production_dm, 1)

    # 2/3 of DM from roughage (fodder), 1/3 of DM from concentrate (feed)
    roughage_dm = total_dm * 0.65
    concentrate_dm = total_dm * 0.35

    # Roughage split: 60% Green fodder (contains ~20% DM), 40% Dry fodder (contains ~90% DM)
    green_fodder_dm = roughage_dm * 0.6
    dry_fodder_dm = roughage_dm * 0.4

    green_fodder_kg = round(green_fodder_dm / 0.20, 1)  # Actual fresh weight
    dry_fodder_kg = round(dry_fodder_dm / 0.90, 1)      # Actual dry weight
    concentrate_kg = round(concentrate_dm / 0.90, 1)    # Actual bag feed weight

    mineral_mixture_grams = 50.0 if milk < 10 else 80.0
    salt_grams = 40.0
    water_litres = round(weight * 0.1 + (milk * 3.0), 0)

    # Economics
    feed_cost_inr = round((concentrate_kg * 28.0) + (dry_fodder_kg * 4.0) + 15.0, 1)
    # Milk price benchmark: Cow ~₹36/L, Buffalo ~₹55/L
    milk_rate = 54.0 if "buffalo" in req.species.lower() else 36.0
    milk_rev = round(milk * milk_rate, 1)
    daily_profit = round(milk_rev - feed_cost_inr, 1)

    tips_en = [
        f"Provide at least {water_litres} Litres of fresh, cool drinking water across 3-4 intervals daily.",
        "Add 15-20g bypass fat for cows producing more than 15 litres to sustain peak lactation.",
        "Soak concentrate feed (sarki dhep / chuni) in water for 2 hours before feeding for optimal rumen digestion."
    ]
    tips_mr = [
        f"दिवसातून किमान ३ ते ४ वेळा स्वच्छ व थंड पाणी (सुमारे {water_litres} लिटर) मुबलक उपलब्ध ठेवा.",
        "१५ लिटरपेक्षा जास्त दूध देणाऱ्या जनावरांना 'बायपास फॅट' दिल्यास दुधातील फॅट आणि एसएनएफ वाढते.",
        "सरकी ढेप, चुनी व पशुखाद्य खायला घालण्यापूर्वी २ तास पाण्यात भिजवून दिल्यास पचनक्रिया सुधारते."
    ]

    return FeedRationResult(
        species=req.species,
        body_weight_kg=weight,
        daily_milk_litres=milk,
        dry_matter_requirement_kg=total_dm,
        green_fodder_kg=green_fodder_kg,
        dry_fodder_kg=dry_fodder_kg,
        concentrate_cattle_feed_kg=concentrate_kg,
        mineral_mixture_grams=mineral_mixture_grams,
        common_salt_grams=salt_grams,
        fresh_drinking_water_litres=water_litres,
        estimated_daily_feed_cost_inr=feed_cost_inr,
        estimated_daily_milk_revenue_inr=milk_rev,
        projected_daily_profit_inr=daily_profit,
        nutritional_tips=tips_en,
        nutritional_tips_mr=tips_mr,
        provenance=Provenance.ESTIMATED,
        source_citation="ICAR-NDRI Karnal & MAFSU Nagpur Cattle Nutrition Benchmarks"
    )
