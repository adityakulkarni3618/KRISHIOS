"""Farm Labor (Krishi Majur) Matching & Daily Wage Board.

Connects farm labor gangs (Toli / मुकादम) with cultivators during critical windows:
- Cotton picking (कापूस वेचणी)
- Soybean harvesting & threshing (सोयाबीन काढणी व मळणी)
- Onion nursery transplanting (कांदा पुनर्लागवड)
- Sugarcane cutting (ऊस तोडणी)
Publishes official and prevailing taluka daily wage rates to prevent exploitation.
"""
from typing import Dict, List, Optional
from pydantic import BaseModel, Field

from app.core.provenance import Provenance


class LaborWageBenchmark(BaseModel):
    operation_type: str
    operation_type_mr: str
    daily_wage_standard_inr: float
    piece_rate_rate: str
    piece_rate_rate_mr: str
    season: str
    hours_per_day: int = 8
    source_url: Optional[str] = None
    last_verified: Optional[str] = None
    reviewed_by: str = "UNREVIEWED"
    provenance: Provenance = Provenance.CURATED_REFERENCE


class LaborGroup(BaseModel):
    id: str
    leader_name: str
    group_size: int
    taluka: str
    district: str
    contact_phone: str
    specialization: str
    specialization_mr: str
    available_now: bool = True
    verified_identity: bool = True


class LaborHubResult(BaseModel):
    district: str
    prevailing_wages: List[LaborWageBenchmark]
    available_labor_groups: List[LaborGroup]
    guidelines_for_employers: List[str]
    guidelines_for_employers_mr: List[str]
    source_url: Optional[str] = None
    last_verified: Optional[str] = None
    reviewed_by: str = "UNREVIEWED"
    provenance: Provenance = Provenance.CURATED_REFERENCE
    source_citation: str


WAGE_BENCHMARKS = [
    LaborWageBenchmark(
        operation_type="General Field Weeding & Interculture (खुरपणी)",
        operation_type_mr="खुरपणी व आंतरमशागत",
        daily_wage_standard_inr=350.0,
        piece_rate_rate="₹350 / Day (8 hours)",
        piece_rate_rate_mr="₹३५० प्रति दिवस (८ तास)",
        season="Kharif (July - August)",
    ),
    LaborWageBenchmark(
        operation_type="Cotton Picking (कापूस वेचणी)",
        operation_type_mr="कापूस वेचणी",
        daily_wage_standard_inr=400.0,
        piece_rate_rate="₹10 to ₹12 per kg seed cotton picked",
        piece_rate_rate_mr="₹१० ते ₹१२ प्रति किलो वेचलेला कापूस",
        season="Kharif/Rabi (October - January)",
    ),
    LaborWageBenchmark(
        operation_type="Soybean Cutting & Bagging (सोयाबीन काढणी)",
        operation_type_mr="सोयाबीन सोंगणी व ढीग लावणे",
        daily_wage_standard_inr=450.0,
        piece_rate_rate="₹3,200 to ₹3,800 per acre contract (उखता / गुत्तेदारी)",
        piece_rate_rate_mr="₹३,२०० ते ₹३,८०० प्रति एकर उखता",
        season="Kharif (October)",
    ),
    LaborWageBenchmark(
        operation_type="Onion Seedling Transplanting (कांदा पुनर्लागवड)",
        operation_type_mr="कांदा पुनर्लागवड",
        daily_wage_standard_inr=380.0,
        piece_rate_rate="₹4,000 to ₹4,500 per acre contract",
        piece_rate_rate_mr="₹४,००० ते ₹४,५०० प्रति एकर",
        season="Late Kharif / Rabi (August & November)",
    ),
]

LABOR_GROUPS = [
    LaborGroup(
        id="lg_01",
        leader_name="Sanjay Shinde (मुकादम)",
        group_size=16,
        taluka="Niphad",
        district="Nashik",
        contact_phone="9823114590",
        specialization="Soybean & Onion Harvesting Group",
        specialization_mr="सोयाबीन काढणी व कांदा लागवड कुशल टोळी",
        available_now=True,
    ),
    LaborGroup(
        id="lg_02",
        leader_name="Rukminibai Gaikwad (महिला गट)",
        group_size=12,
        taluka="Dindori",
        district="Nashik",
        contact_phone="9422789123",
        specialization="Weeding, Cotton Picking & Vineyard Tying",
        specialization_mr="खुरपणी, कापूस वेचणी व द्राक्ष बाग कामे",
        available_now=True,
    ),
    LaborGroup(
        id="lg_03",
        leader_name="Bapu Jadhav",
        group_size=20,
        taluka="Baramati",
        district="Pune",
        contact_phone="9860451278",
        specialization="Sugarcane & Fodder Harvest Crew",
        specialization_mr="ऊस तोडणी व चारा व्यवस्थापन टोळी",
        available_now=True,
    ),
]


def get_labor_hub_data(district: str) -> LaborHubResult:
    return LaborHubResult(
        district=district,
        prevailing_wages=WAGE_BENCHMARKS,
        available_labor_groups=LABOR_GROUPS,
        guidelines_for_employers=[
            "Provide clean drinking water and shade rest intervals during high summer noon.",
            "Agree upon piece-rate (per kg or per acre) before starting field operation to prevent wage dispute.",
            "Adhere to Government of Maharashtra Minimum Wages Act norms for agricultural workers."
        ],
        guidelines_for_employers_mr=[
            "मजुरांना शेतात स्वच्छ पिण्याचे पाणी व उन्हात विश्रांतीसाठी सावली उपलब्ध ठेवा.",
            "वाद टाळण्यासाठी काम सुरू करण्यापूर्वीच रोजंदारी अथवा उखत्याचे दर (प्रति किलो/प्रति एकर) निश्चित करा.",
            "महाराष्ट्र शासन कृषी मजूर किमान वेतन मानकांचे पालन करावे."
        ],
        provenance=Provenance.HISTORICAL,
        source_citation="Department of Labour, Govt. of Maharashtra Agricultural Minimum Wage Guidelines"
    )
