import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from jose import jwt

from src.main import app
from src.core.config import settings
from src.core.security import ALGORITHM


def test_expired_token_returns_401(client: TestClient):
    """Test that expired JWT tokens return 401 Unauthorized."""
    # Create an expired token
    expired_time = datetime.utcnow() - timedelta(hours=1)
    payload = {"exp": expired_time, "sub": "test_user"}
    expired_token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=ALGORITHM)

    headers = {"Authorization": f"Bearer {expired_token}"}
    response = client.get("api/v1/tasks/", headers=headers)

    assert response.status_code == 401
    assert "expired" in response.json()["detail"].lower()


def test_missing_token_returns_401(client: TestClient):
    """Test that requests without JWT token return 401 Unauthorized."""
    # No Authorization header
    response = client.get("api/v1/tasks/")

    assert response.status_code == 401


def test_invalid_token_returns_403(client: TestClient):
    """Test that invalid/malformed JWT tokens return 403 Forbidden."""
    # Completely invalid token
    headers = {"Authorization": "Bearer invalid_token_string"}
    response = client.get("api/v1/tasks/", headers=headers)

    assert response.status_code == 403
    assert "credentials" in response.json()["detail"].lower()


def test_token_with_wrong_signature_returns_403(client: TestClient):
    """Test that JWT tokens signed with wrong secret return 403 Forbidden."""
    # Create a token with wrong secret
    payload = {"exp": datetime.utcnow() + timedelta(hours=1), "sub": "test_user"}
    wrong_token = jwt.encode(payload, "wrong_secret_key", algorithm=ALGORITHM)

    headers = {"Authorization": f"Bearer {wrong_token}"}
    response = client.get("api/v1/tasks/", headers=headers)

    assert response.status_code == 403


def test_token_without_sub_claim_returns_403(client: TestClient):
    """Test that JWT tokens without 'sub' claim return 403 Forbidden."""
    # Create a token without 'sub' claim
    payload = {"exp": datetime.utcnow() + timedelta(hours=1)}
    no_sub_token = jwt.encode(payload, settings.BETTER_AUTH_SECRET, algorithm=ALGORITHM)

    headers = {"Authorization": f"Bearer {no_sub_token}"}
    response = client.get("api/v1/tasks/", headers=headers)

    assert response.status_code == 403
    assert "subject" in response.json()["detail"].lower() or "sub" in response.json()["detail"].lower()


def test_valid_token_allows_access(client: TestClient, user_token_headers: dict):
    """Test that valid JWT tokens allow access to protected endpoints."""
    response = client.get("api/v1/tasks/", headers=user_token_headers)

    assert response.status_code == 200


def test_health_endpoint_does_not_require_auth(client: TestClient):
    """Test that health endpoint is accessible without authentication."""
    response = client.get("api/v1/utils/health")

    # Should return 200 without any token
    assert response.status_code == 200


def test_protected_me_endpoint_requires_auth(client: TestClient):
    """Test that /me endpoint requires authentication."""
    # Without token
    response = client.get("api/v1/utils/me")
    assert response.status_code == 401

    # With valid token should work (tested via user_token_headers fixture in other tests)
