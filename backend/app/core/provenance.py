"""Every data value shown to a user must carry one of these labels (spec principle #5)."""
from enum import Enum


class Provenance(str, Enum):
    LIVE = "LIVE"
    HISTORICAL = "HISTORICAL"
    ESTIMATED = "ESTIMATED"
    SIMULATED = "SIMULATED"
    USER_PROVIDED = "USER_PROVIDED"
    UNAVAILABLE = "UNAVAILABLE"
