# Architecture
Modular monolith: one FastAPI app, one PostgreSQL(+PostGIS) database, modules under `backend/app/modules/<name>` each with its own router, schemas, tests and data-source adapter. Frontend is a separate Next.js PWA calling the REST API.

```
Next.js PWA (mr/hi/en) ──REST──> FastAPI
                                   ├─ routers/ (HTTP only)
                                   ├─ modules/ (domain logic: mapping, soil, crop_rec ...)
                                   ├─ adapters/ (weather, market, ... one interface per provider; cache + timeout + retry)
                                   ├─ core/ (config, provenance, security)
                                   └─ models/ (SQLAlchemy) ──> PostgreSQL/PostGIS (SQLite for dev/tests)
```
Rules: modules never import each other's internals (use service interfaces); adapters return `(value, Provenance, fetched_at, source)`; failures return `UNAVAILABLE`, never invented data.
See `docs/ARCHITECTURE_OPTIONS.md` for alternatives, `docs/DATA_MODEL.md` for ER diagram, `docs/MODULE_DEPENDENCIES.md`.
