# Architecture (Initial)

## Monorepo

- `backend/urban_atlas_api`: FastAPI service and domain layers.
- `frontend/urban-atlas-web`: Angular web client.
- `infrastructure/docker`: Dockerfiles for local development and future CI/CD integration.

## Backend layers

- `app/api`: HTTP routes and API contracts.
- `app/services`: Business logic.
- `app/repositories`: Data access abstractions.
- `app/models`: ORM/domain models.
- `app/schemas`: Pydantic schemas.
- `app/db`: Database integration.
- `app/core`: Configuration and shared core utilities.

