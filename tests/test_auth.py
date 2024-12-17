import pytest
import pytest_asyncio
from httpx import AsyncClient
from fastapi.testclient import TestClient
import motor.motor_asyncio
from webapp.main import app  # Ensure this is your FastAPI app instance
import logging
from webapp.database.db_engine import db


from fastapi.testclient import TestClient
from webapp.main import app

client = TestClient(app)


def test_create_user():
    response = client.post(
        "/auth/register",
        json={"email": "test1@example.com", "password": "testpassword", "username": "testuser"},
    )
    assert response.status_code == 201
    assert response.json()["email"] == "test1@example.com"


def test_login_user():
    response = client.post(
            "/token",
            data={"username": "test1@example.com", "password": "testpassword"},
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
    assert response.status_code == 200
    assert "access_token" in response.json()
