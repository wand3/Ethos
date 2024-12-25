import logging

import pytest
from tests import db_client, clear_db, client

# Configure logging to display messages to the terminal
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s', handlers=[logging.StreamHandler()])


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


# @pytest.fixture(scope="session")
# def test_update_user_client(client, db_client):
#     # Create a user
#     # response = client.post(
#     #     "/auth/register",
#     #     json={
#     #         "username": "testinguser",
#     #         "email": "testuser20@example.com",
#     #         "password": "securepassword",
#     #     }
#     # )
#     # assert response.status_code == 201
#     # assert response.json()["email"] == "testuser20@example.com"
#
#     response = client.post(
#         "/token",
#         data={"username": "testuser20@example.com", "password": "securepassword"},
#         headers={"Content-Type": "application/x-www-form-urlencoded"},
#     )
#     assert response.status_code == 200
#     assert "access_token" in response.json()
#     access_token = response.json()["access_token"]
#
#     collection = db_client["users"]
#     user = collection.find_one({"email": "testuser20@example.com"})
#
#     # user_id = response.json()["email"]
#     print(f"Found user: {user}")
#
#     user_id = user["_id"]
#
#     # Update the user
#     update_dict = {"email": "testupdate200@example.com", "username": "testupdateuser"}
#
#     response = client.put(
#         f"/user/{user_id}/me",
#         data=update_dict,
#         headers={"Authorization": f"Bearer {access_token}"},
#     )
#     assert response.status_code == 200
#     data = response.json()
#     # assert data["bio"] == "An updated bio"
#

def test_update_user(client, db_client):

    access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0MUBleGFtcGxlLmNvbSIsImV4cCI6MTczNTE1NTYzNX0.K0BZGULAMcv_64K0al84nFyCT3ZuDHvcy1opdRzQQ6E'
    # Create a test user (using string id for MongoDB)
    collection = db_client["users"]

    test_user_id = "6763457c59b0aa764955eb18"
    # collection.insert_one({"_id": test_user_id, "username": "testuser", "email": "test@example.com", "password":"password"})

    # Test updating username
    response = client.put(f"/user/users/{test_user_id}", json={"username": "newuser"}, headers={"Authorization": f"Bearer {access_token}"})
    assert response.status_code == 200
    assert response.json() == {"message": "User updated successfully"}
    updated_user = collection.find_one({"_id": test_user_id})
    assert updated_user["username"] == "newuser"

    # Test updating email
    response = client.put(f"/user/users/{test_user_id}", json={"email": "newemail@example.com"})
    assert response.status_code == 200
    updated_user = collection.find_one({"_id": test_user_id})
    assert updated_user["email"] == "newemail@example.com"

    # Test updating password
    response = client.put(f"/user/users/{test_user_id}", json={"password": "newpassword"})
    assert response.status_code == 200
    updated_user = collection.find_one({"_id": test_user_id})
    assert updated_user["password"] == "newpassword"

    # Test user not found
    response = client.put("/user/users/nonexistentuser", json={"username": "doesntmatter"})
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found"}

    # Test duplicate username
    collection.insert_one({"_id": "testuser456", "username": "testuser2", "email": "test2@example.com", "password":"password"})
    response = client.put(f"/user/users/{test_user_id}", json={"username": "testuser2"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Username already taken"}

    # Test duplicate email
    response = client.put(f"/user/users/{test_user_id}", json={"email": "test2@example.com"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Email already taken"}

    #Test no fields to update
    response = client.put(f"/user/users/{test_user_id}", json={})
    assert response.status_code == 200
    assert response.json() == {"message": "No fields to update provided"}
