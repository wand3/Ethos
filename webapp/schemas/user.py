from datetime import datetime
from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from ..schemas import PyObjectId


class UserBase(BaseModel):
    email: EmailStr
    username: str

    class Config:
        from_attributes = True
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
    # email: EmailStr
    # username: str
    # password: Optional[str] = None
    username: Optional[constr(min_length=3, max_length=50)] = None
    email: Optional[EmailStr] = None
    password: Optional[constr(min_length=6)] = None
