from datetime import datetime

from pydantic import BaseModel, EmailStr
from typing import Optional

from webapp.models.user import PyObjectId


class UserBase(BaseModel):
    email: EmailStr
    username: str

    class Config:
        orm_mode = True


class UserInDB(UserBase):
    id: Optional[PyObjectId] = None
    hashed_password: str
    created_at: datetime
    updated_at: datetime


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[str]
    password: Optional[str]
