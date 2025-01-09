from webapp.routes.main import main as ethos_router
from webapp.routes.auth import auth as auth_router
from webapp.routes.user import router as user_router
from webapp.routes.blog import blog as blog_router

__all__ = [
    "ethos_router",
    "auth_router",
    "user_router",
    "blog_router",
]
