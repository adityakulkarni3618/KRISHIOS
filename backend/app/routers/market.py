from fastapi import APIRouter, Query

from app.modules.market.adapter import MarketQueryResponse, market_service
from app.modules.forecasting.mandi_forecast import HoldSellAdvice, compute_mandi_forecast

router = APIRouter(prefix="/market", tags=["market-prices"])


@router.get("/prices", response_model=MarketQueryResponse)
def get_market_prices(
    commodity: str | None = Query(default=None, description="Crop name, e.g. Onion, Soybean, Cotton"),
    district: str | None = Query(default=None, description="Maharashtra district, e.g. Nashik, Pune"),
    market: str | None = Query(default=None, description="APMC market name, e.g. Lasalgaon, Narayangaon"),
):
    return market_service.query_prices(commodity=commodity, district=district, market=market)


@router.get("/forecast", response_model=HoldSellAdvice)
def get_mandi_forecast(
    commodity: str = Query(default="Soybean", description="Crop name: Soybean, Cotton, Onion"),
    district: str = Query(default="Latur", description="District name"),
    market: str = Query(default="Latur APMC", description="APMC Mandi name"),
    quantity_quintals: int = Query(default=50, description="Farmer produce volume in quintals"),
    current_price: int = Query(default=0, description="Override today's price if known"),
):
    return compute_mandi_forecast(
        commodity=commodity,
        district=district,
        market=market,
        quantity_quintals=quantity_quintals,
        current_price=current_price
    )


@router.get("/commodities")
def list_commodities():
    return {"commodities": market_service.get_available_commodities()}


@router.get("/districts")
def list_districts():
    return {"districts": market_service.get_available_districts()}
