from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "AGRINEXUS"
    environment: str = "development"  # development | test | demo | production
    database_url: str = "sqlite:///./agrinexus.db"  # use PostgreSQL URL in docker-compose / production

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
