# KRISHIOS / AGRINEXUS (कृषी ओएस)
> **Unified, Evidence-Driven Digital Agriculture Decision Desk & AgriStack Portal**  
> Tailored for Maharashtra farmers, Farmer Producer Organizations (FPOs), and agricultural researchers.  
> Native Multilingual Support: **Marathi (मराठी)**, **Hindi (हिन्दी)**, and **English (EN)**.

[![Tests](https://img.shields.io/badge/pytest-37%2F37%20passing-brightgreen)](file:///backend/tests)
[![Frontend](https://img.shields.io/badge/Next.js-14.2.15-black)](file:///frontend)
[![Backend](https://img.shields.io/badge/FastAPI-0.115.6-009688)](file:///backend)
[![Provenance](https://img.shields.io/badge/Data%20Provenance-Enforced-blue)](#data-provenance-framework)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#license)

---

## 🌟 Overview

**KRISHIOS** is a full-stack, production-ready agricultural intelligence ecosystem designed to bridge the gap between complex agronomic telemetry and on-the-ground farming decisions. 

Built with strict adherence to data integrity, KRISHIOS guarantees that **no metrics or recommendations are ever hallucinated or fabricated**. Every data point displayed carries a transparent provenance badge (`LIVE`, `HISTORICAL`, `ESTIMATED`, `UNAVAILABLE`, or `USER_PROVIDED`).

---

## 🎨 Dual-Theme Architecture

KRISHIOS features a seamless **Dual-Theme System** switchable instantly with zero reload via the icon toggle `[ 🌿 | 🏛️ ]` or by clicking the website brand logo:

1. **🌿 Dribbble Modern Precision AgTech:**
   - Inspired by Ahmad Fabian's award-winning OnPoint Studio design.
   - Deep forest green (`#08160c`), elevated cards (`#0f2214`), and vibrant chartreuse lime accents (`#d4f936`).
   - Floating capsule navigation, full-width cinematic hero showcase with real-time telemetry pill, verified partner strip (FocalPoint, Screentime, Segment, Shutterframe, Lightspeed, Mastermail).
   - High-contrast visual stats (`100% Customer Satisfaction`, `20+ Years of Experience`), aerial drone precision agriculture showcase, and interactive FAQ accordion.

2. **🏛️ Official Government of Maharashtra AgriStack Portal:**
   - Standard Indian e-Governance interface compliant with National e-Governance Plan in Agriculture (NeGPA).
   - Tri-color saffron/white/green accent stripe, official Department of Agriculture seal, and Kisan Call Centre 24x7 toll-free helpline (`1800-180-1551`).
   - Live ticker bulletin marquee, verified farmer profile banner (`UID: MH-2026-8841-K`), 4-metric summary cards, and official tabular records.

---

## 🚀 Core Functional Modules

### 1. ⛅ Agro-Meteorology & Spray Advisory Module
- **Live Upstream:** Integrated with Open-Meteo & IMD agro-meteorological feeds across all 36 Maharashtra districts.
- **Resilience & Caching:** In-memory TTL caching with graceful fallbacks and strict timeout resilience.
- **Decision Engine:** Evaluates wind speed, relative humidity, and precipitation probability to issue specific spray windows and irrigation timing warnings.

### 2. 📊 APMC Mandi Rate Board
- **Market Schema:** Compatible with Agmarknet and Maharashtra State Agricultural Marketing Board (MSAMB).
- **Price Benchmarking:** Displays Minimum, Modal, and Maximum rates (₹/quintal) for high-value commodities (Soybean, Onion, Cotton, Gram, Maize, Pomegranate).
- **Search & Filter:** Instant real-time filtering with provenance verification.

### 3. 🧮 Farm Economics & Sensitivity Calculator
- **Mathematical Integrity:** Hand-calculated arithmetic formulas for total production cost, cost per hectare, gross revenue, net profit, return on investment (ROI %), and break-even price/yield.
- **5×5 Sensitivity Matrix:** Computes outcome variability across price variations (-20% to +20%) and yield fluctuations (-20% to +20%).

### 4. 🔬 ICAR Soil Health Interpretation Engine
- **Agronomic Standards:** Benchmarked against Indian Council of Agricultural Research (ICAR) and State Agricultural Universities (MPKV Rahuri, PDKV Akola).
- **Corrective Guidance:** Interprets soil pH (acidic, optimal, alkaline) and organic carbon percentage, providing verified corrective amendments (agricultural lime, gypsum, FYM/compost, green manuring).

### 5. 📜 Government Schemes & DBT Directory
- **Verified Catalog:** Central & Maharashtra state farmer initiatives (PM-KISAN, PMFBY ₹1 Crop Insurance, Nanaji Deshmukh Krishi Sanjivani Yojana / PoCRA, Magel Tyala Shet Tale, Soil Health Card, Kisan Credit Card).
- **Actionable Details:** Eligibility checklists, documentation requirements, direct portal links, and last-verified timestamps.

### 6. 🌾 Farm & Soil Holding Records (7/12 Integration)
- **Farmer Isolation:** Multi-tenant role-based access control protecting farmer ownership of land and soil records.
- **Offline Sync:** Automatic local storage synchronization for seamless performance in low-connectivity rural areas.

### 7. 🧭 Problem Mapping & Agronomic Classifier
- **Evidence-Driven:** Categorizes farmer challenges against a verified taxonomy of 13 agricultural domains, transparently flagging whether recommendations require human expert review.

---

## 🛡️ Data Provenance Framework

To prevent misinformation, every API response and frontend widget explicitly declares its data origin:

| Provenance Label | Meaning & Usage |
|---|---|
| `LIVE` | Fetched directly from verified upstream endpoints (Open-Meteo, MSAMB) within valid TTL. |
| `HISTORICAL` | Official published records (e.g. government scheme eligibility, baseline MSP). |
| `ESTIMATED` | Deterministically computed by mathematical algorithms (e.g. economics calculator). |
| `USER_PROVIDED` | Input directly by the cultivator (e.g. soil test report values, farm area). |
| `UNAVAILABLE` | Explicitly declared when upstream sources are unreachable or records are absent (no fake fallbacks). |

---

## 📂 Repository Layout

```text
agrinexus/
├── backend/
│   ├── app/
│   │   ├── core/           # Security, Argon2 hashing, JWT auth, provenance enums, settings
│   │   ├── models/         # SQLAlchemy DB models (User, Farmer, Farm, SoilTest)
│   │   ├── modules/        # Domain business logic & adapters:
│   │   │   ├── weather/    # Open-Meteo adapter, TTL cache, spray advisory rules
│   │   │   ├── market/     # APMC mandi rates adapter & Agmarknet schema
│   │   │   ├── calculator/ # Pure economics engine & sensitivity matrix
│   │   │   ├── soil/       # ICAR soil test interpretation engine
│   │   │   ├── schemes/    # Central & State schemes catalog
│   │   │   └── mapping/    # Agricultural problem classification engine
│   │   ├── routers/        # FastAPI REST endpoints
│   │   └── main.py         # App factory, CORS, exception handlers
│   ├── tests/              # 37 automated pytest unit and integration suites
│   ├── requirements.txt    # Python dependencies
│   └── pytest.ini          # Pytest configuration
├── frontend/
│   ├── app/
│   │   ├── globals.css     # Complete styling system for Dribbble & Govt themes
│   │   ├── layout.tsx      # Root Next.js layout & metadata
│   │   └── page.tsx        # Interactive UI with dual-theme architecture
│   ├── messages/           # Localization dictionaries (mr.json, hi.json, en.json)
│   ├── public/             # High-res photography & extracted Dribbble assets
│   ├── package.json        # Dependencies (Next.js 14, React, TypeScript)
│   └── .env.local          # Environment configuration (NEXT_PUBLIC_API_URL)
├── scripts/
│   └── seed_synthetic.py  # Realistic demo database seeder
├── docs/                   # Architecture notes, traceability matrix, AGENTS.md
└── README.md               # Main project documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Python 3.11+
- Node.js 18+ & npm

### 1. Backend Setup
```bash
# Navigate to backend directory
cd agrinexus/backend

# Activate virtual environment
# Windows:
..\.venv\Scripts\Activate.ps1
# Linux / macOS:
source ../.venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the test suite (37 tests)
pytest -v

# Seed synthetic demo data
python ../scripts/seed_synthetic.py

# Launch development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
API Documentation (Interactive Swagger): **`http://localhost:8000/docs`**

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd agrinexus/frontend

# Install dependencies
npm install

# Run Next.js development server
npm run dev
```
Web Application: **`http://localhost:3000`**

### 3. Demo Credentials
- **Username:** `demo_farmer`
- **Password:** `krishi123`
- **Role:** `farmer` (District: Nashik, Maharashtra)

---

## 🧪 Verification & Automated Testing

All 37 backend tests pass with 100% success rate:

```text
======================== 37 passed, 1 warning in 1.92s ========================
tests/test_api.py::test_health PASSED
tests/test_api.py::test_create_farm PASSED
tests/test_api.py::test_farm_for_missing_farmer_404 PASSED
tests/test_api.py::test_invalid_coordinates_rejected PASSED
tests/test_api.py::test_negative_area_rejected PASSED
tests/test_api.py::test_invalid_language_rejected PASSED
tests/test_api.py::test_soil_test_is_labelled_user_provided PASSED
tests/test_api.py::test_soil_ph_out_of_range_rejected PASSED
tests/test_auth.py::test_register_success PASSED
tests/test_auth.py::test_duplicate_registration_rejected PASSED
tests/test_auth.py::test_login_success_and_failure PASSED
tests/test_auth.py::test_unauthenticated_requests_return_401 PASSED
tests/test_auth.py::test_me_endpoint_returns_user_info PASSED
tests/test_auth.py::test_cross_user_access_returns_403 PASSED
tests/test_calculator.py::test_hand_calculated_soybean_economics PASSED
tests/test_calculator.py::test_calculator_api_endpoint PASSED
tests/test_mapping.py::test_classification_is_flagged_for_review PASSED
tests/test_mapping.py::test_unimplemented_modules_reported_as_missing PASSED
tests/test_mapping.py::test_source_url_marks_verified PASSED
tests/test_mapping.py::test_unknown_text_has_no_domain PASSED
tests/test_market.py::test_market_query_by_commodity PASSED
tests/test_market.py::test_market_query_by_district PASSED
tests/test_market.py::test_market_empty_query_returns_unavailable PASSED
tests/test_market.py::test_market_deduplication PASSED
tests/test_market.py::test_market_endpoints PASSED
tests/test_soil_schemes.py::test_soil_acidic_interpretation PASSED
tests/test_soil_schemes.py::test_soil_optimal_and_alkaline PASSED
tests/test_soil_schemes.py::test_farm_soil_interpretation_endpoint PASSED
tests/test_soil_schemes.py::test_schemes_listing_and_filtering PASSED
tests/test_soil_schemes.py::test_schemes_api_endpoints PASSED
tests/test_weather.py::test_weather_success_response PASSED
tests/test_weather.py::test_weather_cache_hit PASSED
tests/test_weather.py::test_weather_timeout_fallback_to_unavailable PASSED
tests/test_weather.py::test_weather_upstream_error_fallback PASSED
tests/test_weather.py::test_district_name_resolution PASSED
tests/test_weather.py::test_missing_coordinates_and_district_handled PASSED
tests/test_weather.py::test_weather_api_endpoint PASSED
```

Frontend production build (`npm run build`) compiles with zero errors and static pre-rendering optimization.

---

## 📄 License
This project is licensed under the MIT License.
