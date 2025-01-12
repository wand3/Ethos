from datetime import datetime, timedelta, timezone
from pydantic import BaseModel, Field
from typing import Optional, List
from ..schemas import PyObjectId


def ErrorResponseModel(error, code, message):
    return {"error": error, "code": code, "message": message}


# post
class BlogPost(BaseModel):
    image: str = Field(...)
    title: str = Field(...)
    content: str = Field(...)
    tags: List[str] = Field(...)

    class Config:
        form_attributes = True
        json_schema_extra = {
            "example": {
                "image": "https://imageurl",
                "title": "Lady and the hen with many colors",
                "content": '"Enumerating objects: 36, done Counting objects: 100% (36/36), done. Delta compression '
                           'using up to 4 threads Compressing objects: 100% (22/22), done. iting objects: 100% ('
                           '22/22), 3.57 KiB | 1.78 MiB/s, done."',
                "tags": ["Lady", "and", "the", "hen", "with"]
            }
        }


class BlogPostInDB(BlogPost):
    # id: Optional[PyObjectId] = None
    id: Optional[PyObjectId] = Field(alias="_id", default=None)  # Alias _id to id
    created_at: datetime
    updated_at: datetime


class UpdateBlogPost(BaseModel):
    image: str = Field(...)
    title: str = Field(...)
    content: str = Field(...)
    tags: List[str] = Field(...)


# comment
class CommentBase(BaseModel):
    body: str
    author_name: Optional[str] = "Anonymous"
    author_email: Optional[str] = "Random name"
    post_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CommentInDB(CommentBase):
    id: str
