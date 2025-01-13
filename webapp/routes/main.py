from typing import List, Annotated
from webapp.logger import logger
from fastapi import APIRouter, Depends

from webapp.models.blog import Post, get_post_model
from webapp.schemas.blog import BlogPostInDB

main = APIRouter()


@main.get("/ethos")
async def root():
    return {"message": "Hello World"}


@main.get("/posts/")
def get_posts_by_tags(tags: List[str],
                      post_model: Annotated[Post, Depends(get_post_model)]
):

    # all_posts = post_model.db.find()
    # logger.info(f'Post image ----  user {post_data.image}')

    posts = post_model.db.find({"tags": {"$in": tags}})
    result = [
        BlogPostInDB(
            id=str(post["_id"]),
            title=post["title"],
            content=post["content"],
            image=post.get("image"),
            tags=post.get("tags", []),
            createdAt=post["created_at"],
            updatedAt=post["updated_at"]
        )
        for post in posts
    ]
    return result
    # return BlogPostInDB(**all_posts)
