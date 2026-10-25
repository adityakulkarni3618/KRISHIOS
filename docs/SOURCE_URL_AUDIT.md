# Source URL Verification Audit (Step 4c - Honest Verification)

Conducted on: **25-Oct-2026**  
Verification Method: Direct HTTP retrieval, header & redirect analysis, HTML title parsing, and full-text inspection.

---

## 1. Classification Criteria

To ensure strict evidentiary honesty, HTTP reachability is separated from content verification:

- **`CONTENT_MATCHES`**: The URL is reachable (HTTP 200) AND its page content directly includes the specific agronomic, tariff, or scheme figures cited by the codebase.
- **`REACHABLE_ONLY`**: The URL is reachable (HTTP 200), but it is a general corporate/departmental homepage, an administrative portal landing, or an empty client-side SPA shell (React/Vite) that does NOT contain the specific data points cited in the code.
- **`CONTENT_DIFFERENT`**: The URL is reachable (HTTP 200), but the published content has diverged or contradicts what the codebase claims.
- **`UNREACHABLE`**: The URL could not be connected to due to an upstream server-side failure (e.g., HTTP 503) or an invalid/obsolete hostname (DNS resolution error).

---

## 2. Comprehensive Audit Registry

| # | Source URL in Codebase | Module / Claimed Dataset | HTTP Status | Page Title & Details | Honest Audit Status | Audit Findings & Reason for Classification |
|---|------------------------|--------------------------|-------------|----------------------|---------------------|--------------------------------------------|
| 1 | `https://pmkisan.gov.in/` | `schemes/pmkisan` (₹6,000/yr in 3 installments) | 200 OK | `PM-Kisan Samman Nidhi` | **CONTENT_MATCHES** | Homepage text directly verifies the ₹6,000 annual benefit disbursed in three equal 4-monthly installments. |
| 2 | `https://pmfby.gov.in/` | `insurance/pmfby` (₹1 farmer token premium) | 200 OK | `Pradhan Mantri Fasal Bima Yojana - Crop Insurance` | **REACHABLE_ONLY** | Official national PMFBY portal is reachable, but national rules charge 1.5%–2% actuarial farmer premium. The ₹1 token premium is a Maharashtra state decision (G.R.), which is not published on this national root page. |
| 3 | `https://mahapocra.gov.in/` | `schemes/pocra` (World Bank climate resilience) | 200 OK | `नानाजी देशमुख कृषि संजीवनी प्रकल्प २.०` | **CONTENT_MATCHES** | Homepage text directly identifies PoCRA 2.0 as the joint Government of Maharashtra & World Bank Climate Resilient Agriculture project. |
| 4 | `https://mahadbt.maharashtra.gov.in/` | `schemes/mahadbt` (Farmer farm ponds & drip) | 200 OK | `Aaple Sarkar MahaDBT Portal` | **REACHABLE_ONLY** | General state DBT umbrella portal with links to education/scholarships. The specific farmer scheme terms are in an internal sub-portal (`/Farmer/Login/Login`), not on this root page. |
| 5 | `https://soilhealth.dac.gov.in/` | `schemes/soilhealth` (12 testing parameters) | 200 OK | `Soil Health` | **REACHABLE_ONLY** | Reachable, but serves a bare Vite/React SPA shell (`<div id="root"></div>`) requiring client-side JS bundle execution. Parameter thresholds are not in the raw HTML response. |
| 6 | `https://www.myscheme.gov.in/schemes/kcc` | `institutional/kcc` (4% subvented interest) | 200 OK | `myScheme` | **REACHABLE_ONLY** | Reachable, but is a Next.js/React SPA returning a fallback skeleton on raw HTTP requests. Specific subvention terms require client hydration. |
| 7 | `https://myscheme.gov.in/` | `schemes/catalog` (Central schemes registry) | 200 OK (301 redirect) | `myScheme` | **REACHABLE_ONLY** | General citizen services catalog landing page. Scheme listings require user search interaction. |
| 8 | `https://pmfme.mofpi.gov.in/` | `market_linkage/pmfme` (35% capital subsidy) | 200 OK | `Welcome to PMFME-MOFPI | Ministry of Food Processing Industries` | **REACHABLE_ONLY** | Official PMFME portal is live, but the 35% capital subsidy and ₹10 lakh ceiling details reside in scheme guidelines PDFs, not on the homepage text. |
| 9 | `https://agmarknet.gov.in/` | `market/agmarknet` (APMC mandi arrival & modal rates) | 200 OK | `Agmarknet 2.0` | **REACHABLE_ONLY** | Reachable, but is a React single-page app (`<div id="root"></div>`). Dynamic modal rates and arrival quantities are loaded via API calls. |
| 10 | `https://open-meteo.com/` | `weather/open_meteo` (Free open weather telemetry) | 200 OK | `🌤️ Free Open-Source Weather API | Open-Meteo.com` | **CONTENT_MATCHES** | Homepage text directly confirms free weather forecast & historical archive API from 30+ weather models without API keys. |
| 11 | `https://agrimachinery.nic.in/` | `equipment/chc` (SMAM Custom Hiring Centre subsidies) | 200 OK | `Digital Platform for Farm Mechanization and Technology` | **CONTENT_MATCHES** | Homepage text directly verifies the portal as the Ministry of Agriculture & Farmers Welfare's mechanization and CHC subsidy platform. |
| 12 | `https://www.nddb.coop/` | `livestock/nddb` (Cattle feed formulation & vaccines) | 200 OK | `National Dairy Development Board (NDDB)` | **REACHABLE_ONLY** | General corporate homepage of NDDB. Detailed ration balancing software (INAPH/RBP) is a separate internal tool. |
| 13 | `https://www.mswarehousing.com/` | `postharvest/mswc` (MSWC warehouse directory & tariffs) | 200 OK (302 redirect) | `Maharashtra warehousing corporation` | **REACHABLE_ONLY** | Homepage of the corporation is reachable, but specific warehouse directories and storage tariffs are in downloadable PDF circulars. |
| 14 | `https://wdra.gov.in/` | `postharvest/wdra` (WDRA registered warehouses & e-NWR) | 200 OK | `Home - WDRA` | **REACHABLE_ONLY** | General statutory authority homepage. List of registered warehouses and pledge loan guidelines are inside sub-menus. |
| 15 | `https://icar.org.in/` | `soil_health/icar` (Soil nutrient thresholds & RDF) | 200 OK | `Home | Indian Council of Agricultural Research` | **REACHABLE_ONLY** | General research council homepage. Package of practices and fertilizer recommendations are published across ICAR institutes. |
| 16 | `https://www.mahadiscom.in/` | `rural_ops/mahadiscom` (3-phase feeder shift roster) | 200 OK | `मुख्य पृष्ठ - Maharashtra State Electricity Distribution Co. Ltd.` | **REACHABLE_ONLY** | General power utility billing and consumer homepage. Agricultural feeder rosters are behind a separate portal section. |
| 17 | `https://gsda.maharashtra.gov.in/` | `operations/gsda` (Groundwater observation wells) | 200 OK | `GSDA` | **REACHABLE_ONLY** | Official GSDA administrative homepage. Seasonal watershed observation well tables are in periodic assessment reports. |
| 18 | `https://krishi.maharashtra.gov.in/` | `mapping/krishi_dept` (Department of Agriculture) | 200 OK | `Commissionerate of Agriculture, Maharashtra State` | **CONTENT_MATCHES** | Directly matches the official administrative portal for the Department of Agriculture, Government of Maharashtra. |
| 19 | `https://seednet.gov.in/` | `operations/seednet` (Seed lot verification format) | 503 Service Unavailable | None | **UNREACHABLE** | **Failure Diagnosis:** Upstream server-side issue. DNS resolves correctly to `35.207.209.47` (NIC), but the web server returns HTTP 503. Not a local network failure. |
| 20 | `https://kvk.icar.gov.in/` | `assistant/kvk` (KVK network directory) | DNS Failed (Errno 11001) | None | **UNREACHABLE** | **Failure Diagnosis:** Bad URL. The subdomain `kvk.icar.gov.in` has no active DNS record in public nameservers. KVK directory is under `https://icar.org.in/content/krishi-vigyan-kendras`. |
| 21 | `https://arogya.maharashtra.gov.in/` | `rural_ops/arogya` (ASV hospital directory) | DNS Failed (Errno 11001) | None | **UNREACHABLE** | **Failure Diagnosis:** Bad URL. Maharashtra Public Health Department domain is `phd.maharashtra.gov.in` (`164.100.52.236`). `arogya.maharashtra.gov.in` does not exist. |
| 22 | `https://revenue.maharashtra.gov.in/` | `institutional/revenue` (7/12 land records) | DNS Failed (Errno 11001) | None | **UNREACHABLE** | **Failure Diagnosis:** Bad URL. Maharashtra Land Records operate under `mahabhumi.gov.in` and `mahabhulekh.maharashtra.gov.in`. `revenue.maharashtra.gov.in` is not a registered public host. |
| 23 | `https://smartindiahackathon.gov.in/` | `data_registry/sih` (Smart India Hackathon problem statements) | DNS Failed (Errno 11001) | None | **UNREACHABLE** | **Failure Diagnosis:** Bad URL. The domain `smartindiahackathon.gov.in` does not exist. The official portal is **`https://www.sih.gov.in`** (DNS IP: `20.204.13.165`, currently "Website Under Maintenance"). URL retained in code pending user approval. |
| 24 | `https://ncof.dacnet.nic.in/` | `rural_ops/ncof` (Organic farming bio-inputs) | DNS Failed (Errno 11001) | None | **UNREACHABLE** | **Failure Diagnosis:** Bad URL (Obsolete domain). `dacnet.nic.in` subdomains were decommissioned; NCOF was reorganized into NCONF (`https://naturalfarming.dac.gov.in/`). |

