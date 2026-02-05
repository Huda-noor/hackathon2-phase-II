# Research Phase 0 Findings

**Feature**: Frontend & Authentication Integration (003-frontend-integration)

## 1. Next.js App Router Auth Flow with Better Auth

### Decision
Use **Better Auth's React Client SDK** with a dedicated `/lib/auth-client.ts` configuration.
- Auth pages: `app/(auth)/signup/page.tsx` and `app/(auth)/signin/page.tsx`.
- Middleware: Use Next.js Middleware (`middleware.ts`) to protect dashboard routes and redirect unauthenticated users.
- State: Use the `useSession` hook from the client SDK for user state in components.

### Rationale
Better Auth provides a type-safe, modular client SDK that integrates seamlessly with Next.js. Isolating auth configuration in `lib/` keeps it reusable. Using Next.js Middleware ensures the dashboard is protected at the edge, preventing flash-of-unauthenticated-content.

### Alternatives Considered
- **Server Actions only**: Good for forms, but client-side interactivity (like instant UI updates on signin) feels snappier with the Client SDK + Middleware.
- **Context API Wrapper**: While standard, Better Auth's hooks already provide this optimization internally.

## 2. API Error Handling & Toast Notifications

### Decision
Implement a **Centralized API Client Wrapper** (`lib/api-client.ts`) and use **Sonner** for toasts.
- Wrapper intercepts 401/403 responses to trigger auth redirection.
- Wrapper catches 4xx/5xx errors and dispatches a generic or specific error message to the Toast system.
- Sonner is chosen for its lightness and stackable UI.

### Rationale
Handling errors in every component leads to code duplication. A wrapper ensures consistent behavior (e.g., auto-logout on token expiry). Sonner is lighter and more modern than older toast libraries like `react-toastify`.

### Alternatives Considered
- **SWR `onError` callback**: Good for data fetching, but doesn't cover mutations (POST/PUT/DELETE) consistently across different hooks.
- **Native `fetch` everywhere**: Too verbose to repeat header injection and error checking.

## 3. Optimistic UI Updates

### Decision
Use **SWR (Stale-While-Revalidate)** with its `mutate` function for optimistic updates.
- GET requests: `useSWR('/api/tasks', fetcher)`
- Mutations (Add/Toggle):
  1. Update local cache immediately via `mutate(key, callback, { optimisticData: ... })`.
  2. Send API request.
  3. Revalidate automatically if request fails (rollback).

### Rationale
Task management requires immediate feedback ("I clicked check, it should toggle instantly"). SWR handles the complex rollback logic and race conditions better than manual `useState` + `useEffect`. It's lightweight compared to React Query but sufficient for this scope.

### Alternatives Considered
- **React Server Actions + `useOptimistic`**: The "Next.js way", but currently adds complexity with experimental hooks and doesn't handle client-side data re-fetching/polling as effectively as SWR for a dashboard.
- **Redux/Zustand**: Overkill for simple API-state synchronization.

## 4. Responsive Layout Patterns

### Decision
Implement a **Responsive Sidebar Layout**:
- **Desktop**: Fixed left sidebar (w-64).
- **Mobile**: Top navigation bar with a "Hamburger" menu triggering a **Sheet/Drawer** (using a UI library primitive or custom CSS).
- Main content area adjusts `ml-64` on desktop, `w-full` on mobile.

### Rationale
This is the standard, user-expected pattern for dashboards. It maximizes screen real estate on desktop while remaining accessible on mobile. Using Tailwind's md: modifiers (`hidden md:block` for sidebar, `md:ml-64` for content) makes implementation clean.

### Alternatives Considered
- **Bottom Navigation (Mobile)**: Good for apps, but "Tasks" usually implies vertical lists which work better with top/side controls.
- **Dropdown Menu**: Harder to discover specific dashboard sections compared to a drawer.
