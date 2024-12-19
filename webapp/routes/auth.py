from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from webapp.schemas.auth import Token
from webapp.schemas.user import UserBase, UserCreate, UserInDB
from webapp.models.user import UserModel
from webapp.database.db_engine import db
from ..config import Config

auth = APIRouter(tags=["Auth"])


def get_user_model() -> UserModel:
    """Dependency to inject a `UserModel` instance."""
    return UserModel(db)


@auth.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    user_model: Annotated[UserModel, Depends(get_user_model)],  # Inject the UserModel instance
) -> Token:
    """Authenticate user and issue a JWT access token."""
    # Call the instance method using the injected user_model
    user = await user_model.authenticate_user(self=get_user_model(), username=form_data.username, password=form_data.password)
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


# Register route
@auth.post("/auth/register", response_model=UserBase, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserCreate,
    user_model: Annotated[UserModel, Depends(get_user_model)],
) -> UserBase:
    if not user_data.email or not user_data.password or not user_data.username:
        raise HTTPException(status_code=400, detail="Missing required fields")
    existing_user = await user_model.get_user_by_email(email=user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered.",
        )
    new_user = await user_model.create_user(user_data=user_data)

    return UserBase(**new_user.dict())


# Login route
@auth.post("/auth/login", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    user_model: Annotated[UserModel, Depends(get_user_model)],
) -> Token:
    user = await user_model.authenticate_user(username=form_data.username, password=form_data.password)
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
