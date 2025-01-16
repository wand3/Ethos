from typing import Optional, List

from fastapi import UploadFile, File, Body
from pydantic import BaseModel, Field, HttpUrl

from webapp.schemas.project import TechStack


class UserImageUpdateForm(BaseModel):
    image: Optional[UploadFile] = None


class PostFormData(BaseModel):
    title: str = Field(..., max_length=100, description="Title of the blog post")
    content: str = Field(..., description="Content of the blog post")
    image: Optional[UploadFile] = File(None)
    tags: List[str] = Field(..., description="Tags associated with the blog post")
    model_config = {"extra": "forbid"}


class UpdateBlogPost(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    image: Optional[UploadFile] = None


class ProjectFormData(BaseModel):
    title: str = Field(..., description="Project title")
    description: str = Field(..., description="Detailed project description")
    project_url: Optional[str] = Field(None, description="Link to the live project or demo")
    github_url: Optional[str] = Field(None, description="Link to the GitHub repository")
    roles: List[str] = Field(..., description='Your roles on the project e.g "Full-Stack Developer", "Frontend '
                                              'Developer", "Backend Developer", "Test Engineer", "Automation '
                                              'Engineer", "DevOps Engineer"')
    images: Optional[List[UploadFile]] = Field(None, description="List of URLs to project screenshots/images")


# update product images form
class ProjectImagesFormData(BaseModel):
    images: Optional[List[UploadFile]] = Field(..., description="List of URLs to project screenshots/images")


# update product form
class ProjectUpdateFormData(BaseModel):
    title: str = Field(..., description="Project title")
    description: str = Field(..., description="Detailed project description")
    project_url: Optional[str] = Field(None, description="Link to the live project or demo")
    github_url: Optional[str] = Field(None, description="Link to the GitHub repository")
    roles: List[str] = Field(..., description='Your roles on the project e.g "Full-Stack Developer", "Frontend '
                                              'Developer", "Backend Developer", "Test Engineer", "Automation '
                                              'Engineer", "DevOps Engineer"')


