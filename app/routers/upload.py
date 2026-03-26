import base64
from fastapi import APIRouter, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from services.ai_service import analyze_lab_image
from services.db_service import save_lab_result, save_ai_insight
from models.schemas import LabInsight

router = APIRouter()


@router.post("/analyze")
async def analyze_file(file: UploadFile):
    """Endpoint to accept an image file, analyze it with AI, and store insights."""
    file_bytes = await file.read()
    max_bytes = 2_097_152

    if len(file_bytes) > max_bytes:
        raise HTTPException(status_code=413, detail="File too large. Maximum allowed size is 2MB.")

    mime_type = file.content_type or "application/octet-stream"
    if mime_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG and PNG are supported.")

    encoded = base64.b64encode(file_bytes).decode("utf-8")

    ai_payload = await analyze_lab_image(encoded, mime_type)

    try:
        insight = LabInsight(**ai_payload)
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=f"AI response schema validation failed: {e}")

    try:
        lab_result_id = save_lab_result({"raw_image": "data:%s;base64,%s" % (mime_type, encoded)}, user_id=None)
        save_ai_insight(lab_result_id, insight.dict())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save insights: {e}")

    return JSONResponse(status_code=200, content=insight.dict())
