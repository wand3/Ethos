from bson import ObjectId
from datetime import datetime, timedelta, timezone
from jwt import encode, decode, exceptions
from motor.motor_asyncio import AsyncIOMotorDatabase
from passlib.context import CryptContext
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from ..schemas.user import UserInDB, UserCreate, UserUpdate, PyObjectId
from ..schemas.auth import TokenData
from ..config import Config

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class UserModel:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["users"]

    async def create_user(self, user_data: UserCreate) -> UserInDB:
        hashed_password = self.hash_password(user_data.password)
        user_dict = {
            "email": user_data.email,
            "full_name": user_data.full_name,
            "hashed_password": hashed_password,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = await self.collection.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        return UserInDB(**user_dict)

    async def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        user = await self.collection.find_one({"email": email})
        return UserInDB(**user) if user else None

    async def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
        user = await self.collection.find_one({"_id": ObjectId(user_id)})
        return UserInDB(**user) if user else None

    async def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[UserInDB]:
        update_dict = user_data.dict(exclude_unset=True)
        if "password" in update_dict:
            update_dict["hashed_password"] = self.hash_password(update_dict.pop("password"))
        update_dict["updated_at"] = datetime.utcnow()
        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(user_id)}, {"$set": update_dict}, return_document=True
        )
        return UserInDB(**result) if result else None

    async def delete_user(self, user_id: str) -> bool:
        result = await self.collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count == 1

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def authenticate_user(self, db, username: str, password: str):
        user = self.get_user(db, username)
        if not user:
            return False
        if not self.verify_password(password, user.hashed_password):
            return False
        return user

    @staticmethod
    def create_access_token(data: dict, expires_delta: timedelta | None = None):
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
        to_encode.update({"exp": expire})
        return encode(to_encode, Config.SECRET_KEY, algorithm=Config.ALGORITHM)

    async def get_current_user(self, token: str = Depends(oauth2_scheme)) -> UserInDB:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = decode(token, Config.SECRET_KEY, algorithms=[Config.ALGORITHM])
            email: str = payload.get("sub")
            if email is None:
                raise credentials_exception
        except exceptions.InvalidTokenError:
            raise credentials_exception
        user = await self.get_user_by_email(email)
        if not user:
            raise credentials_exception
        return user

    async def get_current_active_user(self, current_user: UserInDB = Depends(get_current_user)):
        if getattr(current_user, "disabled", False):
            raise HTTPException(status_code=400, detail="Inactive user")
        return current_user
