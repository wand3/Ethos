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


def test_user_insertion(db_client, clear_db):
    """Test inserting a user into the database."""
    collection = db_client["users"]
    result = collection.insert_one({"email": "test@example.com", "username": "testuser"})
    assert result.inserted_id is not None

    # Verify the user exists in the database
    user = collection.find_one({"_id": result.inserted_id})
    assert user["email"] == "test@example.com"
