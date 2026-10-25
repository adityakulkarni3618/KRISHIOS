from fastapi import HTTPException, status
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AGRINEXUS"
    environment: str = "development"  # development | test | demo | production
    database_url: str = "sqlite:///./agrinexus.db"  # use PostgreSQL URL in docker-compose / production
    jwt_secret: str = "agrinexus-dev-secret-key-do-not-use-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440
    demo_mode: bool = True

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()


def require_demo_mode():
    if not settings.demo_mode:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This simulated module is disabled when DEMO_MODE is false.",
        )
