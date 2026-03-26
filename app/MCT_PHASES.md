
#### This file contains the implementation guidelines for the medictranslate application's backend. All of this is to be done within this workspace (app/)


## Existing Context
env variables have been placed (ANTHROPIC_API_KEY, SUPABASE_URL. SUPABASE_KEY). 

SQL for supabase tables.
``
```SQL for supabase tables
CREATE TABLE lab_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  raw_json JSONB
);

CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_result_id UUID REFERENCES lab_results(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  disclaimer TEXT,
  big_picture TEXT,
  good_results JSONB,
  areas_of_attention JSONB,
  next_steps TEXT
);
```

## Phase 1 — Backend skeleton

Create a fastAPI server

**Step 1.1 — Install dependencies**
Install your core packages: `fastapi`, `uvicorn`, `python-multipart` (for file uploads), `anthropic`, `supabase`, and `python-dotenv`. Freeze them into a `requirements.txt`.

**Step 1.2 — App entry point**
Create `main.py`. Initialize FastAPI, load environment variables, and add CORS middleware so your frontend (running on a different port locally) can reach the backend. Add a simple `GET /health` route that returns `{"status": "ok"}`

**Step 1.3 — Project structure**
Organize your code into a clean folder structure before writing business logic. A simple layout that works well for this scope:
```
/app
  main.py
  /routers
    upload.py
  /services
    ai_service.py
    db_service.py
  /models
    schemas.py
  .env
  requirements.txt
````

---

## Phase 2 — Upload controller

Handle receiving an image from the frontend, enforcing the 2MB limit, and converting it to Base64.

**Step 2.1 — Define the upload route** In `routers/upload.py`, create a `POST /analyze` endpoint using FastAPI's `UploadFile`. This is the single entry point for all lab result submissions.

**Step 2.2 — Enforce the 2MB file size limit** Read the file bytes into memory and check `len(file_bytes)` before doing anything else. If it exceeds 2,097,152 bytes (2MB), return an HTTP 413 error immediately with a clear message. This is your guard against demo-crashing payloads.

**Step 2.3 — Base64 conversion** After the size check, convert the raw bytes to a Base64 string using Python's `base64` module. Also detect the MIME type (JPEG vs PNG) from the file's content type header, since you'll need to pass this to the Anthropic API. Pass both to the AI service layer.

---

## Phase 3 — AI service layer

This is the core of the product. One async function takes the Base64 image and returns structured JSON.

**Step 3.1 — Write the system prompt** This is the most important piece of engineering in the whole project. Create a constant string `MEDICTRANSLATE_SYSTEM_PROMPT` in `ai_service.py`. The prompt should:

- Instruct the model to act as an empathetic, plain-language medical translator
- Specify that it must **not** diagnose, only explain
- Specify an 8th-grade reading level
- Explicitly instruct the model to respond **only** with a JSON object, with no preamble or markdown fences
- Define the exact 5-key schema: `disclaimer`, `big_picture`, `good_results` (array), `areas_of_attention` (array), `next_steps`

**Step 3.2 — Build the API call function** Create an async function `analyze_lab_image(base64_image, mime_type)`. Inside it, construct the Anthropic API payload with the system prompt, the Base64 image as a `content` block of type `image`, and a user message prompt like `"Please analyze these lab results."` Call `anthropic.messages.create(...)` with `model="claude-haiku-4-5-20251001"` and `max_tokens=1024`.

**Step 3.3 — Parse the JSON response** Extract the text content from the response, strip any accidental markdown fences (` ```json ` etc.), and run `json.loads()` on it. Wrap this in a try/except — if parsing fails, you want a clear error, not a silent crash.

---

## Phase 4 — Formatting engine & database service

Validate what the AI returned and persist it to Supabase.

**Step 4.1 — Define the response schema** In `models/schemas.py`, use Pydantic to define a `LabInsight` model with the five expected fields. This gives you automatic validation — if the AI returns a malformed response, Pydantic will raise a clear validation error rather than letting garbage flow to the frontend.

**Step 4.2 — Build the database service** In `db_service.py`, initialize the Supabase client using your environment variables. Write two functions: `save_lab_result(raw_json)` which inserts into `lab_results` and returns the new row's UUID, and `save_ai_insight(lab_result_id, insight_data)` which inserts into `ai_insights` linked to that UUID.

**Step 4.3 — Wire it together in the upload route** Back in the upload router, call the AI service, validate through Pydantic, call the DB service to save both records, and return the validated insight object as the HTTP response. At this point, the full backend pipeline is complete and testable with a tool like Postman or `curl`.