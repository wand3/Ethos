from webapp.routes.main import main as ethos_router
from webapp.routes.auth import auth as auth_router
from webapp.routes.user import router as user_router
from webapp.routes.blog import blog as blog_router
from webapp.routes.project import project as project_router
from webapp.routes.comment import comment as comment_router


__all__ = [
    "ethos_router",
    "auth_router",
    "user_router",
    "blog_router",
    "project_router",
    "comment_router"
]
