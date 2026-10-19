"""Problem-statement mapping engine (Phase One).

IMPORTANT: this is a transparent keyword classifier, NOT an ML model. Every result is a
suggestion with needs_human_review=True. Coverage is computed from the explicit
CAPABILITIES registry below, never from classification alone.
"""
from enum import Enum

from pydantic import BaseModel, Field


class Coverage(str, Enum):
    NOT_IMPLEMENTED = "NOT IMPLEMENTED"
    PARTIALLY_IMPLEMENTED = "PARTIALLY IMPLEMENTED"
    IMPLEMENTED = "IMPLEMENTED"
    TESTED = "TESTED"
    FIELD_VALIDATED = "FIELD-VALIDATED"


# Honest status of each module. Update ONLY when evidence (code + tests) exists.
CAPABILITIES: dict[str, Coverage] = {
    "A_farm_management": Coverage.PARTIALLY_IMPLEMENTED,  # farmers/farms/soil-test records, no auth yet
    "B_crop_recommendation": Coverage.NOT_IMPLEMENTED,
    "C_soil_health": Coverage.PARTIALLY_IMPLEMENTED,      # record keeping only, no interpretation
    "D_disease_pest": Coverage.NOT_IMPLEMENTED,
    "E_weather": Coverage.NOT_IMPLEMENTED,
    "F_irrigation": Coverage.NOT_IMPLEMENTED,
    "G_fertilizer": Coverage.NOT_IMPLEMENTED,
    "H_yield": Coverage.NOT_IMPLEMENTED,
    "I_market": Coverage.NOT_IMPLEMENTED,
    "J_finance": Coverage.NOT_IMPLEMENTED,
    "K_schemes": Coverage.NOT_IMPLEMENTED,
    "L_insurance": Coverage.NOT_IMPLEMENTED,
    "M_remote_sensing": Coverage.NOT_IMPLEMENTED,
    "N_postharvest": Coverage.NOT_IMPLEMENTED,
    "O_equipment": Coverage.NOT_IMPLEMENTED,
    "P_livestock": Coverage.NOT_IMPLEMENTED,
    "Q_assistant": Coverage.NOT_IMPLEMENTED,
    "R_community": Coverage.NOT_IMPLEMENTED,
    "S_offline": Coverage.NOT_IMPLEMENTED,
    "T_analytics": Coverage.NOT_IMPLEMENTED,
    "X_mapping_engine": Coverage.PARTIALLY_IMPLEMENTED,
}

# domain -> (keywords, modules). Starting vocabulary; expand from research/agricultural_problem_taxonomy.md
TAXONOMY: dict[str, tuple[list[str], list[str]]] = {
    "crop_production": (["crop recommendation", "crop selection", "sowing", "cropping"], ["B_crop_recommendation", "A_farm_management"]),
    "soil_health": (["soil", "ph", "nutrient", "organic carbon"], ["C_soil_health", "G_fertilizer"]),
    "water_management": (["irrigation", "water", "drip", "moisture"], ["F_irrigation", "E_weather"]),
    "disease_pest": (["disease", "pest", "leaf", "infection", "insect"], ["D_disease_pest"]),
    "weather_climate": (["weather", "rainfall", "forecast", "drought", "climate"], ["E_weather"]),
    "market_supply_chain": (["market", "price", "mandi", "supply chain", "storage", "cold chain"], ["I_market", "N_postharvest"]),
    "finance_insurance": (["insurance", "loan", "credit", "pmfby", "income"], ["L_insurance", "J_finance"]),
    "schemes": (["scheme", "subsidy", "government", "eligibility"], ["K_schemes"]),
    "remote_sensing": (["satellite", "drone", "ndvi", "remote sensing"], ["M_remote_sensing"]),
    "yield": (["yield", "production forecast"], ["H_yield"]),
    "livestock": (["livestock", "dairy", "cattle", "fish", "poultry"], ["P_livestock"]),
    "mechanization": (["tractor", "machinery", "equipment"], ["O_equipment"]),
    "inclusion_language": (["language", "voice", "marathi", "hindi", "offline", "low bandwidth"], ["Q_assistant", "S_offline"]),
}


class ProblemStatementIn(BaseModel):
    title: str = Field(min_length=3)
    description: str = ""
    source_organization: str | None = None
    competition: str | None = None
    year: int | None = None
    official_problem_id: str | None = None
    evidence_sources: list[str] = []  # URLs; empty means UNVERIFIED


class MappingResult(BaseModel):
    title: str
    candidate_domains: list[str]
    relevant_modules: list[str]
    module_coverage: dict[str, Coverage]
    missing_capabilities: list[str]
    verification_status: str
    needs_human_review: bool = True
    notes: list[str]


def classify(ps: ProblemStatementIn) -> MappingResult:
    text = f"{ps.title} {ps.description}".lower()
    domains, modules = [], []
    for domain, (kws, mods) in TAXONOMY.items():
        if any(k in text for k in kws):
            domains.append(domain)
            modules.extend(m for m in mods if m not in modules)
    coverage = {m: CAPABILITIES[m] for m in modules}
    missing = [m for m, c in coverage.items() if c == Coverage.NOT_IMPLEMENTED]
    notes = ["Keyword-based suggestion only. A human must confirm domain and modules."]
    if not domains:
        notes.append("No domain matched; extend the taxonomy or classify manually.")
    verified = "VERIFIED" if ps.evidence_sources else "UNVERIFIED (no source URL supplied)"
    return MappingResult(
        title=ps.title, candidate_domains=domains, relevant_modules=modules,
        module_coverage=coverage, missing_capabilities=missing,
        verification_status=verified, notes=notes,
    )
