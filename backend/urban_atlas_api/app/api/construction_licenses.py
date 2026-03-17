from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..schemas.construction_license import (
    ConstructionLicenseCreate,
    ConstructionLicenseMapRead,
    ConstructionLicenseRead,
)
from ..services import construction_license_service as service

router = APIRouter(prefix="/licenses", tags=["licenses"])


def _parse_bbox(bbox: str | None) -> tuple[float, float, float, float] | None:
    if bbox is None:
        return None

    try:
        min_lng, min_lat, max_lng, max_lat = [float(value.strip()) for value in bbox.split(",")]
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="bbox must contain minLng,minLat,maxLng,maxLat",
        ) from exc

    if min_lng > max_lng or min_lat > max_lat:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="bbox coordinates must be ordered as minLng,minLat,maxLng,maxLat",
        )

    return min_lng, min_lat, max_lng, max_lat


@router.get("", response_model=list[ConstructionLicenseMapRead])
def list_licenses(
    bbox: str | None = Query(default=None, description="minLng,minLat,maxLng,maxLat"),
    zoom: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    return service.get_all(db, bbox=_parse_bbox(bbox), zoom=zoom)


@router.get("/{license_id}", response_model=ConstructionLicenseRead)
def get_license(license_id: int, db: Session = Depends(get_db)):
    license_row = service.get_by_id(db, license_id)
    if license_row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="License not found")
    return license_row


@router.post("", response_model=ConstructionLicenseRead, status_code=status.HTTP_201_CREATED)
def create_license(
    payload: ConstructionLicenseCreate,
    db: Session = Depends(get_db),
):
    return service.create(db, payload)
