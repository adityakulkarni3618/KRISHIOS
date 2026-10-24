"""Pradhan Mantri Fasal Bima Yojana (PMFBY) ₹1 Scheme Engine for Maharashtra.

Under the Government of Maharashtra scheme, farmers pay only ₹1 token premium per application,
with the state paying the rest of the actuarial premium.
Provides 72-hour localized disaster claim assessment, loss calculation,
and surveyor inspection guidelines.
"""
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional
from pydantic import BaseModel, Field

from app.core.provenance import Provenance


class CalamityType(str, Enum):
    EXCESS_RAIN = "excess_rain"
    INUNDATION_FLOOD = "inundation_flood"
    DROUGHT_DRY_SPELL = "drought_dry_spell"
    HAILSTORM = "hailstorm"
    POST_HARVEST_CYCLONE = "post_harvest_cyclone"
    PEST_EPIDEMIC = "pest_epidemic"


# Standard benchmarked Sum Insured per hectare in Maharashtra (INR/ha)
OFFICIAL_SUM_INSURED_PER_HA: Dict[str, float] = {
    "soybean": 54000.0,
    "cotton": 60000.0,
    "pigeonpea": 45000.0,
    "paddy": 55000.0,
    "onion": 65000.0,
    "sugarcane": 115000.0,
    "gram": 42000.0,
    "wheat": 48000.0,
}

ACTUARIAL_PREMIUM_RATE_PCT: Dict[str, float] = {
    "soybean": 12.5,
    "cotton": 14.0,
    "pigeonpea": 11.0,
    "paddy": 10.0,
    "onion": 15.0,
    "sugarcane": 8.0,
    "gram": 9.5,
    "wheat": 9.0,
}


class InsuranceClaimEstimateRequest(BaseModel):
    crop: str = Field(..., description="Crop name: soybean, cotton, pigeonpea, onion, etc.")
    district: str = Field(..., description="District in Maharashtra")
    area_hectares: float = Field(..., gt=0.0, le=50.0, description="Area in hectares")
    calamity_type: CalamityType = Field(default=CalamityType.EXCESS_RAIN)
    estimated_loss_percentage: float = Field(..., ge=10.0, le=100.0, description="Visual estimated crop loss %")
    incident_date: Optional[str] = Field(default=None, description="YYYY-MM-DD format date of calamity")


class ClaimStep(BaseModel):
    step_number: int
    title: str
    title_mr: str
    timeline: str
    timeline_mr: str
    action_required: str
    action_required_mr: str
    urgent: bool = False


class InsuranceClaimEstimateResult(BaseModel):
    crop: str
    district: str
    area_hectares: float
    total_sum_insured_inr: float
    farmer_token_premium_inr: float = 1.0  # ₹1 Scheme in Maharashtra
    state_subsidy_borne_inr: float
    estimated_claim_payout_inr: float
    intimation_deadline_warning: str
    intimation_deadline_warning_mr: str
    action_checklist: List[ClaimStep]
    toll_free_helpline: str
    required_documents: List[str]
    required_documents_mr: List[str]
    official_portal_url: str
    provenance: Provenance = Provenance.ESTIMATED
    source_citation: str


