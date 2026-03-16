"""create construction_licenses table

Revision ID: 20260316_0001
Revises:
Create Date: 2026-03-16 00:00:00
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "20260316_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "construction_licenses",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("process_number", sa.String(length=100), nullable=False, unique=True),
        sa.Column("address", sa.String(length=255), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column("issue_date", sa.Date(), nullable=False),
        sa.Column("area", sa.Float(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(
        "ix_construction_licenses_id",
        "construction_licenses",
        ["id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("ix_construction_licenses_id", table_name="construction_licenses")
    op.drop_table("construction_licenses")

