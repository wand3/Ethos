from fastapi import APIRouter

blog = APIRouter(prefix="/blog", tags=["Blog"])


@blog.get("/")
async def get_blog():
    return {"message": "Blog"}
