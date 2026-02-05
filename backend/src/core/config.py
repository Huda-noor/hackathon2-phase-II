from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Todo Web App API"
    DATABASE_URL: str
    BETTER_AUTH_SECRET: str

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
