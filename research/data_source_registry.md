# Agricultural Data Source & Scheme Currency Registry

Last Updated: **25-Oct-2026**  
Status: Enforced data provenance and evidentiary integrity catalog.

---

## 1. Official Scheme Currency Audit (October 2026)

Conducted against official government gazettes, circulars, and departmental portals:

| Scheme / Parameter | Official Sponsoring Body | Verified Status | Current Ground Truth & Official Citation | Codebase Treatment |
|---|---|---|---|---|
| **PMFBY ₹1 Crop Insurance Premium** | Government of Maharashtra (Dept of Agriculture) / MoA&FW | **SCRAPPED (POLICY REVERSED)** | The ₹1 token crop insurance scheme initiated in 2023 was **officially scrapped** by the Maharashtra State Cabinet following CID and departmental audits uncovering nearly 5.9 lakh fraudulent/bogus applications. Maharashtra has reverted to **Standard PMFBY Guidelines** (`https://pmfby.gov.in/`), where farmers pay the standard actuarial beneficiary shares: **2.0% for Kharif crops**, **1.5% for Rabi crops**, and **up to 5.0% for commercial/horticultural crops**. | **UNREVIEWED** badge with visible notice: *"May be outdated — confirm current premium with your bank/KVK."* Token calculator retained with explicit disclaimer. |
| **KCC Modified Interest Subvention Scheme (MISS)** | Reserve Bank of India (RBI) & NABARD | **CONFIRMED CURRENT** | The Union Cabinet and RBI (*Circular RBI/2025-26/193* & *RBI/2024-25/59*) confirm continuation of MISS for short-term crop loans up to **₹3,00,000**. Lending institutions lend at **7.0% p.a.**; Central Govt provides **1.5% interest subvention** to banks plus an additional **3.0% Prompt Repayment Incentive (PRI)** to farmers, yielding an **effective farmer interest rate of 4.0% p.a.** | **CONFIRMED CURRENT** citing RBI Circular *RBI/2025-26/193* & NABARD MISS framework. |
| **PMFME 35% Credit-Linked Capital Subsidy** | Ministry of Food Processing Industries (MoFPI) | **CONFIRMED CURRENT** | Official PMFME Operational Guidelines (`https://mofpi.gov.in/`) verify that individual micro food processing enterprises receive a **35% credit-linked capital subsidy** on eligible project costs, with a statutory maximum ceiling of **₹10.00 Lakhs** per unit and a minimum promoter contribution of 10%. | **CONFIRMED CURRENT** citing MoFPI PMFME Scheme Guidelines. |
| **Scale of Finance (SoF) per Hectare / Acre** | State Level Bankers' Committee (SLBC Maharashtra) & DLTC | **ANNUALLY VARIABLE / DLTC-SPECIFIC** | Scale of Finance is recommended annually by District Level Technical Committees (DLTC) and finalized by SLTC/SLBC. Indicative baseline ranges for Maharashtra (approved through SLBC / Bank of Maharashtra):<br>• **Soybean:** ₹55,000 to ₹59,400 / ha (approx. ₹22,000–24,000 / acre)<br>• **Cotton (Rainfed / Irrigated):** ₹42,000 to ₹65,000+ / ha<br>• **Sugarcane (Suru / Ratoon):** ₹1,25,000 to ₹1,70,000 / ha.<br>Because actual sanctioned limits vary by district DLTC, water source, and bank branch, fixed constants cannot be guaranteed state-wide. | **UNREVIEWED** with visible notice: *"May be outdated — confirm exact Scale of Finance with your local bank branch/KVK."* |
| **PM-KISAN DBT Direct Income Support** | Ministry of Agriculture & Farmers Welfare, GoI | **CONFIRMED CURRENT** | Official portal `https://pmkisan.gov.in/` confirms **₹6,000 per year** transferred in three equal four-monthly installments of ₹2,000 directly to Aadhaar-seeded bank accounts. | **CONFIRMED CURRENT** citing `pmkisan.gov.in`. |
| **Other Schemes (PM-KUSUM, PoCRA, Magel Tyala Shet Tale, SMAM)** | MNRE, World Bank / PoCRA, MahaDBT, MoA&FW | **UNREVIEWED 2026 STATE QUOTAS** | Scheme portals are active, but state annual budgetary allocations, subsidy percentages, and target village eligibility are subject to ongoing fiscal year updates. | **UNREVIEWED** with visible notice: *"May be outdated, confirm with your bank/KVK."* |

---

## 2. Agmarknet & Data.gov.in API Integration Research

Research conducted for the upcoming APMC Mandi live price integration on the Open Government Data (OGD) Platform India (`data.gov.in`):

