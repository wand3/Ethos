from typing import List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime, timedelta, timezone
import secrets
from webapp.database.db_engine import db


class User(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    email: str
    username: str
    hashed_password: str
    token: str
    token_expiration: str


    def __repr__(self):
        return f"<User(full_name={self.full_name}, email={self.email}, id={self.id} )>"
