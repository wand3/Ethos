import jwt
from fastapi.security import OAuth2PasswordBearer
from ..config import Config
from webapp.database.db_engine import db
from fastapi import Depends, HTTPException, status
from typing import Optional, Annotated
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from passlib.context import CryptContext
from bson import ObjectId
from datetime import datetime, timedelta, timezone
from jwt.exceptions import InvalidTokenError

from webapp.schemas.user import UserInDB, UserUpdate, UserCreate, UserBase
from ..schemas.auth import TokenData

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Utility to work with MongoDB ObjectIds
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class UserModel:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["users"]

    async def create_user(self, user_data: UserCreate) -> UserInDB:
        """Create a new user in the database."""
        hashed_password = self.hash_password(user_data.password)
        user_dict = {
            "email": user_data.email,
            "username": user_data.full_name,
            "hashed_password": hashed_password,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = await self.collection.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        return UserInDB(**user_dict)

    def get_user(db, username: str):
        if username in db:
            user_dict = db[username]
            return UserInDB(**user_dict)
    async def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        """Retrieve a user by email."""
        user = await self.collection.find_one({"email": email})
        if user:
            return UserInDB(**user)
        return None

    async def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
        """Retrieve a user by their ObjectId."""
        user = await self.collection.find_one({"_id": ObjectId(user_id)})
        if user:
            return UserInDB(**user)
        return None

    async def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[UserInDB]:
        """Update user details."""
        update_dict = user_data.dict(exclude_unset=True)
        if "password" in update_dict:
            update_dict["hashed_password"] = self.hash_password(update_dict.pop("password"))
        update_dict["updated_at"] = datetime.utcnow()
        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(user_id)},
            {"$set": update_dict},
            return_document=True,
        )
        if result:
            return UserInDB(**result)
        return None

    async def delete_user(self, user_id: str) -> bool:
        """Delete a user from the database."""
        result = await self.collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count == 1

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a plain-text password."""
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a plain-text password against a hashed password."""
        return pwd_context.verify(plain_password, hashed_password)

    def authenticate_user(self, db, username: str, password: str):
        user = self.get_user(db, username)
        if not user:
            return False
        if not self.verify_password(password, user.hashed_password):
            return False
        return user

    def create_access_token(data: dict, expires_delta: timedelta | None = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, Config.SECRET_KEY, algorithm=Config.ALGORITHM)
        return encoded_jwt

    async def get_current_user(self, token: Annotated[str, Depends(oauth2_scheme)]):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                raise credentials_exception
            token_data = (
                TokenData(username=username))
        except InvalidTokenError:
            raise credentials_exception
        user = self.get_user(fake_users_db, username=token_data.username)
        if user is None:
            raise credentials_exception
        return user

    @staticmethod
    async def get_current_active_user(
            self, current_user: Annotated[UserBase, Depends(get_current_user)],
    ):
        if current_user.disabled:
            raise HTTPException(status_code=400, detail="Inactive user")
        return current_user


# class User():
#     id: ObjectId = Field(default_factory=ObjectId, alias="_id")
#
#     username: str
#
#     def __repr__(self):
#         return f"<User(full_name={self.full_name}, email={self.email}, id={self.id} )>"
