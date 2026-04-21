from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from routers.upload import router as upload_router
from routers.auth import router as auth_router

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
app.include_router(auth_router, prefix="", tags=["auth"])


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}
