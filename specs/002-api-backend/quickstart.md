# QuickStart Guide: Backend API

## Prerequisites
- Python 3.11+
- Poetry (recommended) or Pip
- PostgreSQL (or valid `DATABASE_URL`)

## Setup

1. **Install Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Environment Variables**
   Create `.env` in `backend/`:
   ```bash
   DATABASE_URL=postgresql://user:pass@host/db
   BETTER_AUTH_SECRET=your_secret_key_here
   ```

3. **Run Migrations**
   ```bash
   alembic upgrade head
   ```

4. **Start Server**
   ```bash
   uvicorn src.main:app --reload
   ```

## Testing

Run unit and integration tests:
```bash
pytest tests/
```
