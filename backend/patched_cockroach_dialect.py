from sqlalchemy.dialects.postgresql.psycopg2 import PGDialect_psycopg2

class CockroachDBDialect(PGDialect_psycopg2):
    def _get_server_version_info(self, connection):
        # Just return a fake Postgres version to satisfy SQLAlchemy
        return (13, 0)

