from datetime import datetime, timedelta, timezone
from typing import Any, Union
from jose import jwt
from fastapi import HTTPException, Security
from fastapi.security import OAuth2PasswordBearer
from src.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

ALGORITHM = "HS256"

def create_access_token(subject: Union[str, Any], expires_delta: timedelta = None) -> str:
    """
    Utility function to create tokens (useful for testing or if backend issues tokens)
    In this architecture, Better Auth might issue them, but verifying them uses same secret.
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.BETTER_AUTH_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    """
    Decodes and validates the JWT token using the configured secret.
    Raises HTTPException if validation fails.
    """
    try:
        payload = jwt.decode(
            token,
            settings.BETTER_AUTH_SECRET,
            algorithms=[ALGORITHM],
            options={"verify_aud": False}  # Adjust audience verification as needed
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=403, detail="Could not validate credentials")
