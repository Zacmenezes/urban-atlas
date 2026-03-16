from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, Integer, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column

from ..db import Base


class ConstructionLicense(Base):
    __tablename__ = "construction_licenses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    process_number: Mapped[str | None] = mapped_column(String(100), nullable=True, unique=True)
    license_number: Mapped[str | None] = mapped_column(String(100), nullable=True)
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    neighborhood: Mapped[str | None] = mapped_column(String(100), nullable=True)
    builder: Mapped[str | None] = mapped_column(String(255), nullable=True)
    area_m2: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    issue_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    expiration_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