def estimate_pmfby_claim(request: InsuranceClaimEstimateRequest) -> InsuranceClaimEstimateResult:
    normalized_crop = request.crop.lower().strip()
    crop_key = "soybean"
    for key in OFFICIAL_SUM_INSURED_PER_HA.keys():
        if key in normalized_crop:
            crop_key = key
            break

    sum_insured_per_ha = OFFICIAL_SUM_INSURED_PER_HA[crop_key]
    actuarial_rate = ACTUARIAL_PREMIUM_RATE_PCT.get(crop_key, 12.0)

    total_sum_insured = round(sum_insured_per_ha * request.area_hectares, 2)
    commercial_premium = round(total_sum_insured * (actuarial_rate / 100.0), 2)
    # Under Maharashtra ₹1 scheme, farmer pays only 1 Rupee!
    farmer_premium = 1.0
    govt_subsidy = round(commercial_premium - farmer_premium, 2)

    # Claim payout estimation
    # Payout = Total Sum Insured * (Loss % / 100)
    payout = round(total_sum_insured * (request.estimated_loss_percentage / 100.0), 2)

    # 72 hours intimation rule
    warning_en = "🚨 MANDATORY: You must register localized crop damage within 72 HOURS of the incident. Delay leads to claim rejection!"
    warning_mr = "🚨 अत्यंत महत्त्वाचे: नैसर्गिक आपत्ती घडल्यापासून ७२ तासांच्या आत नुकसानीची पूर्वसूचना देणे बंधनकारक आहे. अन्यथा क्लेम नामंजूर होतो!"

    checklist: List[ClaimStep] = [
        ClaimStep(
            step_number=1,
            title="Intimate Claim on Crop Insurance App or Call 14447",
            title_mr="१. क्रॉप इन्शुरन्स ॲपवर पूर्वसूचना नोंदवा किंवा १४४४७ वर कॉल करा",
            timeline="Within 72 Hours of Calamity",
            timeline_mr="आपत्ती घडल्यापासून ७२ तासांच्या आत",
            action_required="Open 'Crop Insurance' mobile app -> Select 'Crop Loss' -> Upload geotagged photos of damaged crop -> Note down Docket / Claim Reference Number.",
            action_required_mr="मोबाइलमधील 'Crop Insurance' ॲप उघडा -> 'क्रॉप लॉस' निवडा -> नुकसानीचे जिओटॅग फोटो अपलोड करा -> डॉकेट/तक्रार क्रमांक लिहून ठेवा.",
            urgent=True,
        ),
        ClaimStep(
            step_number=2,
            title="Joint Field Survey (पंचनामा)",
            title_mr="२. संयुक्त पंचनामा (तालुका कृषी अधिकारी व विमा प्रतिनिधी)",
            timeline="Within 7 to 10 Days",
            timeline_mr="७ ते १० दिवसांच्या आत",
            action_required="Ensure physical presence during joint field inspection by Krishi Sahayak, Talathi, and Insurance Company loss assessor. Sign the panchnama copy.",
            action_required_mr="कृषी सहाय्यक, तलाठी व विमा कंपनी प्रतिनिधी यांच्या समक्ष शेतावर पंचनामा पूर्ण करून घ्या आणि पंचनाम्याची प्रत मिळवा.",
            urgent=False,
        ),
        ClaimStep(
            step_number=3,
            title="Aadhaar-Linked Bank DBT Payout",
            title_mr="३. आधार संलग्न बँक खात्यात थेट डीबीटी जमा",
            timeline="Within 21 to 30 Days of Survey Approval",
            timeline_mr="पंचनामा मंजूर झाल्यानंतर २१ ते ३० दिवसांत",
            action_required="Ensure your bank savings account is NPCI Aadhaar seeded. Compensation will be directly transferred via PFMS/DBT.",
            action_required_mr="आपले बँक खाते एनपीसीआय (NPCI) आधार लिंक असल्याची खात्री करा. भरपाई थेट खात्यात वर्ग केली जाते.",
            urgent=False,
        ),
    ]

    docs_en = [
        "Digital 7/12 (Satbara) & 8-A Extract with current year crop entry",
        "E-Pik Pahani (ई-पीक पाहणी) Mobile Verification Certificate",
        "PMFBY ₹1 Policy Receipt / Acknowledgement Slip",
        "Aadhaar Card copy & Bank Passbook (showing IFSC & Account number)",
        "Geotagged damage photos taken through the Crop Insurance app",
    ]
    docs_mr = [
        "चालू वर्षाची पीक नोंद असलेला डिजिटल ७/१२ व ८-अ उतारा",
        "ई-पीक पाहणी (E-Pik Pahani) नोंदणी दाखला",
        "विमा भरलेली ₹१ ची पावती (PMFBY Policy Slip)",
        "आधार कार्ड व आधार संलग्न बँक पासबुक झेरॉक्स",
        "क्रॉप इन्शुरन्स ॲपद्वारे काढलेले अक्षांश-रेखांशासह फोटो (Geotagged Photos)",
    ]

    return InsuranceClaimEstimateResult(
        crop=request.crop,
        district=request.district,
        area_hectares=request.area_hectares,
        total_sum_insured_inr=total_sum_insured,
        farmer_token_premium_inr=farmer_premium,
        state_subsidy_borne_inr=govt_subsidy,
        estimated_claim_payout_inr=payout,
        intimation_deadline_warning=warning_en,
        intimation_deadline_warning_mr=warning_mr,
        action_checklist=checklist,
        toll_free_helpline="14447",
        required_documents=docs_en,
        required_documents_mr=docs_mr,
        official_portal_url="https://pmfby.gov.in",
        provenance=Provenance.ESTIMATED,
        source_citation="Pradhan Mantri Fasal Bima Yojana (PMFBY) Guidelines & Govt of Maharashtra ₹1 Scheme Resolution"
    )
