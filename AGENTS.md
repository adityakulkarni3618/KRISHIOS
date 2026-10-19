# AGENTS.md — rules for any AI agent working in this repo

Project: AGRINEXUS, a modular, evidence-driven agriculture platform (India first, Maharashtra pilot).

## Hard rules
1. Never fabricate weather, mandi prices, schemes, soil values, sensor data, model outputs or accuracy numbers.
2. Every data value carries a provenance label: LIVE / HISTORICAL / ESTIMATED / SIMULATED / USER_PROVIDED / UNAVAILABLE (`backend/app/core/provenance.py`).
3. No fake AI: do not return canned answers while claiming a model produced them.
4. No pesticide/fertilizer dose advice without an official/ICAR/SAU source recorded in the code and docs.
5. Never commit secrets. Keys live in `.env` only, never in frontend code.
6. Do not claim a feature works until tests ran. Paste REAL terminal output in your report, not a summary.
7. Update `backend/app/modules/mapping/engine.py::CAPABILITIES` and `docs/TRACEABILITY_MATRIX.md` only with evidence.
8. One feature = one branch/commit. Do not delete or overwrite working code without explaining the impact first.
9. Investigate first and show findings in plain language BEFORE changing code.
10. Never present the platform as an official government service.

## Workflow
Research → plan → implement ONE vertical slice → test → document → report (what works, tests run + output, data sources, still-simulated items, limitations, next step).

## Commands
`make setup` · `make test` · `make run` (API docs at http://localhost:8000/docs)
