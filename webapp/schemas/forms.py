from typing import Optional, List

from fastapi import UploadFile, File
from pydantic import BaseModel, Field, HttpUrl


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
    # technologies: List[TechStack] = Field(..., description="List of technologies used")
    roles: List[str] = Field(..., description='Your roles on the project e.g "Full-Stack Developer", "Frontend '
                                              'Developer", "Backend Developer", "Test Engineer", "Automation '
                                              'Engineer", "DevOps Engineer"')
    # testing_details: Optional[TestingDetails] = Field(None, description="Details about testing and automation")
    # images: Optional[List[str]] = Field(None, description="List of URLs to project screenshots/images")
    images: Optional[List[UploadFile]] = Field(None, description="List of URLs to project screenshots/images")



# add product technologies form


# add product testing_details form