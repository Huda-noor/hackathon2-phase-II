# QuickStart Guide: Frontend

## Prerequisites
- Node.js 20+
- Backend running on `http://localhost:8000`

## Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables**
   Create `.env.local` in `frontend/`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Development Workflow

- **UI Components**: in `components/ui` (shadcn-like).
- **Pages**: in `app/`.
- **Testing**:
  ```bash
  npm test        # Unit tests
  npx playwright test  # E2E tests
  ```
