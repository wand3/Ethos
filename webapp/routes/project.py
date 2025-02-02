import logging
import os
import shutil
from datetime import datetime
from typing import Annotated

from starlette.requests import Request

from webapp.config import Config
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status, Form, Body
from webapp.logger import logger
# from ..schemas.forms import UpdateBlogPost
from webapp.schemas.project import Project, TechStack
from webapp.models.project import ProjectModel, get_project_model, ProjectInDB
from webapp.models.user import get_current_active_user
from webapp.schemas.forms import ProjectFormData, ProjectImagesFormData, ProjectUpdateFormData

project = APIRouter(prefix="/project", tags=["Project"], dependencies=[Depends(get_current_active_user)])


@project.post("/add", response_model=ProjectInDB, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: Annotated[ProjectFormData, Form()],
    project_model: Annotated[ProjectModel, Depends(get_project_model)],
):
    # logger.info(f'project content ----  user {project_data}')

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
                    # shutil.copyfileobj(image.file, buffer)
                    buffer.write(file_content)  # Write the file content directly

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
        logger.info(f'project content ----  user {project_dict}')

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


# update project technologies
@project.put("/{project_id}/add/technologies", response_model=ProjectInDB, status_code=status.HTTP_201_CREATED)
async def update_project_technologies(
    project_id: str,
    project_model: Annotated[ProjectModel, Depends(get_project_model)],
    request: Request,  # Add request to access form data
):
    try:
        if not ObjectId.is_valid(project_id):
            raise HTTPException(status_code=400, detail="Invalid project ID format.")

        existing_project = await project_model.db.find_one({"_id": ObjectId(project_id)})
        # logger.info(existing_project)
        if not existing_project:
            raise HTTPException(status_code=404, detail="Project not found.")

        form_data = await request.form()
        technology_data = {"language": form_data.get("language").split(",") if form_data.get("language") else None,
                           "frameworks": form_data.get("frameworks").split(",") if form_data.get(
                               "frameworks") else None,
                           "databases": form_data.get("databases").split(",") if form_data.get("databases") else None,
                           "tools": form_data.get("tools").split(",") if form_data.get("tools") else None,
                           }
        technologies_data = technology_data
        # logging.info(f"---------------------*********** {technology_data}")

        if not any(value is not None for value in technology_data.values()):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="At least one field must be provided in technology")
        if technology_data.get("language") is None and existing_project["language"] is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Language must be alphanumeric")
        for field_name in ["frameworks", "databases", "tools", "language"]:
            field_value = technology_data.get(field_name)
            if field_value is not None and not all(isinstance(item, str) for item in field_value):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                    detail=f"All items in {field_name} must be strings")

        result = await project_model.db.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {"technologies": technologies_data}}
        )

        # update time of modification
        await project_model.db.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {"updated_at": datetime.utcnow()}}
        )
        updated_project = await project_model.db.find_one({"_id": ObjectId(project_id)})
        if updated_project:
            if result.modified_count == 0:
                raise HTTPException(status_code=status.HTTP_304_NOT_MODIFIED,
                                    detail="Technologies has no new fields")
            return ProjectInDB(**updated_project)  # Use the Project model to parse the result
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail="Failed to retrieve updated project")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# update project testing_details
@project.put("/{project_id}/add/testing", response_model=ProjectInDB, status_code=status.HTTP_201_CREATED)
async def update_project_testing(
    project_id: str,
    project_model: Annotated[ProjectModel, Depends(get_project_model)],
    request: Request,  # Add request to access form data
):
    try:
        if not ObjectId.is_valid(project_id):
            raise HTTPException(status_code=400, detail="Invalid project ID format.")

        existing_project = await project_model.db.find_one({"_id": ObjectId(project_id)})
        # logger.info(existing_project)
        if not existing_project:
            raise HTTPException(status_code=404, detail="Project not found.")

        form_data = await request.form()
        testing_types_data = {
            "test_types": form_data.get("test_types").split(",") if form_data.get("test_types") else None,
            "automation_frameworks": form_data.get("automation_frameworks").split(",") if form_data.get("automation_frameworks") else None,
            "ci_cd_integration": form_data.get("ci_cd_integration").split(",") if form_data.get("ci_cd_integration") else form_data.get("ci_cd_integration")
            }
        testing_data = testing_types_data
        # logging.info(f"---------------------*********** {technology_data}")

        if not any(value is not None for value in testing_types_data.values()):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="At least one field must be provided in technology")
        # if testing_types_data.get("language") is None and existing_project["language"] is None:
        #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Language must be alphanumeric")
        for field_name in ["test_types", "automation_frameworks", "ci_cd_integration"]:
            field_value = testing_types_data.get(field_name)
            if field_value is not None and not all(isinstance(item, str) for item in field_value):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                    detail=f"All items in {field_name} must be strings")

        result = await project_model.db.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {"testing_details": testing_data}}
        )

        # update time of modification
        await project_model.db.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {"updated_at": datetime.utcnow()}}
        )
        updated_project = await project_model.db.find_one({"_id": ObjectId(project_id)})
        if updated_project:
            if result.modified_count == 0:
                raise HTTPException(status_code=status.HTTP_304_NOT_MODIFIED,
                                    detail="TestingDetails has no new fields")
            return ProjectInDB(**updated_project)  # Use the Project model to parse the result
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail="Failed to retrieve updated project")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# update project images
@project.put("/{project_id}/add/images", response_model=ProjectInDB, status_code=status.HTTP_201_CREATED)
async def update_project_images(
    project_id: str,
    project_model: Annotated[ProjectModel, Depends(get_project_model)],
    project_data: Annotated[ProjectImagesFormData, Form()]

):
    try:
        if not ObjectId.is_valid(project_id):
            raise HTTPException(status_code=400, detail="Invalid project ID format.")

        existing_project = await project_model.db.find_one({"_id": ObjectId(project_id)})
        # logger.info(existing_project)
        if not existing_project:
            raise HTTPException(status_code=404, detail="Project not found.")

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
                    # shutil.copyfileobj(image.file, buffer)
                    buffer.write(file_content)  # Write the file content directly

                images.append(image_filename)

        await project_model.db.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {"images": images}}
        )

        # update time of modification
        await project_model.db.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {"updated_at": datetime.utcnow()}}
        )
        updated_project = await project_model.db.find_one({"_id": ObjectId(project_id)})
        if updated_project:
            return ProjectInDB(**updated_project)  # Use the Project model to parse the result
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail="Failed to retrieve updated project")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#  update projects
@project.put("/{project_id}/project/", status_code=status.HTTP_201_CREATED)
async def update_project(
    project_id: str,
    update_data: Annotated[ProjectFormData, Form()],
    project_model: Annotated[ProjectModel, Depends(get_project_model)],
):
    logger.info(f"update data ------- {update_data}")
    try:
        if not ObjectId.is_valid(project_id):
            raise HTTPException(status_code=400, detail="Invalid post ID format.")

        existing_post = await project_model.db.find_one({"_id": ObjectId(project_id)})
        if not existing_post:
            raise HTTPException(status_code=404, detail="Post not found.")

        updated_data = {}

        if update_data.title is not None:
            updated_data["title"] = update_data.title
        if update_data.description is not None:
            updated_data["description"] = update_data.description
        if update_data.project_url is not None:
            updated_data["project_url"] = update_data.project_url
        if update_data.github_url is not None:
            updated_data["github_url"] = update_data.github_url
        logger.info(update_data.roles)

        if update_data.roles is not None:
            # Handle tags (accepting both string and list input)
            if isinstance(update_data.roles, str):
                roles_list = [role.strip() for role in update_data.roles.split(",")]
            elif isinstance(update_data.roles, list):
                roles_list = [role.strip() for role in update_data.roles[0].split(",")]
            else:

                raise HTTPException(status_code=400, detail="Invalid format for project. Must be a string or list.")
            updated_data["roles"] = roles_list
            logger.info(updated_data["roles"])

        updated_data["updated_at"] = str(datetime.utcnow())

        if updated_data:  # only update if there is data to update
            await project_model.db.update_one({"_id": ObjectId(project_id)}, {"$set": updated_data})

        updated_project = await project_model.db.find_one({"_id": ObjectId(project_id)})
        return ProjectInDB(**updated_project)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# delete project
