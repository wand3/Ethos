from datetime import datetime

from pydantic import BaseModel, EmailStr
from typing import Optional

from bson import ObjectId


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
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


class UserBase(BaseModel):
    email: EmailStr
    username: str

    class Config:
        from_attributes = True


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
