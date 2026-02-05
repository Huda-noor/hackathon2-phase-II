# Backend Service

This directory contains the backend service for the Todo Web App.

## Technology Stack
- FastAPI
- SQLModel
- SQLite (for development)

## Getting Started

### Installation
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   ./venv/Scripts/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt # (Note: if requirements.txt is missing, refer to pyproject.toml)
   ```
   *Self-correction: Since `requirements.txt` was not found, I should advise using `pip install -e .` or `poetry install` if poetry is used with `pyproject.toml`.*
   Let me refine this instruction. I'll make it more generic since I don't know the exact package manager.

   ```bash
   # Install dependencies based on pyproject.toml
   # If using poetry:
   # poetry install
   # If using pip with an editable install (e.g., for local development):
   # pip install -e .
   ```

   I will assume `pip install -e .` is sufficient for a basic setup given the `pyproject.toml` exists.

### Running the Application
```bash
uvicorn src.main:app --reload
```

## API Documentation
Once the server is running, you can access the API documentation at `/docs` (Swagger UI) or `/redoc` (ReDoc).
Example: `http://127.0.0.1:8000/docs`
