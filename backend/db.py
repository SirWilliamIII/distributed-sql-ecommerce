from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
from patched_cockroach_dialect import CockroachDBDialect


load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))


DATABASE_URL = os.getenv("DATABASE_URL")
SSL_ROOT_CERT = os.getenv("SSL_ROOT_CERT")


if not DATABASE_URL:
    raise ValueError("Missing DATABASE_URL")

if not SSL_ROOT_CERT:
    raise ValueError("Missing SSL_ROOT_CERT")


# Patch the CockroachDB dialect to return a fake Postgres version
from sqlalchemy.dialects.postgresql.psycopg2 import PGDialect_psycopg2
PGDialect_psycopg2._get_server_version_info = lambda self, conn: (13, 0)


engine = create_engine(
    DATABASE_URL,
    connect_args={
        "sslmode": "verify-full",
        "sslrootcert": SSL_ROOT_CERT
    },
    echo=True,
    dialect=CockroachDBDialect()
)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_gateway_region():
    try:
        with SessionLocal() as db:
            result = db.execute(text("SELECT gateway_region()")).fetchone()
            return result[0] if result else "gcp-us-east1"
    except Exception as e:
        print(f"Error fetching gateway region: {e}")
        return "unknown"
    