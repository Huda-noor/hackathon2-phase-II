---
description: "Implementation tasks for the complete Todo Web Application"
---

# Tasks: Complete Todo Web Application

**Input**: Design documents from all feature directories
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
- [x] T004 [P] Verify/Initialize Next.js App Router structure in `frontend/src/`
- [x] T005 [P] Install core frontend dependencies (better-auth, clsx, tailwind-merge, lucide-react, zod, react-hook-form) in `frontend/package.json`
- [x] T006 [P] Configure Tailwind CSS (colors, fonts, content paths) in `frontend/tailwind.config.ts` and `frontend/src/app/globals.css`
- [x] T007 [P] Create `cn` utility helper for Tailwind in `frontend/src/lib/utils.ts`
- [x] T008 [P] Create Better Auth Client configuration in `frontend/src/lib/auth-client.ts`
- [x] T009 [P] Implement API Client wrapper with Interceptors (for header injection) in `frontend/src/lib/api-client.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T010 Setup Database configuration and Session dependency in `backend/src/db/session.py`
- [x] T011 [P] Implement Configuration loader (env vars) in `backend/src/core/config.py`
- [x] T012 [P] Create Main application entry point in `backend/src/main.py` with CORS
- [x] T013 Setup Alembic for migrations in `backend/alembic.ini` and `backend/src/db/migrations/`
- [x] T014 [P] Implement `get_current_user` dependency stub in `backend/src/api/deps.py` (to be filled by US1)
- [x] T015 [P] Create `Button` component in `frontend/src/components/ui/button.tsx`
- [x] T016 [P] Create `Input` component in `frontend/src/components/ui/input.tsx`
- [x] T017 [P] Create `Card` component (Header, Content, Footer) in `frontend/src/components/ui/card.tsx`
- [x] T018 [P] Create `Label` component in `frontend/src/components/ui/label.tsx`
- [x] T019 [P] Setup Toast Provider (e.g., Sonner) configuration in `frontend/src/components/ui/toaster.tsx`
- [x] T020 Update Root Layout to include Toast provider and global styles in `frontend/src/app/layout.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Secure API Access (Priority: P1) 🎯 MVP

**Goal**: Authenticated users need secure access to the API so they can manage their own tasks.

**Independent Test**: Verify endpoint returns 401 without token, 200 with valid token.

### Tests for User Story 1

- [x] T021 [P] [US1] Create auth integration test in `backend/tests/integration/test_auth.py`

### Implementation for User Story 1

- [x] T022 [US1] Implement JWT validation logic using `python-jose` in `backend/src/core/security.py`
- [x] T023 [US1] Update `get_current_user` dependency in `backend/src/api/deps.py` to use security module
- [x] T024 [US1] Add `/health` and protected `/me` (test) endpoints in `backend/src/api/routes/utils.py` to verify auth
- [x] T025 [US1] Register utility router in `backend/src/main.py`
- [x] T026 [US1] Verify JWT validation with unit test execution
- [x] T027 [P] [US1] Define Auth Zod schemas (LoginSchema, RegisterSchema) in `frontend/src/lib/validations/auth.ts`
- [x] T028 [P] [US1] Implement `SignupForm` component with validation in `frontend/src/components/auth/signup-form.tsx`
- [x] T029 [P] [US1] Implement `SigninForm` component with validation in `frontend/src/components/auth/signin-form.tsx`
- [x] T030 [P] [US1] Create Signup Page route in `frontend/src/app/(auth)/signup/page.tsx`
- [x] T031 [P] [US1] Create Signin Page route in `frontend/src/app/(auth)/signin/page.tsx`
- [x] T032 [US1] Implement Middleware for route protection (redirect unauth users) in `frontend/src/middleware.ts`

**Checkpoint**: Auth system operational. Proceed to Business Logic.

---

## Phase 4: User Story 2 - Task CRUD Operations (Priority: P1)

**Goal**: Users need to Create, Read, Update, and Delete tasks.

**Independent Test**: Perform full CRUD cycle via API client.

### Tests for User Story 2

- [x] T033 [P] [US2] Create Task CRUD integration tests in `backend/tests/integration/test_tasks.py`

### Implementation for User Story 2

