from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Multimedia Q&A API"
    DATABASE_URL: str = "postgresql://user:password@db:5432/multimedia_qa"
    REDIS_URL: str = "redis://redis:6379"
    OPENAI_API_KEY: Optional[str] = None
    UPLOAD_DIR: str = "uploads"
    
    # Cloudinary Settings
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None
    
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
