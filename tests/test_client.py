
import pytest

from webapp.models.user import UserModel
from webapp.schemas.user import UserCreate
import pytest
from httpx import AsyncClient
from webapp.main import app


from motor.motor_asyncio import AsyncIOMotorClient


# @pytest.fixture(scope="session")
# def test_db():
#     client = AsyncIOMotorClient("mongodb://localhost:27017")
#     test_db = client["test_db"]
#     yield test_db
#     client.drop_database("test_db")
#
#
# @pytest.fixture
# def get_test_user_model(test_db):
#     print(type(test_db))
#
#     return UserModel(test_db)
#
#
# @pytest.mark.asyncio
# async def test_register_user(test_client):
#     response = await test_client.post(
#         "/auth/register",
#         json={"email": "test@example.com", "password": "testpassword", "username": "testuser"},
#     )
#     assert response.status_code == 201
#     assert response.json()["email"] == "test@example.com"
#
#
# @pytest.mark.asyncio
# async def test_login_user(test_client):
#     # First, create a user
#     await test_client.post(
#         "/auth/register",
#         json={"email": "test@example.com", "password": "testpassword", "username": "testuser"},
#     )
#
#     # Then, attempt login
#     response = await test_client.post(
#         "/token",
#         data={"username": "test@example.com", "password": "testpassword"},
#         headers={"Content-Type": "application/x-www-form-urlencoded"},
#     )
#     assert response.status_code == 200
#     assert "access_token" in response.json()
