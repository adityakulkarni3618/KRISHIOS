from app.core.provenance import Provenance
from app.modules.calculator.economics import EconomicsInput, calculate_farm_economics


def test_hand_calculated_soybean_economics():
    """
    Hand-calculated verification:
    Crop: Soybean, Area: 2.0 ha
    Inputs:
      seed: 6,000, fert: 8,000, pest: 3,000, labor: 12,000,
      machinery: 7,000, irrigation: 4,000, other: 2,000
      Total cost = 42,000
      Cost/ha = 42,000 / 2.0 = 21,000.00
      Yield: 25.0 q/ha -> Total yield = 50.0 q
      Price: 4,500 INR/q
      Gross Revenue = 50.0 * 4,500 = 225,000.00
      Net Profit = 225,000 - 42,000 = 183,000.00
      Profit/ha = 183,000 / 2.0 = 91,500.00
      Break-even price = 42,000 / 50.0 = 840.00 INR/q
      Break-even yield/ha = (42,000 / 4,500) / 2.0 = 4.67 q/ha
      ROI = (183,000 / 42,000) * 100 = 435.71%
    """
    inp = EconomicsInput(
        crop_name="Soybean",
        area_hectares=2.0,
        seed_cost=6000.0,
        fertilizer_cost=8000.0,
        pesticide_cost=3000.0,
        labor_cost=12000.0,
        machinery_cost=7000.0,
        irrigation_cost=4000.0,
        other_cost=2000.0,
        expected_yield_per_hectare=25.0,
        expected_price_per_quintal=4500.0,
    )

    res = calculate_farm_economics(inp)

    assert res.total_cost == 42000.0
    assert res.cost_per_hectare == 21000.0
    assert res.total_yield_quintals == 50.0
    assert res.gross_revenue == 225000.0
    assert res.net_profit == 183000.0
    assert res.profit_per_hectare == 91500.0
    assert res.break_even_price_per_quintal == 840.0
    assert res.break_even_yield_per_hectare == 4.67
    assert res.roi_percentage == 435.71
    assert res.provenance == Provenance.ESTIMATED
    assert "ESTIMATED" in res.disclaimer

    # Verify sensitivity table: 5 price levels x 5 yield levels = 25 cells
    assert len(res.sensitivity_table) == 25
    base_cell = next(c for c in res.sensitivity_table if c.price_change_pct == 0 and c.yield_change_pct == 0)
    assert base_cell.net_profit == 183000.0

    # Downside stress test: -20% price and -20% yield
    # Price = 4500 * 0.8 = 3600; Yield = 50 * 0.8 = 40; Rev = 144,000; Profit = 144,000 - 42,000 = 102,000
    down_cell = next(c for c in res.sensitivity_table if c.price_change_pct == -20 and c.yield_change_pct == -20)
    assert down_cell.test_price_per_quintal == 3600.0
    assert down_cell.test_yield_quintals == 40.0
    assert down_cell.net_profit == 102000.0


def test_calculator_api_endpoint(client):
    body = {
        "crop_name": "Cotton",
        "area_hectares": 1.0,
        "seed_cost": 4000.0,
        "fertilizer_cost": 6000.0,
        "pesticide_cost": 4000.0,
        "labor_cost": 10000.0,
        "machinery_cost": 3000.0,
        "irrigation_cost": 2000.0,
        "other_cost": 1000.0,
        "expected_yield_per_hectare": 15.0,
        "expected_price_per_quintal": 7500.0,
    }
    r = client.post("/calculator/economics", json=body)
    assert r.status_code == 200
    data = r.json()
    assert data["crop_name"] == "Cotton"
    assert data["total_cost"] == 30000.0
    assert data["gross_revenue"] == 112500.0
    assert data["net_profit"] == 82500.0
    assert data["provenance"] == "ESTIMATED"
    assert len(data["sensitivity_table"]) == 25
