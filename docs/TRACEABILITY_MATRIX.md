# Requirements traceability matrix
Coverage values: NOT IMPLEMENTED · PARTIALLY IMPLEMENTED · IMPLEMENTED · TESTED · FIELD-VALIDATED. Update only with evidence.

| Requirement | Module | Capability | Code | Test | Evidence | Limitation | Status |
|---|---|---|---|---|---|---|---|
| Register farmer and farm | A | Create/read farmer, farm | `routers/farms.py` | `tests/test_api.py` | 12 passing tests | No auth; no edit/delete | PARTIALLY IMPLEMENTED |
| Record soil test | C | Store user-provided pH/OC | `routers/farms.py` | `test_soil_test_is_labelled_user_provided` | tests | No interpretation | PARTIALLY IMPLEMENTED |
| Classify problem statement | X | Keyword classifier | `modules/mapping/engine.py` | `tests/test_mapping.py` | tests | Not ML; human review needed | PARTIALLY IMPLEMENTED |
