from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..schemas.construction_license import ConstructionLicenseCreate, ConstructionLicenseRead
from ..services import construction_license_service as service

router = APIRouter(prefix="/licenses", tags=["licenses"])


@router.get("", response_model=list[ConstructionLicenseRead])
def list_licenses(db: Session = Depends(get_db)) -> list[ConstructionLicenseRead]:
    return service.get_all(db)


@router.get("/{license_id}", response_model=ConstructionLicenseRead)
def get_license(license_id: int, db: Session = Depends(get_db)) -> ConstructionLicenseRead:
    license_row = service.get_by_id(db, license_id)
    if license_row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="License not found")
    return license_row


@router.post("", response_model=ConstructionLicenseRead, status_code=status.HTTP_201_CREATED)
def create_license(
    payload: ConstructionLicenseCreate,
    db: Session = Depends(get_db),
) -> ConstructionLicenseRead:
    return service.create(db, payload)