- [x] T034 [P] [US2] Create Task SQLModel entity in `backend/src/models/task.py`
- [x] T035 [US2] Create Alembic migration for Task table and apply it
- [x] T036 [US2] Implement Task Service logic (CRUD) in backend/src/services/task_service.py (optional abstraction) OR directly in routes
- [x] T037 [US2] Implement `POST /tasks` endpoint in `backend/src/api/routes/tasks.py`
- [x] T038 [US2] Implement `GET /tasks` listing endpoint in `backend/src/api/routes/tasks.py`
- [x] T039 [US2] Implement `GET /tasks/{id}` endpoint in `backend/src/api/routes/tasks.py`
- [x] T040 [US2] Implement `PATCH` and `DELETE` endpoints in `backend/src/api/routes/tasks.py`
- [x] T041 [US2] Register tasks router in `backend/src/main.py`

**Checkpoint**: CRUD functionality complete.

---

## Phase 5: User Story 3 - Task Management Frontend (Priority: P1)

**Goal**: Authenticated users need to view, create, update, and delete tasks via a responsive interface.

**Independent Test**: Can be tested by performing CRUD operations in the UI and verifying updates appear immediately.

### Implementation for User Story 3

- [x] T042 [P] [US3] Define Task TS Interfaces (`FrontendTask`) in `frontend/src/types/task.ts`
- [x] T043 [P] [US3] Define Task Zod schemas (`TaskCreateDTO`, `TaskUpdateDTO`) in `frontend/src/lib/validations/task.ts`
- [x] T044 [P] [US3] Implement Task API service functions (fetch, create, update, delete) in `frontend/src/lib/api/tasks.ts`
- [x] T045 [P] [US3] Create `TaskItem` display component (checkbox, delete button) in `frontend/src/components/tasks/task-item.tsx`
- [x] T046 [P] [US3] Implement `NewTaskForm` component in `frontend/src/components/tasks/new-task-form.tsx`
- [x] T047 [US3] Implement `TaskList` logic with fetching and optimistic updates in `frontend/src/components/tasks/task-list.tsx`
- [x] T048 [US3] Assemble Dashboard Page with TaskList and NewTaskForm in `frontend/src/app/dashboard/page.tsx`

**Checkpoint**: Complete frontend task management functionality.

---

## Phase 6: User Story 4 - Data Isolation & Ownership (Priority: P2)

**Goal**: Users must only see their own tasks.

**Independent Test**: Verify User A cannot fetch User B's task.

### Tests for User Story 4

- [x] T049 [P] [US4] Create Data Isolation integration tests in `backend/tests/integration/test_isolation.py`

### Implementation for User Story 4

- [x] T050 [US4] Refactor Task Listing to filter by `current_user.id` in `backend/src/api/routes/tasks.py`
- [x] T051 [US4] Refactor Get/Update/Delete to verify `owner_id` logic in `backend/src/api/routes/tasks.py`
- [x] T052 [US4] Verify strict isolation compliance with test suite

**Checkpoint**: Multi-tenancy security enforced.

---

## Phase 7: User Story 5 - Secure Task Access (Priority: P1)

**Goal**: Ensure that JWT tokens are validated on all endpoints so that unauthorized users cannot access protected resources.

**Independent Test**: Can be fully tested by attempting to access protected endpoints with invalid/missing JWT tokens and verifying that access is denied with appropriate HTTP status codes.

### Implementation for User Story 5

- [x] T053 [US5] Implement comprehensive JWT validation middleware for all protected endpoints
- [x] T054 [US5] Add tests for expired JWT token handling returning 401 Unauthorized
- [x] T055 [US5] Add tests for missing JWT token handling returning 401 Unauthorized
- [x] T056 [US5] Add tests for invalid/malformed JWT token handling returning 401 Unauthorized

**Checkpoint**: All endpoints properly validate JWT tokens.

---

## Phase 8: User Story 6 - Task Ownership Enforcement (Priority: P2)

**Goal**: Ensure that task ownership is strictly enforced so that users can only view, modify, or delete their own tasks.

**Independent Test**: Can be tested by having one user create a task, then attempting to access that task with another user's credentials and verifying access is denied.

### Implementation for User Story 6

- [x] T057 [US6] Implement backend logic to verify task ownership before allowing access
- [x] T058 [US6] Add tests for task ownership validation allowing access for owners
- [x] T059 [US6] Add tests for task ownership validation denying access for non-owners with 403 Forbidden
- [x] T060 [US6] Add tests for non-existent task access returning 404 Not Found

