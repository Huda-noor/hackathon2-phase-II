---
description: "Implementation tasks for Backend API development"
---

# Tasks: Backend & API Development

**Input**: Design documents from `specs/002-api-backend/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/api-v1.md

**Tests**: Tests are included as per plan.md "Testing Strategy".

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create FastAPI backend folder structure (api, core, db, models, tests) in configuration
- [x] T002 Initialize Python project with Poetry and install dependencies (fastapi, sqlmodel, uvicorn, python-jose, pytest, psycopg2-binary, httpx) in `backend/pyproject.toml`
- [x] T003 [P] Configure pytest in `backend/pyproject.toml` and create `backend/tests/conftest.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Setup Database configuration and Session dependency in `backend/src/db/session.py`
- [x] T005 [P] Implement Configuration loader (env vars) in `backend/src/core/config.py`
- [x] T006 [P] Create Main application entry point in `backend/src/main.py` with CORS
- [x] T007 Setup Alembic for migrations in `backend/alembic.ini` and `backend/src/db/migrations/`
- [x] T008 [P] Implement `get_current_user` dependency stub in `backend/src/api/deps.py` (to be filled by US1)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure API Access (Priority: P1) 🎯 MVP

**Goal**: Authenticated users need secure access to the API so they can manage their own tasks.

**Independent Test**: Verify endpoint returns 401 without token, 200 with valid token.

### Tests for User Story 1

- [x] T009 [P] [US1] Create auth integration test in `backend/tests/integration/test_auth.py`

### Implementation for User Story 1

- [x] T010 [US1] Implement JWT validation logic using `python-jose` in `backend/src/core/security.py`
- [x] T011 [US1] Update `get_current_user` dependency in `backend/src/api/deps.py` to use security module
- [x] T012 [US1] Add `/health` and protected `/me` (test) endpoints in `backend/src/api/routes/utils.py` to verify auth
- [x] T013 [US1] Register utility router in `backend/src/main.py`
- [x] T014 [US1] Verify JWT validation with unit test execution

**Checkpoint**: Auth system operational. Proceed to Business Logic.

---

## Phase 4: User Story 2 - Task CRUD Operations (Priority: P1)

**Goal**: Users need to Create, Read, Update, and Delete tasks.

**Independent Test**: Perform full CRUD cycle via API client.

### Tests for User Story 2

- [x] T015 [P] [US2] Create Task CRUD integration tests in `backend/tests/integration/test_tasks.py`

### Implementation for User Story 2

- [x] T016 [P] [US2] Create Task SQLModel entity in `backend/src/models/task.py`
- [x] T017 [US2] Create Alembic migration for Task table and apply it
- [ ] T018 [US2] Implement Task Service logic (CRUD) in `backend/src/services/task_service.py` (optional abstraction) OR directly in routes
- [ ] T019 [US2] Implement `POST /tasks` endpoint in `backend/src/api/routes/tasks.py`
- [ ] T020 [US2] Implement `GET /tasks` listing endpoint in `backend/src/api/routes/tasks.py`
- [ ] T021 [US2] Implement `GET /tasks/{id}` endpoint in `backend/src/api/routes/tasks.py`
- [ ] T022 [US2] Implement `PATCH` and `DELETE` endpoints in `backend/src/api/routes/tasks.py`
- [ ] T023 [US2] Register tasks router in `backend/src/main.py`

**Checkpoint**: CRUD functionality complete.

---

## Phase 5: User Story 3 - Data Isolation & Ownership (Priority: P2)

**Goal**: Users must only see their own tasks.

**Independent Test**: Verify User A cannot fetch User B's task.

### Tests for User Story 3

- [ ] T024 [P] [US3] Create Data Isolation integration tests in `backend/tests/integration/test_isolation.py`

### Implementation for User Story 3

- [ ] T025 [US3] Refactor Task Listing to filter by `current_user.id` in `backend/src/api/routes/tasks.py`
- [ ] T026 [US3] Refactor Get/Update/Delete to verify `owner_id` logic in `backend/src/api/routes/tasks.py`
- [ ] T027 [US3] Verify strict isolation compliance with test suite

**Checkpoint**: Multi-tenancy security enforced.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T028 [P] Update `docs/backend_api.md` with final API details
- [ ] T029 Clean up test fixtures in `backend/tests/conftest.py`
- [ ] T030 Ensure 90% test coverage report generation
- [ ] T031 Run security audit on dependencies (bandit/safety)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all
- **User Stories (Phase 3+)**: Depend on Foundational
  - US1 (Auth) BLOCKS US2 (CRUD) because CRUD needs User ID context?
  - *Correction*: CRUD *can* be built with mock user deps, but intended design relies on Auth.
  - **Recommended**: US1 -> US2 -> US3 for easiest flow.

### Within Each User Story

- Tests FIRST (verified failure)
- Models -> Migrations -> Routes
- Integration

### Parallel Opportunities

- Setup tasks T001-T003
- Foundation tasks T005, T006, T008
- US2 Tests T015 can be written while US1 is implemented
- Polish tasks

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Setup & Foundation
2. Complete US1 (Auth)
3. Complete US2 (CRUD) which uses Auth
4. **STOP and VALIDATE**: Full functional API
5. Apply US3 (Isolation) as strict security layer

### Parallel Team Strategy

1. **Infra dev**: Phases 1 & 2
2. **Feature dev A**: US2 (Tasks) - initially utilizing a mock `get_current_user`
3. **Feature dev B**: US1 (Auth) - implementing the real `get_current_user`
4. **Merge**: Switch US2 to use US1's dependency.
