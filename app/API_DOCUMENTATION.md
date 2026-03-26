# MedicTranslate Backend API Documentation

## Overview
This backend processes lab result image uploads, sends them to Anthropic for text analysis, stores raw input + insights in Supabase, and returns validated structured insights.

Base URL: `http://localhost:8000`

## Environment Variables
- `ANTHROPIC_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_KEY`

The project uses `.env` loaded by `python-dotenv`.

## Dependencies
- `fastapi`
- `uvicorn`
- `python-multipart`
- `anthropic`
- `supabase`
- `python-dotenv`
- `pydantic`

## Endpoints

### GET /health
- Description: Check that service is running.
- Response: `200`
- Body:
  ```json
  {"status":"ok"}
  ```

### POST /analyze
- Description: Upload lab result image for AI analysis.
- Content-Type: `multipart/form-data`
- Body field:
  - `file` (required): image file, must be `image/jpeg` or `image/png`.

#### File size limit
- 2MB max (2,097,152 bytes).
- Too large => `413 Payload Too Large`.

#### Validation
- non-JPEG/PNG => `400 Invalid file type`.
- AI response schema mismatch => `422 Unprocessable Entity`.

#### Processing steps
1. Read uploaded bytes.
2. Validate size (2MB).
3. Convert bytes to Base64.
4. Send to Anthropic using `services/ai_service.py`.
5. Parse and validate response against `models/schemas.py::LabInsight`.
6. Persist raw result and insight in Supabase via `services/db_service.py`.
7. Return insight JSON.

#### Success response
- Status: `200`
- Body:
  ```json
  {
    "disclaimer": "...",
    "big_picture": "...",
    "good_results": ["..."],
    "areas_of_attention": ["..."],
    "next_steps": "..."
  }
  ```

## Data Models

### `LabInsight` (Pydantic model)
- `disclaimer`: `str`
- `big_picture`: `str`
- `good_results`: `List[Any]`
- `areas_of_attention`: `List[Any]`
- `next_steps`: `str`

## Database

### `lab_results`
- id: UUID primary key
- created_at: timestamp
- raw_json: JSONB

### `ai_insights`
- id: UUID primary key
- lab_result_id: UUID fk lab_results
- created_at: timestamp
- disclaimer: text
- big_picture: text
- good_results: JSONB
- areas_of_attention: JSONB
- next_steps: text

## Implementation Notes
- `services/ai_service.py::MEDICTRANSLATE_SYSTEM_PROMPT` ensures:
  - empathetic tone
  - no diagnosis
  - 8th-grade reading level
  - strict JSON output
- `services/ai_service.py::analyze_lab_image` handles Anthropic call and JSON parsing.
- `services/db_service.py` uses Supabase Python client for insertion.
- `routers/upload.py` orchestrates file handling, service calls and response.

## Run locally

1. `pip install -r requirements.txt`
2. `uvicorn main:app --reload --host 0.0.0.0 --port 8000`
3. POST to `http://localhost:8000/analyze` with a form field `file`.
