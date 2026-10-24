"""Post-Harvest & Cold Storage Locator with WDRA e-NWR Financing Engine.

Integrates Maharashtra State Warehousing Corporation (MSWC), Central Warehousing Corporation (CWC),
and Warehousing Development and Regulatory Authority (WDRA) pledge financing norms.
Protects smallholders from distress sales through electronic Negotiable Warehouse Receipts (e-NWR).
"""
from typing import List, Optional
from pydantic import BaseModel, Field

from app.core.provenance import Provenance


class WarehouseFacility(BaseModel):
    id: str
    name: str
    name_mr: str
    district: str
    taluka: str
    agency: str  # MSWC, CWC, Private WDRA
    total_capacity_mt: int
    cold_storage_available: bool
    wdra_registered: bool
    wdra_reg_number: str
    storage_charge_per_qtl_month_inr: float
    manager_name: str
    contact_phone: str
    distance_km: float


class PledgeLoanEstimateRequest(BaseModel):
    commodity: str
    quantity_quintals: float = Field(..., gt=0.0)
    current_modal_price_per_qtl: float = Field(..., gt=0.0)
    planned_storage_months: int = Field(default=3, ge=1, le=12)


class PledgeLoanEstimateResult(BaseModel):
    commodity: str
    quantity_quintals: float
    total_crop_value_inr: float
    max_pledge_loan_eligible_inr: float  # Up to 75% under RBI Agri Priority Sector norms
    interest_rate_pct_annual: float     # Subvented ~7.0% p.a.
    monthly_interest_cost_inr: float
    warehouse_storage_cost_inr: float
    total_carrying_cost_inr: float
    projected_post_harvest_price_inr: float
    net_economic_gain_by_holding_inr: float
    advice_summary: str
    advice_summary_mr: str
    provenance: Provenance = Provenance.ESTIMATED
    source_citation: str


MAHARASHTRA_WAREHOUSE_DIRECTORY = [
    WarehouseFacility(
        id="mswc_nashik",
        name="Maharashtra State Warehousing Corp (MSWC), Ambad",
        name_mr="महाराष्ट्र राज्य वखार महामंडळ (MSWC), अंबड, नाशिक",
        district="Nashik",
        taluka="Nashik City",
        agency="MSWC",
        total_capacity_mt=18500,
        cold_storage_available=True,
        wdra_registered=True,
        wdra_reg_number="WDRA/MH/2021/0458",
        storage_charge_per_qtl_month_inr=18.5,
        manager_name="Sunil Deshmukh",
        contact_phone="0253-2384910",
        distance_km=4.8,
    ),
    WarehouseFacility(
        id="cwc_lasalgaon",
        name="Central Warehousing Corp (CWC), Lasalgaon Mega Onion Complex",
        name_mr="केंद्रीय वखार महामंडळ (CWC), लासलगाव कांदा संकुल",
        district="Nashik",
        taluka="Niphad",
        agency="CWC",
        total_capacity_mt=35000,
        cold_storage_available=True,
        wdra_registered=True,
        wdra_reg_number="WDRA/MH/2019/0112",
        storage_charge_per_qtl_month_inr=22.0,
        manager_name="P. K. Sharma",
        contact_phone="02550-266341",
        distance_km=38.0,
    ),
    WarehouseFacility(
        id="mswc_latur",
        name="MSWC Regional Warehouse & Soybean Terminal, Latur",
        name_mr="महाराष्ट्र राज्य वखार महामंडळ, लातूर सोयाबीन केंद्र",
        district="Latur",
        taluka="Latur",
        agency="MSWC",
        total_capacity_mt=28000,
        cold_storage_available=False,
        wdra_registered=True,
        wdra_reg_number="WDRA/MH/2020/0890",
        storage_charge_per_qtl_month_inr=16.0,
        manager_name="Anand Kadam",
        contact_phone="02382-245120",
        distance_km=3.2,
    ),
    WarehouseFacility(
        id="mswc_pune_hadapsar",
        name="MSWC Godown Hub, Hadapsar, Pune",
        name_mr="महाराष्ट्र राज्य वखार महामंडळ गोदाम, हडपसर, पुणे",
        district="Pune",
        taluka="Haveli",
        agency="MSWC",
        total_capacity_mt=22000,
        cold_storage_available=True,
        wdra_registered=True,
        wdra_reg_number="WDRA/MH/2018/0234",
        storage_charge_per_qtl_month_inr=20.0,
        manager_name="Mahesh Shinde",
        contact_phone="020-26871245",
        distance_km=8.5,
    ),
    WarehouseFacility(
        id="mswc_nagpur",
        name="MSWC Cotton & Grain Terminal, Butibori, Nagpur",
        name_mr="महाराष्ट्र राज्य वखार महामंडळ, बुटीबोरी, नागपूर",
        district="Nagpur",
        taluka="Nagpur Rural",
        agency="MSWC",
        total_capacity_mt=32000,
        cold_storage_available=False,
        wdra_registered=True,
        wdra_reg_number="WDRA/MH/2022/1045",
        storage_charge_per_qtl_month_inr=17.0,
        manager_name="Rajesh Gaikwad",
        contact_phone="0712-289012",
        distance_km=14.0,
    ),
]


