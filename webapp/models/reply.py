import datetime
from typing import List, Optional
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from pydantic import ValidationError
from webapp.logger import logger
from pymongo import AsyncMongoClient

from webapp.schemas.comment import Reply


class ReplyModel:

    def __init__(self, db: AsyncMongoClient):
        self.db = db["replies"]

    async def get_all_replies(self) -> List[Reply]:
        replies = []
        try:
            async for reply_data in self.db.find():
                blog = Reply(**reply_data)
                replies.append(blog)
            return replies
        except Exception as e:
            print(f"Error fetching replies: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch all posts")

    # get reply by id
    async def get_reply_by_id(self, reply_id: str) -> Optional[Reply]:
        try:
            # Validate the reply_id
            object_id = ObjectId(reply_id)
        except InvalidId:
            # raise ValueError(f"Invalid reply_id: {reply_id}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Invalid reply_id: {reply_id}")

        post = await self.db.find_one({"_id": object_id})
        if post:
            # Convert ObjectId to string for compatibility with Pydantic
            post["_id"] = str(post["_id"])
            try:
                return Reply(**post)
            except ValidationError as e:
                raise ValueError(f"Invalid data for CommentInDB: {e}")
        if not post:
            raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, detail=f"Comment not found: {reply_id}")
        return None

    # delete reply
    async def delete_reply(self, reply_id: str) -> bool:
        result = await self.db.delete_one({"_id": ObjectId(reply_id)})
        return result.deleted_count == 1


def get_reply_model() -> ReplyModel:
    from webapp.database.db_engine import db

    return ReplyModel(db)
