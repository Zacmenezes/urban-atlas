"""update construction_licenses columns

Revision ID: 20260316_0002
Revises: 20260316_0001
Create Date: 2026-03-16 00:10:00
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "20260316_0002"
down_revision: str | None = "20260316_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    with op.batch_alter_table("construction_licenses") as batch_op:
        batch_op.alter_column("process_number", existing_type=sa.String(length=100), nullable=True)
        batch_op.alter_column("address", existing_type=sa.String(length=255), nullable=True)
        batch_op.alter_column("latitude", existing_type=sa.Float(), nullable=True)
        batch_op.alter_column("longitude", existing_type=sa.Float(), nullable=True)
        batch_op.alter_column("issue_date", existing_type=sa.Date(), nullable=True)
        batch_op.alter_column(
            "area",
            existing_type=sa.Float(),
            type_=sa.Numeric(10, 2),
            nullable=True,
            new_column_name="area_m2",
        )
        batch_op.add_column(sa.Column("license_number", sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column("neighborhood", sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column("builder", sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column("expiration_date", sa.Date(), nullable=True))
        batch_op.add_column(
            sa.Column(
                "updated_at",
                sa.DateTime(timezone=True),
                nullable=False,
                server_default=sa.func.now(),
            )
        )


def downgrade() -> None:
    with op.batch_alter_table("construction_licenses") as batch_op:
        batch_op.drop_column("updated_at")
        batch_op.drop_column("expiration_date")
        batch_op.drop_column("builder")
        batch_op.drop_column("neighborhood")
        batch_op.drop_column("license_number")
        batch_op.alter_column(
            "area_m2",
            existing_type=sa.Numeric(10, 2),
            type_=sa.Float(),
            nullable=False,
            new_column_name="area",
        )
        batch_op.alter_column("issue_date", existing_type=sa.Date(), nullable=False)
        batch_op.alter_column("longitude", existing_type=sa.Float(), nullable=False)
        batch_op.alter_column("latitude", existing_type=sa.Float(), nullable=False)
        batch_op.alter_column("address", existing_type=sa.String(length=255), nullable=False)
        batch_op.alter_column("process_number", existing_type=sa.String(length=100), nullable=False)

