import pytest
from fastapi.testclient import TestClient

from src.main import app


def test_user_cannot_access_other_users_tasks(client: TestClient, admin_token_headers: dict, user_token_headers: dict):
    # Admin creates a task
    admin_task_data = {"title": "Admin's Secret Task", "description": "Only admin should see this", "owner_id": "admin"}
    response = client.post("api/v1/tasks/", json=admin_task_data, headers=admin_token_headers)
    assert response.status_code == 200
    admin_task_id = response.json()["id"]

    # User attempts to get admin's task - should fail with 403 (ownership check is explicit)
    response = client.get(f"api/v1/tasks/{admin_task_id}", headers=user_token_headers)
    assert response.status_code == 403

    # User attempts to update admin's task - should fail with 403
    user_update_data = {"title": "User trying to update admin's task"}
    response = client.patch(f"api/v1/tasks/{admin_task_id}", json=user_update_data, headers=user_token_headers)
    assert response.status_code == 403

    # User attempts to delete admin's task - should fail with 403
    response = client.delete(f"api/v1/tasks/{admin_task_id}", headers=user_token_headers)
    assert response.status_code == 403

    # Admin should still be able to access their own task
    response = client.get(f"api/v1/tasks/{admin_task_id}", headers=admin_token_headers)
    assert response.status_code == 200
    assert response.json()["title"] == admin_task_data["title"]


def test_user_only_sees_their_own_tasks_in_list(client: TestClient, admin_token_headers: dict, user_token_headers: dict):
    # Admin creates several tasks
    client.post("api/v1/tasks/", json={"title": "Admin Task 1", "owner_id": "admin"}, headers=admin_token_headers)
    client.post("api/v1/tasks/", json={"title": "Admin Task 2", "owner_id": "admin"}, headers=admin_token_headers)

    # User creates their own task
    user_task_data = {"title": "User's Own Task", "owner_id": "user"}
    response = client.post("api/v1/tasks/", json=user_task_data, headers=user_token_headers)
    assert response.status_code == 200

    # User fetches tasks - should only see their own task
    response = client.get("api/v1/tasks/", headers=user_token_headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 1
    assert tasks[0]["title"] == user_task_data["title"]
    assert tasks[0]["owner_id"] == "user"

    # Admin fetches tasks - should only see their own tasks (isolation is enforced)
    response = client.get("api/v1/tasks/", headers=admin_token_headers)
    assert response.status_code == 200
    tasks = response.json()
    # The list endpoint is filtered by owner_id (T050 is implemented)
    # so admin should only see admin's own tasks, not user's tasks
    assert len(tasks) == 2 # Exactly 2 admin tasks
    assert all(task["owner_id"] == "admin" for task in tasks)
