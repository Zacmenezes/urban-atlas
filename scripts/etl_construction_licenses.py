import os
from pathlib import Path

import psycopg
from psycopg.rows import dict_row


def _load_dotenv() -> None:
    dotenv_path = Path(__file__).resolve().parents[1] / ".env"
    if not dotenv_path.exists():
        return

    for raw_line in dotenv_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


_load_dotenv()

SOURCE_DB = os.getenv("SOURCE_DB")
TARGET_DB = os.getenv("TARGET_DB")


def extract(conn):
    query = """
        SELECT
            process_number,
            license_number,
            address,
            neighborhood,
            builder,
            area_m2,
            issue_date,
            expiration_date,
            latitude,
            longitude,
            created_at,
            updated_at
        FROM construction_licenses
        WHERE enhancement_status = 'SUCCESS'
    """

    with conn.cursor(row_factory=dict_row) as cur:
        cur.execute(query)
        return cur.fetchall()


def load(conn, rows):

    insert_query = """
        INSERT INTO construction_licenses (
            process_number,
            license_number,
            address,
            neighborhood,
            builder,
            area_m2,
            issue_date,
            expiration_date,
            latitude,
            longitude,
            created_at,
            updated_at
        )
        VALUES (
            %(process_number)s,
            %(license_number)s,
            %(address)s,
            %(neighborhood)s,
            %(builder)s,
            %(area_m2)s,
            %(issue_date)s,
            %(expiration_date)s,
            %(latitude)s,
            %(longitude)s,
            %(created_at)s,
            %(updated_at)s
        )
        ON CONFLICT (process_number)
        DO UPDATE SET
            address = EXCLUDED.address,
            neighborhood = EXCLUDED.neighborhood,
            builder = EXCLUDED.builder,
            area_m2 = EXCLUDED.area_m2,
            issue_date = EXCLUDED.issue_date,
            expiration_date = EXCLUDED.expiration_date,
            latitude = EXCLUDED.latitude,
            longitude = EXCLUDED.longitude,
            updated_at = EXCLUDED.updated_at
    """

    with conn.cursor() as cur:
        for row in rows:
            cur.execute(insert_query, row)

    conn.commit()


def main():
    if not SOURCE_DB or not TARGET_DB:
        raise RuntimeError("SOURCE_DB and TARGET_DB must be set in .env or environment variables")

    with psycopg.connect(SOURCE_DB) as source_conn:
        rows = extract(source_conn)

    print(f"Extracted {len(rows)} records")

    with psycopg.connect(TARGET_DB) as target_conn:
        load(target_conn, rows)

    print("ETL completed")


if __name__ == "__main__":
    main()