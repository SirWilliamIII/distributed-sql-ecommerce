from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os
from patched_cockroach_dialect import CockroachDBDialect


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("Missing DATABASE_URL")

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

