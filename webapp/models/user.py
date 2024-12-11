from typing import List, Optional
from pydantic import BaseModel, Field
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
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

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)

    # def get_token(self, expires_in=9600):
    #     now = datetime.now(timezone.utc)
    #     if self.token and self.token_expiration.replace(
    #             tzinfo=timezone.utc) > now + timedelta(seconds=60):
    #         return self.token
    #     self.token = secrets.token_hex(16)
    #     self.token_expiration = now + timedelta(seconds=expires_in)
    #     db.session.add(self)
    #     return self.token
    #
    # def revoke_token(self):
    #     self.token_expiration = datetime.now(timezone.utc) - timedelta(seconds=1)

    # @staticmethod
    # def check_token(token):
    #     user = db.session.scalar(select(User).where(User.token == token))
    #     if user is None or user.token_expiration.replace(
    #             tzinfo=timezone.utc) < datetime.now(timezone.utc):
    #         return None
    #     return user

    def __repr__(self):
        return f"<User(full_name={self.full_name}, email={self.email}, id={self.id} )>"
