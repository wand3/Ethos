from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import Annotated, Optional
from webapp.schemas.user import UserBase, UserUpdate, UserInDB
from webapp.models.user import get_current_active_user
# from webapp.database.db_engine import db


router = APIRouter(prefix="/user", tags=["User"])

# curr_user = UserModel(db=db) #for class injection


@router.get("/me", response_model=None)
async def read_users_me(
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
