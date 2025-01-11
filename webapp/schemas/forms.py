from typing import Optional, List

from pydantic import BaseModel, Field


class PostFormData(BaseModel):
    title: str = Field(..., max_length=100, description="Title of the blog post")
    content: str = Field(..., description="Content of the blog post")
    image: Optional[str] = Field(None, description="Image URL for the blog post")
    tags: List[str] = Field(..., description="Tags associated with the blog post")
    model_config = {"extra": "forbid"}
    # createdAt: Optional[datetime] = Field(None, description="Time of post creation")
    # updatedAt: Optional[datetime] = Field(None, description="Time of last post update")
