"""Every data value shown to a user must carry one of these labels (spec principle #5).

Rules:
- LIVE: Fetched directly from verified upstream endpoints within valid TTL.
- HISTORICAL: Only for data fetched from an official dataset with a date.
- CURATED_REFERENCE: Hand-entered from a cited source, may be outdated.
- ESTIMATED: Deterministically computed by mathematical algorithms.
- SIMULATED: Synthetic/mock data for demonstration only; requires DEMO_MODE=true.
- USER_PROVIDED: Input directly by the cultivator.
- UNAVAILABLE: Declared when upstream sources are unreachable or records are absent.
"""
from enum import Enum


class Provenance(str, Enum):
    LIVE = "LIVE"
    HISTORICAL = "HISTORICAL"
    CURATED_REFERENCE = "CURATED_REFERENCE"
    ESTIMATED = "ESTIMATED"
    SIMULATED = "SIMULATED"
    USER_PROVIDED = "USER_PROVIDED"
    UNAVAILABLE = "UNAVAILABLE"
