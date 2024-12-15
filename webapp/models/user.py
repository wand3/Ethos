from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId
from webapp.database.db_engine import db


class User(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    email: EmailStr
    username: str

    def __repr__(self):
        return f"<User(full_name={self.full_name}, email={self.email}, id={self.id} )>"
