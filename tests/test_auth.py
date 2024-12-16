import pytest
import pytest_asyncio
from httpx import AsyncClient
from fastapi.testclient import TestClient
import motor.motor_asyncio
from webapp.main import app  # Ensure this is your FastAPI app instance
import logging
from webapp.database.db_engine import db