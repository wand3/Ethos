from fastapi import APIRouter, Depends

user = APIRouter(prefix="/user", tags=["User"])


@user.get("/")
async def get_user():
    return {"message": "User Profile"}
