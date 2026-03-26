# MedicTranslate Backend API Documentation

## Overview
This backend processes lab result image uploads, sends them to Anthropic for text analysis, stores raw input + insights in PostgreSQL, and returns validated structured insights. Includes user authentication with JWT sessions.

Base URL: `http://localhost:8000`

## Environment Variables
- `ANTHROPIC_API_KEY`
- `DATABASE_URL` (PostgreSQL connection string)
- `SECRET_KEY` (JWT signing key)
- `ALGORITHM` (JWT algorithm, default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` (JWT expiry, default: 30)

The project uses `.env` loaded by `python-dotenv`.

## Dependencies
- `fastapi`
- `uvicorn`
- `python-multipart`
- `anthropic`
- `python-dotenv`
- `pydantic`
- `psycopg2-binary`
- `python-jose[cryptography]`
- `passlib[bcrypt]`

## Endpoints

### Authentication Endpoints

#### POST /auth/signup
- Description: Create a new user account.
- Content-Type: `application/json`
- Body:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- Success Response: `200`
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 1800
  }
  ```
- Error Responses:
  - `400`: Email already registered
  - `422`: Invalid input data

#### POST /auth/login
- Description: Authenticate user and return JWT token.
- Content-Type: `application/json`
- Body:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword123"
  }
  ```
- Success Response: `200`
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 1800
  }
  ```
- Error Responses:
  - `401`: Invalid credentials

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
6. Persist raw result and insight in PostgreSQL via `services/db_service.py`.
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

### Authentication Models
- `UserCreate`: `{"email": str, "password": str}`
- `UserLogin`: `{"email": str, "password": str}`
- `Token`: `{"access_token": str, "token_type": str, "expires_in": int}`

## Database

### `users`
- id: UUID primary key
- email: VARCHAR(255) unique
- hashed_password: VARCHAR(255)
- created_at: TIMESTAMPTZ

### `lab_results`
- id: UUID primary key
- user_id: UUID fk users (nullable)
- raw_json: JSONB
- created_at: TIMESTAMPTZ

### `ai_insights`
- id: UUID primary key
- lab_result_id: UUID fk lab_results
- disclaimer: TEXT
- big_picture: TEXT
- good_results: JSONB
- areas_of_attention: JSONB
- next_steps: TEXT
- created_at: TIMESTAMPTZ

## Implementation Notes
- `services/ai_service.py::MEDICTRANSLATE_SYSTEM_PROMPT` ensures:
  - empathetic tone
  - no diagnosis
  - 8th-grade reading level
  - strict JSON output
- `services/ai_service.py::analyze_lab_image` handles Anthropic call and JSON parsing.
- `services/db_service.py` uses psycopg2 for PostgreSQL operations.
- `routers/auth.py` handles user registration/login with JWT tokens.
- `routers/upload.py` orchestrates file handling, service calls and response.

## Run locally

1. Activate virtual environment: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Linux/Mac)
2. `pip install -r requirements.txt`
3. Set up PostgreSQL database and run the table creation SQL
4. Update `.env` with DATABASE_URL and JWT settings
5. `uvicorn main:app --reload --host 0.0.0.0 --port 8000`
6. Test endpoints:
   - `POST /auth/signup` to create user
   - `POST /auth/login` to get JWT
   - `POST /analyze` with form field `file`
