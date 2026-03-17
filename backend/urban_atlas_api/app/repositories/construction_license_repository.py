from datetime import date

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..models.construction_license import ConstructionLicense
from ..schemas.construction_license import ConstructionLicenseCreate


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
) -> tuple[list[ConstructionLicense], int]:
    filters = []

    if process_number:
        filters.append(func.lower(ConstructionLicense.process_number).like(f"%{process_number.lower()}%"))

    if license_number:
        filters.append(func.lower(ConstructionLicense.license_number).like(f"%{license_number.lower()}%"))

    if builder:
        filters.append(func.lower(ConstructionLicense.builder).like(f"%{builder.lower()}%"))

    if start_date is not None:
        filters.append(ConstructionLicense.issue_date >= start_date)

    if end_date is not None:
        filters.append(ConstructionLicense.issue_date <= end_date)

    today = date.today()
    if status == "active":
        filters.append(ConstructionLicense.expiration_date.is_not(None))
        filters.append(ConstructionLicense.expiration_date >= today)
    elif status == "expired":
        filters.append(ConstructionLicense.expiration_date.is_not(None))
        filters.append(ConstructionLicense.expiration_date < today)
    elif status == "unknown":
        filters.append(ConstructionLicense.expiration_date.is_(None))

    total_stmt = select(func.count()).select_from(ConstructionLicense).where(*filters)
    total = db.scalar(total_stmt) or 0

    offset = (page - 1) * page_size
    stmt = (
        select(ConstructionLicense)
        .where(*filters)
        .order_by(ConstructionLicense.issue_date.desc().nullslast(), ConstructionLicense.id.asc())
        .offset(offset)
        .limit(page_size)
    )
    return list(db.scalars(stmt).all()), total


def get_all(
    db: Session,
    *,
    bbox: tuple[float, float, float, float] | None = None,
    zoom: int = 0,
) -> list[dict[str, int | float | str | None]]:
    if zoom < 12:
        return []

    stmt = (
        select(
            ConstructionLicense.id,
            ConstructionLicense.latitude,
            ConstructionLicense.longitude,
            ConstructionLicense.process_number,
            ConstructionLicense.address,
        )
        .where(ConstructionLicense.latitude.is_not(None))
        .where(ConstructionLicense.longitude.is_not(None))
        .order_by(ConstructionLicense.id.asc())
    )

    if bbox is not None:
        min_lng, min_lat, max_lng, max_lat = bbox
        stmt = stmt.where(ConstructionLicense.latitude.between(min_lat, max_lat)).where(
            ConstructionLicense.longitude.between(min_lng, max_lng)
        )

    if zoom < 14:
        stmt = stmt.limit(200)
    else:
        stmt = stmt.limit(1000)

    return list(db.execute(stmt).mappings().all())


def get_by_id(db: Session, license_id: int) -> ConstructionLicense | None:
    stmt = select(ConstructionLicense).where(ConstructionLicense.id == license_id)
    return db.scalars(stmt).first()


def create(db: Session, payload: ConstructionLicenseCreate) -> ConstructionLicense:
    license_row = ConstructionLicense(**payload.model_dump())
    db.add(license_row)
    db.commit()
    db.refresh(license_row)
    return license_row
