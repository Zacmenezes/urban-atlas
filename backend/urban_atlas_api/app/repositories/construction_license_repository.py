from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models.construction_license import ConstructionLicense
from ..schemas.construction_license import ConstructionLicenseCreate


def get_all(db: Session) -> list[ConstructionLicense]:
    stmt = select(ConstructionLicense).order_by(ConstructionLicense.id.asc())
    return list(db.scalars(stmt).all())


def get_by_id(db: Session, license_id: int) -> ConstructionLicense | None:
    stmt = select(ConstructionLicense).where(ConstructionLicense.id == license_id)
    return db.scalars(stmt).first()


def create(db: Session, payload: ConstructionLicenseCreate) -> ConstructionLicense:
    license_row = ConstructionLicense(**payload.model_dump())
    db.add(license_row)
    db.commit()
    db.refresh(license_row)
    return license_row
