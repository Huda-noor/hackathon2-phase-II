# API Contract: Frontend & Authentication Integration (003-frontend-integration)

## Auth Contract (Client -> Auth)

- **Login**: `authClient.signIn.email({ email, password })` -> Returns session or throws error.
- **Signup**: `authClient.signUp.email({ email, password, name })` -> Returns session or throws error.
- **Logout**: `authClient.signOut()` -> Clears session.

## Backend API Contract

### Endpoints (Mirrors Backend)

- `GET /api/v1/tasks` (List)
- `POST /api/v1/tasks` (Create)
- `PATCH /api/v1/tasks/{id}` (Update)
- `DELETE /api/v1/tasks/{id}` (Delete)

### Error Handling Contract

- **401/403**: Redirect to `/signin`.
- **4xx/5xx**: Display Toast error: "Action failed: [message]".
