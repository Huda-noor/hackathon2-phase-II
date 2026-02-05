from typing import Generator, Annotated, Dict, Any
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from src.db.session import get_session
from src.core.security import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")  # Simple scheme definition

SessionDep = Annotated[Session, Depends(get_session)]

def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """
    Dependency that extracts the bearer token, validates it,
    and returns a user dictionary with at least 'id' (sub).
    """
    payload = decode_token(token)
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=403, detail="Token missing subject (sub) claim")

    # In a real app we might fetch user from DB here, but for now we trust the token payload
    # This represents the user context for the request
    return {"id": user_id, "email": payload.get("email"), "name": payload.get("name")}

UserDep = Annotated[Dict[str, Any], Depends(get_current_user)]
