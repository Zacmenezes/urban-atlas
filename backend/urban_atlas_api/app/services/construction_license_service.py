from datetime import date

from sqlalchemy.orm import Session

from ..models.construction_license import ConstructionLicense
from ..repositories import construction_license_repository as repository
from ..schemas.construction_license import ConstructionLicenseCreate, ConstructionLicenseListRead, ConstructionLicenseMapRead


def get_table(
    db: Session,
    *,
    page: int,
    page_size: int,
    process_number: str | None = None,
    license_number: str | None = None,
    builder: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    status: str | None = None,
) -> ConstructionLicenseListRead:
    rows, total = repository.get_table(
        db,
        page=page,
        page_size=page_size,
        process_number=process_number,
        license_number=license_number,
        builder=builder,
        start_date=start_date,
        end_date=end_date,
        status=status,
    )
    return ConstructionLicenseListRead(items=rows, total=total, page=page, page_size=page_size)


def get_all(
    db: Session,
    *,
    bbox: tuple[float, float, float, float] | None = None,
    zoom: int = 0,
) -> list[ConstructionLicenseMapRead]:
    return [ConstructionLicenseMapRead.model_validate(row) for row in repository.get_all(db, bbox=bbox, zoom=zoom)]


def get_by_id(db: Session, license_id: int) -> ConstructionLicense | None:
    return repository.get_by_id(db, license_id)


def create(db: Session, payload: ConstructionLicenseCreate) -> ConstructionLicense:
    return repository.create(db, payload)
