# Source URL Verification Audit (Step 4)

Conducted on: **25-Oct-2026**
Verification Method: Direct HTTP retrieval with browser user-agent and SSL handling.

Status Classification Criteria:
- **`OPENED_AND_MATCHES`**: Successfully connected with HTTP 200 OK, page content matches the agronomic or governmental dataset cited.
- **`OPENED_BUT_DIFFERENT`**: Connected with HTTP 200 OK, but portal content has diverged or redirected to an unrelated service.
- **`COULD_NOT_VERIFY`**: Network timeout, DNS resolution failure (Errno 11001), or server-side error (HTTP 503). *No URLs have been modified without explicit user approval.*

---

## Audit Registry Table

| # | Source URL in Codebase | Module / Dataset | Status | HTTP / Title | Audit Findings & Recommendations |
|---|------------------------|------------------|--------|--------------|-----------------------------------|
| 1 | `https://pmkisan.gov.in/` | `schemes/pmkisan` | **OPENED_AND_MATCHES** | 200 OK ("PM-Kisan Samman Nidhi") | Official national direct DBT portal. Confirms ₹6,000/year in 3 installments. |
| 2 | `https://pmfby.gov.in/` | `insurance/pmfby` | **OPENED_AND_MATCHES** | 200 OK ("Pradhan Mantri Fasal Bima Yojana - Crop Insurance") | National crop insurance portal for premium calculation and claims. |
| 3 | `https://mahapocra.gov.in/` | `schemes/pocra` | **OPENED_AND_MATCHES** | 200 OK | World Bank & Maharashtra Government PoCRA project portal for drip & farm pond subsidies. |
| 4 | `https://mahadbt.maharashtra.gov.in/` | `schemes/mahadbt` | **OPENED_AND_MATCHES** | 200 OK | Aaple Sarkar MahaDBT farmer welfare portal for farm ponds on demand and drip schemes. |
| 5 | `https://soilhealth.dac.gov.in/` | `schemes/soilhealth` | **OPENED_AND_MATCHES** | 200 OK ("Soil Health") | Ministry of Agriculture & Farmers Welfare Soil Health Card portal. |
| 6 | `https://www.myscheme.gov.in/schemes/kcc` | `institutional/kcc` | **OPENED_AND_MATCHES** | 200 OK | myScheme national portal entry for Kisan Credit Card (4% subsidized interest). |
| 7 | `https://myscheme.gov.in/` | `schemes/catalog` | **OPENED_AND_MATCHES** | 200 OK | Central citizen services platform listing verified government schemes. |
| 8 | `https://pmfme.mofpi.gov.in/` | `market_linkage/pmfme` | **OPENED_AND_MATCHES** | 200 OK ("Welcome to PMFME-MOFPI") | Ministry of Food Processing Industries portal for 35% credit-linked capital subsidy. |
| 9 | `https://agmarknet.gov.in/` | `market/agmarknet` | **OPENED_AND_MATCHES** | 200 OK ("Agmarknet 2.0") | Directorate of Marketing & Inspection portal for APMC Mandi daily arrival and modal prices. |
| 10 | `https://open-meteo.com/` | `weather/open_meteo` | **OPENED_AND_MATCHES** | 200 OK ("Free Open-Source Weather API") | Live weather telemetry and agro-meteorological advisory endpoint. |
| 11 | `https://agrimachinery.nic.in/` | `equipment/chc` | **OPENED_AND_MATCHES** | 200 OK ("Digital Platform for Farm Mechanization and Technology") | Sub-Mission on Agricultural Mechanization (SMAM) Custom Hiring Centres portal. |
| 12 | `https://www.nddb.coop/` | `livestock/nddb` | **OPENED_AND_MATCHES** | 200 OK ("National Dairy Development Board (NDDB)") | NDDB portal for livestock feed ration formulations and dairy data. |
| 13 | `https://www.mswarehousing.com/` | `postharvest/mswc` | **OPENED_AND_MATCHES** | 200 OK ("Maharashtra warehousing corporation") | Official MSWC portal for state warehouse directory, storage charges, and cold chain capacity. |
| 14 | `https://wdra.gov.in/` | `postharvest/wdra` | **OPENED_AND_MATCHES** | 200 OK ("Home - WDRA") | Statutory Warehousing Development and Regulatory Authority e-NWR pledge loan rules. |
| 15 | `https://icar.org.in/` | `soil_health/icar` | **OPENED_AND_MATCHES** | 200 OK ("Indian Council of Agricultural Research") | Official ICAR research portal for Package of Practices and RDF fertilizer standards. |
| 16 | `https://www.mahadiscom.in/` | `rural_ops/mahadiscom` | **OPENED_AND_MATCHES** | 200 OK ("Maharashtra State Electricity Distribution Co. Ltd.") | MSEDCL official portal for 3-phase agricultural feeder shift rosters. |
| 17 | `https://gsda.maharashtra.gov.in/` | `operations/gsda` | **OPENED_AND_MATCHES** | 200 OK ("GSDA") | Groundwater Surveys and Development Agency Maharashtra watershed observation wells. |
| 18 | `https://krishi.maharashtra.gov.in/` | `mapping/krishi_dept` | **OPENED_AND_MATCHES** | 200 OK | Official Department of Agriculture Government of Maharashtra administrative portal. |
| 19 | `https://seednet.gov.in/` | `operations/seednet` | **COULD_NOT_VERIFY** | HTTP 503 (Service Unavailable) | NIC Seednet India portal is legitimate but currently returning 503 error on server side. Retained without modification. |
| 20 | `https://kvk.icar.gov.in/` | `assistant/kvk` | **COULD_NOT_VERIFY** | DNS Error (`getaddrinfo` failed) | Hostname `kvk.icar.gov.in` failed DNS lookup. Potential official alternative: `https://icar.org.in/content/krishi-vigyan-kendras`. Retained existing URL pending approval. |
| 21 | `https://arogya.maharashtra.gov.in/` | `rural_ops/arogya` | **COULD_NOT_VERIFY** | DNS Error (`getaddrinfo` failed) | Maharashtra Public Health Dept subdomain failed DNS resolution. Potential official alternative: `https://phd.maharashtra.gov.in/`. Retained existing URL pending approval. |
| 22 | `https://revenue.maharashtra.gov.in/` | `institutional/revenue` | **COULD_NOT_VERIFY** | DNS Error (`getaddrinfo` failed) | Subdomain failed DNS resolution. Official revenue portal for land records is `https://mahabhulekh.maharashtra.gov.in`. Retained existing URL pending approval. |
| 23 | `https://smartindiahackathon.gov.in/` | `data_registry/sih` | **COULD_NOT_VERIFY** | DNS Error (`getaddrinfo` failed) | Domain failed DNS lookup. Official Smart India Hackathon portal is `https://www.sih.gov.in`. Retained existing URL pending approval. |
| 24 | `https://ncof.dacnet.nic.in/` | `rural_ops/ncof` | **COULD_NOT_VERIFY** | DNS Error (`getaddrinfo` failed) | DACNET National Centre for Organic Farming portal restructured into NCONF. Retained existing URL pending approval. |

---

## Summary
- **Total Source URLs Audited:** 24
- **OPENED_AND_MATCHES:** 18 (75.0%)
- **OPENED_BUT_DIFFERENT:** 0 (0.0%)
- **COULD_NOT_VERIFY:** 6 (25.0% - 1 HTTP 503, 5 DNS resolution issues on current network)
- **URLs Changed:** 0 (Strict policy: no URLs modified or invented without user authorization).
