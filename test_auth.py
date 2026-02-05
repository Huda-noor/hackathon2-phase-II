import requests
import json

print("=" * 60)
print("Testing Backend Auth Endpoints")
print("=" * 60)

# Test signup
print("\n1. Testing /api/v1/auth/signup...")
try:
    response = requests.post(
        "http://localhost:8000/api/v1/auth/signup",
        json={
            "email": "testuser@example.com",
            "password": "password123",
            "name": "Test User"
        },
        timeout=5
    )
    print(f"   Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✓ Signup successful!")
        print(f"   Token: {data['access_token'][:50]}...")
        print(f"   User: {data['user']}")
    else:
        print(f"   ✗ Error: {response.text}")
except Exception as e:
    print(f"   ✗ Exception: {e}")

# Test signin
print("\n2. Testing /api/v1/auth/signin...")
try:
    response = requests.post(
        "http://localhost:8000/api/v1/auth/signin",
        json={
            "email": "testuser@example.com",
            "password": "password123"
        },
        timeout=5
    )
    print(f"   Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✓ Signin successful!")
        print(f"   Token: {data['access_token'][:50]}...")

        # Test creating a task with the token
        print("\n3. Testing /api/v1/tasks (create)...")
        task_response = requests.post(
            "http://localhost:8000/api/v1/tasks",
            json={
                "title": "Test Task",
                "description": "Testing after auth fix",
                "status": "Todo",
                "owner_id": data['user']['id']
            },
            headers={"Authorization": f"Bearer {data['access_token']}"},
            timeout=5
        )
        print(f"   Status Code: {task_response.status_code}")
        if task_response.status_code == 200:
            print(f"   ✓ Task created successfully!")
            print(f"   Task: {task_response.json()}")
        else:
            print(f"   ✗ Error: {task_response.text}")
    else:
        print(f"   ✗ Error: {response.text}")
except Exception as e:
    print(f"   ✗ Exception: {e}")

print("\n" + "=" * 60)
print("Test Complete!")
print("=" * 60)
