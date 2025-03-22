import os
import cloudinary
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env


basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY: str = 'ONE'
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # database url
    DATABASE_URI = os.getenv('CLUSTER') or 'mongodb://127.0.0.1:27017/'

    # cloudinary config
    CLOUDINARY_CLOUD_NAME = os.getenv('CLOUD_NAME')
    CLOUDINARY_API_KEY = os.getenv('API_KEY')
    CLOUDINARY_API_SECRET = os.getenv('API_SECRET')

    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
        secure=True
    )

    MAX_CONTENT_LENGTH = 6144 * 6144
    MAX_IMAGE_SIZE = 30 * 1024 * 1024  # 30 MB
    UPLOAD_EXTENSIONS = ['.jpg', '.png', '.img', '.jpeg', '.mov', '.mp4', '.webp']

    # project image directory
    UPLOAD_USER_IMAGE = os.path.join(basedir, 'static', 'images', 'user_images')

    # blog post image directory
    UPLOAD_BLOG_POST_IMAGE = os.path.join(basedir, 'static', 'images', 'post_images')

    # blog post comment image directory
    UPLOAD_BLOG_POST_COMMENT_IMAGE = os.path.join(basedir, 'static', 'images', 'post_comment_images')

    # project image directory
    UPLOAD_PROJECT_IMAGE = os.path.join(basedir, 'static', 'images', 'project_images')



