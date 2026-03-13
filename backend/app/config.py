from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "WeatherEdge"
    database_url: str = "postgresql+asyncpg://weatheredge:weatheredge@localhost:5432/weatheredge"
    database_url_sync: str = "postgresql+psycopg2://weatheredge:weatheredge@localhost:5432/weatheredge"
    open_meteo_base_url: str = "https://marine-api.open-meteo.com/v1/marine"
    open_meteo_weather_url: str = "https://api.open-meteo.com/v1/forecast"
    forecast_days: int = 14
    weather_refresh_interval_hours: int = 6
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
