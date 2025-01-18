import logging
import os
import shutil
from datetime import datetime
from typing import Annotated, List

from starlette.requests import Request

from webapp.config import Config
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status, Form, Body
from webapp.logger import logger
from webapp.models.blog import Post, get_post_model
from webapp.models.reply import ReplyModel, get_reply_model
from webapp.routes.auth import get_user_model
# from ..schemas.forms import UpdateBlogPost
from webapp.schemas.comment import Comment, Reply
from webapp.models.comment import CommentModel, get_comment_model, CommentInDB
from webapp.models.user import get_current_active_user, UserModel
from webapp.schemas.forms import CommentFormData, CommentImagesFormData
from webapp.schemas.user import UserBase

comment = APIRouter(prefix="/comment", tags=["Comments"])  # , dependencies=[Depends(get_current_active_user)]


# create comment
@comment.post("/{post_id}/add", response_model=CommentInDB, status_code=status.HTTP_201_CREATED)
async def create_comment(
    post_id: str,
    comment_data: Annotated[CommentFormData, Form()],
    comment_model: Annotated[CommentModel, Depends(get_comment_model)],
    user_model: Annotated[UserModel, Depends(get_user_model)],
    post_model: Annotated[Post, Depends(get_post_model)]
):
    try:
        if not ObjectId.is_valid(post_id):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project ID format.")

        post = await post_model.db.find_one({"_id": ObjectId(post_id)})
        logger.info(post)
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")

        # Check if user exists, create if not
        user = await user_model.db.find_one({"email": comment_data.email})
        logger.info(user)

        if not user:
            new_user = UserBase(username=comment_data.username, email=comment_data.email).model_dump(by_alias=True)
            inserted_user = await user_model.db.insert_one(new_user)
            user_id = str(inserted_user.inserted_id)

        else:
            user_id = str(user["_id"])
            logger.info(user_id)

        # Handle image uploads (single or multiple)
        images = []
        if comment_data.images:
            # Check if it's a single file upload
            if not isinstance(comment_data.images, list):
                comment_data.images = [comment_data.images]

            if len(comment_data.images) > 2:
                raise HTTPException(status_code=400, detail="Max of 2 images can be uploaded")

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
                os.makedirs(Config.UPLOAD_BLOG_POST_COMMENT_IMAGE, exist_ok=True)

                image_path = os.path.join(Config.UPLOAD_BLOG_POST_COMMENT_IMAGE, image_filename)
                with open(image_path, "wb") as buffer:
                    shutil.copyfileobj(image.file, buffer)

                images.append(image_filename)

        post = Comment(post_id=post_id,
                       user_id=user_id,
                       content=comment_data.content,
                       images=images)

        comment_dict = post.model_dump(by_alias=True)
        comment_dict["created_at"] = datetime.utcnow()

        inserted_post = await comment_model.db.insert_one(comment_dict)
        comment_dict["_id"] = inserted_post.inserted_id

        retrieved_comment = await comment_model.db.find_one({"_id": ObjectId(comment_dict["_id"])})
        # logger.info(f'Post ---- retrieved post {retrieved_post}')

        # Update the project to include the comment id
        await post_model.db.update_one(
            {"_id": ObjectId(post_id)},
            {"$push": {"comments": retrieved_comment["_id"]}}
        )

        if retrieved_comment:

            return CommentInDB(**retrieved_comment)
        else:
            raise HTTPException(status_code=404, detail="Comment not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# get all comments on post
@comment.get("/blog/{post_id}/comments", response_model=List[CommentInDB], status_code=status.HTTP_200_OK)
async def get_comments_by_post(
    post_id: str,
    comment_model: Annotated[CommentModel, Depends(get_comment_model)],
    post_model: Annotated[Post, Depends(get_post_model)]

):
    try:
        if not ObjectId.is_valid(post_id):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid post ID format.")
        post = await post_model.db.find_one({"_id": ObjectId(post_id)})
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")
        comment_ids = post.get("comments", [])
        comments = []
        for comment_id in comment_ids:
            p_comment = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
            if p_comment:
                comments.append(CommentInDB(**p_comment))
        return comments
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# create a reply
@comment.post("/{post_id}/comments/{comment_id}/replies", response_model=Reply, status_code=status.HTTP_201_CREATED)
async def create_reply(
    post_id: str,
    comment_id: str,
    reply_data: Annotated[CommentFormData, Form()],
    reply_model: Annotated[ReplyModel, Depends(get_reply_model)],
    user_model: Annotated[UserModel, Depends(get_user_model)],
    post_model: Annotated[Post, Depends(get_post_model)],
    comment_model: Annotated[Post, Depends(get_comment_model)]

):
    try:
        if not ObjectId.is_valid(post_id):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid post ID format.")
        if not ObjectId.is_valid(comment_id):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid comment ID format.")

        post = await post_model.db.find_one({"_id": ObjectId(post_id)})
        # logger.info(post)
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")

        # Check if user exists, create if not
        user = await user_model.db.find_one({"email": reply_data.email})
        logger.info(user)

        if not user:
            new_user = UserBase(username=reply_data.username, email=reply_data.email).model_dump(by_alias=True)
            inserted_user = await user_model.db.insert_one(new_user)
            user_id = str(inserted_user.inserted_id)

        else:
            user_id = str(user["_id"])
            logger.info(user_id)

        # Handle image uploads (single or multiple)
        images = []
        if reply_data.images:
            # Check if it's a single file upload
            if not isinstance(reply_data.images, list):
                reply_data.images = [reply_data.images]

            if len(reply_data.images) > 2:
                raise HTTPException(status_code=400, detail="Max of 2 images can be uploaded")

            # Loop through each uploaded image
            for image in reply_data.images:
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
                os.makedirs(Config.UPLOAD_BLOG_POST_COMMENT_IMAGE, exist_ok=True)

                image_path = os.path.join(Config.UPLOAD_BLOG_POST_COMMENT_IMAGE, image_filename)
                with open(image_path, "wb") as buffer:
                    shutil.copyfileobj(image.file, buffer)

                images.append(image_filename)

        # new_reply = Reply(user_id=user_id, images=images, parent_comment_id=comment_id, content=reply_data.content,
        #                   created_at=datetime.utcnow())
        # reply_dict = new_reply.model_dump(by_alias=True)
        reply_dict = {
            "user_id": user_id,
            "images": images,
            "parent_comment_id": comment_id,
            "content": reply_data.content,
            "created_at": datetime.utcnow()
        }

        inserted_reply = await reply_model.db.insert_one(reply_dict)
        reply_id = str(inserted_reply.inserted_id)

        retrieved_reply = await reply_model.db.find_one({"_id": ObjectId(reply_id)})
        # Update the comment to include the replies id
        await comment_model.db.update_one(
            {"_id": ObjectId(comment_id)},
            {"$push": {"replies": retrieved_reply["_id"]}}
        )
        if retrieved_reply:
            return Reply(**retrieved_reply)
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail="Failed to retrieve created reply")

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@comment.get("/{post_id}/comments", response_model=List[CommentInDB], status_code=status.HTTP_200_OK)
async def get_comments_by_project(
    post_id: str,
    reply_model: Annotated[ReplyModel, Depends(get_reply_model)],
    user_model: Annotated[UserModel, Depends(get_user_model)],
    comment_model: Annotated[CommentModel, Depends(get_comment_model)],
    post_model: Annotated[Post, Depends(get_post_model)]
):
    try:
        if not ObjectId.is_valid(post_id):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project ID format.")
        post = await post_model.db.find_one({"_id": ObjectId(post_id)})
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")

        logger.error("comments_cursor")

        comments_cursor = comment_model.db.find({"post_id": post_id})
        logger.error("comments_cursor below")

        comments_with_replies = []
        logger.error(comments_cursor)
        logger.error(comments_with_replies)

        for comment_data in comments_cursor:
            comment = Comment(**comment_data)
            logger.error(comment_data)
            logger.error(f" comment {comment}")

            replies_cursor = await reply_model.db.find({"parent_comment_id": str(comment._id)})
            replies = [Reply(**reply_data) for reply_data in replies_cursor]
            comments_with_replies.append(CommentInDB(**comment.model_dump(), replies=replies))

        return comments_with_replies
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


