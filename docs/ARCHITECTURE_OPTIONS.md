# Architecture options
| Option | Pros | Cons | Verdict |
|---|---|---|---|
| A. Modular monolith: FastAPI + Next.js + Postgres/PostGIS | Simple, one deploy, good Python ML ecosystem | Needs discipline on module boundaries | **Recommended** |
| B. Microservices | Independent scaling | Ops burden a student team can't carry | Reject for now |
| C. Full-stack TS (Next.js API + Prisma) | One language | Weaker ML/geo tooling; ML needs Python anyway | Alternative |
| D. Supabase/Firebase BaaS | Fast auth/DB | Vendor lock-in, geospatial/ML limits, free-tier limits to verify | Possible for prototype |
Dev DB is SQLite for speed; production target is PostgreSQL+PostGIS (geospatial features need it).
