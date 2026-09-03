import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FootPulse API"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://localhost:5432/footpulse")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    class Config:
        env_file = ".env"

settings = Settings()
