# UrbanAtlas

UrbanAtlas is a monorepo with an Angular frontend and a FastAPI backend.
This initial commit provides a clean project structure, minimal boilerplate, and Docker-based local development.

## Repository structure

```text
urban-atlas/
  backend/urban_atlas_api/
  frontend/urban-atlas-web/
  infrastructure/docker/
  docs/
  scripts/
  docker-compose.yml
```

## Quick start (Docker)

1. Copy env template:
   - `cp .env.example .env` (Linux/macOS)
   - `Copy-Item .env.example .env` (PowerShell)
2. Run services:
   - `docker compose up --build`

## Service URLs

- Frontend: http://localhost:4200
- Backend API: http://localhost:8000
- Backend docs: http://localhost:8000/docs
- Backend health check: http://localhost:8000/health

## Notes

- Backend uses Python 3.11+ and FastAPI.
- Frontend uses Angular (minimal standalone setup).
- This is a starter layout meant for incremental feature development.

