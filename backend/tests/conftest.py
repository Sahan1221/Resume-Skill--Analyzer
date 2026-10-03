import pytest

from app.db.database import Base, engine, init_db


@pytest.fixture(scope="session", autouse=True)
def initialize_test_database():
    """Create the SQLite schema before tests that use SessionLocal."""
    init_db()
    yield
    Base.metadata.drop_all(bind=engine)
