# Roadmap (complexity: S/M/L/XL — rough estimates for a small student team)
| Phase | Scope | Depends on | Complexity |
|---|---|---|---|
| 0 Research | Problem catalog, data-source verification, expert contacts | — | M |
| 1 Foundation | Auth, roles, Alembic, Postgres, CI, i18n shell | 0 (partly) | M |
| 2 Decision support | Weather, market, calculator, soil interp, schemes | 1, data verification | L |
| 3 Crop recommendation (rules + expert review) | 2 (soil, weather) | L |
| 4 AI features | Disease model, RAG assistant, yield | datasets, evaluation harness, 2 | XL |
| 5 Operations | Irrigation, nutrients, harvest, storage | 2, 3 | L |
| 6 Advanced | Satellite, IoT, equipment, insurance docs, livestock | 1–5 | XL |
| 7 Competition adapter | Importer UI, traceability reports, demo scripts | catalog filled, 1–5 | M |
| 8 Field validation | Farmer interviews, expert review, pilot | 2+ | L (needs partners) |
