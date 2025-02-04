import datetime
from typing import List, Optional
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from pydantic import ValidationError
from webapp.logger import logger
from pymongo import AsyncMongoClient
from ..schemas.project import Project, ProjectInDB


class ProjectModel:

    def __init__(self, db: AsyncMongoClient):
        self.db = db["projects"]

    async def get_all_projects(self) -> List[ProjectInDB]:
        projects = []
        try:
            async for project_data in self.db.find():
                blog = ProjectInDB(**project_data)
                projects.append(blog)
            # logger.info(projects)
            return projects
        except Exception as e:
            print(f"Error fetching projects: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch all posts")

    # get project by id
    async def get_project_by_id(self, post_id: str) -> Optional[ProjectInDB]:
        try:
            # Validate the post_id
            object_id = ObjectId(post_id)
        except InvalidId:
            # raise ValueError(f"Invalid post_id: {post_id}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Invalid project_id: {post_id}")

        post = await self.db.find_one({"_id": object_id})
        if post:
            # Convert ObjectId to string for compatibility with Pydantic
            post["_id"] = str(post["_id"])
            try:
                return ProjectInDB(**post)
            except ValidationError as e:
                raise ValueError(f"Invalid data for ProjectInDB: {e}")
        if not post:
            raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, detail=f"Project not found: {post_id}")
        return None

    # get project by role and roles
    async def get_projects_by_roles(self, roles: List[str]) -> List[ProjectInDB]:
        query = {"roles": {"$in": roles}}
        projects_cursor = self.db.find(query)
        projects = []
        async for project in projects_cursor:
            projects.append(ProjectInDB(**project))
        return projects

    # delete project
    async def delete_project(self, project_id: str) -> bool:
        result = await self.db.delete_one({"_id": ObjectId(project_id)})
        return result.deleted_count == 1


def get_project_model() -> ProjectModel:
    from webapp.database.db_engine import db

    return ProjectModel(db)
