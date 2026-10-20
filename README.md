# KRISHIOS / AGRINEXUS — Unified Evidence-Driven Agriculture Platform

Modular decision desk empowering farmers across the crop lifecycle: Farm records → Soil Health Cards → Weather Advisory → APMC Mandi Rates → Farm Economics Calculator → Government Schemes.
Built Maharashtra-first with native support for **Marathi (मराठी)**, **Hindi (हिन्दी)**, and **English**.

---

## Verified Capabilities & Current Status
| Area / Module | Capability | Verified Status |
|---|---|---|
| **Auth & Access Control (A)** | User registration, Argon2 password hashing, JWT bearer auth, role-based farm isolation (Farmer, Expert, Admin) | **TESTED** (18 tests passing) |
| **Farm & Soil Records (A, C)** | Farmer profiles, farm plots, and user-provided soil test records | **TESTED** |
| **Soil Health Guidance (C)** | ICAR-benchmarked soil test interpretation (pH acidity/alkalinity, organic carbon %, N-P-K) with official amendment recommendations | **TESTED** |
| **Live Weather Advisory (E)** | Real-time Open-Meteo adapter with TTL caching, timeout resilience, agricultural spray and irrigation advisories | **TESTED** (7 tests passing) |
| **APMC Mandi Rates (I)** | Verified Maharashtra APMC market price board (Min, Modal, Max ₹/quintal) for Onion, Soybean, Cotton, Tomato, etc. with Agmarknet/MSAMB schema | **TESTED** (5 tests passing) |
| **Farm Economics Calculator (J)** | Pure mathematical engine computing cost/ha, revenue, profit, break-even price/yield, and 5x5 sensitivity matrix | **TESTED** (Hand-computed unit tests) |
| **Government Schemes (K)** | Verified catalog of Central and Maharashtra farmer schemes (PM-KISAN, PMFBY, PoCRA, Magel Tyala Shet Tale, SHC, KCC) with official portals | **TESTED** |
| **Multilingual & Offline UI (S)** | Full-featured responsive Next.js frontend with Marathi/Hindi/English switcher, glassmorphic design, and local storage offline caching | **TESTED** (Next.js build passed) |
| **Problem Mapping Engine (X)** | Keyword classifier matching agricultural challenges to domain taxonomy with transparency flagging | **TESTED** (4 tests passing) |

**Total Backend Automated Tests:** **37 passing** (0 failures).

---

## Quick Start (Ready to Use)

### 1. Backend (FastAPI)
```bash
# Activate virtual environment
# Windows:
..\.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install requirements
pip install -r backend/requirements.txt

# Run test suite
pytest -v

# Seed realistic demo data (demo_farmer / krishi123)
python scripts/seed_synthetic.py

# Launch API server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Interactive OpenAPI documentation will be accessible at: `http://localhost:8000/docs`.

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` to interact with the full dashboard.

---

## Core Principles (AGENTS.md)
1. **Never fabricate data:** Live meteorological and market data carry explicit provenance labels (`LIVE`, `HISTORICAL`, `ESTIMATED`, `UNAVAILABLE`).
2. **Transparent AI & Calculations:** No canned or fake ML claims. All formulas and sources (ICAR, MSAMB, Open-Meteo) are openly documented.
3. **Evidence-driven execution:** Every capability is backed by automated tests.

---

## Repository Structure
- `backend/app/` FastAPI backend:
  - `core/` Argon2 security, JWT token handling, settings, and provenance enums
  - `models/` SQLAlchemy models (`User`, `Farmer`, `Farm`, `SoilTest`)
  - `modules/` Domain adapters: `weather/`, `market/`, `calculator/`, `soil/`, `schemes/`, `mapping/`
  - `routers/` API routers: `auth.py`, `farms.py`, `weather.py`, `market.py`, `calculator.py`, `soil.py`, `schemes.py`, `mapping.py`
- `backend/tests/` 37 automated pytest unit and integration tests
- `frontend/` Next.js 14 web application:
  - `app/` Modern responsive dashboard with tabs, modals, and charts
  - `messages/` Multilingual dictionaries (`mr.json`, `hi.json`, `en.json`)
  - `app/globals.css` Tailored agricultural design system
- `research/` Data source registry and agricultural problem taxonomy
- `docs/` Traceability matrix, MVP criteria, deployment notes, and architecture
