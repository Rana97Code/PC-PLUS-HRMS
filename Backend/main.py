from fastapi import FastAPI
from app.routes.router_list import router as api_router
from app.db.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware



Base.metadata.create_all(bind=engine)

origins = [
        "http://localhost:5173",
]


def start_application():
    app = FastAPI()
    app.include_router(api_router)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    # Custom middleware for security headers
    @app.middleware("http")
    async def add_security_headers(request, call_next):
        response = await call_next(request)
        # response.headers["Content-Security-Policy"] = "default-src 'self'"
        response.headers["Content-Security-Policy"] = (
                "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; "
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; "
                "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
                "img-src 'self' data: https://fastapi.tiangolo.com"
        )
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response
    
    return app

app = start_application()