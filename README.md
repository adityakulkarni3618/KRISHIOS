# AGRINEXUS — Unified AI-Powered Agriculture Ecosystem (working name)

Modular platform helping farmers across the crop lifecycle: farm records → soil → crop planning → weather → disease → irrigation → market → finance → schemes. India/Maharashtra first; Marathi, Hindi, English.

> Name is provisional. Check trademark/domain conflicts before public use.

## Honest status (as of creation)
| Area | Status |
|---|---|
| Backend foundation (FastAPI, SQLAlchemy, health) | Built, 12 tests passing |
| Farmer / Farm / Soil-test records | Built (no auth yet, open endpoints — dev only) |
| Problem-statement mapping engine | Built (keyword classifier, human review required) |
| Research catalog | **Empty — must be filled from official sources** (see `prompts/00_research.md`) |
| Frontend | Skeleton only, **untested** |
| Every other module (B, D–T) | NOT IMPLEMENTED |

## Quick start
```bash
make setup
make test
make run   # http://localhost:8000/docs
```
Optional: `docker compose up` for PostgreSQL/PostGIS.

## Layout
- `backend/` FastAPI app + tests · `frontend/` Next.js skeleton · `research/` problem catalog & data-source registry
- `docs/` architecture, roadmap, MVP, risks, pilot, tests, deployment, traceability · `prompts/` ready-to-paste build prompts · `AGENTS.md` agent rules
- Read first: `docs/MVP.md`, `docs/DECISIONS_NEEDED.md`, `docs/ROADMAP.md`.
