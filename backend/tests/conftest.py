import pytest
import httpx
from typing import Generator, Dict, Any

from fastapi.testclient import TestClient
from src.main import app
from src.db.session import get_session
from sqlmodel import Session, create_engine, SQLModel
from src.core.config import settings

# Fixtures will be implemented as we build the components
@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"

# Override the get_session dependency for testing
@pytest.fixture(name="session")
def session_fixture() -> Generator[Session, None, None]:
    engine = create_engine(settings.DATABASE_URL)
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="client")
def client_fixture(session: Session) -> Generator[TestClient, None, None]:
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


@pytest.fixture
def admin_token_headers() -> Dict[str, Any]:
    # Generate a valid JWT token for an admin user
    from src.core.security import create_access_token
    from datetime import timedelta

    token = create_access_token(subject="admin", expires_delta=timedelta(hours=1))
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def user_token_headers() -> Dict[str, Any]:
    # Generate a valid JWT token for a regular user
    from src.core.security import create_access_token
    from datetime import timedelta

    token = create_access_token(subject="user", expires_delta=timedelta(hours=1))
    return {"Authorization": f"Bearer {token}"}
