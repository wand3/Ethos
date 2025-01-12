import datetime
from typing import List, Optional
from bson import ObjectId
from webapp.database.db_engine import db as database
from pymongo import AsyncMongoClient
from ..schemas.blog import BlogPost, BlogPostInDB, UpdateBlogPost


class Post:

    def __init__(self, db: AsyncMongoClient):
        self.db = db["posts"]

    # async def create_post(self, post_data: BlogPost) -> BlogPostInDB:
    #     post_dict = {
    #         "title": post_data.title,
    #         "content": post_data.content,
    #         "image": post_data.image,
    #         "tags": post_data.tags,
    #         "createdAt": datetime.datetime.utcnow(),
    #         "updatedAt": datetime.datetime.utcnow()
    #     }
    #
    #     result = await self.db.insert_one(post_dict)
    #     post_dict["_id"] = result.inserted_id
    #     return BlogPostInDB(**post_dict)

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
    """Dependency to inject a `UserModel` instance."""
    return Post(database)
