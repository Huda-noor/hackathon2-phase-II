from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session
from src.db.session import get_session
from src.core.security import create_access_token

router = APIRouter()

SessionDep = Annotated[Session, Depends(get_session)]


class SignUpRequest(BaseModel):
    email: str
    password: str
    name: str


class SignInRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


@router.post("/signup", response_model=AuthResponse)
def signup(*, data: SignUpRequest):
    """
    Sign up a new user (simplified for development).
    In production, this would hash passwords and store in database.
    """
    # For development, just generate a token with user data
    user_id = f"user_{data.email.replace('@', '_').replace('.', '_')}"

    access_token = create_access_token(
        subject=user_id,
        expires_delta=timedelta(hours=24)
    )

    return AuthResponse(
        access_token=access_token,
        user={
            "id": user_id,
            "email": data.email,
            "name": data.name,
        }
    )


@router.post("/signin", response_model=AuthResponse)
def signin(*, data: SignInRequest):
    """
    Sign in an existing user (simplified for development).
    In production, this would verify password against hashed version in database.
    """
    # For development, just generate a token
    user_id = f"user_{data.email.replace('@', '_').replace('.', '_')}"

    access_token = create_access_token(
        subject=user_id,
        expires_delta=timedelta(hours=24)
    )

    return AuthResponse(
        access_token=access_token,
        user={
            "id": user_id,
            "email": data.email,
            "name": data.email.split('@')[0],
        }
    )
