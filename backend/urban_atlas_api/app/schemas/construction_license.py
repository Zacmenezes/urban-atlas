from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class ConstructionLicenseBase(BaseModel):
    process_number: str | None = None
    license_number: str | None = None
    address: str | None = None
    neighborhood: str | None = None
    builder: str | None = None
    area_m2: float | None = None
    issue_date: date | None = None
    expiration_date: date | None = None
    latitude: float | None = None
    longitude: float | None = None


class ConstructionLicenseCreate(ConstructionLicenseBase):
    pass


class ConstructionLicenseRead(ConstructionLicenseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

