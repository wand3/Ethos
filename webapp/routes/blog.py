import os
import shutil
from datetime import datetime
from typing import Annotated
from webapp.config import Config
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status, Form
from webapp.logger import logger
from webapp.schemas.blog import BlogPostInDB, BlogPost
from ..schemas.forms import UpdateBlogPost
from webapp.models.blog import Post, get_post_model
from webapp.models.user import get_current_active_user
from webapp.schemas.forms import PostFormData


blog = APIRouter(prefix="/blog", tags=["Blog"], dependencies=[Depends(get_current_active_user)])


@blog.post("/post", response_model=BlogPostInDB, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: Annotated[PostFormData, Form()],
    post_model: Annotated[Post, Depends(get_post_model)],
):
    # logger.info(f'Post title ----  user {title}')
    # logger.info(f'Post content ----  user {content}')
    # logger.info(f'Post image ----  user {post_data.image}')
    # logger.info(f'Post content ----  user {content}')

    try:
        image_filename = None
        if post_data.image:

            # Validate image size (e.g., limit to 5 MB)
            file_content = await post_data.image.read()
            file_size = len(file_content)
            if file_size > Config.MAX_IMAGE_SIZE:
                raise HTTPException(status_code=400, detail="Image size exceeds 5 MB limit.")

            # Validate image format (e.g., jpg, png, gif)
            file_ext = os.path.splitext(post_data.image.filename)[1]
            if file_ext not in Config.UPLOAD_EXTENSIONS:
                raise HTTPException(status_code=400,
                                    detail=f"Unsupported image format. Allowed: {', '.join(Config.UPLOAD_EXTENSIONS)}.")

            image_filename = f"{ObjectId()}_{post_data.image.filename}"
            # Create uploads directory if it doesn't exist
            os.makedirs(Config.UPLOAD_BLOG_POST_IMAGE, exist_ok=True)

            image_path = os.path.join(Config.UPLOAD_BLOG_POST_IMAGE, image_filename)
            with open(image_path, "wb") as buffer:
                # shutil.copyfileobj(post_data.image.file, buffer)
                buffer.write(file_content)  # Write the file content directly

        # Handle tags input (either a string or a list)
        if isinstance(post_data.tags, str):
            tags_list = [tag.strip() for tag in post_data.tags.split(",")]
            # logger.info(f'Post tag---- retrieved post taglist  string {tags_list}')

        elif isinstance(post_data.tags, list):
            tags_list = [tag.strip() for tag in post_data.tags[0].split(",")]
            # logger.info(f'Post tag---- retrieved post taglist list {tags_list}')

        else:
            raise HTTPException(
                status_code=400, detail="Invalid format for tags. Must be a string or list."
            )

        post = BlogPost(title=post_data.title, content=post_data.content, image=image_filename, tags=tags_list)
        post_dict = post.model_dump(by_alias=True)
        post_dict["created_at"] = datetime.utcnow()
        post_dict["updated_at"] = datetime.utcnow()

        inserted_post = await post_model.db.insert_one(post_dict)
        post_dict["_id"] = inserted_post.inserted_id

        retrieved_post = await post_model.db.find_one({"_id": ObjectId(post_dict["_id"])})
        # logger.info(f'Post ---- retrieved post {retrieved_post}')

        if retrieved_post:

            return BlogPostInDB(**retrieved_post)
        else:
            raise HTTPException(status_code=404, detail="Post not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@blog.put("/post/{post_id}", response_model=BlogPostInDB, status_code=status.HTTP_201_CREATED)
async def update_post(
    post_id: str,
    update_data: Annotated[UpdateBlogPost, Form()],
    post_model: Annotated[Post, Depends(get_post_model)],
):
    logger.info(f"update data ------- {update_data}")
    try:
        if not ObjectId.is_valid(post_id):
            raise HTTPException(status_code=400, detail="Invalid post ID format.")

        existing_post = await post_model.db.find_one({"_id": ObjectId(post_id)})
        if not existing_post:
            raise HTTPException(status_code=404, detail="Post not found.")

        updated_data = {}

        if update_data.title is not None:
            updated_data["title"] = update_data.title
        if update_data.content is not None:
            updated_data["content"] = update_data.content

        if update_data.tags is not None:
            # Handle tags (accepting both string and list input)
            if isinstance(update_data.tags, str):
                tags_list = [tag.strip() for tag in update_data.tags.split(",")]
            elif isinstance(update_data.tags, list):
                tags_list = [tag.strip() for tag in update_data.tags[0].split(",")]
            else:
                raise HTTPException(status_code=400, detail="Invalid format for tags. Must be a string or list.")
            updated_data["tags"] = tags_list

        if update_data.image is not None:  # Check if image is provided
            file_content = await update_data.image.read()
            file_size = len(file_content)
            if file_size > Config.MAX_IMAGE_SIZE:
                raise HTTPException(status_code=400, detail="Image size exceeds limit.")

            file_ext = os.path.splitext(update_data.image.filename)[1]
            if file_ext not in Config.UPLOAD_EXTENSIONS:
                raise HTTPException(status_code=400,
                                    detail=f"Unsupported image format. Allowed: {', '.join(Config.UPLOAD_EXTENSIONS)}.")

            image_filename = f"{ObjectId()}_{update_data.image.filename}"
            os.makedirs(Config.UPLOAD_BLOG_POST_IMAGE, exist_ok=True)
            image_path = os.path.join(Config.UPLOAD_BLOG_POST_IMAGE, image_filename)

            with open(image_path, "wb") as buffer:
                # shutil.copyfileobj(update_data.image.file, buffer)
                buffer.write(file_content)  # Write the file content directly

            if existing_post.get("image"):
                old_image_path = os.path.join(Config.UPLOAD_BLOG_POST_IMAGE, existing_post["image"])
                try:
                    os.remove(old_image_path)
                except FileNotFoundError:
                    pass

            updated_data["image"] = image_filename
        updated_data["updated_at"] = datetime.utcnow()

        if updated_data:  # only update if there is data to update
            await post_model.db.update_one({"_id": ObjectId(post_id)}, {"$set": updated_data})

        updated_post = await post_model.db.find_one({"_id": ObjectId(post_id)})
        return BlogPostInDB(**updated_post)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@blog.delete("/post/{post_id}", status_code=status.HTTP_200_OK)
async def delete_post(
    post_id: str,
    post_model: Annotated[Post, Depends(get_post_model)]
):
    existing_post = await post_model.delete_post(post_id)
    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")

    return {"message": f"Post deleted successfully {existing_post}"}


