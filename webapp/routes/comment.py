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
            {"$push": {"comments": comment_dict}}
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
        # Print comment_ids to check the data structure
        logger.info(f"comment_ids: {post.get('comments', [])}")

        comment_ids = post.get("comments", [])
        # logger.error(comment_ids)
        comments = []
        for comment_id in comment_ids:
            p_comment = await comment_model.db.find_one({"_id": ObjectId(comment_id["_id"])})
            logger.error(p_comment)

            if p_comment:
                # Convert ObjectId to dictionary or Reply instance (based on your model)
                if isinstance(p_comment, dict):  # If comment_id already returns a dictionary
                    comments.append(CommentInDB(**p_comment))
                else:
                    comments.append(CommentInDB(**p_comment))  # Convert to dict if it's a Reply model

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
            {"$push": {"replies": reply_dict}}
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


@comment.get("/{comment_id}/", response_model=CommentInDB, status_code=status.HTTP_200_OK)
async def get_comment(
    comment_id: str,
    reply_model: Annotated[ReplyModel, Depends(get_reply_model)],
    comment_model: Annotated[CommentModel, Depends(get_comment_model)],
):
    try:
        if not ObjectId.is_valid(comment_id):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid comment ID format.")
        comment = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
        if not comment:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found.")

        logger.error("comments_cursor")

        comment_data = await comment_model.db.find_one({"_id": ObjectId(comment_id)})
        if not comment_data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found.")

        replies_cursor = reply_model.db.find({"_id": comment_id})
        replies = []
        async for reply_data in replies_cursor:
            replies.append(Reply(**reply_data))  # Parse reply data with Reply model

        comment = CommentInDB(**comment_data)  # Add replies to comment

        return comment
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@comment.delete("/{comment_id}", status_code=status.HTTP_200_OK)
async def delete_comment(
    comment_id: str,
    comment_model: Annotated[CommentModel, Depends(get_comment_model)],
    reply_model: Annotated[ReplyModel, Depends(get_reply_model)],  # Inject ReplyModel
    # user_model: Annotated[UserModel, Depends(get_current_active_user)]

):
    try:
        if not ObjectId.is_valid(comment_id):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid comment ID format.")

        comment_id_obj = ObjectId(comment_id)

        # 1. Delete replies associated with the comment
        delete_replies_result = await reply_model.db.delete_many({"parent_comment_id": str(comment_id_obj)})

        # 2. Delete the comment itself
        delete_comment_result = await comment_model.db.delete_one({"_id": comment_id_obj})

        if delete_comment_result.deleted_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")

        return {"message": f"Comment and {delete_replies_result.deleted_count} replies deleted successfully"}

    except Exception as e:
        logger.exception(f"Exception in delete_comment: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