---

## 3. Findings on Failed URLs & Official SIH Site

1. **Local Network vs. Bad URL Analysis:**
   - **`seednet.gov.in`**: Server-side outage (HTTP 503). DNS successfully resolves (`35.207.209.47`).
   - **`kvk.icar.gov.in`**, **`arogya.maharashtra.gov.in`**, **`revenue.maharashtra.gov.in`**, **`smartindiahackathon.gov.in`**, **`ncof.dacnet.nic.in`**: Bad URLs. Public DNS nameservers return NXDOMAIN (`[Errno 11001] getaddrinfo failed`).

2. **Smart India Hackathon (SIH) Investigation:**
   - The official, registered government portal for Smart India Hackathon is **`https://www.sih.gov.in`** (hosted under Ministry of Education / AICTE).
   - The domain `smartindiahackathon.gov.in` is an invented or invalid hostname.
   - **Recommendation:** When user approves, update `smartindiahackathon.gov.in` to `https://www.sih.gov.in`. No changes have been made to code URLs.

---

## 4. Audit Summary Statistics

- **Total URLs Audited:** 24
- **CONTENT_MATCHES:** 5 (20.8%)
- **REACHABLE_ONLY:** 13 (54.2%)
- **CONTENT_DIFFERENT:** 0 (0.0%)
- **UNREACHABLE:** 6 (25.0% — 1 upstream 503, 5 bad/obsolete URLs)
- **Code URLs Modified:** 0 (Retained existing URLs pending explicit user confirmation).
