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
from webapp.schemas.comment import CommentBase
from webapp.models.comment import CommentModel, get_comment_model, CommentInDB
from webapp.models.user import get_current_active_user
# from webapp.schemas.forms import CommentFormData, CommentImagesFormData, CommentUpdateFormData

comment = APIRouter(prefix="/comment", tags=["Comments"])  # , dependencies=[Depends(get_current_active_user)]


@comment.post("/add", response_model=CommentInDB, status_code=status.HTTP_201_CREATED)
async def create_comment(
    comment_data: Annotated[CommentFormData, Form()],
    comment_model: Annotated[CommentModel, Depends(get_comment_model)],
):
    # logger.info(f'comment content ----  user {comment_data}')

    try:
        # Handle image uploads (single or multiple)
        images = []
        if comment_data.images:
            # Check if it's a single file upload
            if not isinstance(comment_data.images, list):
                comment_data.images = [comment_data.images]

            # Loop through each uploaded image
            for image in comment_data.images:
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
        if isinstance(comment_data.roles, str):
            roles_list = [role.strip() for role in comment_data.roles.split(",")]
            # logger.info(f'Comment role---- retrieved role list  string {tags_list}')

        elif isinstance(comment_data.roles, list):
            roles_list = [role.strip() for role in comment_data.roles[0].split(",")]
            # logger.info(f'Comment role---- retrieved role list {tags_list}')

        else:
            raise HTTPException(
                status_code=400, detail="Invalid format for roles. Must be a string or list."
            )

        post = Comment(title=comment_data.title,
                       description=comment_data.description,
                       comment_url=comment_data.comment_url,
                       github_url=comment_data.github_url,
                       images=images,
                       roles=roles_list)
        comment_dict = post.model_dump(by_alias=True)
        comment_dict["created_at"] = datetime.utcnow()
        comment_dict["updated_at"] = datetime.utcnow()

        inserted_post = await comment_model.db.insert_one(comment_dict)
        comment_dict["_id"] = inserted_post.inserted_id

        retrieved_comment = await comment_model.db.find_one({"_id": ObjectId(comment_dict["_id"])})
        # logger.info(f'Post ---- retrieved post {retrieved_post}')

        if retrieved_comment:

            return CommentInDB(**retrieved_comment)
        else:
            raise HTTPException(status_code=404, detail="Comment not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# update comment technologies
@comment.put("/{comment_id}/add/technologies", response_model=CommentInDB, status_code=status.HTTP_201_CREATED)
async def update_comment_technologies(
    comment_id: str,
    comment_model: Annotated[CommentModel, Depends(get_comment_model)],
    request: Request,  # Add request to access form data
):
    try:
        if not ObjectId.is_valid(comment_id):
            raise HTTPException(status_code=400, detail="Invalid comment ID format.")

        existing_comment = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
        # logger.info(existing_comment)
        if not existing_comment:
            raise HTTPException(status_code=404, detail="Comment not found.")

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
        if technology_data.get("language") is None and existing_comment["language"] is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Language must be alphanumeric")
        for field_name in ["frameworks", "databases", "tools", "language"]:
            field_value = technology_data.get(field_name)
            if field_value is not None and not all(isinstance(item, str) for item in field_value):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                    detail=f"All items in {field_name} must be strings")

        result = await comment_model.db.update_one(
            {"_id": ObjectId(comment_id)},
            {"$set": {"technologies": technologies_data}}
        )

        # update time of modification
        await comment_model.db.update_one(
            {"_id": ObjectId(comment_id)},
            {"$set": {"updated_at": datetime.utcnow()}}
        )
        updated_comment = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
        if updated_comment:
            if result.modified_count == 0:
                raise HTTPException(status_code=status.HTTP_304_NOT_MODIFIED,
                                    detail="Technologies has no new fields")
            return CommentInDB(**updated_comment)  # Use the Comment model to parse the result
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail="Failed to retrieve updated comment")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# update comment testing_details
@comment.put("/{comment_id}/add/testing", response_model=CommentInDB, status_code=status.HTTP_201_CREATED)
async def update_comment_testing(
    comment_id: str,
    comment_model: Annotated[CommentModel, Depends(get_comment_model)],
    request: Request,  # Add request to access form data
):
    try:
        if not ObjectId.is_valid(comment_id):
            raise HTTPException(status_code=400, detail="Invalid comment ID format.")

        existing_comment = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
        # logger.info(existing_comment)
        if not existing_comment:
            raise HTTPException(status_code=404, detail="Comment not found.")

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
        # if testing_types_data.get("language") is None and existing_comment["language"] is None:
        #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Language must be alphanumeric")
        for field_name in ["test_types", "automation_frameworks", "ci_cd_integration"]:
            field_value = testing_types_data.get(field_name)
            if field_value is not None and not all(isinstance(item, str) for item in field_value):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                    detail=f"All items in {field_name} must be strings")

        result = await comment_model.db.update_one(
            {"_id": ObjectId(comment_id)},
            {"$set": {"testing_details": testing_data}}
        )

        # update time of modification
        await comment_model.db.update_one(
            {"_id": ObjectId(comment_id)},
            {"$set": {"updated_at": datetime.utcnow()}}
        )
        updated_comment = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
        if updated_comment:
            if result.modified_count == 0:
                raise HTTPException(status_code=status.HTTP_304_NOT_MODIFIED,
                                    detail="TestingDetails has no new fields")
            return CommentInDB(**updated_comment)  # Use the Comment model to parse the result
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail="Failed to retrieve updated comment")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# update comment images
@comment.put("/{comment_id}/add/images", response_model=CommentInDB, status_code=status.HTTP_201_CREATED)
async def update_comment_images(
    comment_id: str,
    comment_model: Annotated[CommentModel, Depends(get_comment_model)],
    comment_data: Annotated[CommentImagesFormData, Form()]

):
    try:
        if not ObjectId.is_valid(comment_id):
            raise HTTPException(status_code=400, detail="Invalid comment ID format.")

        existing_comment = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
        # logger.info(existing_comment)
        if not existing_comment:
            raise HTTPException(status_code=404, detail="Comment not found.")

        # Handle image uploads (single or multiple)
        images = []

        if comment_data.images:
            # Check if it's a single file upload
            if not isinstance(comment_data.images, list):
                comment_data.images = [comment_data.images]

            # Loop through each uploaded image
            for image in comment_data.images:
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

        await comment_model.db.update_one(
            {"_id": ObjectId(comment_id)},
            {"$set": {"images": images}}
        )

        # update time of modification
        await comment_model.db.update_one(
            {"_id": ObjectId(comment_id)},
            {"$set": {"updated_at": datetime.utcnow()}}
        )
        updated_comment = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
        if updated_comment:
            return CommentInDB(**updated_comment)  # Use the Comment model to parse the result
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail="Failed to retrieve updated comment")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#  update comments
@comment.put("/{comment_id}/comment/", status_code=status.HTTP_201_CREATED)
async def update_comment(
    comment_id: str,
    update_data: Annotated[CommentFormData, Form()],
    comment_model: Annotated[CommentModel, Depends(get_comment_model)],
):
    logger.info(f"update data ------- {update_data}")
    try:
        if not ObjectId.is_valid(comment_id):
            raise HTTPException(status_code=400, detail="Invalid post ID format.")

        existing_post = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
        if not existing_post:
            raise HTTPException(status_code=404, detail="Post not found.")

        updated_data = {}

        if update_data.title is not None:
            updated_data["title"] = update_data.title
        if update_data.description is not None:
            updated_data["description"] = update_data.description
        if update_data.comment_url is not None:
            updated_data["comment_url"] = update_data.comment_url
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

                raise HTTPException(status_code=400, detail="Invalid format for comment. Must be a string or list.")
            updated_data["roles"] = roles_list
            logger.info(updated_data["roles"])

        updated_data["updated_at"] = str(datetime.utcnow())

        if updated_data:  # only update if there is data to update
            await comment_model.db.update_one({"_id": ObjectId(comment_id)}, {"$set": updated_data})

        updated_comment = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
        return CommentInDB(**updated_comment)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# delete comment
@comment.delete("/{comment_id}/comment/", status_code=status.HTTP_200_OK)
async def delete_comment(
    comment_id: str,
    comment_model: Annotated[CommentModel, Depends(get_comment_model)]
):
    response = await comment_model.delete_comment(comment_id)
    if not response:
        raise HTTPException(status_code=404, detail="Comment not found")

    return {"message": f"Comment deleted successfully {response}"}

