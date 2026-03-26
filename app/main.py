import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers.upload import router as upload_router

load_dotenv()  # load env vars from .env

app = FastAPI(title="MedicTranslate Backend")

origins = ["*"]  # adjust to exact frontend URI in production

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="", tags=["upload"])


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}
