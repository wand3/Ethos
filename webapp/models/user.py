from ..logger import logger
from bson import ObjectId
from datetime import datetime, timedelta, timezone
from pymongo import AsyncMongoClient
from passlib.context import CryptContext
from typing import Optional, Annotated, AsyncGenerator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from ..schemas.user import UserInDB, UserCreate, UserUpdate, UserBase
from ..schemas.auth import TokenData
from ..config import Config
from jose import jwt, JWTError
# from webapp.database.db_engine import db


# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class UserModel:
    def __init__(self, db: AsyncMongoClient):
        self.db = db["users"]

    async def create_user(self, user_data: UserCreate) -> UserInDB:
        hashed_password = self.hash_password(user_data.password)
        user_dict = {
            "email": user_data.email,
            "username": user_data.username,
            "hashed_password": hashed_password,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        result = await self.db.insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        return UserInDB(**user_dict)

    async def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        user = await self.db.find_one({"email": email})
        return UserInDB(**user) if user else None

    async def get_user_by_id(self, user_id: str) -> Optional[UserInDB]:
        user = await self.db.find_one({"_id": ObjectId(user_id)})
        return UserInDB(**user) if user else None

    async def update_user(self, user_id: str, user_data: UserUpdate) -> Optional[UserInDB]:
        update_dict = user_data.dict(exclude_unset=True)
        if "password" in update_dict:
            update_dict["hashed_password"] = self.hash_password(update_dict.pop("password"))
        update_dict["updated_at"] = datetime.utcnow()
        result = await self.db.find_one_and_update(
            {"_id": ObjectId(user_id)}, {"$set": update_dict}, return_document=True
        )
        return UserInDB(**result) if result else None

    async def delete_user(self, user_id: str) -> bool:
        result = await self.db.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count == 1

    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    async def authenticate_user(self, username: str, password: str) -> Optional[UserInDB]:
        """Verify the user's credentials."""
        user = await self.db.find_one({"username": username})
        logger.info(f'User auth {user}')
        if user and self.verify_password(password, user["hashed_password"]):
            return UserInDB(**user)
        return None

    @staticmethod
    def create_access_token(data: dict, expires_delta: timedelta | None = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, Config.SECRET_KEY, algorithm=Config.ALGORITHM)
        logger.info(f'Token created for user {encoded_jwt}')

        return encoded_jwt

    async def get_user(self, database, username: str):
        database = self.db
        user = await database.find_one({"username": username})
        logger.info(f'Get User in auth: {user}')
        if user:
            user["_id"] = str(user["_id"])
            return UserInDB(**user)
        return None

    # @staticmethod
    async def get_current_user(self, token: Annotated[str, Depends(oauth2_scheme)]):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        logger.info(f'User model ---- get current user start')

        try:
            logger.info(f'User model ---- get current user next')
            logger.info(f'User model ---- get current user token {token}')
            logger.info(f'User model ---- get current user secret key {Config.SECRET_KEY}')
            logger.info(f'User model ---- get current user algo {Config.ALGORITHM}')

            payload = jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.ALGORITHM])
            logger.info(f'User model ---- get current user payload {payload}')

            username: str = payload.get("sub")

            if username is None:
                raise credentials_exception
            token_data = TokenData(username=username)
        except JWTError:
            logger.info(f'User model ---- get current user payload error')

            raise credentials_exception
        user = await self.get_user(database=self.db, username=token_data.username)
        if user is None:
            raise credentials_exception
        return user


    async def get_current_active_user(current_user: UserBase = Depends(get_current_user)):
        # if getattr(current_user, "disabled", False):
        if current_user:
            raise HTTPException(status_code=400, detail="Inactive user")
        return current_user

    @property
    def user_collection(self):
        return self.db


