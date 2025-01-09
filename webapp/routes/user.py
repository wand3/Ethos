from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import Annotated, Optional
from webapp.schemas.user import UserBase, UserUpdate, UserInDB
from webapp.models.user import get_current_active_user, UserModel

from webapp.database.db_engine import db


router = APIRouter(prefix="/user", tags=["User"])

curr_user = UserModel(db=db)  # for class injection


@router.get("/me", response_model=None)
async def read_user_me(
    current_user: UserBase = Depends(get_current_active_user),
):
    try:
        # Ensure the current_user is valid and active
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        if getattr(current_user, "disabled", False):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user"
            )
        return current_user
    except HTTPException as e:
        # Handle HTTPException and re-raise it
        raise e


@router.put("/{user_id}/me", response_model=UserBase)
async def update_user(
        user_id: str, user_data: UserUpdate, current_user: UserBase = Depends(get_current_active_user)
):
    if not current_user:
        raise HTTPException(status_code=400, detail="User is not logged in")

    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    updated_user = await curr_user.update_user(user_id, user_data)

    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")

    return updated_user


@router.delete("/{user_id}/me")
async def delete_user(user_id: str, current_user: UserBase = Depends(get_current_active_user)):
    delete_u = await curr_user.delete_user(user_id)

    return delete_u