def list_warehouses_by_district(district: Optional[str] = None) -> List[WarehouseFacility]:
    if not district:
        return MAHARASHTRA_WAREHOUSE_DIRECTORY
    matching = [w for w in MAHARASHTRA_WAREHOUSE_DIRECTORY if w.district.lower() == district.lower()]
    return matching if matching else MAHARASHTRA_WAREHOUSE_DIRECTORY


def calculate_pledge_loan(req: PledgeLoanEstimateRequest) -> PledgeLoanEstimateResult:
    total_val = round(req.quantity_quintals * req.current_modal_price_per_qtl, 2)
    # Up to 75% pledge loan under WDRA
    loan_eligible = round(total_val * 0.75, 2)

    annual_rate = 7.0  # 7% under agriculture interest subvention
    monthly_interest = round(loan_eligible * (annual_rate / 100.0) / 12.0, 2)
    total_interest = round(monthly_interest * req.planned_storage_months, 2)

    # Standard storage charge ~ ₹18/qtl/month
    storage_cost = round(req.quantity_quintals * 18.0 * req.planned_storage_months, 2)
    total_carrying = round(total_interest + storage_cost, 2)

    # Historical off-season price rally (typically +12% to +18% over 3 months)
    projected_price = round(req.current_modal_price_per_qtl * 1.15, 2)
    projected_future_val = round(req.quantity_quintals * projected_price, 2)
    net_gain = round((projected_future_val - total_val) - total_carrying, 2)

    rec_en = f"Pledge your produce via e-NWR to immediately unlock ₹{loan_eligible:,.0f} working capital at 7% interest while expecting a net gain of ₹{net_gain:,.0f} by selling in off-season."
    rec_mr = f"e-NWR वखार पावतीवर अवघ्या ७% व्याजाने ₹{loan_eligible:,.0f} त्वरित कर्ज मिळवा आणि हंगाम संपल्यावर विकून ₹{net_gain:,.0f} चा अतिरिक्त नफा कमवा."

    return PledgeLoanEstimateResult(
        commodity=req.commodity,
        quantity_quintals=req.quantity_quintals,
        total_crop_value_inr=total_val,
        max_pledge_loan_eligible_inr=loan_eligible,
        interest_rate_pct_annual=annual_rate,
        monthly_interest_cost_inr=monthly_interest,
        warehouse_storage_cost_inr=storage_cost,
        total_carrying_cost_inr=total_carrying,
        projected_post_harvest_price_inr=projected_price,
        net_economic_gain_by_holding_inr=net_gain,
        advice_summary=rec_en,
        advice_summary_mr=rec_mr,
        provenance=Provenance.ESTIMATED,
        source_citation="Warehousing Development and Regulatory Authority (WDRA) & RBI Priority Sector Lending Guidelines"
    )
