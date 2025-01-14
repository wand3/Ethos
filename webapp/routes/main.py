import re
from typing import List, Annotated

from pymongo import DESCENDING

from webapp.logger import logger
from fastapi import APIRouter, Depends, HTTPException, status, Query

from webapp.models.blog import Post, get_post_model
from webapp.models.project import get_project_model, ProjectModel
from webapp.schemas.blog import BlogPostInDB, BlogPost
from webapp.schemas.project import Project, ProjectInDB

main = APIRouter()


@main.get("/ethos")
async def root():
    return {"message": "Hello World"}

"""
    Routes for all posts
    
"""


# get all posts
@main.get("/posts/", status_code=status.HTTP_200_OK)
async def get_posts(
    post_model: Annotated[Post, Depends(get_post_model)]
):
    posts = await post_model.get_all_posts()
    return posts


# get search post by title
@main.get("/posts/search/")
async def get_search_posts_by_title(
    post_model: Annotated[Post, Depends(get_post_model)],
    q: str = Query(None, description="The regex pattern to match post titles, tags or content.")
):

    """
    Retrieve posts by matching their titles, tags or content using a regex pattern and regex query with case-insensitivity.
    Args:
        post_model (str): Post models dependency injection
        q (str): The regex pattern to search for in post titles.

    Returns:
        List[BlogPost]: A list of matching blog posts.
    """
    if not q:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Search query is required")
    blogs = []
    try:
        regex_query = {"$or": [
            {"title": {"$regex": re.compile(re.escape(q), re.IGNORECASE)}},  # escape prevents regex injection
            # vulnerabilities
            {"content": {"$regex": re.compile(re.escape(q), re.IGNORECASE)}},
            {"tags": {"$in": [re.compile(re.escape(q), re.IGNORECASE)]}}
        ]}
        async for blog_data in post_model.db.find(regex_query).sort("created_at", DESCENDING):
            blog = BlogPostInDB(**blog_data)
            blogs.append(blog)
        return blogs
    except Exception as e:
        print(f"Error searching blogs: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to search blogs")


# get post by id
@main.get("/{post_id}/posts/")
async def get_posts_by_id(
    post_id: str, post_model: Annotated[Post, Depends(get_post_model)],
):
    post = await post_model.get_post_by_id(post_id=post_id)
    return post


# get post by tag or tags
@main.get("/posts/tags/")
async def get_posts_by_tags(
    post_model: Annotated[Post, Depends(get_post_model)],
    tags: List[str] = Query(..., description="List of tags to search for"),  # Query is used for query parameters.
        # ... makes the query parameter required
):
    try:
        posts = await post_model.get_posts_by_tags(tags)
        if not posts:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No posts found with these tags")
        return posts
    except Exception as e:
        print(f"Error searching posts by tags: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to search posts by tags")


"""
    Routes for all projects

"""


# get all projects
@main.get("/projects/", status_code=status.HTTP_200_OK, response_model=List[ProjectInDB])
async def get_posts(
    project_model: Annotated[ProjectModel, Depends(get_project_model)]
):
    posts = await project_model.get_all_projects()
    return posts

