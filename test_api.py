import requests
import json

# Test backend signup
print("Testing signup...")
response = requests.post(
    "http://localhost:8000/api/v1/auth/signup",
    json={
        "email": "test@example.com",
        "password": "test123",
        "name": "Test User"
    }
)
print(f"Status: {response.status_code}")
print(f"Response: {response.text[:200]}")

if response.status_code == 200:
    data = response.json()
    token = data.get('access_token')
    print(f"\nToken received: {token[:50]}...")

    # Test creating a task
    print("\nTesting task creation...")
    task_response = requests.post(
        "http://localhost:8000/api/v1/tasks",
        json={
            "title": "Test Task from API",
            "description": "Testing the fixed API",
            "status": "Todo",
            "owner_id": data['user']['id']
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"Task Status: {task_response.status_code}")
    print(f"Task Response: {task_response.text[:200]}")
