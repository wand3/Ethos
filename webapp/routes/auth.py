from fastapi import APIRouter, Depends

auth = APIRouter(prefix="/auth", tags=["Auth"])


@auth.get("/user")
async def get_user():
    return {"message": "User API"}
