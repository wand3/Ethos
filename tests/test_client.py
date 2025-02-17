import os

from webapp.config import basedir
from webapp.logger import logger
import pytest
from tests import db_client, clear_db, client


@pytest.fixture(scope="function")
def test_register_user(client, clear_db):
    """Test registering a user via the API."""
    response = client.post(
        "/auth/register",
        json={"email": "test@example.com", "password": "testpassword", "username": "testuser"},
    )
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"


@pytest.fixture(scope="function")
def test_user_insertion(db_client):
    """Test inserting a user into the database."""
    collection = db_client["users"]
    result = collection.insert_one({"email": "test@example.com", "username": "testuser"})
    assert result.inserted_id is not None
    user_id = result.inserted_id
    # Verify the user exists in the database
    user = collection.find_one({"_id": result.inserted_id})
    assert user["email"] == "test@example.com"


@pytest.fixture(scope="function")
def test_user_update(db_client, clear_db):
    # Create a user to update
    collection = db_client["users"]
    # db_client.create_collection("users")
    result = collection.insert_one({"email": "test@example.com", "username": "testuser"})
    print(f"User added with ID: {result.inserted_id}")
    user = collection.find_one({"email": "test@example.com"})
    print(f"Found user: {user}")
    # test updating a user into the db
    update_dict = {"email": "testupdate@example.com", "username": "testupdateuser"}
    new_result = collection.find_one_and_update({"_id": result.inserted_id}, {"$set": update_dict}, return_document=True)
    print(f"Found user: {new_result}")

    # Verify the user is updated in the database
    user = collection.find_one({"_id": new_result["_id"]})
    assert user["email"] == "testupdate@example.com"
    assert user["username"] == "testupdateuser"


@pytest.fixture(scope="session")
def test_update_user_client(client, db_client):
    # Create a user
    response = client.post(
        "/auth/register",
        json={
            "username": "testinguser",
            "email": "testuser20@example.com",
            "password": "securepassword",
        }
    )
    assert response.status_code == 201
    assert response.json()["email"] == "testuser20@example.com"

    response = client.post(
        "/token",
        data={"username": "testinguser", "password": "securepassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    access_token = response.json()["access_token"]

    collection = db_client["users"]
    user = collection.find_one({"email": "testuser20@example.com"})

    # user_id = response.json()["email"]
    print(f"Found user: {user}")

    user_id = user["_id"]

    # Update the user
    update_dict = {"email": "testupdate200@example.com", "username": "testupdateuser"}

    response = client.put(
        f"/user/{user_id}/me",
        json=update_dict,
        headers={"Authorization": f"Bearer {access_token}"}
    )
    logger.info(response)

    assert response.status_code == 200


# @pytest.fixture(scope="session")
def test_update_user_image(client, db_client):
    response = client.post(
        "/token",
        data={"username": "john_doe", "password": "jonnybones"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    access_token = response.json()["access_token"]

    res_p = response.json()
    collection = db_client["users"]
    # Verify the user is updated in the database
    user = collection.find_one({"username": "john_doe"})
    assert user["email"] == "john_doe@example.com"
    assert user["username"] == "john_doe"

    user_id = user["_id"]
    # Create a valid image file for testing
    from PIL import Image
    image_path = os.path.join(basedir, 'static', 'test_image_update.png')  # "/static/test/test_image.png"
    image = Image.new("RGB", (100, 100), color=(255, 0, 0))  # A red square
    image.save(image_path)

    try:
        with open(image_path, "rb") as image_file:
            files = {
                "image": (
                    "test_image_update.png",
                    image_file,
                    "image/png",
                )  # Correct way to send files with requests
            }

            # Send PUT request
            response = client.put(
                f"/user/{user_id}/add/image",
                files=files,
                headers={"Authorization": f"Bearer {access_token}"}
            )
            logger.info(response.json())

            assert response.status_code == 201
            response_data = response.json()

            # update = collection_project.find(project_id)
            logger.error(files["image"][0])
            # Validate the response
            assert "_id" in response_data
            assert response_data["profile_pic"] == files["image"][0]
            assert "updated_at" in response_data

    except Exception as e:
        return str(e)


@pytest.fixture(scope="session")
def test_delete_user_route(client, db_client):
    # login and delete user
    response = client.post(
        "/token",
        data={"username": "testinguser", "password": "securepassword"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    access_token = response.json()["access_token"]

    # Define the user_id to delete
    user_id = response.json()["id"]

    # or  user_id = "mock_user_id"

    # Send a DELETE request
    response = client.delete(f"/{user_id}/me", headers={"Authorization": f"Bearer {access_token}"})

    # Assertions
    assert response.status_code == 200
    assert response.json() == {"message": "User deleted successfully"}




#     # Test updating username
#     response = client.put(f"/user/users/{test_user_id}", json={"username": "newuser"}, headers={"Authorization": f"Bearer {access_token}"})
#     assert response.status_code == 200
#     assert response.json() == {"message": "User updated successfully"}
#     updated_user = collection.find_one({"_id": test_user_id})
#     assert updated_user["username"] == "newuser"
#
#     # Test updating email
#     response = client.put(f"/user/users/{test_user_id}", json={"email": "newemail@example.com"})
#     assert response.status_code == 200
#     updated_user = collection.find_one({"_id": test_user_id})
#     assert updated_user["email"] == "newemail@example.com"
#
#     # Test updating password
#     response = client.put(f"/user/users/{test_user_id}", json={"password": "newpassword"})
#     assert response.status_code == 200
#     updated_user = collection.find_one({"_id": test_user_id})
#     assert updated_user["password"] == "newpassword"
#
#     # Test user not found
#     response = client.put("/user/users/nonexistentuser", json={"username": "doesntmatter"})
#     assert response.status_code == 404
#     assert response.json() == {"detail": "User not found"}
#
#     # Test duplicate username
#     collection.insert_one({"_id": "testuser456", "username": "testuser2", "email": "test2@example.com", "password":"password"})
#     response = client.put(f"/user/users/{test_user_id}", json={"username": "testuser2"})
#     assert response.status_code == 400
#     assert response.json() == {"detail": "Username already taken"}
#
#     # Test duplicate email
#     response = client.put(f"/user/users/{test_user_id}", json={"email": "test2@example.com"})
#     assert response.status_code == 400
#     assert response.json() == {"detail": "Email already taken"}
#
#     #Test no fields to update
#     response = client.put(f"/user/users/{test_user_id}", json={})
#     assert response.status_code == 200
#     assert response.json() == {"message": "No fields to update provided"}