@project.delete("/{project_id}/project/", status_code=status.HTTP_200_OK)
async def delete_project(
    project_id: str,
    project_model: Annotated[ProjectModel, Depends(get_project_model)]
):
    response = await project_model.delete_project(project_id)
    if not response:
        raise HTTPException(status_code=404, detail="Project not found")

    return {"message": f"Project deleted successfully {response}"}



# @project.put("/{project_id}/add/images", response_model=ProjectInDB, status_code=status.HTTP_201_CREATED)
# async def update_project_images(
#     project_id: str,
#     project_model: Annotated[ProjectModel, Depends(get_project_model)],
#     images: List[UploadFile] = File(...)  # Use List[UploadFile] for multiple files
# ):
#     try:
#         # Validate project ID
#         if not ObjectId.is_valid(project_id):
#             raise HTTPException(status_code=400, detail="Invalid project ID format.")
#
#         # Check if the project exists
#         existing_project = await project_model.db.find_one({"_id": ObjectId(project_id)})
#         if not existing_project:
#             raise HTTPException(status_code=404, detail="Project not found.")
#
#         # Handle image uploads
#         uploaded_images = []
#
#         for image in images:
#             # Validate image size
#             file_content = await image.read()
#             file_size = len(file_content)
#             if file_size == 0:
#                 raise HTTPException(status_code=400, detail="Uploaded file is empty.")
#             if file_size > Config.MAX_IMAGE_SIZE:
#                 raise HTTPException(status_code=400, detail="Image size exceeds 5 MB limit.")
#
#             # Validate image format
#             file_ext = os.path.splitext(image.filename)[1].lower()
#             if file_ext not in Config.UPLOAD_EXTENSIONS:
#                 raise HTTPException(
#                     status_code=400,
#                     detail=f"Unsupported image format. Allowed: {', '.join(Config.UPLOAD_EXTENSIONS)}."
#                 )
#
#             # Generate a unique filename
#             image_filename = f"{ObjectId()}_{image.filename}"
#
#             # Ensure the upload directory exists
#             os.makedirs(Config.UPLOAD_PROJECT_IMAGE, exist_ok=True)
#
#             # Save the image to the upload directory
#             image_path = os.path.join(Config.UPLOAD_PROJECT_IMAGE, image_filename)
#             with open(image_path, "wb") as buffer:
#                 buffer.write(file_content)  # Write the file content directly
#
#             uploaded_images.append(image_filename)
#
#         # Update the project with the new images
#         await project_model.db.update_one(
#             {"_id": ObjectId(project_id)},
#             {"$set": {"images": uploaded_images, "updated_at": datetime.utcnow()}}
#         )
#
#         # Retrieve the updated project
#         updated_project = await project_model.db.find_one({"_id": ObjectId(project_id)})
#         if updated_project:
#             return ProjectInDB(**updated_project)
#         else:
#             raise HTTPException(
#                 status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 detail="Failed to retrieve updated project."
#             )
#
#     except HTTPException as http_error:
#         raise http_error
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))