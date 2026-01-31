from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Multimedia Q&A API"
    DATABASE_URL: str = "postgresql://user:password@db:5432/multimedia_qa"
    REDIS_URL: str = "redis://redis:6379"
    OPENAI_API_KEY: Optional[str] = None
    UPLOAD_DIR: str = "uploads"
    
    class Config:
        env_file = ".env"

settings = Settings()
