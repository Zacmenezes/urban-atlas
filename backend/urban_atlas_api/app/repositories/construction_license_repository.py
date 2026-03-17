from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models.construction_license import ConstructionLicense
from ..schemas.construction_license import ConstructionLicenseCreate


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
