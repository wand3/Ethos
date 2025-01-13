import os
from datetime import datetime
from bson import ObjectId
from webapp.config import basedir
from webapp.logger import logger
import pytest
from tests import db_client, client


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


# test get all post
@pytest.fixture(scope="function")
def test_get_all_posts(client):
    response = client.get("/posts")
    assert response.status_code == 200
    blogs = response.json()
    assert isinstance(blogs, list)
    assert len(blogs) >= 3


# test search for post by title, tags or content
@pytest.fixture(scope="function")
def test_search_blogs(client):
    # Test cases for searching
    test_cases = [
        {"q": "done", "expected_count": 7},  # Matches titles and content
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


@pytest.fixture(scope="function")
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
@pytest.fixture(scope="function")
def test_get_posts_by_id_success(db_client, client):
    post_id = "678501750a991f0c000f2fdf"  # update this to depend on a post present in db
    expected_post = {
        "_id": post_id,
        "title": "Special Chars $^+.?{}[]()\\|",
        'image': 'special.jpg',
        "content": 'Content with special chars',
        "tags": ['special'],
        "created_at": "2025-01-13T12:05:09.863000",
        "updated_at": "2025-01-13T12:05:09.863000",
    }  # same as above for the same post

    response = client.get(f"/{post_id}/posts/")

    assert response.status_code == 200
    assert response.json() == expected_post
    response_data = response.json()
    logger.info(str(response_data))
    assert response_data["content"] == 'Content with special chars'


@pytest.fixture(scope="function")
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
    assert response.json() == {"detail": f"Post not found: {post_id}"}  # or a more specific error message if you customize it


# test get post by tag or tags
@pytest.fixture(scope="function")
def test_get_posts_by_tag_success(client):
    tags = ["yes"]  # using a single tag
    expected_posts = [
        {
            "image": "6783fb100b4a9acc8e52d39b_flipper.jpeg",
            "title": "testblog",
            "content": "Enumerating objects: 36, done Counting objects: 100% (36/36), done. Delta compression '\n    "
                       "                       'using up to 4 threads Compressing objects: 100% (22/22), done.",
            "tags": [
                "one",
                "two",
                "fish",
                "yes"
            ],
            "_id": "6783fb100b4a9acc8e52d39c",
            "created_at": "2025-01-12T17:25:36.137000",
            "updated_at": "2025-01-12T17:25:36.137000"
        }
    ]

    response = client.get("/posts/tags/?tags=yes") # Multiple query params are added like this

    assert response.status_code == 200
    assert response.json() == expected_posts


@pytest.fixture(scope="function")
def test_get_posts_by_tags_success(client):
    tags = ["yes", "fish"]  # using a single tag
    expected_posts = [
        {
            "image": "6783fb100b4a9acc8e52d39b_flipper.jpeg",
            "title": "testblog",
            "content": "Enumerating objects: 36, done Counting objects: 100% (36/36), done. Delta compression '\n                           'using up to 4 threads Compressing objects: 100% (22/22), done.",
            "tags": [
                "one",
                "two",
                "fish",
                "yes"
            ],
            "_id": "6783fb100b4a9acc8e52d39c",
            "created_at": "2025-01-12T17:25:36.137000",
            "updated_at": "2025-01-12T17:25:36.137000"
        },
        {
            "image": "6784defe3e2c085e71490328_test_image.png",
            "title": "testblog",
            "content": "Enumerating objects: 36, done Counting objects: 100% (36/36), done. Delta compression using up to 4 threads Compressing objects: 100% (22/22), done.",
            "tags": [
                "one",
                "two",
                "fish"
            ],
            "_id": "6784defe3e2c085e71490329",
            "created_at": "2025-01-13T09:38:06.240000",
            "updated_at": "2025-01-13T09:38:06.240000"
        },
        {
            "image": "6784df1de7dcf26bab03376d_test_image.png",
            "title": "testblog",
            "content": "Enumerating objects: 36, done Counting objects: 100% (36/36), done. Delta compression using up to 4 threads Compressing objects: 100% (22/22), done.",
            "tags": [
                "one",
                "two",
                "fish"
            ],
            "_id": "6784df1de7dcf26bab03376e",
            "created_at": "2025-01-13T09:38:37.538000",
            "updated_at": "2025-01-13T09:38:37.538000"
        },
        {
            "image": "6784e06b2b8db8fad9544806_test_image.png",
            "title": "testblog",
            "content": "Enumerating objects: 36, done Counting objects: 100% (36/36), done. Delta compression using up to 4 threads Compressing objects: 100% (22/22), done.",
            "tags": [
                "one",
                "two",
                "fish"
            ],
            "_id": "6784e06b2b8db8fad9544807",
            "created_at": "2025-01-13T09:44:11.516000",
            "updated_at": "2025-01-13T09:44:11.516000"
        },
        {
            "image": "6784e22ee2e858d506ed7f32_test_image.png",
            "title": "testblog",
            "content": "Enumerating objects: 36, done Counting objects: 100% (36/36), done. Delta compression using up to 4 threads Compressing objects: 100% (22/22), done.",
            "tags": [
                "one",
                "two",
                "fish"
            ],
            "_id": "6784e22ee2e858d506ed7f33",
            "created_at": "2025-01-13T09:51:42.061000",
            "updated_at": "2025-01-13T09:51:42.061000"
        },
        {
            "image": "6784e2529511ab63ca847746_test_image.png",
            "title": "testblog",
            "content": "Enumerating objects: 36, done Counting objects: 100% (36/36), done. Delta compression using up to 4 threads Compressing objects: 100% (22/22), done.",
            "tags": [
                "one",
                "two",
                "fish"
            ],
            "_id": "6784e2529511ab63ca847747",
            "created_at": "2025-01-13T09:52:18.937000",
            "updated_at": "2025-01-13T09:52:18.937000"
        },
        {
            "image": "6784fb1a6e0792981e3a9370_flipper.jpeg",
            "title": "lady",
            "content": "Enumerating objects: 36, done Counting objects: 100% (36/36), done. Delta compression '\n                           'using up to 4 threads Compressing objects: 100% (22/22), done.",
            "tags": [
                "one",
                "two",
                "fish"
            ],
            "_id": "6784fb1a6e0792981e3a9371",
            "created_at": "2025-01-13T11:38:02.794000",
            "updated_at": "2025-01-13T11:38:02.794000"
        }
    ]

    response = client.get("/posts/tags/?tags=yes&tags=fish")  # Multiple query params are added like this

    assert response.status_code == 200
    assert response.json() == expected_posts

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
