import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId
from webapp.database.db_engine import db


class Post(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    title: str
    content: str
    createdAt: datetime = Field(default_factory=datetime.datetime.utcnow())
    updatedAt: datetime = Field(default_factory=datetime.datetime.utcnow())
    tags: List[str] = []

    def __repr__(self):
        return f"<Post(title={self.title}, tags={self.tags}, id={self.id} )>"
