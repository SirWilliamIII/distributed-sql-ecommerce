from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import os

DATABASE_URL = os.getenv("DATABASE_URL")  # read from .env

engine = create_engine(DATABASE_URL, connect_args={
    "sslmode": "verify-full",
    "sslrootcert": "cc-ca.crt"
})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)






