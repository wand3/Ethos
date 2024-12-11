from fastapi import FastAPI
from webapp.routes import ethos_router
from webapp.database.db_engine import db_lifespan


def create_app() -> FastAPI:
    app: FastAPI = FastAPI(lifespan=db_lifespan)
    # Include routes
    app.include_router(ethos_router, tags=["Ethos"])

    # app.include_router(portfolio_router, prefix="/portfolio", tags=["Portfolio"])

    # Create tables

    return app


app = create_app()
