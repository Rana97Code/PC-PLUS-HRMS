from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes.router_list import router as api_router
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from app.db.create_tables import *

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://erp.pcplusbd.com",
    "http://erp.pcplusbd.com",
]


def start_application():
    app = FastAPI(
        title="PC Plus HRMS API",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json"
    )

    BASE_DIR = Path(__file__).resolve().parent

    UPLOAD_DIR = BASE_DIR / "app" / "uploads" / "images"
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    app.mount(
        "/uploads/images",
        StaticFiles(directory=UPLOAD_DIR),
        name="uploads"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)

    @app.get("/")
    def root():
        return {
            "message": "PC Plus HRMS API is running"
        }

    return app


app = start_application()