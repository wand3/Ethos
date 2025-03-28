import logging
import os
from pathlib import Path
from datetime import datetime
from typing import Annotated

from starlette.requests import Request
from cloudinary import uploader
from webapp.config import Config, basedir
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
                # image_filename = f"{ObjectId()}_{image.filename}"

                # Upload to Cloudinary
                try:
                    upload_result = uploader.upload(
                        file_content,
                        public_id=f"projects/{ObjectId()}",  # Custom public ID
                        folder="projects",  # Optional folder organization
                        resource_type="image"  # Auto-detects image/video
                    )
                    images.append(upload_result["secure_url"])
                    logger.info("testbcloudinary in")
                    # images.append(upload_result["secure_url"])  # Store secure HTTPS URL
                except Exception as cloudinary_error:
                    logger.info(cloudinary_error)

                    raise HTTPException(
                        status_code=500,
                        detail=f"Failed to upload image to Cloudinary: {str(cloudinary_error)}"
                    )

                # # Create uploads directory (logic remains the same)
                # os.makedirs(Config.UPLOAD_PROJECT_IMAGE, exist_ok=True)
                #
                # image_path = os.path.join(Config.UPLOAD_PROJECT_IMAGE, image_filename)
                # with open(image_path, "wb") as buffer:
                #     # shutil.copyfileobj(image.file, buffer)
                #     buffer.write(file_content)  # Write the file content directly

                # images.append(image_filename)

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
                # os.makedirs(Config.UPLOAD_PROJECT_IMAGE, exist_ok=True)
                #
                # image_path = os.path.join(Config.UPLOAD_PROJECT_IMAGE, image_filename)
                # with open(image_path, "wb") as buffer:
                #     # shutil.copyfileobj(image.file, buffer)
                #     buffer.write(file_content)  # Write the file content directly
                #
                # images.append(image_filename)
                # Upload to Cloudinary
                try:
                    upload_result = uploader.upload(
                        file_content,
                        public_id=f"projects/{ObjectId()}",  # Custom public ID
                        folder="projects",  # Optional folder organization
                        resource_type="image"  # Auto-detects image/video
                    )
                    images.append(upload_result["secure_url"])
                    # logger.info("testbcloudinary in")
                    # images.append(upload_result["secure_url"])  # Store secure HTTPS URL
                except Exception as cloudinary_error:
                    logger.info(cloudinary_error)

                    raise HTTPException(
                        status_code=500,
                        detail=f"Failed to upload image to Cloudinary: {str(cloudinary_error)}"
                    )

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


# delete projects particular image
@project.delete("/{project_id}/images/{image_name}", status_code=status.HTTP_200_OK)
async def delete_project_image(
    project_id: str,
    image_name: str,
    project_model: Annotated[ProjectModel, Depends(get_project_model)]
):
    try:
        get_project = await project_model.db.find_one({"_id": ObjectId(project_id)})
        if not get_project:
            raise HTTPException(status_code=404, detail="Project not found")

        if image_name not in get_project["images"]:
            # logger.info(f'project seen {get_project["images"]}')

            raise HTTPException(status_code=404, detail="Image not found in project")

        updated_images = [img for img in get_project["images"] if img != image_name]

        update_result = await project_model.db.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {"images": updated_images}}
        )
        if update_result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Project not found or image not found")

        # Optionally delete the image file from storage here (if needed)
        image_path = os.path.join(basedir, 'static', 'images', 'project_images', f'{image_name}')
        # Clean up
        if os.path.exists(image_path):
            logger.info('image found in directory')
            os.remove(image_path)
        return {"message": f"Image '{image_name}' deleted from project '{project_id}'"}
    except ValueError:  # Handle invalid ObjectId
        raise HTTPException(status_code=400, detail="Invalid project ID")
    except Exception as e:  # Catch other potential errors (database, file deletion, etc.)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
