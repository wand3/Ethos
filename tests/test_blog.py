import os
from datetime import datetime
from bson import ObjectId
from webapp.config import basedir
from webapp.logger import logger
import pytest
from tests import db_client, client
from webapp.schemas.blog import BlogPostInDB


def convert_objectid_to_str(posts):
    """Converts ObjectId to string in a list of posts."""
    converts = None
    for post in posts:
        if post["_id"]:

            post["_id"] = str(post["_id"])
    logger.info(f'----------posts    -{posts}')

    converts = posts
    return converts


def clear_posts_db(db_client):
    """Clear the database and ensure the 'users' collection exists."""
    # Drop the collection if it exists
    if "posts" in db_client.list_collection_names():
        db_client.drop_collection("posts")
        db_client.posts.drop()
    # Create the 'users' collection for testing
    db_client.create_collection("posts")
    yield
    # Cleanup after the test
    db_client.drop_collection("posts")


# Test cases for Post CRUD
@pytest.fixture(scope="function")
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
    image_path = os.path.join(basedir, 'static', 'test_image.png')  # "/static/test/test_image.png"
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
        # clear_posts_db(db_client)


# test get all post
# @pytest.fixture(scope="function")
def test_get_all_posts(client):
    response = client.get("/posts")
    assert response.status_code == 200
    blogs = response.json()
    assert isinstance(blogs, list)
    assert len(blogs) >= 2


# test search for post by title, tags or content
# @pytest.fixture(scope="function")
def test_search_blogs(client):

    # Test cases for searching
    test_cases = [
        {"q": "done", "expected_count": 10},  # Matches titles and content
        {"q": "lady", "expected_count": 1},  # Matches content exactly
        {"q": "yes", "expected_count": 1},  # Matches tags
        {"q": "YES", "expected_count": 1},  # test case insensitivity
        {"q": "nonexistent", "expected_count": 0},  # No matches
        {"q": None, "expected_status_code": 400}  # test for missing query
    ]

    for case in test_cases:
        if "expected_status_code" in case:
            response = client.get("/posts/search")
            assert response.status_code == case["expected_status_code"]
            continue

        response = client.get(f"/posts/search?q={case['q']}")
        assert response.status_code == 200
        blogs = response.json()
        assert isinstance(blogs, list)
        assert len(blogs) == case["expected_count"]

        # If there are results, check if they contain the search query (case-insensitive)
        if case["expected_count"] > 0:
            for blog in blogs:
                title_match = case['q'].lower() in blog["title"].lower()
                content_match = case['q'].lower() in blog["content"].lower()
                tag_match = any(case['q'].lower() in tag.lower() for tag in blog["tags"])
                assert title_match or content_match or tag_match


