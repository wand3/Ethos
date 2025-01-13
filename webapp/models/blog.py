import datetime
from typing import List, Optional
from bson import ObjectId
from fastapi import HTTPException, status
from webapp.logger import logger
from pymongo import AsyncMongoClient
from ..schemas.blog import BlogPost, BlogPostInDB, UpdateBlogPost


class Post:

    def __init__(self, db: AsyncMongoClient):
        self.db = db["posts"]

    async def get_all_posts(self) -> List[BlogPostInDB]:
        blogs = []
        try:
            async for blog_data in self.db.find():
                blog = BlogPostInDB(**blog_data)
                blogs.append(blog)
            return blogs
        except Exception as e:
            print(f"Error fetching blogs: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch all posts")

    async def get_post_by_title(self, title: str) -> Optional[BlogPostInDB]:
        post = await self.db.find_one({"title": title})
        return BlogPostInDB(**post) if post else None

    # get post by id
    @staticmethod
    async def get_post_by_id(self, post_id: str) -> Optional[BlogPostInDB]:
        post = await self.collection.find_one({"_id": ObjectId(post_id)})
        return BlogPostInDB(**post) if post else None

    # get post by tag and tags
    async def get_posts_by_tags(self, tags: List[str]) -> List[BlogPostInDB]:
        query = {"tags": {"$in": tags}}
        posts_cursor = self.db.find(query)
        posts = []
        async for post in posts_cursor:
            posts.append(BlogPostInDB(**post))
        return posts

    # update post
    @staticmethod
    async def update_post(self, post_id: str, post_data: UpdateBlogPost) -> Optional[BlogPostInDB]:
        update_dict = post_data.dict(exclude_unset=True)
        result = await self.db.find_one_and_update(
            {"_id": ObjectId(post_id)}, {"set": update_dict}, return_document=True
        )

        return BlogPostInDB(**result) if result else None

    # delete post
    async def delete_post(self, post_id: str) -> bool:
        result = await self.db.delete_one({"_id": ObjectId(post_id)})
        return result.deleted_count == 1


def get_post_model() -> Post:
    from webapp.database.db_engine import db

    """Dependency to inject a `UserModel` instance."""
    return Post(db)
