import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Ensure backend folder is in python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from database.db import init_db
from database.seed import seed_schemes
from routes.schemes import router as schemes_router
from routes.match import router as match_router
from routes.upload import router as upload_router
from routes.chat import router as chat_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure DB and seeds
    init_db()
    seed_schemes()
    print("Backend started successfully. SQLite schemes seeded.")
    yield
    # Shutdown
    print("Backend shutting down.")

app = FastAPI(
    title="SIH26092 Scheme Matcher API",
    description="AI-Driven Government Scheme Matching for Marginalized Entrepreneurs",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware to allow React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(schemes_router)
app.include_router(match_router)
app.include_router(upload_router)
app.include_router(chat_router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SIH26092 AI Scheme Matcher Backend",
        "version": "1.0.0",
        "db": "SQLite connected"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "details": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
