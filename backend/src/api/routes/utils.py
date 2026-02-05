from fastapi import APIRouter
from src.api.deps import UserDep

router = APIRouter()

@router.get("/health")
def health():
    """
    Health check endpoint - does not require authentication.
    """
    return {"status": "healthy"}

@router.get("/me")
def read_users_me(current_user: UserDep):
    """
    Test endpoint to verify authentication.
    Returns the user data decoded from the token.
    """
    return current_user
