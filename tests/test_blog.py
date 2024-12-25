import pytest
from pymongo import MongoClient
from fastapi.testclient import TestClient
from bson import ObjectId
from datetime import datetime
from webapp.main import app

# Create a test client
client = TestClient(app)

# MongoDB test setup
TEST_DB_URI = "mongodb://localhost:27017/"
TEST_DB_NAME = "test_personal_blog"
mongo_client = MongoClient(TEST_DB_URI)
test_db = mongo_client[TEST_DB_NAME]
users_collection = test_db.users
posts_collection = test_db.posts


# Utility function to clear the test database
def clear_test_db():
    users_collection.delete_many({})
    posts_collection.delete_many({})


# Fixtures for setting up and tearing down tests
@pytest.fixture(scope="function", autouse=True)
def setup_and_teardown():
    clear_test_db()
    yield
    clear_test_db()


# Test cases for User CRUD
def test_create_user():
    response = client.post(
        "/users/",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "securepassword",
            "bio": "A test user",
            "profile_image": None,
            "joined_at": str(datetime.utcnow())
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "testuser@example.com"
    assert "hashed_password" in data


def test_get_user_by_id():
    # Create a user
    response = client.post(
        "/users/",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "securepassword",
            "bio": "A test user",
            "profile_image": None,
            "joined_at": str(datetime.utcnow())
        }
    )
    user_id = response.json()["id"]

    # Fetch the user
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "testuser@example.com"



def test_delete_user():
    # Create a user
    response = client.post(
        "/users/",
        json={
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "securepassword",
            "bio": "A test user",
            "profile_image": None,
            "joined_at": str(datetime.utcnow())
        }
    )
    user_id = response.json()["id"]

    # Delete the user
    response = client.delete(f"/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "User deleted successfully"


# Test cases for Post CRUD
def test_create_post():
    response = client.post(
        "/posts/",
        json={
            "title": "First Post",
            "content": "This is the content of the first post.",
            "published": True,
            "tags": ["test", "fastapi"]
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "First Post"
    assert "createdAt" in data


def test_get_post_by_id():
    # Create a post
    response = client.post(
        "/posts/",
        json={
            "title": "First Post",
            "content": "This is the content of the first post.",
            "published": True,
            "tags": ["test", "fastapi"]
        }
    )
    post_id = response.json()["id"]

    # Fetch the post
    response = client.get(f"/posts/{post_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "First Post"


def test_update_post():
    # Create a post
    response = client.post(
        "/posts/",
        json={
            "title": "First Post",
            "content": "This is the content of the first post.",
            "published": True,
            "tags": ["test", "fastapi"]
        }
    )
    post_id = response.json()["id"]

    # Update the post
    response = client.put(
        f"/posts/{post_id}",
        json={"content": "Updated content"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "Updated content"


def test_delete_post():
    # Create a post
    response = client.post(
        "/posts/",
        json={
            "title": "First Post",
            "content": "This is the content of the first post.",
            "published": True,
            "tags": ["test", "fastapi"]
        }
    )
    post_id = response.json()["id"]

    # Delete the post
    response = client.delete(f"/posts/{post_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Post deleted successfully"
