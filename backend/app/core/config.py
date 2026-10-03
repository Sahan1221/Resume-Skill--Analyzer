from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Resume & Skill Analyzer API"

    frontend_origin: str = "http://localhost:5173"

    jwt_secret_key: str = (
        "development-only-change-this-secret-key"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()