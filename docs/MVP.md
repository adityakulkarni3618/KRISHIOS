# Prioritized MVP (proposal — needs your approval)
**Principle:** few features that really work beat 20 that don't. MVP = "Farm Decision Desk" for pilot-region farmers.

| # | Feature | Acceptance criteria (all must pass) | Data |
|---|---|---|---|
| 1 | Farmer + farm + soil-test records (DONE, no auth) | CRUD works; invalid input rejected; provenance shown; tests pass | User-provided |
| 2 | Auth + roles | Passwords hashed; protected routes return 401/403 correctly; tests for cross-user access | — |
| 3 | Weather advisory (E) | Shows source, timestamp, freshness; provider failure shows UNAVAILABLE, no fake values; cache + timeout tests | Provider TBD after verification (IMD / Open-Meteo / NASA POWER) |
| 4 | Market prices (I) | Prices come from verified official source; modal/min/max separated; missing data handled; date shown | Agmarknet via data.gov.in (verify access/limits) |
| 5 | Farm economics calculator (J) | Unit tests on formulas (cost, break-even yield/price, sensitivity); labelled ESTIMATE; no guarantees | User inputs |
| 6 | Soil interpretation (C) | Thresholds sourced from Soil Health Card/ICAR docs and cited; expert reviewed | Official guidance |
| 7 | Scheme finder (K) | Each scheme has official URL + last-checked date; no conclusive eligibility claims | Official portals |
| 8 | Marathi/Hindi/English UI + offline record entry (S) | All MVP screens translated and reviewed by native speaker; offline queue syncs; conflict test | — |

Deferred until MVP is validated: disease detection (needs dataset + independent evaluation), yield forecasting, satellite, IoT, community, equipment sharing, livestock.
