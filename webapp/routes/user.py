import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import Annotated, Optional
from webapp.schemas.user import UserBase, UserUpdate, UserInDB
from webapp.models.user import UserModel, oauth2_scheme
from webapp.database.db_engine import db
from webapp.routes.auth import get_user_model


router = APIRouter(prefix="/user", tags=["User"])

curr_user = UserModel(db=db)


@router.get("/me")
async def read_users_me(
    current_user: UserBase = Depends(curr_user.get_current_active_user),
):
    return current_user

# @router.get("/me", response_model=None)
# async def read_users_me(
#     current_user: Annotated[UserBase, Depends(get_current_user)],
# ):
#     return current_user
