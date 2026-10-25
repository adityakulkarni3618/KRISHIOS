"""System-wide Data Source & Provenance Registry Router.

Exposes an audit of every AgriNexus module, data origin, provenance label,
verification status, source URL, and reviewer assignment as required by
the platform's radical honesty and traceability standards.
"""
from typing import List, Optional
from fastapi import APIRouter
from pydantic import BaseModel

from app.core.provenance import Provenance

router = APIRouter(tags=["data-registry"])


class DataRegistryItem(BaseModel):
    module_id: str
    module_name: str
    route_prefix: str
    data_origin: str  # LIVE_HTTP, CURATED_REFERENCE, COMPUTED_FORMULA, SIMULATED, USER_PROVIDED
    provenance: Provenance
    source_url: Optional[str] = None
    last_verified: Optional[str] = None
    reviewer_status: str
    description: str


class DataRegistryResponse(BaseModel):
    total_modules: int
    modules: List[DataRegistryItem]
    last_audited: str
    audit_policy: str


REGISTRY_CATALOG: List[DataRegistryItem] = [
    DataRegistryItem(
        module_id="weather",
        module_name="Live Hyperlocal Weather",
        route_prefix="/weather",
        data_origin="LIVE_HTTP",
        provenance=Provenance.LIVE,
        source_url="https://open-meteo.com/",
        last_verified="2026-10-20",
        reviewer_status="Reviewed by Engineering & Open-Meteo CC BY 4.0",
        description="Live Open-Meteo API with in-memory TTL caching and UNAVAILABLE fallback.",
    ),
    DataRegistryItem(
        module_id="market",
        module_name="APMC Mandi Price Board",
        route_prefix="/market",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url="https://agmarknet.gov.in/",
        last_verified="2026-10-19",
        reviewer_status="Agricultural Domain Team",
        description="Sample daily modal prices for Maharashtra agricultural produce.",
    ),
    DataRegistryItem(
        module_id="forecasting",
        module_name="Mandi Price Forecast Scenario",
        route_prefix="/market/forecast",
        data_origin="SIMULATED",
        provenance=Provenance.SIMULATED,
        source_url=None,
        last_verified="2026-10-20",
        reviewer_status="Demo Simulation Engine",
        description="Illustrative heuristic scenario model gated behind DEMO_MODE.",
    ),
    DataRegistryItem(
        module_id="schemes",
        module_name="Government Schemes Catalog",
        route_prefix="/schemes",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url="https://myscheme.gov.in/",
        last_verified="2026-10-20",
        reviewer_status="Agricultural Domain Team",
        description="Central and Maharashtra state agriculture welfare schemes database.",
    ),
    DataRegistryItem(
        module_id="disease",
        module_name="Crop Symptom Guide",
        route_prefix="/disease",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url="https://kvk.icar.gov.in/",
        last_verified="2026-10-20",
        reviewer_status="Agricultural Domain Team",
        description="Keyword-matched ICAR/KVK symptom identification guide (not clinical diagnosis).",
    ),
    DataRegistryItem(
        module_id="crops",
        module_name="Crop Suitability Advisor",
        route_prefix="/crops",
        data_origin="COMPUTED_FORMULA",
        provenance=Provenance.ESTIMATED,
        source_url="https://icar.org.in/",
        last_verified="2026-10-20",
        reviewer_status="Agricultural Domain Team",
        description="Deterministic agro-climatic scoring based on soil type and water availability.",
    ),
    DataRegistryItem(
        module_id="fertilizer",
        module_name="Fertilizer RDF Calculator",
        route_prefix="/fertilizer",
        data_origin="COMPUTED_FORMULA",
        provenance=Provenance.ESTIMATED,
        source_url="https://soilhealth.dac.gov.in/",
        last_verified="2026-10-20",
        reviewer_status="Agricultural Domain Team",
        description="ICAR state recommended dose of fertilizer balance equations.",
    ),
    DataRegistryItem(
        module_id="calculator",
        module_name="Crop Cost & Profit Calculator",
        route_prefix="/calculator",
        data_origin="COMPUTED_FORMULA",
        provenance=Provenance.ESTIMATED,
        source_url=None,
        last_verified="2026-10-20",
        reviewer_status="Agricultural Domain Team",
        description="Farmer economic breakdown computed from user parameters and input benchmarks.",
    ),
    DataRegistryItem(
        module_id="soil",
        module_name="Soil Health Card Interpreter",
        route_prefix="/soil",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url="https://soilhealth.dac.gov.in/",
        last_verified="2026-10-20",
        reviewer_status="Agricultural Domain Team",
        description="Official ICAR nutrient threshold rules for macronutrient and pH interpretation.",
    ),
    DataRegistryItem(
        module_id="insurance",
        module_name="PMFBY Premium Calculator",
        route_prefix="/insurance",
        data_origin="COMPUTED_FORMULA",
        provenance=Provenance.ESTIMATED,
        source_url="https://pmfby.gov.in/",
        last_verified="2026-10-20",
        reviewer_status="Agricultural Domain Team",
        description="Statutory 2% Kharif / 1.5% Rabi / ₹1 Maharashtra farmer premium computation.",
    ),
    DataRegistryItem(
        module_id="equipment",
        module_name="Custom Hiring Center (CHC)",
        route_prefix="/equipment",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url="https://agrimachinery.nic.in/",
        last_verified="2026-10-20",
        reviewer_status="Agricultural Domain Team",
        description="Standardized hourly rental rates for tractors, harvesters, and implements.",
    ),
    DataRegistryItem(
        module_id="livestock",
        module_name="Dairy Livestock & Vaccination",
        route_prefix="/livestock",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url="https://www.nddb.coop/",
        last_verified="2026-10-20",
        reviewer_status="Agricultural Domain Team",
        description="NDDB FMD/HS/BQ vaccination schedule and dry matter feeding formula.",
    ),
    DataRegistryItem(
        module_id="remote_sensing",
        module_name="Satellite NDVI Simulation",
        route_prefix="/remote-sensing",
        data_origin="SIMULATED",
        provenance=Provenance.SIMULATED,
        source_url=None,
        last_verified="2026-10-20",
        reviewer_status="Demo Simulation Engine",
        description="Synthetic sinusoidal canopy vegetation model gated behind DEMO_MODE.",
    ),
    DataRegistryItem(
        module_id="warehouses",
        module_name="WDRA Warehouse & Pledge Loan",
        route_prefix="/postharvest",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url="https://www.mswarehousing.com/",
        last_verified="2026-10-18",
        reviewer_status="Agricultural Domain Team",
        description="Maharashtra State Warehousing Corp godowns and 75% e-NWR loan calculator.",
    ),
    DataRegistryItem(
        module_id="assistant",
        module_name="Krishi FAQ & KVK Directory",
        route_prefix="/assistant",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url="https://kvk.icar.gov.in/",
        last_verified="2026-10-20",
        reviewer_status="Agricultural Domain Team",
        description="Deterministic keyword FAQ with direct fallbacks to official KVK helplines.",
    ),
    DataRegistryItem(
        module_id="electricity",
        module_name="MSEDCL Feeder Electricity Schedule",
        route_prefix="/rural-ops/electricity",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url="https://www.mahadiscom.in/",
        last_verified="2026-10-15",
        reviewer_status="UNREVIEWED",
        description="Sample 8-hour agricultural rotational shift roster for Maharashtra feeders.",
    ),
    DataRegistryItem(
        module_id="emergency_sos",
        module_name="Emergency First Aid & Hospital Directory",
        route_prefix="/rural-ops/emergency",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url="https://arogya.maharashtra.gov.in/",
        last_verified="2026-10-20",
        reviewer_status="Medical & Emergency Protocol Reviewer",
        description="Immediate 108 protocol, non-invasive first aid, and sample hospital directory.",
    ),
    DataRegistryItem(
        module_id="diy_bio",
        module_name="DIY Bio-Fertilizer Recipes",
        route_prefix="/rural-ops/bio-recipes",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url="https://ncof.dacnet.nic.in/",
        last_verified="2026-10-20",
        reviewer_status="Agricultural Domain Team",
        description="Zero-Budget Natural Farming formulations (Jeevamrut, Beejamrut, Dashaparni).",
    ),
    DataRegistryItem(
        module_id="labor_hub",
        module_name="Labor Wage Benchmarks & Gangs",
        route_prefix="/operations/labor",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url=None,
        last_verified=None,
        reviewer_status="UNREVIEWED",
        description="Sample daily farm labor wage rates and contactable harvesting toli mukadams.",
    ),
    DataRegistryItem(
        module_id="input_verification",
        module_name="Seed Lot Format Checker",
        route_prefix="/operations/verify-seed",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url="https://seednet.gov.in/",
        last_verified="2026-10-20",
        reviewer_status="Agricultural Domain Team",
        description="Syntax format checker for Indian seed lots (format check only, not authenticity).",
    ),
    DataRegistryItem(
        module_id="groundwater",
        module_name="Groundwater Aquifer Advisory",
        route_prefix="/operations/groundwater",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url="https://gsda.maharashtra.gov.in/",
        last_verified="2026-10-20",
        reviewer_status="Agricultural Domain Team",
        description="GSDA basalt watershed recharge zones and borewell spacing advisories.",
    ),
    DataRegistryItem(
        module_id="kisan_bazaar",
        module_name="Kisan Direct Bazaar",
        route_prefix="/market-linkage/bazaar",
        data_origin="SIMULATED",
        provenance=Provenance.SIMULATED,
        source_url=None,
        last_verified="2026-10-20",
        reviewer_status="Demo Simulation Engine",
        description="Simulated community marketplace for direct farm-to-buyer listings.",
    ),
    DataRegistryItem(
        module_id="food_processing",
        module_name="PMFME Agro-Processing Profiles",
        route_prefix="/market-linkage/processing",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url="https://pmfme.mofpi.gov.in/",
        last_verified="2026-10-20",
        reviewer_status="Ministry of Food Processing Industries (PMFME Guidelines)",
        description="35% capital subsidy feasibility profiles for mini dal mill and oil ghani.",
    ),
    DataRegistryItem(
        module_id="kcc_loan",
        module_name="KCC Loan Dossier Generator",
        route_prefix="/institutional/kcc",
        data_origin="COMPUTED_FORMULA",
        provenance=Provenance.ESTIMATED,
        source_url="https://www.myscheme.gov.in/schemes/kcc",
        last_verified="2026-10-20",
        reviewer_status="UNREVIEWED",
        description="DLTC per-acre scale of finance credit calculations and 0% interest subvention.",
    ),
    DataRegistryItem(
        module_id="kisan_nyay",
        module_name="Kisan Nyay Legal Guidance",
        route_prefix="/institutional/nyay",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url="https://revenue.maharashtra.gov.in/",
        last_verified="2026-10-20",
        reviewer_status="Agricultural Domain Team",
        description="MLRC Sec 143 right-of-way farm access and seed defect legal procedures.",
    ),
    DataRegistryItem(
        module_id="omnichannel",
        module_name="Omnichannel IVR & SMS Gateway",
        route_prefix="/institutional/omnichannel",
        data_origin="SIMULATED",
        provenance=Provenance.SIMULATED,
        source_url=None,
        last_verified="2026-10-20",
        reviewer_status="Demo Simulation Engine",
        description="Simulated interactive voice response (IVR) and SMS alert dispatcher.",
    ),
    DataRegistryItem(
        module_id="mapping",
        module_name="Problem Statement Capability Mapping",
        route_prefix="/mapping",
        data_origin="CURATED_REFERENCE",
        provenance=Provenance.CURATED_REFERENCE,
        source_url="https://smartindiahackathon.gov.in/",
        last_verified="2026-10-20",
        reviewer_status="Engineering Team",
        description="Deterministic keyword classifier mapping agri problem statements to platform capabilities.",
    ),
]


@router.get("/data-registry", response_model=DataRegistryResponse)
def get_data_registry():
    """Returns a full inventory of AgriNexus data sources, origins, provenance labels, and audit status."""
    return DataRegistryResponse(
        total_modules=len(REGISTRY_CATALOG),
        modules=REGISTRY_CATALOG,
        last_audited="2026-10-20",
        audit_policy="Every dataset must have an origin, honest provenance label, and reviewer assignment.",
    )
