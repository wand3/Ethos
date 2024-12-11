from fastapi import FastAPI
from webapp.routes import ethos_router, user_router, auth_router, blog_router

from webapp.database.db_engine import db_lifespan


def create_app() -> FastAPI:
    app: FastAPI = FastAPI(lifespan=db_lifespan)
    # Include routes
    app.include_router(auth_router)
    app.include_router(user_router)
    app.include_router(blog_router)
    app.include_router(ethos_router, tags=["Ethos"])

    # Create tables

    return app


app = create_app()
