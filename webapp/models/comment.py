import datetime
from typing import List, Optional
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from pydantic import ValidationError
from webapp.logger import logger
from pymongo import AsyncMongoClient

from ..schemas.comment import CommentInDB


class CommentModel:

    def __init__(self, db: AsyncMongoClient):
        self.db = db["comments"]

    async def get_all_comments(self) -> List[CommentInDB]:
        comments = []
        try:
            async for comment_data in self.db.find():
                blog = CommentInDB(**comment_data)
                comments.append(blog)
            return comments
        except Exception as e:
            print(f"Error fetching comments: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch all posts")

    # get comment by id
    async def get_comment_by_id(self, comment_id: str) -> Optional[CommentInDB]:
        try:
            # Validate the comment_id
            object_id = ObjectId(comment_id)
        except InvalidId:
            # raise ValueError(f"Invalid comment_id: {comment_id}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Invalid comment_id: {comment_id}")

        post = await self.db.find_one({"_id": object_id})
        if post:
            # Convert ObjectId to string for compatibility with Pydantic
            post["_id"] = str(post["_id"])
            try:
                return CommentInDB(**post)
            except ValidationError as e:
                raise ValueError(f"Invalid data for CommentInDB: {e}")
        if not post:
            raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, detail=f"Comment not found: {comment_id}")
        return None

    # delete comment
    async def delete_comment(self, comment_id: str) -> bool:
        result = await self.db.delete_one({"_id": ObjectId(comment_id)})
        return result.deleted_count == 1


def get_comment_model() -> CommentModel:
    from webapp.database.db_engine import db

    return CommentModel(db)
