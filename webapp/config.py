import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY: str = 'ONE'
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # blog post image directory
    UPLOAD_BLOG_POST_IMAGE = os.path.join(basedir, 'static', 'images', 'post_images')
