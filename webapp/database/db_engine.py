import os
from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from contextlib import asynccontextmanager
import logging


# MongoDB's connection string (localhost, no authentication)
MONGO_CONNECTION_STRING = "mongodb://127.0.0.1:27017/"
DATABASE_NAME = "ethos"

# Load the MongoDB connection string from the environment variable MONGODB_URI

# Create a MongoDB client
client = AsyncIOMotorClient(MONGO_CONNECTION_STRING)
db = client["ethos"]


@asynccontextmanager
async def db_lifespan(app: FastAPI):
    # Startup
    app.mongodb_client = AsyncIOMotorClient(MONGO_CONNECTION_STRING)
    app.database = app.mongodb_client.get_default_database(DATABASE_NAME)
    ping_response = await app.database.command("ping")
    if int(ping_response["ok"]) != 1:
        raise Exception("Problem connecting to database cluster.")
    else:
        logging.info("Connected to database cluster.")

    yield

    # Shutdown
    app.mongodb_client.close()

