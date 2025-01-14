import os
import shutil
from datetime import datetime
from typing import Annotated
from webapp.config import Config
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status, Form
from webapp.logger import logger
# from ..schemas.forms import UpdateBlogPost
from webapp.schemas.project import Project
from webapp.models.project import ProjectModel, get_project_model, ProjectInDB
from webapp.models.user import get_current_active_user
from webapp.schemas.forms import ProjectFormData


project = APIRouter(prefix="/project", tags=["Project"])  # , dependencies=[Depends(get_current_active_user)]


@project.post("/add", response_model=ProjectInDB, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: Annotated[ProjectFormData, Form()],
    project_model: Annotated[ProjectModel, Depends(get_project_model)],
):
    logger.info(f'project content ----  user {project_data}')

    try:
        # Handle image uploads (single or multiple)
        images = []
        if project_data.images:
            # Check if it's a single file upload
            if not isinstance(project_data.images, list):
                project_data.images = [project_data.images]

            # Loop through each uploaded image
            for image in project_data.images:
                # Validate image size and format (logic remains the same)
                file_content = await image.read()
                file_size = len(file_content)
                if file_size > Config.MAX_IMAGE_SIZE:
                    raise HTTPException(status_code=400, detail="Image size exceeds 5 MB limit.")

                file_ext = os.path.splitext(image.filename)[1]
                if file_ext not in Config.UPLOAD_EXTENSIONS:
                    raise HTTPException(status_code=400,
                                        detail=f"Unsupported image format. Allowed: {', '.join(Config.UPLOAD_EXTENSIONS)}.")

                # Generate unique filename
                image_filename = f"{ObjectId()}_{image.filename}"

                # Create uploads directory (logic remains the same)
                os.makedirs(Config.UPLOAD_PROJECT_IMAGE, exist_ok=True)

                image_path = os.path.join(Config.UPLOAD_PROJECT_IMAGE, image_filename)
                with open(image_path, "wb") as buffer:
                    shutil.copyfileobj(image.file, buffer)

                images.append(image_filename)

        # Handle roles input (either a string or a list)
        if isinstance(project_data.roles, str):
            roles_list = [role.strip() for role in project_data.roles.split(",")]
            # logger.info(f'Project role---- retrieved role list  string {tags_list}')

        elif isinstance(project_data.roles, list):
            roles_list = [role.strip() for role in project_data.roles[0].split(",")]
            # logger.info(f'Project role---- retrieved role list {tags_list}')

        else:
            raise HTTPException(
                status_code=400, detail="Invalid format for roles. Must be a string or list."
            )

        post = Project(title=project_data.title,
                       description=project_data.description,
                       project_url=project_data.project_url,
                       github_url=project_data.github_url,
                       images=images,
                       roles=roles_list)
        project_dict = post.model_dump(by_alias=True)
        project_dict["created_at"] = datetime.utcnow()
        project_dict["updated_at"] = datetime.utcnow()

        inserted_post = await project_model.db.insert_one(project_dict)
        project_dict["_id"] = inserted_post.inserted_id

        retrieved_project = await project_model.db.find_one({"_id": ObjectId(project_dict["_id"])})
        # logger.info(f'Post ---- retrieved post {retrieved_post}')

        if retrieved_project:

            return ProjectInDB(**retrieved_project)
        else:
            raise HTTPException(status_code=404, detail="Project not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @blog.put("/post/{post_id}", response_model=BlogPostInDB, status_code=status.HTTP_201_CREATED)
# async def update_post(
#     post_id: str,
#     update_data: Annotated[UpdateBlogPost, Form()],
#     post_model: Annotated[Post, Depends(get_post_model)],
# ):
#     logger.info(f"update data ------- {update_data}")
#     try:
#         if not ObjectId.is_valid(post_id):
#             raise HTTPException(status_code=400, detail="Invalid post ID format.")
#
#         existing_post = await post_model.db.find_one({"_id": ObjectId(post_id)})
#         if not existing_post:
#             raise HTTPException(status_code=404, detail="Post not found.")
#
#         updated_data = {}
#
#         if update_data.title is not None:
#             updated_data["title"] = update_data.title
#         if update_data.content is not None:
#             updated_data["content"] = update_data.content
#
#         if update_data.tags is not None:
#             # Handle tags (accepting both string and list input)
#             if isinstance(update_data.tags, str):
#                 tags_list = [tag.strip() for tag in update_data.tags.split(",")]
#             elif isinstance(update_data.tags, list):
#                 tags_list = [tag.strip() for tag in update_data.tags[0].split(",")]
#             else:
#                 raise HTTPException(status_code=400, detail="Invalid format for tags. Must be a string or list.")
#             updated_data["tags"] = tags_list
#
#         if update_data.image is not None:  # Check if image is provided
#             file_content = await update_data.image.read()
#             file_size = len(file_content)
#             if file_size > Config.MAX_IMAGE_SIZE:
#                 raise HTTPException(status_code=400, detail="Image size exceeds limit.")
#
#             file_ext = os.path.splitext(update_data.image.filename)[1]
#             if file_ext not in Config.UPLOAD_EXTENSIONS:
#                 raise HTTPException(status_code=400,
#                                     detail=f"Unsupported image format. Allowed: {', '.join(Config.UPLOAD_EXTENSIONS)}.")
#
#             image_filename = f"{ObjectId()}_{update_data.image.filename}"
#             os.makedirs(Config.UPLOAD_BLOG_POST_IMAGE, exist_ok=True)
#             image_path = os.path.join(Config.UPLOAD_BLOG_POST_IMAGE, image_filename)
#
#             with open(image_path, "wb") as buffer:
#                 shutil.copyfileobj(update_data.image.file, buffer)
#
#             if existing_post.get("image"):
#                 old_image_path = os.path.join(Config.UPLOAD_BLOG_POST_IMAGE, existing_post["image"])
#                 try:
#                     os.remove(old_image_path)
#                 except FileNotFoundError:
#                     pass
#
#             updated_data["image"] = image_filename
#         updated_data["updated_at"] = datetime.utcnow()
#
#         if updated_data:  # only update if there is data to update
#             await post_model.db.update_one({"_id": ObjectId(post_id)}, {"$set": updated_data})
#
#         updated_post = await post_model.db.find_one({"_id": ObjectId(post_id)})
#         return BlogPostInDB(**updated_post)
#
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#
#
# @blog.delete("/post/{post_id}", status_code=status.HTTP_200_OK)
# async def delete_post(
#     post_id: str,
#     post_model: Annotated[Post, Depends(get_post_model)]
# ):
#     post = await post_model.delete_post(post_id)
#     # if not existing_post:
#     #     raise HTTPException(status_code=404, detail="Post not found")
#     #
#     # posts_collection.delete_one({"_id": ObjectId(post_id)})
#     return {"message": f"Post deleted successfully {post}"}