# @comment.get("/blog/{post_id}/comments/{comment_id}/replies", response_model=List[Reply], status_code=status.HTTP_200_OK)
# async def get_replies_for_comment(
#     post_id: str,
#     comment_id: str,
#     collections: Any = Depends(get_collections),
# ):
#     try:
#         if not ObjectId.is_valid(post_id):
#             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project ID format.")
#         if not ObjectId.is_valid(comment_id):
#             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid comment ID format.")
#         project = collections["projects"].find_one({"_id": ObjectId(post_id)})
#         if not project:
#             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
#         comment = collections["comments"].find_one({"_id": ObjectId(comment_id)})
#         if not comment:
#             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found.")
#
#         replies_cursor = collections["replies"].find({"parent_comment_id": comment_id})
#         replies = [Reply(**reply_data) for reply_data in replies_cursor]
#         return replies
#
#     except HTTPException as http_exc:
#         raise http_exc
#     except Exception as e:
#         logger.exception(f"Exception in get_replies_for_comment: {e}")
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))



# # update comment testing_details
# @comment.put("/{comment_id}/add/testing", response_model=CommentInDB, status_code=status.HTTP_201_CREATED)
# async def update_comment_testing(
#     comment_id: str,
#     comment_model: Annotated[CommentModel, Depends(get_comment_model)],
#     request: Request,  # Add request to access form data
# ):
#     try:
#         if not ObjectId.is_valid(comment_id):
#             raise HTTPException(status_code=400, detail="Invalid comment ID format.")
#
#         existing_comment = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
#         # logger.info(existing_comment)
#         if not existing_comment:
#             raise HTTPException(status_code=404, detail="Comment not found.")
#
#         form_data = await request.form()
#         testing_types_data = {
#             "test_types": form_data.get("test_types").split(",") if form_data.get("test_types") else None,
#             "automation_frameworks": form_data.get("automation_frameworks").split(",") if form_data.get("automation_frameworks") else None,
#             "ci_cd_integration": form_data.get("ci_cd_integration").split(",") if form_data.get("ci_cd_integration") else form_data.get("ci_cd_integration")
#             }
#         testing_data = testing_types_data
#         # logging.info(f"---------------------*********** {technology_data}")
#
#         if not any(value is not None for value in testing_types_data.values()):
#             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                                 detail="At least one field must be provided in technology")
#         # if testing_types_data.get("language") is None and existing_comment["language"] is None:
#         #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Language must be alphanumeric")
#         for field_name in ["test_types", "automation_frameworks", "ci_cd_integration"]:
#             field_value = testing_types_data.get(field_name)
#             if field_value is not None and not all(isinstance(item, str) for item in field_value):
#                 raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
#                                     detail=f"All items in {field_name} must be strings")
#
#         result = await comment_model.db.update_one(
#             {"_id": ObjectId(comment_id)},
#             {"$set": {"testing_details": testing_data}}
#         )
#
#         # update time of modification
#         await comment_model.db.update_one(
#             {"_id": ObjectId(comment_id)},
#             {"$set": {"updated_at": datetime.utcnow()}}
#         )
#         updated_comment = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
#         if updated_comment:
#             if result.modified_count == 0:
#                 raise HTTPException(status_code=status.HTTP_304_NOT_MODIFIED,
#                                     detail="TestingDetails has no new fields")
#             return CommentInDB(**updated_comment)  # Use the Comment model to parse the result
#         else:
#             raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                                 detail="Failed to retrieve updated comment")
#
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#
#
# # update comment images
# @comment.put("/{comment_id}/add/images", response_model=CommentInDB, status_code=status.HTTP_201_CREATED)
# async def update_comment_images(
#     comment_id: str,
#     comment_model: Annotated[CommentModel, Depends(get_comment_model)],
#     comment_data: Annotated[CommentImagesFormData, Form()]
#
# ):
#     try:
#         if not ObjectId.is_valid(comment_id):
#             raise HTTPException(status_code=400, detail="Invalid comment ID format.")
#
#         existing_comment = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
#         # logger.info(existing_comment)
#         if not existing_comment:
#             raise HTTPException(status_code=404, detail="Comment not found.")
#
#         # Handle image uploads (single or multiple)
#         images = []
#
#         if comment_data.images:
#             # Check if it's a single file upload
#             if not isinstance(comment_data.images, list):
#                 comment_data.images = [comment_data.images]
#
#             # Loop through each uploaded image
#             for image in comment_data.images:
#                 # Validate image size and format (logic remains the same)
#                 file_content = await image.read()
#                 file_size = len(file_content)
#                 if file_size > Config.MAX_IMAGE_SIZE:
#                     raise HTTPException(status_code=400, detail="Image size exceeds 5 MB limit.")
#
#                 file_ext = os.path.splitext(image.filename)[1]
#                 if file_ext not in Config.UPLOAD_EXTENSIONS:
#                     raise HTTPException(status_code=400,
#                                         detail=f"Unsupported image format. Allowed: {', '.join(Config.UPLOAD_EXTENSIONS)}.")
#
#                 # Generate unique filename
#                 image_filename = f"{ObjectId()}_{image.filename}"
#
#                 # Create uploads directory (logic remains the same)
#                 os.makedirs(Config.UPLOAD_PROJECT_IMAGE, exist_ok=True)
#
#                 image_path = os.path.join(Config.UPLOAD_PROJECT_IMAGE, image_filename)
#                 with open(image_path, "wb") as buffer:
#                     shutil.copyfileobj(image.file, buffer)
#
#                 images.append(image_filename)
#
#         await comment_model.db.update_one(
#             {"_id": ObjectId(comment_id)},
#             {"$set": {"images": images}}
#         )
#
#         # update time of modification
#         await comment_model.db.update_one(
#             {"_id": ObjectId(comment_id)},
#             {"$set": {"updated_at": datetime.utcnow()}}
#         )
#         updated_comment = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
#         if updated_comment:
#             return CommentInDB(**updated_comment)  # Use the Comment model to parse the result
#         else:
#             raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                                 detail="Failed to retrieve updated comment")
#
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#
#
# #  update comments
# @comment.put("/{comment_id}/comment/", status_code=status.HTTP_201_CREATED)
# async def update_comment(
#     comment_id: str,
#     update_data: Annotated[CommentFormData, Form()],
#     comment_model: Annotated[CommentModel, Depends(get_comment_model)],
# ):
#     logger.info(f"update data ------- {update_data}")
#     try:
#         if not ObjectId.is_valid(comment_id):
#             raise HTTPException(status_code=400, detail="Invalid post ID format.")
#
#         existing_post = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
#         if not existing_post:
#             raise HTTPException(status_code=404, detail="Post not found.")
#
#         updated_data = {}
#
#         if update_data.title is not None:
#             updated_data["title"] = update_data.title
#         if update_data.description is not None:
#             updated_data["description"] = update_data.description
#         if update_data.comment_url is not None:
#             updated_data["comment_url"] = update_data.comment_url
#         if update_data.github_url is not None:
#             updated_data["github_url"] = update_data.github_url
#         logger.info(update_data.roles)
#
#         if update_data.roles is not None:
#             # Handle tags (accepting both string and list input)
#             if isinstance(update_data.roles, str):
#                 roles_list = [role.strip() for role in update_data.roles.split(",")]
#             elif isinstance(update_data.roles, list):
#                 roles_list = [role.strip() for role in update_data.roles[0].split(",")]
#             else:
#
#                 raise HTTPException(status_code=400, detail="Invalid format for comment. Must be a string or list.")
#             updated_data["roles"] = roles_list
#             logger.info(updated_data["roles"])
#
#         updated_data["updated_at"] = str(datetime.utcnow())
#
#         if updated_data:  # only update if there is data to update
#             await comment_model.db.update_one({"_id": ObjectId(comment_id)}, {"$set": updated_data})
#
#         updated_comment = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
#         return CommentInDB(**updated_comment)
#
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#
#
# # delete comment
# @comment.delete("/{comment_id}/comment/", status_code=status.HTTP_200_OK)
# async def delete_comment(
#     comment_id: str,
#     comment_model: Annotated[CommentModel, Depends(get_comment_model)]
# ):
#     response = await comment_model.delete_comment(comment_id)
#     if not response:
#         raise HTTPException(status_code=404, detail="Comment not found")
#
#     return {"message": f"Comment deleted successfully {response}"}
#
