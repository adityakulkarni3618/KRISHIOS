from app.core.provenance import Provenance
from app.modules.market.adapter import MarketService


def test_market_query_by_commodity():
    svc = MarketService()
    res = svc.query_prices(commodity="Onion")
    assert res.total_records > 0
    assert res.provenance == Provenance.CURATED_REFERENCE
    assert res.as_of == "2026-10-19"
    assert any("sample, not live" in n.lower() for n in res.notes)
    for rec in res.records:
        assert "Onion" in rec.commodity
        assert rec.provenance == Provenance.CURATED_REFERENCE
        assert rec.as_of == "2026-10-19"
        assert rec.min_price > 0
        assert rec.modal_price >= rec.min_price
        assert rec.max_price >= rec.modal_price
        assert rec.market is not None
        assert rec.price_date is not None


def test_market_query_by_district():
    svc = MarketService()
    res = svc.query_prices(district="Nashik")
    assert res.total_records >= 2
    markets = [r.market for r in res.records]
    assert "Lasalgaon" in markets


def test_market_empty_query_returns_unavailable():
    svc = MarketService()
    res = svc.query_prices(commodity="NonExistentExoticCrop")
    assert res.total_records == 0
    assert res.provenance == Provenance.UNAVAILABLE
    assert len(res.notes) > 0


def test_market_deduplication():
    # Pass duplicate records to MarketService
    dupes = [
        {
            "id": "DUP-01",
            "commodity": "Onion",
            "district": "Pune",
            "market": "Pune",
            "variety": "Red",
            "min_price": 1000.0,
            "modal_price": 1500.0,
            "max_price": 2000.0,
            "price_date": "2026-10-19",
            "provenance": Provenance.CURATED_REFERENCE,
            "source": "MSAMB",
            "attribution": "MSAMB",
        },
        {
            "id": "DUP-01",
            "commodity": "Onion",
            "district": "Pune",
            "market": "Pune",
            "variety": "Red",
            "min_price": 1000.0,
            "modal_price": 1500.0,
            "max_price": 2000.0,
            "price_date": "2026-10-19",
            "provenance": Provenance.CURATED_REFERENCE,
            "source": "MSAMB",
            "attribution": "MSAMB",
        },
    ]
    svc = MarketService(records=dupes)
    res = svc.query_prices(commodity="Onion")
    assert res.total_records == 1
    assert len(res.records) == 1


def test_market_endpoints(client):
    r_prices = client.get("/market/prices?commodity=Soybean")
    assert r_prices.status_code == 200
    data = r_prices.json()
    assert data["total_records"] >= 1
    assert data["provenance"] == "CURATED_REFERENCE"
    assert data["as_of"] == "2026-10-19"

    r_comm = client.get("/market/commodities")
    assert r_comm.status_code == 200
    assert "Onion" in r_comm.json()["commodities"]

    r_dist = client.get("/market/districts")
    assert r_dist.status_code == 200
    assert "Nashik" in r_dist.json()["districts"]
