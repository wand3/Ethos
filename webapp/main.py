from fastapi import FastAPI
from webapp.routes import ethos_router


def create_app() -> FastAPI:
    app = FastAPI()

    # Include routes
    app.include_router(ethos_router, tags=["Ethos"])

    # app.include_router(portfolio_router, prefix="/portfolio", tags=["Portfolio"])


    # Create tables

    return app

app = create_app()
