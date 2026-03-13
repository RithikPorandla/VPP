from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db
from app.api.routes import router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="WeatherEdge API",
    description="ML-Powered Marine Weather Intelligence for Offshore Wind Operations",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
async def root():
    return {
        "name": "WeatherEdge",
        "version": "0.1.0",
        "description": "ML-Powered Marine Weather Intelligence for Offshore Wind Operations",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
