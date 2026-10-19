# Deployment
Local: `make setup && make run`. Containers: `docker compose up`. Production-oriented config: PostgreSQL, env-based secrets, HTTPS, backups (pg_dump nightly + restore test). Hosting provider **not chosen** — check current free-tier limits before deciding. Migrations: Alembic (to be added in Milestone 1b).
