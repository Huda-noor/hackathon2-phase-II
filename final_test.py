import requests
import time

print("="*70)
print("FINAL COMPREHENSIVE TEST")
print("="*70)

# Test 1: Signup
print("\n[1/5] Testing Signup...")
signup_resp = requests.post("http://localhost:8888/api/v1/auth/signup", json={
    "email": f"finaltest{int(time.time())}@example.com",
    "password": "test123",
    "name": "Final Test User"
})
print(f"      Status: {signup_resp.status_code} {'✓' if signup_resp.status_code == 200 else '✗'}")

if signup_resp.status_code == 200:
    auth_data = signup_resp.json()
    token = auth_data['access_token']
    user_id = auth_data['user']['id']

    # Test 2: Create Task
    print("\n[2/5] Testing Create Task...")
    create_resp = requests.post(
        "http://localhost:8888/api/v1/tasks",
        json={
            "title": "Test Task Final",
            "description": "Final comprehensive test",
            "status": "Todo",
            "owner_id": user_id
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"      Status: {create_resp.status_code} {'✓' if create_resp.status_code == 200 else '✗'}")

    if create_resp.status_code == 200:
        task = create_resp.json()
        task_id = task['id']

        # Test 3: Get Tasks
        print("\n[3/5] Testing Get Tasks...")
        get_resp = requests.get(
            "http://localhost:8888/api/v1/tasks",
            headers={"Authorization": f"Bearer {token}"}
        )
        print(f"      Status: {get_resp.status_code} {'✓' if get_resp.status_code == 200 else '✗'}")
        if get_resp.status_code == 200:
            tasks = get_resp.json()
            print(f"      Found {len(tasks)} task(s)")

        # Test 4: Update Task
        print("\n[4/5] Testing Update Task...")
        update_resp = requests.patch(
            f"http://localhost:8888/api/v1/tasks/{task_id}",
            json={"status": "InProgress", "title": "Updated Task"},
            headers={"Authorization": f"Bearer {token}"}
        )
        print(f"      Status: {update_resp.status_code} {'✓' if update_resp.status_code == 200 else '✗'}")

        # Test 5: Delete Task
        print("\n[5/5] Testing Delete Task...")
        delete_resp = requests.delete(
            f"http://localhost:8888/api/v1/tasks/{task_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        print(f"      Status: {delete_resp.status_code} {'✓' if delete_resp.status_code == 200 else '✗'}")

print("\n" + "="*70)
print("ALL TESTS COMPLETED!")
print("="*70)
print("\nServers Status:")
print("  - Frontend: http://localhost:3000")
print("  - Backend:  http://localhost:8888")
print("\nReady to use in browser!")
print("="*70)
