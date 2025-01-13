import os
from datetime import datetime
from bson import ObjectId
from fastapi import UploadFile, File

from webapp.config import basedir
from webapp.logger import logger
import pytest
from tests import db_client, client


def clear_posts_db(db_client):
    """Clear the database and ensure the 'users' collection exists."""
    # Drop the collection if it exists
    if "users" in db_client.list_collection_names():
        db_client.drop_collection("posts")
    # Create the 'users' collection for testing
    db_client.create_collection("posts")
    yield
    # Cleanup after the test
    db_client.drop_collection("posts")


# Test cases for Post CRUD
def test_create_post(client, db_client):
    response = client.post(
        "/token",
        data={"username": "john_doe", "password": "jonnybones"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    access_token = response.json()["access_token"]

    # Create a valid image file for testing
    from PIL import Image
    image_path = os.path.join(basedir, 'static', 'test_image.png')#"/static/test/test_image.png"
    image = Image.new("RGB", (100, 100), color=(255, 0, 0))  # A red square
    image.save(image_path)

    try:
        # Prepare the post data
        post_data = {
            "title": (None, "testblog"),
            "content": (None, "Enumerating objects: 36, done Counting objects: 100% (36/36), done. "
                              "Delta compression using up to 4 threads Compressing objects: 100% (22/22), done."),
            "tags": (None, "one, two, fish"),
            "image": ("test_image.png", open(image_path, "rb"), "image/png"),
        }

        # Send POST request
        response = client.post(
            "/blog/post",
            files=post_data,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        assert response.status_code == 201
        response_data = response.json()

        # Validate the response
        assert "_id" in response_data
        assert response_data["title"] == "testblog"
        assert response_data["content"] == post_data["content"][1]
        assert response_data["tags"] == ["one", "two", "fish"]
        assert "created_at" in response_data
        assert "updated_at" in response_data
        assert isinstance(ObjectId(response_data["_id"]), ObjectId)

    finally:
        # Clean up
        if os.path.exists(image_path):
            os.remove(image_path)
        clear_posts_db(db_client)


# def test_create_post(client):
#     response = client.post(
#         "/posts/",
#         json={
#             "title": "First Post",
#             "content": "This is the content of the first post.",
#             "published": True,
#             "tags": ["test", "fastapi"]
#         }
#     )
#     assert response.status_code == 200
#     data = response.json()
#     assert data["title"] == "First Post"
#     assert "createdAt" in data
#
#
# def test_get_post_by_id():
#     # Create a post
#     response = client.post(
#         "/posts/",
#         json={
#             "title": "First Post",
#             "content": "This is the content of the first post.",
#             "published": True,
#             "tags": ["test", "fastapi"]
#         }
#     )
#     post_id = response.json()["id"]
#
#     # Fetch the post
#     response = client.get(f"/posts/{post_id}")
#     assert response.status_code == 200
#     data = response.json()
#     assert data["title"] == "First Post"
#
#
# def test_update_post():
#     # Create a post
#     response = client.post(
#         "/posts/",
#         json={
#             "title": "First Post",
#             "content": "This is the content of the first post.",
#             "published": True,
#             "tags": ["test", "fastapi"]
#         }
#     )
#     post_id = response.json()["id"]
#
#     # Update the post
#     response = client.put(
#         f"/posts/{post_id}",
#         json={"content": "Updated content"}
#     )
#     assert response.status_code == 200
#     data = response.json()
#     assert data["content"] == "Updated content"
#
#
# def test_delete_post():
#     # Create a post
#     response = client.post(
#         "/posts/",
#         json={
#             "title": "First Post",
#             "content": "This is the content of the first post.",
#             "published": True,
#             "tags": ["test", "fastapi"]
#         }
#     )
#     post_id = response.json()["id"]
#
#     # Delete the post
#     response = client.delete(f"/posts/{post_id}")
#     assert response.status_code == 200
#     assert response.json()["message"] == "Post deleted successfully"
