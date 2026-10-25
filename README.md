# KRISHIOS / AGRINEXUS (कृषी ओएस)
> **Unified, Evidence-Driven Digital Agriculture Decision Desk & AgriStack Portal**  
> Tailored for Maharashtra farmers, Farmer Producer Organizations (FPOs), and agricultural researchers.  
> Native Multilingual Support: **Marathi (मराठी)**, **Hindi (हिन्दी)**, and **English (EN)**.

[![Tests](https://img.shields.io/badge/pytest-73%2F73%20passing-brightgreen)](file:///backend/tests)
[![Frontend](https://img.shields.io/badge/Next.js-14.2.15-black)](file:///frontend)
[![Backend](https://img.shields.io/badge/FastAPI-0.115.6-009688)](file:///backend)
[![Provenance](https://img.shields.io/badge/Data%20Provenance-Enforced-blue)](#data-provenance-framework)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#license)

---

## 🌟 Overview

**KRISHIOS** is a full-stack agricultural decision ecosystem designed to bridge the gap between complex agronomic telemetry and on-the-ground farming decisions. 

Built with strict adherence to data integrity, KRISHIOS guarantees that **every data point carries an honest, transparent provenance badge** (`LIVE`, `HISTORICAL`, `CURATED_REFERENCE`, `ESTIMATED`, `SIMULATED`, `USER_PROVIDED`, or `UNAVAILABLE`). Heuristic models and simulated scenarios are explicitly marked and gated behind `DEMO_MODE`.

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
   - Single-tap toggle for farmers with lower digital literacy: presents exactly 8 high-contrast, card-based questions:
     - 🌦️ *आज फवारणी करू का? (Can I Spray Today?)* — Traffic-light Safe/Warning/Hazard status based on live weather.
     - 🔬 *पिकाला काय लक्षणे आहेत? (Crop Symptom Guide)* — Keyword search with ICAR/KVK reference guide and expert referral disclaimer.
     - 💰 *आजचा बाजारभाव काय? (Today's Mandi Rate & Hold/Sell Advice)* — Sample APMC reference prices with holding cost calculator.
     - 📞 *२४x७ किसान हेल्पलाइन (Toll-free 1800-180-1551)* — Direct one-tap phone call to official extension services.
     - 🎙️ *कृषी विचारणा (Krishi FAQ)* — Multilingual question-answer lookup with official KVK helpline fallback.
     - 🛡️ *₹१ पीक विमा क्लेम (PMFBY Claim Assistance)* — 72-hour disaster intimation guide.
     - 🧪 *खताची मात्रा व वेळापत्रक (Fertilizer Bags)* — NPK split dosing schedule.
     - 📄 *७/१२ उतारा व हेल्थ कार्ड (7/12 Digital Card)* — Printable official Farm Health Card.
   - **🔊 Voice-First Text-to-Speech (TTS):** Browser SpeechSynthesis reads out advisories in Marathi, Hindi, or English.
   - **📲 Instant WhatsApp Share:** One-click sharing of prescriptions, mandi trends, and weather warnings to farmer groups and Krishi Seva Kendra shops.

---

## 🚀 Core Functional Modules

### 1. ⛅ Agro-Meteorology & Spray Advisory Module
- **Live Upstream:** Integrated with Open-Meteo weather API across all 36 Maharashtra districts.
- **Decision Engine:** Evaluates wind speed, relative humidity, and precipitation probability to issue specific spray windows with audio readout and WhatsApp sharing.
- **Provenance:** `LIVE` with in-memory TTL caching and graceful `UNAVAILABLE` fallback.

### 2. 📊 APMC Mandi Rate Board & Price Forecaster Scenario
- **Market Schema:** Curated reference daily modal prices compatible with Agmarknet and Maharashtra State Agricultural Marketing Board (MSAMB).
- **Price Forecasting Scenario:** Illustrative heuristic price scenario model gated behind `DEMO_MODE` and labeled `SIMULATED`.
- **Hold vs. Sell Engine:** Computes warehouse storage carrying costs, shrinkage loss %, and net gain to protect farmers from distress selling.

### 3. 🔬 Crop Symptom Guide
- **Curated ICAR/KVK Benchmarks:** Keyword-driven symptom identification guide for Maharashtra crops (Cotton, Soybean, Tomato, Sugarcane, Onion).
- **Non-Diagnostic Disclaimer:** Prominently warns that symptom matching is not a clinical laboratory diagnosis and advises showing affected leaves to a local KVK or crop expert.
- **Dual Remedy:** Side-by-side Organic/Bio-control (Neem, Jeevamrut, Dashparni) vs. Targeted Chemical control with pump dosages per 15-litre knapsack pump.

### 4. 💧 Smart Jal-Mitra: Precision Drip Irrigation & Water Budgeting
- **Evapotranspiration ($ET_c$):** Integrates temperature, humidity, crop coefficient ($K_c$), and soil water-holding capacity.
- **Execution Guidance:** Outputs estimated daily drip runtime in minutes and farm pond reserve countdown days.

### 5. 🧮 Farm Economics & Sensitivity Calculator
- **Mathematical Integrity:** Deterministic arithmetic formulas for total cost, gross revenue, net profit, ROI %, and break-even price/yield.
- **5×5 Sensitivity Matrix:** Computes outcome variability across price and yield fluctuations (-20% to +20%).

### 6. 🔬 ICAR Soil Health Interpretation Engine
- **Agronomic Standards:** Interprets soil pH and organic carbon percentage, providing verified corrective amendments (agricultural lime, gypsum, compost).

### 7. 📜 Government Schemes & DBT Directory
- **Curated Catalog:** Central & Maharashtra state initiatives (PM-KISAN, PMFBY ₹1 Crop Insurance, PoCRA, Magel Tyala Shet Tale) with verified official portal links and last verified dates.

### 8. 🌱 Scientific Crop Recommendation & Intercropping Planner
- **Agro-Climatic Benchmarking:** Evaluates Maharashtra's agro-climatic zones, soil texture, pH, and rainfall/irrigation conditions.
- **Intercrop Multiplier:** Recommends scientifically validated row ratios (e.g. *Soybean + Pigeonpea 4:2*, *Cotton + Mung 1:2*).

### 9. 🧪 Fertilizer & N-P-K Split Dosage Engine
- **Soil Health Card Adjusted:** Calculates bags of DAP, Urea, MOP, and SSP tailored to specific acreages.
- **3-Stage Split Schedule:** Prepares Basal, 30 DAS Vegetative, and 60 DAS Flowering top-dressing schedules.

### 10. 🛡️ PMFBY ₹1 Crop Insurance & Emergency Claim Desk
- **Maharashtra ₹1 Policy Calculation:** Calculates farmer token premium (₹1) vs. state actuarial subsidy.
- **72-Hour Disaster Intimation:** Emergency countdown, localized damage assessment, panchnama checklist, and toll-free helpline (14447).

### 11. 🚜 Custom Hiring Center (CHC) Farm Machinery Rental
- **Mechanization Suite:** Benchmark rental tariffs for spray drones, 45HP 4WD tractors, rotavators, and combine harvesters.
- **Cost & Fuel Estimator:** Detailed breakdown of rental, diesel consumption, and certified operator costs.

### 12. 🐄 Pashu-Mitra Dairy & Vaccination Companion
- **Total Mixed Ration (TMR):** Calculates dry matter, green fodder, dry straw, and cattle feed concentrate requirements based on body weight and milk yield.
- **Vaccination Tracker:** NDDB vaccination schedule for FMD, HS, and BQ.

### 13. 🛰️ Canopy NDVI Vegetation Simulation
- **Synthetic Vegetation Model:** Illustrative canopy vigor simulation gated behind `DEMO_MODE` with `SIMULATED` provenance badge.

### 14. 📦 MSWC Warehouses & e-NWR Pledge Financing
- **State Warehouse Directory:** Direct contacts and capacity details for Maharashtra State Warehousing Corporation (MSWC) and CWC godowns.
- **Pledge Loan Calculator:** Enables farmers to estimate up to 75% advance liquidity at 7% subvented interest instead of distress selling.

### 15. 🎙️ Multilingual Krishi FAQ & KVK Directory
- **Curated Knowledge Base:** Answers common agronomic questions in Marathi, Hindi, and English.
- **Human Fallback:** Directly routes unanswered questions to the nearest Krishi Vigyan Kendra (KVK) and Kisan Call Centre (`1800-180-1551`).

### 16. 📄 Mahabhulekh Digital 7/12 & Farm Health Card Exporter
- **Land Registry Sync:** Standardized 7/12 Gat number and E-Pik Pahani digital record keeper.
- **Official Print Export:** Printable Farm Health Card for bank loan submissions and dealer fertilizer subsidies.

### 17. ⚡ Rural Lifeline: 3-Phase Electricity Feeder Roster & Emergency First Aid
- **MSEDCL 3-Phase Roster:** Standard 8-hour feeder shift timings (Day Shift: 08:00 AM to 04:00 PM vs. Night Shift: 11:00 PM to 07:00 AM), voltage health monitor, and pump protection guidelines. Note: Schedules vary by feeder; confirm with local MSEDCL office.
- **Snakebite & Poison SOS:** Direct 1-tap call to 108 Ambulance, sample hospital directory (confirm stock prior to transit), and non-invasive first-aid protocols (no tourniquets, no cutting/sucking).
- **Desi Bio-Inputs Lab:** University formulations for *Jeevamrut*, *Dashparni Ark*, and *Sour Buttermilk*.

### 18. 👥 Farm Operations, Labor Wage Hub & Seed Format Checker
- **Krishi Majur Wage Benchmarks:** Sample district-wise daily wage rates for farm operations with contactable crew directory.
- **Seed Lot Format Checker:** Syntax format validation against Indian seed lot standards. (Format check only; does not confirm physical seed purity or authenticity).
- **Groundwater Advisory:** Static water level monitoring (bgl), GSDA casing recommendations, and borewell recharge pit design diagrams.

### 19. 🤝 Direct Kisan Bazaar & PMFME 35% Food Processing
- **Farm-to-Buyer Listings:** Simulated community marketplace for direct farm-to-buyer produce lots.
- **PMFME Food Processing Profiles:** Curated feasibility profiles for *Mini Dal Mills*, *Wood-pressed Lakadi Ghani*, and *Onion Solar Dehydration* with 35% capital subsidy calculations.

### 20. 💳 KCC Subsidized Loan Dossier & Kisan Nyay Legal Aid
- **KCC Loan Dossier:** Generates crop-wise DLTC Scale of Finance bank dossiers calculating 0% net interest rate under Maharashtra's Dr. Punjabrao Deshmukh scheme for prompt repayment up to ₹3 Lakhs.
- **Kisan Nyay Legal Remedies:** Step-by-step statutory remedies for *Mamlatdar's Courts Act Sec 143 (Farm Road right-of-way disputes)* and Consumer Protection Act seed claims.
- **Omnichannel Access Gateway:** Interactive simulation of missed-call automated voice advisory (IVR) and zero-data WhatsApp Krishi Bot.

---

## 🛡️ Data Provenance Framework

To prevent misinformation, every API response and frontend widget explicitly declares its data origin:

| Provenance Label | Meaning & Usage |
|---|---|
| `LIVE` | Fetched directly from verified upstream endpoints (Open-Meteo) within valid TTL. Includes `source` and `fetched_at`. |
| `HISTORICAL` | Archived official published records. |
| `CURATED_REFERENCE` | Hand-verified static catalogs (schemes, CHC rates, KVK contacts, hospital directory) with `source_url`, `last_verified`, and reviewer metadata. |
| `ESTIMATED` | Deterministically computed by mathematical agronomic algorithms (economics calculator, fertilizer RDF). |
| `SIMULATED` | Illustrative synthetic models gated behind `DEMO_MODE` (mandi forecast, NDVI canopy model, kisan bazaar, omnichannel). |
| `USER_PROVIDED` | Input directly by the cultivator (soil test report values, farm area, Gat number). |
| `UNAVAILABLE` | Explicitly declared when upstream sources are unreachable or records are absent (no fake fallbacks). |

Audit all modules and datasets anytime via the `/data-registry` API endpoint.

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
│   │   │   ├── forecasting/# Mandi price forecasting scenario (DEMO_MODE)
│   │   │   ├── calculator/ # Pure economics engine & sensitivity matrix
│   │   │   ├── soil/       # ICAR soil test interpretation engine
│   │   │   ├── schemes/    # Central & State schemes catalog
│   │   │   ├── disease/    # ICAR/KVK symptom guide
│   │   │   ├── crops/      # Agro-climatic crop suitability recommender
│   │   │   ├── fertilizer/ # ICAR RDF NPK calculator
│   │   │   ├── insurance/  # PMFBY insurance calculator
│   │   │   ├── equipment/  # CHC custom hiring rate cards
│   │   │   ├── livestock/  # Dairy ration & NDDB vaccination
│   │   │   ├── remote_sensing/# NDVI canopy simulation (DEMO_MODE)
│   │   │   ├── postharvest/# MSWC warehouses & e-NWR pledge loans
│   │   │   ├── assistant/  # Krishi FAQ & KVK directory
│   │   │   ├── rural_ops/  # Feeder electricity, emergency first aid, bio-recipes
│   │   │   ├── operations/ # Labor wage hub, seed format checker, groundwater
│   │   │   ├── market_linkage/# Kisan bazaar (simulated) & PMFME food processing
│   │   │   ├── institutional/# KCC loan dossier, Kisan Nyay, omnichannel simulation
│   │   │   └── mapping/    # Agricultural problem classification engine
│   │   ├── routers/        # FastAPI REST endpoints
│   │   └── main.py         # App factory, CORS, exception handlers
│   ├── tests/              # 17 automated pytest test suites (73 tests)
│   ├── requirements.txt    # Python dependencies
│   └── pytest.ini          # Pytest configuration
├── frontend/
│   ├── app/
│   │   ├── globals.css     # Complete styling system for Dribbble & Govt themes
│   │   ├── layout.tsx      # Root Next.js layout & metadata
│   │   └── page.tsx        # Interactive UI with dual-theme architecture & Easy Kisan Mode
│   ├── messages/           # Localization dictionaries (mr.json, hi.json, en.json)
│   ├── package.json        # Dependencies (Next.js 14, React, TypeScript)
│   └── .env.local          # Environment configuration
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

# Run the test suite (73 tests)
pytest -v

# Launch development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
API Documentation (Interactive Swagger): **`http://localhost:8000/docs`**  
Data Source Registry: **`http://localhost:8000/data-registry`**

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

All 73 backend tests across 17 suites pass with a 100% success rate:

```text
======================== 73 passed, 1 warning in 2.25s ========================
tests/test_api.py (8 tests)
tests/test_assistant.py (4 tests)
tests/test_auth.py (6 tests)
tests/test_calculator.py (2 tests)
tests/test_crops.py (3 tests)
tests/test_data_registry.py (1 test)
tests/test_disease_forecast.py (4 tests)
tests/test_equipment_livestock.py (3 tests)
tests/test_fertilizer.py (2 tests)
tests/test_institutional.py (3 tests)
tests/test_insurance.py (1 test)
tests/test_mapping.py (4 tests)
tests/test_market.py (5 tests)
tests/test_market_linkage.py (2 tests)
tests/test_operations.py (3 tests)
tests/test_provenance_integrity.py (4 tests)
tests/test_remote_sensing_postharvest.py (2 tests)
tests/test_rural_ops.py (4 tests)
tests/test_soil_schemes.py (5 tests)
tests/test_weather.py (7 tests)
```

Frontend production build (`npm run build`) compiles with zero errors and static pre-rendering optimization.

---

## 📄 License
This project is licensed under the MIT License.
