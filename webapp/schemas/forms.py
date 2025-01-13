from typing import Optional, List

from fastapi import UploadFile, File
from pydantic import BaseModel, Field


class PostFormData(BaseModel):
    title: str = Field(..., max_length=100, description="Title of the blog post")
    content: str = Field(..., description="Content of the blog post")
    image: Optional[UploadFile] = File(None)
    tags: List[str] = Field(..., description="Tags associated with the blog post")
    model_config = {"extra": "forbid"}


class UpdateBlogPost(BaseModel):
    # image: str = Field(...)
    # image: Optional[UploadFile] = File(None)
    # title: str = Field(...)
    # content: str = Field(...)
    # tags: List[str] = Field(...)
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    image: Optional[UploadFile] = None
