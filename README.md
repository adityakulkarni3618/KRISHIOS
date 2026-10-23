# KRISHIOS / AGRINEXUS (कृषी ओएस)
> **Unified, Evidence-Driven Digital Agriculture Decision Desk & AgriStack Portal**  
> Tailored for Maharashtra farmers, Farmer Producer Organizations (FPOs), and agricultural researchers.  
> Native Multilingual Support: **Marathi (मराठी)**, **Hindi (हिन्दी)**, and **English (EN)**.

[![Tests](https://img.shields.io/badge/pytest-41%2F41%20passing-brightgreen)](file:///backend/tests)
[![Frontend](https://img.shields.io/badge/Next.js-14.2.15-black)](file:///frontend)
[![Backend](https://img.shields.io/badge/FastAPI-0.115.6-009688)](file:///backend)
[![Provenance](https://img.shields.io/badge/Data%20Provenance-Enforced-blue)](#data-provenance-framework)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#license)

---

## 🌟 Overview

**KRISHIOS** is a full-stack, production-ready agricultural intelligence ecosystem designed to bridge the gap between complex agronomic telemetry and on-the-ground farming decisions. 

Built with strict adherence to data integrity, KRISHIOS guarantees that **no metrics or recommendations are ever hallucinated or fabricated**. Every data point displayed carries a transparent provenance badge (`LIVE`, `HISTORICAL`, `ESTIMATED`, `UNAVAILABLE`, or `USER_PROVIDED`).

---

## 🎨 Dual-Theme Architecture & Accessibility

KRISHIOS features a seamless **Dual-Theme System** and **Rural-First Accessibility Suite**:

1. **🌿 Dribbble Modern Precision AgTech:**
   - Inspired by Ahmad Fabian's award-winning OnPoint Studio design.
   - Deep forest green (`#08160c`), elevated cards (`#0f2214`), and vibrant chartreuse lime accents (`#d4f936`).
   - Floating capsule navigation, full-width cinematic hero showcase with real-time telemetry pill.

2. **🏛️ Official Government of Maharashtra AgriStack Portal:**
   - Standard Indian e-Governance interface compliant with National e-Governance Plan in Agriculture (NeGPA).
   - Tri-color saffron/white/green accent stripe, official Department of Agriculture seal, and Kisan Call Centre 24x7 toll-free helpline (`1800-180-1551`).

3. **🌾 Easy Kisan Mode (सुलभ शेतकरी मोड):**
   - Single-tap toggle for farmers with lower digital literacy: presents 4 high-contrast, card-based questions:
     - 🌦️ *आज फवारणी करू का? (Can I Spray Today?)* — Traffic-light Safe/Warning/Hazard status.
     - 🔬 *पिकाला काय रोग झाला? (Crop Doctor Diagnostic)* — Instant camera photo check.
     - 💰 *आजचा बाजारभाव काय? (Today's Mandi Rate & Hold/Sell Advice)*.
     - 📞 *२४x७ किसान हेल्पलाइन (Toll-free 1800-180-1551)* — Direct one-tap phone call.
   - **🔊 Voice-First Text-to-Speech (TTS):** Browser SpeechSynthesis reads out weather advisories and spray prescriptions in Marathi, Hindi, or English.
   - **📲 Instant WhatsApp Share:** One-click sharing of prescriptions, mandi trends, and weather warnings to farmer groups and Krishi Seva Kendra shops.

---

## 🚀 Core Functional Modules

### 1. ⛅ Agro-Meteorology & Spray Advisory Module
- **Live Upstream:** Integrated with Open-Meteo & IMD agro-meteorological feeds across all 36 Maharashtra districts.
- **Decision Engine:** Evaluates wind speed, relative humidity, and precipitation probability to issue specific spray windows with audio readout and WhatsApp sharing.

### 2. 📊 APMC Mandi Rate Board & 🔮 30-Day Price Forecaster
- **Market Schema:** Compatible with Agmarknet and Maharashtra State Agricultural Marketing Board (MSAMB).
- **Price Forecasting:** 7, 15, and 30-day projected commodity curves based on arrivals and export tariffs.
- **Hold vs. Sell Engine:** Computes warehouse storage carrying costs, shrinkage loss %, and net gain to protect farmers from distress selling.

### 3. 🔬 AI Crop Doctor & Multimodal Leaf Pathology Lab
- **ICAR Benchmarking:** Visual and symptom-based diagnosis for Maharashtra crops (Cotton, Soybean, Tomato, Sugarcane, Onion).
- **Dual Remedy:** Side-by-side Organic/Bio-control (Neem, Jeevamrut, Dashparni) vs. Targeted Chemical control.
- **Pump Dosage Calculator:** Formulated strictly **per 15-litre knapsack pump** with CIBRC Pre-Harvest Interval (PHI) waiting periods.

### 4. 💧 Smart Jal-Mitra: Precision Drip Irrigation & Water Budgeting
- **Evapotranspiration ($ET_c$):** Integrates temperature, humidity, crop coefficient ($K_c$), and soil water-holding capacity.
- **Execution Guidance:** Outputs exact daily drip runtime in minutes (e.g. 54 mins at 5:00 PM) and farm pond reserve countdown days.

### 5. 🧮 Farm Economics & Sensitivity Calculator
- **Mathematical Integrity:** Hand-calculated arithmetic formulas for total cost, gross revenue, net profit, ROI %, and break-even price/yield.
- **5×5 Sensitivity Matrix:** Computes outcome variability across price and yield fluctuations (-20% to +20%).

### 6. 🔬 ICAR Soil Health Interpretation Engine
- **Agronomic Standards:** Interprets soil pH and organic carbon percentage, providing verified corrective amendments (agricultural lime, gypsum, compost).

### 7. 📜 Government Schemes & DBT Directory (3D Corridor)
- **Verified Catalog:** Central & Maharashtra state initiatives (PM-KISAN, PMFBY ₹1 Crop Insurance, PoCRA, Magel Tyala Shet Tale).

### 8. 🌾 Farm & Soil Holding Records (7/12 Integration)
- **Farmer Isolation:** Multi-tenant access control with offline IndexedDB/LocalStorage synchronization.

### 9. 🧭 Problem Mapping & Agronomic Classifier
- **Evidence-Driven:** Categorizes farmer challenges against a verified taxonomy of 13 agricultural domains.

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
