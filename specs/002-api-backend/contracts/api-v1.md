# API Contract: Backend & API Development (002-api-backend)

## Authentication
All endpoints (except health) require:
`Authorization: Bearer <JWT_TOKEN>`

## Endpoints

### 1. Create Task
- **Method**: `POST`
- **Path**: `/tasks`
- **Input**: `TaskCreate` JSON
- **Output**: `TaskRead` JSON (201 Created)
- **Errors**:
  - 401: Unauthorized (Missing/Bad Token)
  - 422: Validation Error

### 2. List Tasks
- **Method**: `GET`
- **Path**: `/tasks`
- **Query Params**:
  - `skip`: int (Default 0)
  - `limit`: int (Default 100)
- **Output**: `List[TaskRead]` JSON (200 OK)
- **Logic**: Returns only tasks where `owner_id` == `current_user.id`

### 3. Get Task
- **Method**: `GET`
- **Path**: `/tasks/{task_id}`
- **Output**: `TaskRead` JSON (200 OK)
- **Errors**:
  - 404: Not Found (Task does not exist OR `owner_id` mismatch)
  - 401: Unauthorized

### 4. Update Task
- **Method**: `PATCH`
- **Path**: `/tasks/{task_id}`
- **Input**: `TaskUpdate` JSON
- **Output**: `TaskRead` JSON (200 OK)
- **Errors**:
  - 404: Not Found
  - 401: Unauthorized

### 5. Delete Task
- **Method**: `DELETE`
- **Path**: `/tasks/{task_id}`
- **Output**: Empty (204 No Content)
- **Errors**:
  - 404: Not Found
  - 401: Unauthorized
