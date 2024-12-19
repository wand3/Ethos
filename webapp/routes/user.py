from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from webapp.schemas.user import UserBase
from webapp.models.user import UserModel

user = APIRouter(prefix="/user", tags=["User"])


@user.get("/me", response_model=UserBase)
async def get_user(current_user: Annotated[UserBase, Depends(UserModel.get_current_active_user)]):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user

@user.put("/me/update", response_model=UserBase)
async def put_user(current_user: Annotated[UserBase, Depends(UserModel.get_current_active_user)]):
