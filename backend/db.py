from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
from patched_cockroach_dialect import CockroachDBDialect


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("Missing DATABASE_URL")


def get_gateway_region():
    db = SessionLocal()
    result = db.execute(text("SELECT gateway_region()")).fetchone()
    return result[0] if result else "gcp-us-east1"


# Patch the CockroachDB dialect to return a fake Postgres version
from sqlalchemy.dialects.postgresql.psycopg2 import PGDialect_psycopg2
PGDialect_psycopg2._get_server_version_info = lambda self, conn: (13, 0)

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "sslmode": "verify-full",
        "sslrootcert": "/Users/will/.postgresql/root.crt"
    },
    echo=True,
    dialect=CockroachDBDialect()
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

