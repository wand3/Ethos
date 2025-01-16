from datetime import datetime
from bson import ObjectId
from pydantic import BaseModel, EmailStr, constr, Field, field_validator, ConfigDict
from typing import Optional
from ..schemas import PyObjectId


class CommentBase(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={

            "example": {
                "_id": "678501e2a246221541ec8a0e",
                "title": "E-commerce Platform",
                "description": "Developed a full-featured e-commerce platform with user authentication, product "
                               "catalog,"
                               "shopping cart, and payment gateway integration.",
                "project_url": "https://example.com/ecommerce",
                "github_url": "https://github.com/yourusername/ecommerce"
            }

        })

    email: EmailStr
    username: str
    disabled: bool | None = None


class CommentInDB(CommentBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)  # Alias _id to id
    hashed_password: str
    created_at: datetime
    updated_at: datetime


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[constr(min_length=3, max_length=50)] = None
    password: Optional[constr(min_length=6)] = None
