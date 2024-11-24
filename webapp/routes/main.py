from fastapi import APIRouter, Depends

main = APIRouter()


@main.get("/ethos")
async def root():
    return {"message": "Hello World"}

