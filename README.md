# Todo Web Application

This project is a full-stack Todo web application with a FastAPI backend and a Next.js frontend.

## Project Structure

-   `/backend`: Contains the FastAPI backend service.
-   `/frontend`: Contains the Next.js frontend application.

## Getting Started

### Backend

To run the backend service:

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    ./venv/Scripts/activate
    ```
3.  Install dependencies (assuming `pyproject.toml` is used):
    ```bash
    pip install -e .
    ```
4.  Run the application:
    ```bash
    uvicorn src.main:app --reload
    ```
    The backend will be running at `http://127.0.0.1:8000`.

### Frontend

To run the frontend application:

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:3000`.

## API Documentation

Once the backend server is running, you can access the API documentation at `http://127.0.0.1:8000/docs` (Swagger UI) or `http://127.0.0.1:8000/redoc` (ReDoc).
