import pytest
from fastapi.testclient import TestClient


def test_create_task(client: TestClient, user_token_headers: dict):
    """Test creating a new task"""
    payload = {
        "title": "Test Task",
        "description": "Test Description",
        "owner_id": "user"
    }

    response = client.post("api/v1/tasks/", json=payload, headers=user_token_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == payload["title"]
    assert data["description"] == payload["description"]
    assert data["owner_id"] == "user"
    assert "id" in data
    assert "created_at" in data


def test_read_tasks(client: TestClient, user_token_headers: dict):
    """Test reading all tasks for current user"""
    # Create a task first
    payload = {"title": "Test Task", "owner_id": "user"}
    client.post("api/v1/tasks/", json=payload, headers=user_token_headers)

    response = client.get("api/v1/tasks/", headers=user_token_headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["title"] == "Test Task"


def test_read_single_task(client: TestClient, user_token_headers: dict):
    """Test reading a single task by ID"""
    # Create a task first
    payload = {"title": "Single Task", "owner_id": "user"}
    create_response = client.post("api/v1/tasks/", json=payload, headers=user_token_headers)
    task_id = create_response.json()["id"]

    response = client.get(f"api/v1/tasks/{task_id}", headers=user_token_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == task_id
    assert data["title"] == "Single Task"


def test_update_task(client: TestClient, user_token_headers: dict):
    """Test updating a task"""
    # Create a task first
    payload = {"title": "Original Title", "owner_id": "user"}
    create_response = client.post("api/v1/tasks/", json=payload, headers=user_token_headers)
    task_id = create_response.json()["id"]

    # Update the task
    update_payload = {"title": "Updated Title", "description": "New description", "completed": True}
    response = client.patch(f"api/v1/tasks/{task_id}", json=update_payload, headers=user_token_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["description"] == "New description"
    assert data["completed"] == True


def test_delete_task(client: TestClient, user_token_headers: dict):
    """Test deleting a task"""
    # Create a task first
    payload = {"title": "Task to Delete", "owner_id": "user"}
    create_response = client.post("api/v1/tasks/", json=payload, headers=user_token_headers)
    task_id = create_response.json()["id"]

    # Delete the task
    response = client.delete(f"api/v1/tasks/{task_id}", headers=user_token_headers)
    assert response.status_code == 200

    # Verify task is deleted
    get_response = client.get(f"api/v1/tasks/{task_id}", headers=user_token_headers)
    assert get_response.status_code == 404


def test_list_tasks_returns_only_user_tasks(client: TestClient, admin_token_headers: dict, user_token_headers: dict):
    """Test that listing tasks only returns tasks owned by the authenticated user"""
    # Admin creates tasks
    client.post("api/v1/tasks/", json={"title": "Admin Task 1", "owner_id": "admin"}, headers=admin_token_headers)
    client.post("api/v1/tasks/", json={"title": "Admin Task 2", "owner_id": "admin"}, headers=admin_token_headers)

    # User creates tasks
    client.post("api/v1/tasks/", json={"title": "User Task", "owner_id": "user"}, headers=user_token_headers)

    # User should only see their task
    user_response = client.get("api/v1/tasks/", headers=user_token_headers)
    user_tasks = user_response.json()
    assert len(user_tasks) == 1
    assert user_tasks[0]["title"] == "User Task"
    assert user_tasks[0]["owner_id"] == "user"

    # Admin should only see their tasks
    admin_response = client.get("api/v1/tasks/", headers=admin_token_headers)
    admin_tasks = admin_response.json()
    assert len(admin_tasks) == 2
    assert all(task["owner_id"] == "admin" for task in admin_tasks)