**Checkpoint**: Task ownership strictly enforced.

---

## Phase 9: User Story 7 - End-to-End Testing (Priority: P2)

**Goal**: Ensure that end-to-end tests pass for both frontend and backend so that the integrated system functions correctly and meets security requirements.

**Independent Test**: Can be tested by running the complete end-to-end test suite and verifying that all tests pass without security vulnerabilities.

### Implementation for User Story 7

- [ ] T061 [US7] Implement end-to-end tests for complete user journey (signup, create task, update task, delete task)
- [ ] T062 [US7] Implement security-focused end-to-end tests to detect vulnerabilities
- [ ] T063 [US7] Create environment-specific end-to-end tests
- [ ] T064 [US7] Execute complete end-to-end test suite and verify all tests pass

**Checkpoint**: End-to-end tests passing consistently.

---

## Phase 10: User Story 8 - Reproducible Deployment (Priority: P2)

**Goal**: Ensure that the deployment process is reproducible so that the same code can be deployed consistently across different environments with the same results.

**Independent Test**: Can be tested by performing multiple deployments of the same code version and verifying that each deployment produces identical results.

### Implementation for User Story 8

- [ ] T065 [US8] Create Dockerfile for backend service
- [ ] T066 [US8] Create Dockerfile for frontend service
- [ ] T067 [US8] Create docker-compose.yml for local development environment
- [ ] T068 [US8] Create deployment configuration for cloud platform (Vercel/Render/Heroku)
- [ ] T069 [US8] Document deployment process and requirements
- [ ] T070 [US8] Test deployment reproducibility by deploying same version multiple times

**Checkpoint**: Reproducible deployments achieved.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T071 [P] Update `docs/backend_api.md` with final API details
- [ ] T072 [P] Update `docs/frontend_components.md` with component documentation
- [ ] T073 Clean up test fixtures in `backend/tests/conftest.py`
- [ ] T074 Create global Error Boundary for graceful crash handling in `frontend/src/app/error.tsx`
- [ ] T075 Implement Loading Skeleton for Dashboard in `frontend/src/app/dashboard/loading.tsx`
- [ ] T076 Audit mobile responsiveness on small screens (375px) - Adjust `frontend/src/app/dashboard/page.tsx` if needed
- [ ] T077 Ensure 90% test coverage report generation
- [ ] T078 Run security audit on dependencies (bandit/safety)
- [ ] T079 Update README with complete setup and deployment instructions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all
- **User Stories (Phase 3+)**: Depend on Foundational
  - US1 (Auth) BLOCKS US2 (CRUD) because CRUD needs User ID context
  - US2 (Backend CRUD) BLOCKS US3 (Frontend Task Management) because frontend needs working backend
  - US3 (Frontend Task Management) BLOCKS US4 (Data Isolation) for integrated testing
  - **Recommended**: US1 -> US2 -> US3 -> US4 -> US5 -> US6 -> US7 -> US8 for easiest flow.

### Within Each User Story

- Tests FIRST (verified failure)
- Models -> Migrations -> Routes
- Integration

### Parallel Opportunities

- Setup tasks T001-T009
- Foundation tasks T011, T012, T014, T015-T020
- US2 Tests T033 can be written while US1 is implemented
- US3 frontend components (T042-T046) can be developed in parallel
- US5-US8 can be worked on in parallel after core functionality is complete

---

## Implementation Strategy

### MVP First (User Story 1 + 2 + 3)

1. Complete Setup & Foundation
2. Complete US1 (Auth)
3. Complete US2 (Backend CRUD) which uses Auth
4. Complete US3 (Frontend Task Management) which integrates with backend
5. **STOP and VALIDATE**: Full functional application with auth and task management
6. Apply US4 (Isolation) as strict security layer
7. Implement US5-US8 for enhanced security, testing and deployment

### Parallel Team Strategy

1. **Backend dev**: US2 (Tasks) - utilizing the auth system from US1
2. **Frontend dev**: US3 (Task Management UI) - integrating with backend API
3. **Security dev**: US4, US5, US6 (Security enhancements) - working after core functionality
4. **DevOps/QA**: US7, US8 (Testing and deployment) - can work in parallel toward the end