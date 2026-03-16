from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.construction_licenses import router as construction_licenses_router

app = FastAPI(title="UrbanAtlas API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(construction_licenses_router)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}
