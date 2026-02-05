# Data Model: Frontend & Authentication Integration (003-frontend-integration)

## Entities

### FrontendTask

Mirror of backend task, used in TS interfaces.

- **id**: `number`
- **title**: `string`
- **description**: `string | null`
- **status**: `"Todo" | "InProgress" | "Done"`
- **created_at**: `string` (ISO Date)
- **updated_at**: `string | null` (ISO Date)

### AuthUser

Represents the currently logged-in user in client state.

- **id**: `string`
- **email**: `string`
- **name**: `string`
- **accessToken**: `string` (JWT)

## Data Transfer Objects (DTOs)

### TaskCreateDTO
- `title`: `string`
- `description`: `string | undefined`

### TaskUpdateDTO
- `status`: `"Todo" | "InProgress" | "Done"` (For toggles)
- `title`: `string | undefined`
- `description`: `string | undefined`

## Validation Rules (Client-Side)

### Auth
- **Email**: Must be valid format (Zod: `.email()`).
- **Password**: Min 8 chars (Zod: `.min(8)`).

### Tasks
- **Title**: Required, non-empty. Max 255 chars.
