from fastapi import APIRouter

blog = APIRouter(prefix="/blog", tags=["Blog"])


@blog.get("/")
async def get_blog():
    return {"message": "Blog"}


# # MongoDB helper functions
# def get_post_by_id(post_id: str):
#     post_data = posts_collection.find_one({"_id": ObjectId(post_id)})
#     if post_data:
#         return PostInDB(
#             id=str(post_data["_id"]),
#             title=post_data["title"],
#             content=post_data["content"],
#             published=post_data["published"],
#             image=post_data.get("image"),
#             tags=post_data.get("tags", []),
#             createdAt=post_data["createdAt"],
#             updatedAt=post_data["updatedAt"]
#         )
#     return None
#
# # Routes
# @app.post("/posts/", response_model=PostInDB)
# async def create_post(post_data: PostCreate):
#     post_dict = {
#         "title": post_data.title,
#         "content": post_data.content,
#         "image": post_data.image,
#         "tags": post_data.tags,
#         "published": post_data.published,
#         "createdAt": datetime.utcnow(),
#         "updatedAt": datetime.utcnow()
#     }
#     result = posts_collection.insert_one(post_dict)
#     post_dict["_id"] = result.inserted_id
#     return PostInDB(
#         id=str(post_dict["_id"]),
#         **post_data.dict(),
#         createdAt=post_dict["createdAt"],
#         updatedAt=post_dict["updatedAt"]
#     )
#
# @app.get("/posts/{post_id}", response_model=PostInDB)
# def read_post(post_id: str):
#     post = get_post_by_id(post_id)
#     if not post:
#         raise HTTPException(status_code=404, detail="Post not found")
#     return post
#
# @app.put("/posts/{post_id}", response_model=PostInDB)
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
# @app.delete("/posts/{post_id}", response_model=dict)
# def delete_post(post_id: str):
#     existing_post = get_post_by_id(post_id)
#     if not existing_post:
#         raise HTTPException(status_code=404, detail="Post not found")
#
#     posts_collection.delete_one({"_id": ObjectId(post_id)})
#     return {"message": "Post deleted successfully"}
#
# @app.get("/posts/", response_model=List[PostInDB])
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
