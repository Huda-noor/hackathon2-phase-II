import pytest
from fastapi.testclient import TestClient


def test_owner_can_access_own_task(client: TestClient, user_token_headers: dict):
    """Test that task owners can access their own tasks."""
    # Create a task
    task_data = {"title": "User's Task", "description": "Test description", "owner_id": "user"}
    response = client.post("api/v1/tasks/", json=task_data, headers=user_token_headers)
    assert response.status_code == 200
    task_id = response.json()["id"]

    # Owner can read the task
    response = client.get(f"api/v1/tasks/{task_id}", headers=user_token_headers)
    assert response.status_code == 200
    assert response.json()["id"] == task_id
    assert response.json()["title"] == task_data["title"]


def test_owner_can_update_own_task(client: TestClient, user_token_headers: dict):
    """Test that task owners can update their own tasks."""
    # Create a task
    task_data = {"title": "Original Title", "owner_id": "user"}
    response = client.post("api/v1/tasks/", json=task_data, headers=user_token_headers)
    assert response.status_code == 200
    task_id = response.json()["id"]

    # Owner can update the task
    update_data = {"title": "Updated Title"}
    response = client.patch(f"api/v1/tasks/{task_id}", json=update_data, headers=user_token_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Title"


def test_owner_can_delete_own_task(client: TestClient, user_token_headers: dict):
    """Test that task owners can delete their own tasks."""
    # Create a task
    task_data = {"title": "Task to Delete", "owner_id": "user"}
    response = client.post("api/v1/tasks/", json=task_data, headers=user_token_headers)
    assert response.status_code == 200
    task_id = response.json()["id"]

    # Owner can delete the task
    response = client.delete(f"api/v1/tasks/{task_id}", headers=user_token_headers)
    assert response.status_code == 200

    # Verify task is deleted
    response = client.get(f"api/v1/tasks/{task_id}", headers=user_token_headers)
    assert response.status_code == 404


def test_non_owner_cannot_access_task(client: TestClient, admin_token_headers: dict, user_token_headers: dict):
    """Test that non-owners cannot access tasks they don't own."""
    # Admin creates a task
    admin_task_data = {"title": "Admin Task", "owner_id": "admin"}
    response = client.post("api/v1/tasks/", json=admin_task_data, headers=admin_token_headers)
    assert response.status_code == 200
    admin_task_id = response.json()["id"]

    # User (non-owner) tries to access admin's task
    response = client.get(f"api/v1/tasks/{admin_task_id}", headers=user_token_headers)
    assert response.status_code == 403
    assert "not authorized" in response.json()["detail"].lower()


def test_non_owner_cannot_update_task(client: TestClient, admin_token_headers: dict, user_token_headers: dict):
    """Test that non-owners cannot update tasks they don't own."""
    # Admin creates a task
    admin_task_data = {"title": "Admin Task", "owner_id": "admin"}
    response = client.post("api/v1/tasks/", json=admin_task_data, headers=admin_token_headers)
    assert response.status_code == 200
    admin_task_id = response.json()["id"]

    # User (non-owner) tries to update admin's task
    update_data = {"title": "Hacked Title"}
    response = client.patch(f"api/v1/tasks/{admin_task_id}", json=update_data, headers=user_token_headers)
    assert response.status_code == 403
    assert "not authorized" in response.json()["detail"].lower()


def test_non_owner_cannot_delete_task(client: TestClient, admin_token_headers: dict, user_token_headers: dict):
    """Test that non-owners cannot delete tasks they don't own."""
    # Admin creates a task
    admin_task_data = {"title": "Admin Task", "owner_id": "admin"}
    response = client.post("api/v1/tasks/", json=admin_task_data, headers=admin_token_headers)
    assert response.status_code == 200
    admin_task_id = response.json()["id"]

    # User (non-owner) tries to delete admin's task
    response = client.delete(f"api/v1/tasks/{admin_task_id}", headers=user_token_headers)
    assert response.status_code == 403
    assert "not authorized" in response.json()["detail"].lower()

    # Verify task still exists (admin can still access)
    response = client.get(f"api/v1/tasks/{admin_task_id}", headers=admin_token_headers)
    assert response.status_code == 200


def test_accessing_non_existent_task_returns_404(client: TestClient, user_token_headers: dict):
    """Test that accessing a non-existent task returns 404."""
    non_existent_id = 99999
    response = client.get(f"api/v1/tasks/{non_existent_id}", headers=user_token_headers)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_updating_non_existent_task_returns_404(client: TestClient, user_token_headers: dict):
    """Test that updating a non-existent task returns 404."""
    non_existent_id = 99999
    update_data = {"title": "Updated Title"}
    response = client.patch(f"api/v1/tasks/{non_existent_id}", json=update_data, headers=user_token_headers)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_deleting_non_existent_task_returns_404(client: TestClient, user_token_headers: dict):
    """Test that deleting a non-existent task returns 404."""
    non_existent_id = 99999
    response = client.delete(f"api/v1/tasks/{non_existent_id}", headers=user_token_headers)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_user_cannot_create_task_for_another_user(client: TestClient, user_token_headers: dict):
    """Test that users cannot create tasks for other users (owner_id mismatch)."""
    # User tries to create a task with different owner_id
    task_data = {"title": "Malicious Task", "owner_id": "admin"}  # Wrong owner_id
    response = client.post("api/v1/tasks/", json=task_data, headers=user_token_headers)
    assert response.status_code == 403
    assert "not authorized" in response.json()["detail"].lower()