### 2.1 API Catalog Details
- **Platform:** Open Government Data (OGD) Platform India (`https://data.gov.in/`)
- **Originating Department:** Directorate of Marketing & Inspection (DMI), Ministry of Agriculture and Farmers Welfare
- **Catalog Dataset Title:** *Current Daily Price of Various Commodities from Various Markets (Mandi)*
- **Resource ID:** `9ef84268-d588-465a-a308-a864a43d0070`
- **Base Endpoint URL:** `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070`

### 2.2 Query Parameters & URL Format
```http
GET https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=YOUR_API_KEY&format=json&limit=50&filters[state]=Maharashtra&filters[commodity]=Soyabean
```

| Parameter | Type | Required | Description / Allowed Values |
|---|---|---|---|
| `api-key` | string | **Yes** | 32-character personal API key generated from data.gov.in user profile. |
| `format` | string | **Yes** | `json`, `xml`, or `csv` (`json` required for AgriNexus adapter). |
| `limit` | integer | Optional | Number of records per response (default 10, recommended 50–100). |
| `offset` | integer | Optional | Pagination start index (0-indexed). |
| `filters[state]` | string | Optional | State name filter (e.g., `Maharashtra`). |
| `filters[district]` | string | Optional | District name filter (e.g., `Nashik`, `Pune`, `Latur`, `Amravati`). |
| `filters[market]` | string | Optional | Mandi / APMC market name (e.g., `Lasalgaon`, `Pimpalgaon`, `Solapur`). |
| `filters[commodity]` | string | Optional | Commodity name (e.g., `Onion`, `Soyabean`, `Cotton`, `Tomato`). |

### 2.3 Response JSON Schema
```json
{
  "index_name": "9ef84268-d588-465a-a308-a864a43d0070",
  "title": "Current Daily Price of Various Commodities from Various Markets (Mandi)",
  "desc": "Current Daily Price of Various Commodities from Various Markets (Mandi)",
  "created": 1563870631,
  "updated": 1729851600,
  "created_date": "2019-07-23T15:20:31+05:30",
  "updated_date": "2026-10-25T10:30:00+05:30",
  "total": 1420,
  "count": 2,
  "limit": "2",
  "offset": "0",
  "records": [
    {
      "state": "Maharashtra",
      "district": "Nashik",
      "market": "Lasalgaon",
      "commodity": "Onion",
      "variety": "Red Onion",
      "arrival_date": "25/10/2026",
      "min_price": "1400",
      "max_price": "2850",
      "modal_price": "2250"
    }
  ]
}
```

### 2.4 Authentication, Rate Limits & Access Terms
- **Authentication:** Free registration on `https://data.gov.in/` -> *My Account* -> *My API Keys* -> Generate Key.
- **Rate Limits:** 10,000 API calls per day per API key; maximum burst limit of 10 requests per minute.
- **License:** Government Open Data License - India (GODL-India).
- **Mandatory Attribution:** *"Data provided by Directorate of Marketing & Inspection (DMI), Ministry of Agriculture & Farmers Welfare via data.gov.in"*.
- **Implementation Status:** Research complete; adapter construction held pending user provision of API key.

---

## 3. General Data Source Provider Registry

| Provider / Adapter | Domain / Function | Provenance Badge | Auth Required | Rate Limits | License & Attribution | Current Status |
|---|---|---|---|---|---|---|
| **Open-Meteo** | Agro-meteorology, hourly weather, spray window | `LIVE` | None | 10,000 req/day; 60 req/min | CC BY 4.0 ("Weather data by Open-Meteo.com") | **ACTIVE & TESTED** |
| **Agmarknet via data.gov.in** | APMC mandi arrivals & daily modal prices | `LIVE` (Planned) / `CURATED_REFERENCE` (Current) | API Key (data.gov.in) | 10,000 req/day | GODL-India (DMI Agmarknet) | **RESEARCHED (Awaiting API Key)** |
| **Soil Health Card Portal** | 12-parameter soil norms & fertilizer RDF | `CURATED_REFERENCE` | None (Public portal) | N/A | Government of India Soil Health Standards | **CURATED BENCHMARK** |
| **Kisan Credit Card (MISS)** | Subvented agricultural crop loans | `CURATED_REFERENCE` | None | N/A | RBI Circular *RBI/2025-26/193* & NABARD | **CONFIRMED BENCHMARK** |
| **PMFME Food Processing** | 35% micro-enterprise capital subsidy | `CURATED_REFERENCE` | None | N/A | MoFPI Scheme Guidelines | **CONFIRMED BENCHMARK** |
| **Copernicus Sentinel-2** | Satellite NDVI canopy vigor | `SIMULATED` | OAuth2 (Copernicus Hub) | Tiered | ESA Open Access Policy | **SIMULATED DEMO (Post-MVP)** |
| **Plant Pathology ML** | Automated computer vision disease diagnosis | `UNAVAILABLE` | N/A | N/A | Requires validated field dataset | **NOT IMPLEMENTED** |
