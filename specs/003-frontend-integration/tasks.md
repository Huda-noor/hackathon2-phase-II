# Tasks: Frontend & Authentication Integration (003-frontend-integration)

**Spec**: [specs/003-frontend-integration/spec.md](specs/003-frontend-integration/spec.md)
**Status**: Pending

## Implementation Strategy

We will build the frontend using a layered approach:
1.  **Setup & Foundation**: Establish the Next.js runtime, UI libraries, and API/Auth clients.
2.  **Authentication (US1)**: Implement strict security boundaries and entry points (`/signin`, `/signup`) first, as US2 depends on authenticated context.
3.  **Task Management (US2)**: Build the core dashboard and task interactions using the verified auth state.
4.  **Polish**: Refine error handling, loading states, and responsiveness.

**Parallel Execution**:
- UI Components (Phase 2) can be built in parallel.
- US1 and US2 are sequential (Auth is a blocker), but within US2, components (`TaskItem`, `NewTaskForm`) can be built in parallel.

---

## Phase 1: Setup & Configuration
*Foundational infrastructure and dependency management.*

- [x] T001 Verify/Initialize Next.js App Router structure in `frontend/src/`
- [x] T002 Install core dependencies (better-auth, clsx, tailwind-merge, lucide-react, zod, react-hook-form) in `frontend/package.json`
- [x] T003 Configure Tailwind CSS (colors, fonts, content paths) in `frontend/tailwind.config.ts` and `frontend/src/app/globals.css`
- [x] T004 Create `cn` utility helper for Tailwind in `frontend/src/lib/utils.ts`
- [x] T005 Create Better Auth Client configuration in `frontend/src/lib/auth-client.ts`
- [x] T006 Implement API Client wrapper with Interceptors (for header injection) in `frontend/src/lib/api-client.ts`

## Phase 2: Foundational Components
*Reusable UI elements required by both User Stories.*

- [x] T007 [P] Create `Button` component in `frontend/src/components/ui/button.tsx`
- [x] T008 [P] Create `Input` component in `frontend/src/components/ui/input.tsx`
- [x] T009 [P] Create `Card` component (Header, Content, Footer) in `frontend/src/components/ui/card.tsx`
- [x] T010 [P] Create `Label` component in `frontend/src/components/ui/label.tsx`
- [x] T011 [P] Setup Toast Provider (e.g., Sonner) configuration in `frontend/src/components/ui/toaster.tsx`
- [x] T012 Update Root Layout to include Toast provider and global styles in `frontend/src/app/layout.tsx`

## Phase 3: User Story 1 - Authentication Flow
*Priority: P1 - Secure access to the application.*
*Goal: Users can sign up, sign in, and persist session token.*

- [x] T013 [P] [US1] Define Auth Zod schemas (LoginSchema, RegisterSchema) in `frontend/src/lib/validations/auth.ts`
- [x] T014 [P] [US1] Implement `SignupForm` component with validation in `frontend/src/components/auth/signup-form.tsx`
- [x] T015 [P] [US1] Implement `SigninForm` component with validation in `frontend/src/components/auth/signin-form.tsx`
- [x] T016 [P] [US1] Create Signup Page route in `frontend/src/app/(auth)/signup/page.tsx`
- [x] T017 [P] [US1] Create Signin Page route in `frontend/src/app/(auth)/signin/page.tsx`
- [x] T018 [US1] Implement Middleware for route protection (redirect unauth users) in `frontend/src/middleware.ts`

## Phase 4: User Story 2 - Task Management
*Priority: P1 - Core application functionality.*
*Goal: Authenticated users can visual and manage tasks.*

- [ ] T019 [P] [US2] Define Task TS Interfaces (`FrontendTask`) in `frontend/src/types/task.ts`
- [ ] T020 [P] [US2] Define Task Zod schemas (`TaskCreateDTO`, `TaskUpdateDTO`) in `frontend/src/lib/validations/task.ts`
- [ ] T021 [P] [US2] Implement Task API service functions (fetch, create, update, delete) in `frontend/src/lib/api/tasks.ts`
- [ ] T022 [P] [US2] Create `TaskItem` display component (checkbox, delete button) in `frontend/src/components/tasks/task-item.tsx`
- [ ] T023 [P] [US2] Implement `NewTaskForm` component in `frontend/src/components/tasks/new-task-form.tsx`
- [ ] T024 [US2] Implement `TaskList` logic with fetching and optimistic updates in `frontend/src/components/tasks/task-list.tsx`
- [ ] T025 [US2] Assemble Dashboard Page with TaskList and NewTaskForm in `frontend/src/app/dashboard/page.tsx`

## Phase 5: Polish & Cross-Cutting Concerns
*Finalizing the user experience.*

- [ ] T026 Create global Error Boundary for graceful crash handling in `frontend/src/app/error.tsx`
- [ ] T027 Implement Loading Skeleton for Dashboard in `frontend/src/app/dashboard/loading.tsx`
- [ ] T028 Audit mobile responsiveness on small screens (375px) - Adjust `frontend/src/app/dashboard/page.tsx` if needed

## Dependencies

- **US1 (Auth)** blocks **US2 (Tasks)** (Users must be logged in to manage tasks)
- **Phase 1 & 2** block **Phase 3 & 4**

## Parallel Execution Opportunities

- T007-T011 (UI Components) can be built concurrently.
- T014 (SignupForm) and T015 (SigninForm) are independent.
- T022 (TaskItem) and T023 (NewTaskForm) are independent.
