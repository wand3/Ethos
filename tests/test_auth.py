import pytest
from tests import db_client, clear_db, client


@pytest.fixture(scope="function")
def test_create_user(client, clear_db):
    response = client.post(
        "/auth/register",
        json={"email": "test1@example.com", "password": "testpassword", "username": "testuser"},
    )
    assert response.status_code == 201
    assert response.json()["email"] == "test1@example.com"


@pytest.fixture(scope="function")
def test_login_user(client):
    response = client.post(
            "/token",
            data={"username": "test1@example.com", "password": "testpassword"},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
    assert response.status_code == 200
    assert "access_token" in response.json()
