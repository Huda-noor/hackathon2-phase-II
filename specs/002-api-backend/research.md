# Research Phase 0 Findings

**Feature**: Backend & API Development (002-api-backend)

## 1. FastAPI Project Structure with SQLModel

### Decision
Adopt a **domain-driven, layered architecture** within `backend/src`:
- `api/`: Routes and request handling (Controllers).
- `models/`: SQLModel definitions (Entities & DTOs).
- `core/`: Configuration and security (Infrastructure).
- `db/`: Database connection and session management (Infrastructure).
- `deps.py`: Dependency injection for DB sessions and Current User.

### Rationale
Separating concerns allows for better maintainability and testing. Keeping models separate from API logic prevents circular imports. Using a dedicated `deps.py` leverages FastAPI's dependency injection system for consistent access to resources. This matches the Constitution's "Technical Rigor" principle.

### Alternatives Considered
- **Flat structure (single main.py)**: Too messy for a scalable app; violates modularity principles.
- **MVC (Model-View-Controller)**: FastAPI is naturally more "Resource-Route" oriented than strict MVC. The proposed structure is the Pythonic standard for FastAPI.

## 2. JWT Authentication Middleware

### Decision
Implement **application-level Dependency Injection** for authentication rather than raw ASGI Middleware.
- Create a `get_current_user` dependency in `deps.py`.
- Use `python-jose` to decode and verify JWT signatures against `BETTER_AUTH_SECRET`.
- Use `OAuth2PasswordBearer` (or similar) scheme to extract the bearer token.

### Rationale
FastAPI Dependencies are the idiomatic way to handle auth. They integrate automatically with OpenAPI docs (Swagger UI) and provide type-safe user objects to route functions. Raw middleware is harder to type-check and strictly modifying request objects is less explicit than explicit injection.

### Alternatives Considered
- **Starlette Middleware**: Good for global logic (CORS, trusted host), but less convenient for granular endpoint protection where you need the actual User object.
- **Better Auth Python SDK**: (If available/stable) - Creating a custom verification using `python-jose` offers zero-dep control and strictly follows standards without relying on potentially heavy SDKs for simple verification.

## 3. Data Isolation (Multi-tenant User-Task)

### Decision
Enforce **Application-Layer Filtering**.
- Every CRUD operation requiring user data MUST accept `current_user` dependency.
- All DB queries include `.where(Task.owner_id == current_user.id)`.
- Models (`Task`) will have a mandatory `owner_id` field.

### Rationale
While Postgres RLS is powerful, managing database-level users for every app user is complex and often overkill for this scale. Application-level filtering via SQLModel is explicit, easy to test, and standard for single-db-multi-tenant apps using ORMs.

### Alternatives Considered
- **Postgres Row Level Security (RLS)**: Setting `set_config('app.current_user_id', ...)` per request. secure but adds complexity to connection pooling and migrations.
- **Separate Schemas**: Too heavy for simple user task lists.

## 4. Testing Strategy

### Decision
Use **Pytest with `TestClient` and a temporary SQLite (in-memory) or isolated Postgres DB**.
- Use `conftest.py` to override the `get_session` dependency with a test-scoped session.
- Fixtures for `client`, `session`, and `test_user` (with token).

### Rationale
FastAPI's `TestClient` is built on `httpx` and integrates perfectly. Overriding dependencies allows tests to run without spinning up a real server. Using an in-memory SQLModel (SQLite) is often "good enough" for logic tests, though a Dockerized Postgres is better for "Reproducibility". We will target Postgres compatibility in tests if possible, or fall back to SQLite for speed if complex PG features aren't used.

### Alternatives Considered
- **Mocking DB calls**: Implementation specific and fragile. Tying to the ORM interface is more robust.
- **End-to-End only**: Too slow. Unit/Integration tests via `TestClient` provide immediate feedback.
