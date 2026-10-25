# Roadmap (Status: Verified & Tested)
| Phase | Scope | Status | Evidence / Tests |
|---|---|---|---|
| 0 Research | Problem catalog, data-source verification, MPKV/ICAR benchmarks | COMPLETED | `research/`, `mapping/` |
| 1 Foundation | Auth (Argon2), roles, DB models, multi-tenancy, i18n shell (mr/hi/en) | COMPLETED | `tests/test_auth.py`, `tests/test_api.py` |
| 2 Decision support | Weather, APMC Mandi price forecaster, economics calculator, soil interp, schemes | COMPLETED | `tests/test_weather.py`, `tests/test_market.py`, `tests/test_calculator.py`, `tests/test_soil_schemes.py` |
| 3 Crop recommendation | ICAR/MPKV crop suitability scoring & intercropping row ratios (B) | COMPLETED | `tests/test_crops.py` |
| 4 Decision support | Crop symptom guide (D), Voice-first Krishi Mitra advisor (Q) | COMPLETED | `tests/test_disease_forecast.py`, `tests/test_assistant.py` |
| 5 Operations | Jal-Mitra ET_c irrigation (F), NPK split fertilizer (G), MSWC storage & e-NWR (N) | COMPLETED | `tests/test_fertilizer.py`, `tests/test_remote_sensing_postharvest.py` |
| 6 Advanced | Canopy NDVI simulator (M), CHC equipment (O), PMFBY ₹1 insurance (L), Pashu-Mitra (P) | COMPLETED | `tests/test_equipment_livestock.py`, `tests/test_insurance.py`, `tests/test_remote_sensing_postharvest.py` |
| 7 Competition adapter | 3D Schemes corridor, 7/12 Land record digitizer, Farm health card print | COMPLETED | `frontend/app/schemes/`, `frontend/app/components/SatbaraModule.tsx` |
| 8 Field validation | Farmer interviews, Maharashtra university pilot validation | IN PROGRESS | On-ground FPO evaluation |

