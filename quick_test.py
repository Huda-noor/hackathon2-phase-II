import requests

print("Testing auth on port 8888...")

# Signup
resp = requests.post("http://localhost:8888/api/v1/auth/signup", json={
    "email": "demo@test.com",
    "password": "pass123",
    "name": "Demo User"
})
print(f"Signup: {resp.status_code}")
if resp.status_code == 200:
    data = resp.json()
    token = data['access_token']
    print(f"Token: {token[:40]}...")

    # Create task
    task_resp = requests.post(
        "http://localhost:8888/api/v1/tasks",
        json={"title": "My Task", "description": "Test", "status": "Todo", "owner_id": data['user']['id']},
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"Create Task: {task_resp.status_code}")
    if task_resp.status_code == 200:
        print("SUCCESS! Task created:", task_resp.json()['title'])
    else:
        print("Task Error:", task_resp.text)
else:
    print("Signup Error:", resp.text)
