import pytest
import jwt
from fastapi.testclient import TestClient
from src.main import app
from src.core.config import settings

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_auth_missing_token():
    # Attempt to access protected endpoint without token
    # Note: /me endpoint handles auth verification (will be added in implementation)
    response = client.get("/api/v1/utils/me")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

def test_auth_invalid_token():
    response = client.get("/api/v1/utils/me", headers={"Authorization": "Bearer invalid_token"})
    assert response.status_code == 403
    assert response.json() == {"detail": "Could not validate credentials"}

def test_auth_valid_token():
    # Create a dummy valid token signed with our logic
    payload = {
        "sub": "user_123",
        "name": "Test User"
    }
    token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm="HS256")

    response = client.get(
        "/api/v1/utils/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "user_123"
