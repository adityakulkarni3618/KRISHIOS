# Troubleshooting
- `ModuleNotFoundError: app` → run pytest/uvicorn from `backend/`.
- `ModuleNotFoundError` for packages → `make setup`.
- Stale SQLite schema after model change → delete `backend/agrinexus.db` (dev only).
