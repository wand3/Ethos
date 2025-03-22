import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from webapp.routes import ethos_router, user_router, auth_router, blog_router, project_router, comment_router
import uvicorn
from webapp.database.db_engine import db_lifespan, connect_to_mongo, close_mongo_connection
from .logger import logger
from fastapi.staticfiles import StaticFiles
from pathlib import Path


def create_app() -> FastAPI:
    app: FastAPI = FastAPI(db_lifespan=db_lifespan)
    logger.info(f'Application started -----------')


    origins = [
        "http://localhost:5173/",
        "http://127.0.0.1:8000/*",
        "*"
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )
    # Include routes
    app.include_router(auth_router)
    app.include_router(user_router)
    app.include_router(blog_router)
    app.include_router(project_router)
    app.include_router(comment_router)
    app.include_router(ethos_router, tags=["Ethos"])

    # Create tables

    return app


app = create_app()
# base_folder = Path(__name__).resolve().parent
# logger.info(base_folder)


# directories = ["static"]
# Use absolute path detection
current_dir = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(current_dir, "static")

app.mount("/static", StaticFiles(directory=static_dir), name="static")
        


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)


# @app.on_event("startup")
# async def startup_event():
#     await connect_to_mongo()
#
#
# @app.on_event("shutdown")
# async def shutdown_event():
#     await close_mongo_connection()
