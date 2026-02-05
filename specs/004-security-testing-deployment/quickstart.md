# Quickstart Guide: Security Features for Todo Web Application

## Overview
This guide provides instructions for setting up and using the security features of the Todo Web Application, including authentication, authorization, and secure task management.

## Prerequisites
- Python 3.11+
- Node.js 18+ (for frontend)
- PostgreSQL database
- Poetry (for backend dependency management)
- Docker (optional, for containerized deployment)

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies using Poetry:
   ```bash
   poetry install
   ```

3. Set up environment variables by copying the example:
   ```bash
   cp .env.example .env
   ```
   
4. Update the `.env` file with your database connection details and a strong secret key:
   ```bash
   DATABASE_URL=postgresql://username:password@localhost/dbname
   SECRET_KEY=your-super-secret-key-here-make-it-long-and-random
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. Run database migrations:
   ```bash
   poetry run alembic upgrade head
   ```

6. Start the backend server:
   ```bash
   poetry run uvicorn src.main:app --reload --port 8000
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   
4. Update the `.env.local` file with your backend API URL:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Using Security Features

### 1. User Registration
Register a new user account by sending a POST request to `/auth/register`:

```bash
curl -X POST http://localhost:8000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### 2. User Authentication
Authenticate a user and receive a JWT token by sending a POST request to `/auth/login`:

```bash
curl -X POST http://localhost:8000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securePassword123"
  }'
```

The response will contain an access token:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. Making Authenticated Requests
Include the JWT token in the Authorization header for protected endpoints:

```bash
curl -X GET http://localhost:8000/v1/tasks \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Creating Tasks
Create a new task by sending a POST request to `/tasks`:

```bash
curl -X POST http://localhost:8000/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "Complete project",
    "description": "Finish the important project by Friday",
    "status": "pending"
  }'
```

### 5. Accessing Tasks
Retrieve your tasks by sending a GET request to `/tasks`:

```bash
curl -X GET http://localhost:8000/v1/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 6. Updating Tasks
Update a specific task by sending a PUT request to `/tasks/{task_id}`:

```bash
curl -X PUT http://localhost:8000/v1/tasks/TASK_UUID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "Updated task title",
    "status": "in-progress"
  }'
```

## Security Best Practices

### 1. Token Handling
- Store JWT tokens securely (preferably in httpOnly cookies rather than localStorage)
- Implement automatic token refresh before expiration
- Log out users when tokens expire or become invalid

### 2. Password Security
- Enforce strong password requirements (minimum length, complexity)
- Use bcrypt or similar for password hashing
- Implement rate limiting for login attempts

### 3. Environment Configuration
- Never commit secrets to version control
- Use environment variables for sensitive configuration
- Regularly rotate secret keys

### 4. Error Handling
- Don't expose sensitive information in error messages
- Log security-related events without sensitive data
- Implement proper access controls at the API level

## Testing Security Features

### 1. Unit Tests
Run backend unit tests:
```bash
cd backend
poetry run pytest tests/unit/
```

### 2. Integration Tests
Run backend integration tests:
```bash
cd backend
poetry run pytest tests/integration/
```

### 3. End-to-End Tests
Run frontend end-to-end tests:
```bash
cd frontend
npm run test:e2e
```

## Deployment

### 1. Containerized Deployment
Build and run with Docker:

```bash
# Build the backend image
docker build -f backend/Dockerfile -t todo-backend .

# Run the backend container
docker run -d -p 8000:8000 --env-file ./backend/.env todo-backend
```

### 2. Environment-Specific Configuration
For different environments, ensure you set the appropriate environment variables:

- **Development**: Enable debug mode, use development database
- **Staging**: Use staging database, enable additional logging
- **Production**: Disable debug mode, use production database, enforce HTTPS

## Troubleshooting

### Common Issues
1. **JWT Token Expiration**: Tokens expire after 30 minutes by default. Implement token refresh logic in your frontend.
2. **Unauthorized Access**: Ensure the Authorization header is properly formatted as "Bearer YOUR_TOKEN_HERE".
3. **Database Connection**: Verify that your DATABASE_URL is correctly configured and the database is accessible.
4. **Environment Variables**: Check that all required environment variables are set before starting the application.

### Security Checks
- Verify that all protected endpoints return 401 for invalid/missing tokens
- Confirm that users can only access their own tasks (403 for others' tasks)
- Ensure sensitive information is not logged in plain text