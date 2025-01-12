import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY: str = 'ONE'
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    MAX_CONTENT_LENGTH = 6144 * 6144
    MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB
    UPLOAD_EXTENSIONS = ['.jpg', '.png', '.img', '.jpeg']
    # blog post image directory
    UPLOAD_BLOG_POST_IMAGE = os.path.join(basedir, 'static', 'images', 'post_images')
