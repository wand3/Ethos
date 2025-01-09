from datetime import datetime

from bson import ObjectId
from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from ..schemas import PyObjectId


class UserBase(BaseModel):
    email: EmailStr
    username: str
    disabled: bool | None = None

    class Config:
        from_attributes = True
        json_encoders = {
            ObjectId: str
        }
        json_schema_extra = {
            "example": {
                "username": "john_doe",
                "email": "john_doe@example.com"
            }
        }


class UserInDB(UserBase):
    id: Optional[PyObjectId] = None
    hashed_password: str
    created_at: datetime
    updated_at: datetime


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[constr(min_length=3, max_length=50)] = None
    password: Optional[constr(min_length=6)] = None
