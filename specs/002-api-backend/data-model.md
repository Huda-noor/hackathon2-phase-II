# Data Model: Backend & API Development (002-api-backend)

## Entities

### Task

Represents a TODO item in the system.

- **id**: `Optional[int]`, Primary Key, Auto-increment.
- **title**: `str`, Database column, Indexed. Required.
- **description**: `Optional[str]`, Database column.
- **status**: `str`, Database column, Enum ("Todo", "InProgress", "Done"). Default: "Todo".
- **owner_id**: `str`, Database column, Indexed. Links to external User ID from JWT.
- **created_at**: `datetime`, Database column, Default: `now()`.
- **updated_at**: `Optional[datetime]`, Database column, Default: `None` (Managed by app logic on update).

*Note: User entity is virtual (JWT only), not stored as a relation in a tasks-only microservice unless we cache profiles.*

## Data Transfer Objects (DTOs)

### TaskCreate
- `title`: `str` (Required, non-empty)
- `description`: `Optional[str]`
- `status`: `Optional[str]` (Default "Todo")

### TaskUpdate
- `title`: `Optional[str]`
- `description`: `Optional[str]`
- `status`: `Optional[str]`

### TaskRead
- `id`: `int`
- `title`: `str`
- `description`: `Optional[str]`
- `status`: `str`
- `created_at`: `datetime`
- `updated_at`: `Optional[datetime]`

## Validation Rules

- **Title**: Length 1-255 characters.
- **Status**: Must be one of `Todo`, `InProgress`, `Done`.
- **OwnerID**: Must match the `sub` claim of the current bearer token.
