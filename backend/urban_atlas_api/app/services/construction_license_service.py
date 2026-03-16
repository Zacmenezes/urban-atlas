from sqlalchemy.orm import Session

from ..models.construction_license import ConstructionLicense
from ..repositories import construction_license_repository as repository
from ..schemas.construction_license import ConstructionLicenseCreate


def get_all(db: Session) -> list[ConstructionLicense]:
    return repository.get_all(db)


def get_by_id(db: Session, license_id: int) -> ConstructionLicense | None:
    return repository.get_by_id(db, license_id)


def create(db: Session, payload: ConstructionLicenseCreate) -> ConstructionLicense:
    return repository.create(db, payload)
