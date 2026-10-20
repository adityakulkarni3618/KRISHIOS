from fastapi import APIRouter, Query

from app.modules.market.adapter import MarketQueryResponse, market_service

router = APIRouter(prefix="/market", tags=["market-prices"])


@router.get("/prices", response_model=MarketQueryResponse)
def get_market_prices(
    commodity: str | None = Query(default=None, description="Crop name, e.g. Onion, Soybean, Cotton"),
    district: str | None = Query(default=None, description="Maharashtra district, e.g. Nashik, Pune"),
    market: str | None = Query(default=None, description="APMC market name, e.g. Lasalgaon, Narayangaon"),
):
    return market_service.query_prices(commodity=commodity, district=district, market=market)


@router.get("/commodities")
def list_commodities():
    return {"commodities": market_service.get_available_commodities()}


@router.get("/districts")
def list_districts():
    return {"districts": market_service.get_available_districts()}
