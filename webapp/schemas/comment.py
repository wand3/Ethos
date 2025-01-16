from datetime import datetime
from pydantic import BaseModel, Field, field_validator, ConfigDict, EmailStr
from typing import Optional, List
from ..schemas import PyObjectId


class CommentAuthor(BaseModel):
    id: Optional[PyObjectId] = Field(..., alias="_id")
    username: str
    email: EmailStr


class CommentBase(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "_id": "ObjectId('64b8e349887754f76789abcd')",
                "post_id": "ObjectId('64b8e349887754f76789abcd')",
                "author": [
                    {
                        "_id": "ObjectId('64b8e349887754f76789abcd')",
                        "username": "Jane Smith",
                        "email": "JaneSmith@kwanks.com"
                    }
                      ],
                "content": "Great post!",
                "images": ["image1.png", "image11.mp4"]
            }
        })

    post_id: Optional[PyObjectId] = Field(alias="_id", default=None)
    author: List[CommentAuthor]
    content: Optional[str] = Field(..., description="Detailed comment")
    images: Optional[List[str]] = Field(None, description="List of URLs to project screenshots/images")


class CommentInDB(CommentBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)  # Alias _id to id
    created_at: datetime
    updated_at: datetime
