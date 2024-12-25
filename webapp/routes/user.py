import logging
from pymongo.errors import DuplicateKeyError
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from webapp.schemas.user import UserBase, UserUpdate
from webapp.models.user import UserModel

user = APIRouter(prefix="/user", tags=["User"])

# Configure logging to display messages to the terminal
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s', handlers=[logging.StreamHandler()])


@user.get("/me", response_model=UserBase)
async def get_user(current_user: Annotated[UserBase, Depends(UserModel.get_current_active_user)]):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user


@user.put("/users/{user_id}", response_model=UserBase)
async def update_user(
    user_id: str,
    user_data: Annotated[UserModel, Depends(UserModel.get_current_active_user)],
    user_update: UserUpdate,
):
    # update_data = user_update.dict(exclude_unset=True)  # Only include set fields
    update_data = user_update  # Only include set fields

    logging.info(update_data)
    if not update_data:
        return {"message": "No fields to update provided"}

    try:
        # result = user_data({"_id": user_id}, {"$set": update_data})
        # req = update_data
        result = user_data.update_user(user_id, update_data)

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": "User updated successfully"}
    except DuplicateKeyError as e:
        if "username" in str(e):
            raise HTTPException(status_code=400, detail="Username already taken")
        elif "email" in str(e):
            raise HTTPException(status_code=400, detail="Email already taken")
        else:
            raise HTTPException(status_code=500, detail="Database error")  # General db error

