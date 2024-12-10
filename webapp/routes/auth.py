from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from webapp.schemas.auth import Token
from webapp.schemas.user import UserBase
from webapp.models.user import UserModel
from webapp.database.db_engine import db
from ..config import Config

auth = APIRouter(prefix="/auth", tags=["Auth"])


def get_user_model() -> UserModel:
    """Dependency to inject a `UserModel` instance."""
    return UserModel(db)


@auth.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    user_model: Annotated[UserModel, Depends(get_user_model)],
) -> Token:
    """Authenticate user and issue a JWT access token."""
    user = await user_model.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = user_model.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@auth.get("/users/me/", response_model=UserBase)
async def read_users_me(
    current_user: Annotated[UserBase, Depends(UserModel.get_current_active_user)],
):
    """Retrieve details of the currently authenticated user."""
    return current_user
