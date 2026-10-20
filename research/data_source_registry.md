# Data source registry — Verified Providers & Candidates
For each: official URL, auth, cost, rate limits, license, update frequency, coverage, attribution, fallback, last verified date.

| Candidate / Provider | Likely use | Status | Details & Verification Notes |
|---|---|---|---|
| **Open-Meteo Weather API** | Real-time weather, agro-climatic advisory | **VERIFIED** | **URL:** https://open-meteo.com/ (Endpoint: `https://api.open-meteo.com/v1/forecast`).<br>**Auth:** None required for non-commercial open use.<br>**Cost:** Free.<br>**Rate Limits:** 10,000 requests/day, 60 requests/minute.<br>**License:** Creative Commons Attribution 4.0 International (CC BY 4.0).<br>**Attribution:** "Weather data by Open-Meteo.com under CC BY 4.0".<br>**Update Frequency:** Hourly based on global DWD ICON, GFS, ECMWF models.<br>**Coverage:** Global coordinate-based, high-accuracy coverage for Maharashtra districts.<br>**Fallback:** In-memory TTL cache (900s) + fallback response with `Provenance.UNAVAILABLE` on network outage.<br>**Verified Date:** 2026-10-20. |
| India Meteorological Department (IMD) | Forecast, warnings | UNVERIFIED (API availability restricted / requires enterprise MOU) | Official portal: https://mausam.imd.gov.in/ |
| Agmarknet (via data.gov.in / MSAMB) | Mandi market prices | VERIFIED (Schema & APMC daily bulletin) | APMC mandi arrivals: Min/Modal/Max prices ₹/quintal |
| e-NAM | National unified market data | CANDIDATE | Official portal: https://www.enam.gov.in/ |
| Soil Health Card portal (Govt. of India) | Soil guidance & testing norms | VERIFIED (ICAR thresholds) | Official portal: https://soilhealth.dac.gov.in/ |
| ICAR / SAUs (e.g., MPKV Rahuri) | Agronomy & package of practices | VERIFIED (Official bulletins) | ICAR crop advisories and recommended dosages |
| Copernicus Sentinel / USGS Landsat | NDVI vegetation index | CANDIDATE (Post-MVP) | Open Copernicus Hub |
| ISRIC SoilGrids | Coarse soil estimates | CANDIDATE (Post-MVP) | Coarse 250m resolution estimates |
| PlantVillage / ICAR-NCIPM | Disease identification reference | CANDIDATE (Post-MVP) | Requires ground-truth validation dataset |

Last verification date: 2026-10-20.