# @pytest.fixture(scope="function")
def test_search_with_special_chars(client, db_client):
    collection = db_client["posts"]

    collection.insert_one({
        "image": "special.jpg",
        "title": "Special Chars $^+.?{}[]()\\|",
        "content": "Content with special chars",
        "tags": ["special"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    })
    response = client.get("/posts/search?q=$^+.?{}[]()\\|")
    assert response.status_code == 200
    blogs = response.json()
    assert len(blogs) == 0
    """The above returns 0 if the special characters are escaped"""
    # assert blogs[0]["title"] == "Special Chars $^+.?{}[]()\\|"


# def test_get_post_by_id
# @pytest.fixture(scope="function")
def test_get_posts_by_id_success(db_client, client):
    post_id = "6788b1458ff8314c0430b945"  # update this to depend on a post present in db
    response = client.get(f"/{post_id}/posts/")
    logger.error(response.json())
    logger.error(response.status_code)

    expected_post = {
        "_id": post_id,
        "title": "Special Chars $^+.?{}[]()\\|",
        'image': 'special.jpg',
        "content": 'Content with special chars',
        "tags": ['special'],
        "created_at": response.json().get("created_at"),
        "updated_at": response.json().get("created_at")
    }  # same as above for the same post

    assert response.status_code == 200
    assert response.json() == expected_post
    response_data = response.json()
    logger.info(str(response_data))
    assert response_data["content"] == 'Content with special chars'


# @pytest.fixture(scope="function")
def test_get_posts_by_id_invalid(client):
    post_id = "678501750a991c000f2fdm"

    response = client.get(f"/{post_id}/posts/")

    assert response.status_code == 500
    assert response.json() == {'detail': f'Invalid post_id: {post_id}'}


@pytest.fixture(scope="function")
def test_get_posts_by_id_not_found(client):
    post_id = "678501750a991f0c000f2fdm"

    response = client.get(f"/{post_id}/posts/")

    assert response.status_code == 204  # or 400 depending on how you handle the error in your route check error handling in related class
    assert response.json() == {
        "detail": f"Post not found: {post_id}"}  # or a more specific error message if you customize it


# test get post by tag or tags
# @pytest.fixture(scope="function")
def test_get_posts_by_tag_success(client, db_client):
    collection = db_client["posts"]
    tags = ["yes"]  # using a single tag
    query = {"tags": {"$in": tags}}
    post_cursor = collection.find(query)
    all_p = list(post_cursor)

    post_cursor = convert_objectid_to_str(posts=all_p)  # convert the object ids to string

    expected_posts = post_cursor
    # logger.error(expected_posts)

    response = client.get("/posts/tags/?tags=yes")  # Multiple query params are added like this

    assert response.status_code == 200
    posts = response.json()
    # assert response.json() == len(expected_posts)
    assert posts[0]["title"] == expected_posts[0]["title"]
    assert posts[-1]["title"] == expected_posts[-1]["title"]


# @pytest.fixture(scope="function")
def test_get_posts_by_tags_success(client, db_client):
    collection = db_client["posts"]
    tags = ["yes", "fish"]  # using a single tag
    query = {"tags": {"$in": tags}}
    post_cursor = collection.find(query)
    all_p = list(post_cursor)

    post_cursor = convert_objectid_to_str(posts=all_p)  #convert the object ids to string

    expected_posts = post_cursor
    logger.error(expected_posts)

    response = client.get("/posts/tags/?tags=yes&tags=fish")  # Multiple query params are added like this

    assert response.status_code == 200
    logger.error(response.json())
    posts = response.json()
    assert posts[0]["title"] == expected_posts[0]["title"]
    assert posts[-1]["title"] == expected_posts[-1]["title"]


# @pytest.fixture(scope="session")
def test_update_post(client, db_client):
    response = client.post(
        "/token",
        data={"username": "john_doe", "password": "jonnybones"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    access_token = response.json()["access_token"]

    collection = db_client["users"]
    collection_post = db_client["posts"]
    user = collection.find_one({"email": "john_doe@example.com"})
    get_post = collection_post.find_one()
    get_post["_id"] = str(get_post["_id"])

    post_id = get_post["_id"]  # any existing post to update

    # Create a valid image file for testing
    from PIL import Image
    image_path = os.path.join(basedir, 'static', 'test_image.png')  # "/static/test/test_image.png"
    image = Image.new("RGB", (100, 100), color=(255, 0, 0))  # A red square
    image.save(image_path)

    try:
        # Prepare the update data
        update_dict = {
            "title": (None, "testblogupdate"),
            "content": (None, "Enumerating objects: 36, done Counting objects: 100% (36/36), done. "
                              "Delta compression using up to 4 threads Compressing objects: 100% (22/22), done."),
            "tags": (None, "one, two, fish"),
            "image": ("test_image.png", open(image_path, "rb"), "image/png"),
        }

        # Send PUT request
        response = client.put(
            f"/blog/post/{post_id}",
            files=update_dict,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        logger.info(response)

        assert response.status_code == 201
        response_data = response.json()

        # Validate the response
        assert "_id" in response_data
        assert response_data["title"] == "testblogupdate"
        assert response_data["content"] == update_dict["content"][1]
        assert response_data["tags"] == ["one", "two", "fish"]
        assert "created_at" in response_data
        assert "updated_at" in response_data
        assert isinstance(ObjectId(response_data["_id"]), ObjectId)

    finally:
        # Clean up
        if os.path.exists(image_path):
            os.remove(image_path)
        # clear_posts_db(db_client)


@pytest.fixture(scope="session")
def test_delete_post(client, db_client):
    # login and delete user
    response = client.post(
        "/token",
        data={"username": "john_doe", "password": "jonnybones"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    access_token = response.json()["access_token"]

    # Define the post_id to delete
    post_id = "6783fb100b4a9acc8e52d39c"

    # Send a DELETE request
    response = client.delete(f"/blog/post/{post_id}",
                             headers={"Authorization": f"Bearer {access_token}"})
    # Assertions
    assert response.status_code == 200
    assert response.json() == {"message": f"Post deleted successfully True"}
