import os
import shutil
from datetime import datetime
from typing import List, Annotated, Optional
from webapp.config import Config
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File

from webapp.logger import logger
from webapp.schemas.blog import BlogPostInDB, BlogPost
from webapp.models.blog import Post, get_post_model
from webapp.models.user import get_current_active_user, UserModel
from webapp.schemas.forms import PostFormData


blog = APIRouter(prefix="/blog", tags=["Blog"], dependencies=[Depends(get_current_active_user)])


@blog.post("/post", response_model=BlogPostInDB, status_code=status.HTTP_201_CREATED)
async def create_post(
    # post_data: Annotated[PostFormData, Form()],
    post_model: Annotated[Post, Depends(get_post_model)],

    title: str = Form(...),
    content: str = Form(...),
    tags: str = Form(""), # Receive tags as a comma-separated string
    image: Optional[UploadFile] = File(None)
):
    
    # logger.info(f'Post title ----  user {title}')
    # logger.info(f'Post content ----  user {content}')
    # logger.info(f'Post tags ----  user {tags}')
    # logger.info(f'Post image ----  user {image}')
    # logger.info(f'Post content ----  user {content}')

    try:
        image_filename = None
        if image:
            image_filename = f"{ObjectId()}_{image.filename}"
            # Create uploads directory if it doesn't exist
            os.makedirs(Config.UPLOAD_BLOG_POST_IMAGE, exist_ok=True)

            image_path = os.path.join(Config.UPLOAD_BLOG_POST_IMAGE, image_filename)
            with open(image_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)

        tags_list = [tag.strip() for tag in tags.split(",") if
                     tag.strip()]  # Convert comma separated string to list of strings
        post = BlogPost(title=title, content=content, image=image_filename, tags=tags_list)
        post_dict = post.model_dump(by_alias=True)
        post_dict["created_at"] = datetime.utcnow()
        post_dict["updated_at"] = datetime.utcnow()

        inserted_post = await post_model.db.insert_one(post_dict)
        post_dict["_id"] = inserted_post.inserted_id

        retrieved_post = await post_model.db.find_one({"_id": ObjectId(post_dict["_id"])})
        logger.info(f'Post ---- retrieved post {retrieved_post}')

        if retrieved_post:

            return BlogPostInDB(**retrieved_post)
        else:
            raise HTTPException(status_code=404, detail="Post not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    # post_dict = {
    #     "title": post_data.title,
    #     "content": post_data.content,
    #     "image": post_data.image,
    #     "tags": post_data.tags,
    #     "published": post_data.published,
    #     "createdAt": datetime.utcnow(),
    #     "updatedAt": datetime.utcnow()
    # }
    # result = posts_collection.insert_one(post_dict)
    # post_dict["_id"] = result.inserted_id
    # return PostInDB(
    #     id=str(post_dict["_id"]),
    #     **post_data.dict(),
    #     createdAt=post_dict["createdAt"],
    #     updatedAt=post_dict["updatedAt"]
    # )

# @blog.get("/posts/{post_id}", response_model=BlogPostInDB)
# def read_post(post_id: str):
#     post = get_post_by_id(post_id)
#     if not post:
#         raise HTTPException(status_code=404, detail="Post not found")
#     return post
#
# @blog.put("/posts/{post_id}", response_model=BlogPostInDB)
# def update_post(post_id: str, post_data: PostUpdate):
#     existing_post = get_post_by_id(post_id)
#     if not existing_post:
#         raise HTTPException(status_code=404, detail="Post not found")
#
#     update_data = {k: v for k, v in post_data.dict().items() if v is not None}
#     update_data["updatedAt"] = datetime.utcnow()
#
#     posts_collection.update_one({"_id": ObjectId(post_id)}, {"$set": update_data})
#     updated_post = posts_collection.find_one({"_id": ObjectId(post_id)})
#     return PostInDB(
#         id=str(updated_post["_id"]),
#         title=updated_post["title"],
#         content=updated_post["content"],
#         published=updated_post["published"],
#         image=updated_post.get("image"),
#         tags=updated_post.get("tags", []),
#         createdAt=updated_post["createdAt"],
#         updatedAt=updated_post["updatedAt"]
#     )
#
#
# @blog.delete("/posts/{post_id}", response_model=dict)
# def delete_post(post_id: str):
#     existing_post = get_post_by_id(post_id)
#     if not existing_post:
#         raise HTTPException(status_code=404, detail="Post not found")
#
#     posts_collection.delete_one({"_id": ObjectId(post_id)})
#     return {"message": "Post deleted successfully"}
#
#
# @blog.get("/posts/", response_model=List[BlogPostInDB])
# def get_posts_by_tags(tags: List[str]):
#     posts = posts_collection.find({"tags": {"$in": tags}})
#     result = [
#         PostInDB(
#             id=str(post["_id"]),
#             title=post["title"],
#             content=post["content"],
#             published=post["published"],
#             image=post.get("image"),
#             tags=post.get("tags", []),
#             createdAt=post["createdAt"],
#             updatedAt=post["updatedAt"]
#         )
#         for post in posts
#     ]
#     return result
