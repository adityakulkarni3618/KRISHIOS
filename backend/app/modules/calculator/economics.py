from pydantic import BaseModel, Field

from app.core.provenance import Provenance


class EconomicsInput(BaseModel):
    crop_name: str = Field(min_length=1, max_length=100)
    area_hectares: float = Field(gt=0, le=10000)
    seed_cost: float = Field(ge=0)
    fertilizer_cost: float = Field(ge=0)
    pesticide_cost: float = Field(default=0.0, ge=0)
    labor_cost: float = Field(ge=0)
    machinery_cost: float = Field(default=0.0, ge=0)
    irrigation_cost: float = Field(default=0.0, ge=0)
    other_cost: float = Field(default=0.0, ge=0)
    expected_yield_per_hectare: float = Field(gt=0, description="Yield in quintals per hectare")
    expected_price_per_quintal: float = Field(gt=0, description="Price in INR per quintal")


class SensitivityCell(BaseModel):
    price_change_pct: int
    yield_change_pct: int
    test_price_per_quintal: float
    test_yield_quintals: float
    net_profit: float
    roi_percentage: float


class EconomicsResult(BaseModel):
    crop_name: str
    area_hectares: float
    total_cost: float
    cost_per_hectare: float
    total_yield_quintals: float
    gross_revenue: float
    net_profit: float
    profit_per_hectare: float
    break_even_price_per_quintal: float
    break_even_yield_per_hectare: float
    roi_percentage: float
    sensitivity_table: list[SensitivityCell]
    provenance: Provenance
    disclaimer: str
    formulas_used: dict[str, str]


def calculate_farm_economics(inp: EconomicsInput) -> EconomicsResult:
    """Pure mathematical calculation of crop economics, break-even thresholds, and sensitivity matrix."""
    total_cost = (
        inp.seed_cost
        + inp.fertilizer_cost
        + inp.pesticide_cost
        + inp.labor_cost
        + inp.machinery_cost
        + inp.irrigation_cost
        + inp.other_cost
    )
    cost_per_hectare = round(total_cost / inp.area_hectares, 2)
    total_yield = round(inp.expected_yield_per_hectare * inp.area_hectares, 2)
    gross_revenue = round(total_yield * inp.expected_price_per_quintal, 2)
    net_profit = round(gross_revenue - total_cost, 2)
    profit_per_hectare = round(net_profit / inp.area_hectares, 2)

    # Break-even calculations
    be_price = round(total_cost / total_yield, 2) if total_yield > 0 else 0.0
    be_yield_total = total_cost / inp.expected_price_per_quintal if inp.expected_price_per_quintal > 0 else 0.0
    be_yield_per_ha = round(be_yield_total / inp.area_hectares, 2)

    roi = round((net_profit / total_cost) * 100, 2) if total_cost > 0 else 0.0

    # Sensitivity matrix: -20%, -10%, 0%, +10%, +20%
    price_deltas = [-20, -10, 0, 10, 20]
    yield_deltas = [-20, -10, 0, 10, 20]
    table: list[SensitivityCell] = []

    for p_pct in price_deltas:
        p_factor = 1.0 + (p_pct / 100.0)
        p_tested = round(inp.expected_price_per_quintal * p_factor, 2)

        for y_pct in yield_deltas:
            y_factor = 1.0 + (y_pct / 100.0)
            y_tested = round(total_yield * y_factor, 2)
            rev_tested = round(p_tested * y_tested, 2)
            profit_tested = round(rev_tested - total_cost, 2)
            roi_tested = round((profit_tested / total_cost) * 100, 2) if total_cost > 0 else 0.0

            table.append(
                SensitivityCell(
                    price_change_pct=p_pct,
                    yield_change_pct=y_pct,
                    test_price_per_quintal=p_tested,
                    test_yield_quintals=y_tested,
                    net_profit=profit_tested,
                    roi_percentage=roi_tested,
                )
            )

    return EconomicsResult(
        crop_name=inp.crop_name,
        area_hectares=inp.area_hectares,
        total_cost=round(total_cost, 2),
        cost_per_hectare=cost_per_hectare,
        total_yield_quintals=total_yield,
        gross_revenue=gross_revenue,
        net_profit=net_profit,
        profit_per_hectare=profit_per_hectare,
        break_even_price_per_quintal=be_price,
        break_even_yield_per_hectare=be_yield_per_ha,
        roi_percentage=roi,
        sensitivity_table=table,
        provenance=Provenance.ESTIMATED,
        disclaimer=(
            "ESTIMATED: Calculations are mathematical projections based strictly on user-provided costs "
            "and yield assumptions. Actual farm profitability depends on seasonal climate conditions, "
            "market price volatility, and pest incidence. No financial guarantee is implied."
        ),
        formulas_used={
            "total_cost": "Sum of operational input costs (seeds, fertilizer, labor, machinery, irrigation, other)",
            "break_even_price": "Total Cost / Total Expected Yield",
            "break_even_yield_per_ha": "(Total Cost / Expected Price per Quintal) / Area (ha)",
            "roi": "((Gross Revenue - Total Cost) / Total Cost) * 100",
        },
    )
