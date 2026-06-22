from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes.router_list import router as api_router
from app.db.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path


Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173",
    "https://erp.pcplusbd.com",
    "http://erp.pcplusbd.com",
]


def start_application():
    app = FastAPI()

    BASE_DIR = Path(__file__).resolve().parent
    UPLOAD_DIR = BASE_DIR / "uploads" / "images"
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    app.mount(
        "/uploads/images",
        StaticFiles(directory=UPLOAD_DIR),
        name="uploads"
    )

    app.include_router(api_router)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def add_security_headers(request, call_next):
        response = await call_next(request)

        response.headers["Content-Security-Policy"] = (
            "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
            "img-src 'self' data: https://api.erp.pcplusbd.com https://erp.pcplusbd.com https://fastapi.tiangolo.com; "
            "connect-src 'self' https://api.erp.pcplusbd.com http://localhost:8000 http://127.0.0.1:8000"
        )

        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        return response

    return app


app = start_application()