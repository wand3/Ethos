import asyncio
import os
from datetime import datetime
from bson import ObjectId
from webapp.config import basedir
from webapp.logger import logger
import pytest
from tests import db_client, client, get_recrent_model


def convert_objectid_to_str(comments):
    """Converts ObjectId to string in a list of comments."""
    converts = None
    for comment in comments:
        if comment["_id"]:

            comment["_id"] = str(comment["_id"])
    logger.info(f'----------comments    -{comments}')

    converts = comments
    return converts


def clear_comments_db(db_client):
    """Clear the database and ensure the 'users' collection exists."""
    # Drop the collection if it exists
    if "comments" in db_client.list_collection_names():
        db_client.drop_collection("comments")
        db_client.comments.drop()
    # Create the 'users' collection for testing
    db_client.create_collection("comments")
    yield
    # Cleanup after the test
    db_client.drop_collection("comments")


# @pytest.fixture(scope="function")
def test_create_comment(client, db_client):
    last_post = get_recrent_model(client=db_client, collection_name="posts")
    post_id = last_post[-1]["_id"]

    # Create a valid image file for testing
    from PIL import Image
    image_path = os.path.join(basedir, 'static', 'test_image.png')  # "/static/test/test_image.png"
    image = Image.new("RGB", (100, 100), color=(255, 0, 0))  # A red square
    image.save(image_path)

    try:
        with open(image_path, "rb") as image_file:
            files = {
                "images": (
                    "test_image.png",
                    image_file,
                    "image/png",
                )  # Correct way to send files with requests
            }
            response_data = {  # other fields as form data
                "post_id": post_id,
                "content": "This is a test comment without authentication",
                "email": "testaddcomment@mail.com",
                "username": "testaddcomment",
                "created_at": datetime.utcnow().isoformat()  # ISO format is safer
            }

            logger.info(response_data)
            # Send POST request
            response = client.post(
                f"/comment/{post_id}/",
                files=files, data=response_data)
            assert response.status_code == 201
            response_data = response.json()
            logger.info(f"----- db response data {response_data}")

        assert response.status_code == 201
        response_data = response.json()
        logger.info(f"----- db response data {response_data}")

        # get updates
        db_update = get_recrent_model(client=db_client, collection_name="comments")
        logger.info(f"----- db response update {db_update}")

        # Validate the response
        assert "_id" in response_data
        assert response_data["content"] == "This is a test comment without authentication"
        assert "created_at" in response_data

        assert isinstance(ObjectId(response_data["_id"]), ObjectId)
        return True

    finally:
        # Clean up
        if os.path.exists(image_path):
            os.remove(image_path)
        # clear_comments_db(db_client)


# test get all comments
# @pytest.fixture(scope="function")
def test_get_all_comments(client, db_client):
    last_post = get_recrent_model(client=db_client, collection_name="posts")
    post_id = last_post[-1]["_id"]

    response = client.get(f"/comment/blog/{post_id}/comments")
    assert response.status_code == 200
    comments = response.json()
    assert isinstance(comments, list)
    assert len(comments) == len(comments)


# add a reply to a post
# @pytest.fixture(scope="function")
def test_create_reply(client, db_client):
    last_post = get_recrent_model(client=db_client, collection_name="posts")
    last_comment = get_recrent_model(client=db_client, collection_name="comments")
    post_id = last_post[-1]["_id"]
    comment_id = last_comment[-1]["_id"]

    # Create a valid image file for testing
    from PIL import Image
    image_path = os.path.join(basedir, 'static', 'test_image.png')  # "/static/test/test_image.png"
    image = Image.new("RGB", (100, 100), color=(255, 0, 0))  # A red square
    image.save(image_path)

    try:
        with open(image_path, "rb") as image_file:
            files = {
                "images": (
                    "test_image.png",
                    image_file,
                    "image/png",
                )  # Correct way to send files with requests
            }
            response_data = {  # other fields as form data
                "post_id": post_id,
                "content": "This is a reply to a comment",
                "email": "testaddcomment@mail.com",
                "username": "testaddcomment",
                "created_at": datetime.utcnow().isoformat()  # ISO format is safer
            }

            logger.info(response_data)
            # Send POST request
            response = client.post(
                f"/comment/{post_id}/comments/{comment_id}/replies",
                files=files, data=response_data)
            assert response.status_code == 201
            response_data = response.json()
            # logger.info(f"----- db response data {response_data}")

        assert response.status_code == 201
        response_data = response.json()
        # logger.info(f"----- db response data {response_data}")

        # get updates comments
        db_update = get_recrent_model(client=db_client, collection_name="replies")
        # logger.info(f"----- db response update {db_update}")

        # Validate the response
        assert "_id" in response_data
        assert response_data["content"] == db_update[-1]["content"]
        assert "created_at" in response_data

        assert isinstance(ObjectId(response_data["_id"]), ObjectId)
        return True

    finally:
        # Clean up
        if os.path.exists(image_path):
            os.remove(image_path)


# test delete comment with replies
# @pytest.fixture(scope="function")
def test_delete_comment_with_replies(client, db_client):
    # create comment
    comment_1 = test_create_comment(client=client, db_client=db_client)
    reply_1 = test_create_reply(client=client, db_client=db_client)

    # get the last comment added to the db
    last_comment = get_recrent_model(client=db_client, collection_name="comments")
    comment_id = last_comment[-1]["_id"]

    # Send DELETE request to delete the comment
    response = client.delete(f"/comment/{comment_id}")

    # Assert expected status code (200 OK)
    assert response.status_code == 200

    response = client.get(f"/comment/{comment_id}/")
    assert response.status_code == 404
