import os
from datetime import datetime, timedelta
from typing import Optional
import jwt
import hashlib
from passlib.context import CryptContext
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from models.schemas import UserCreate, UserLogin, UserResponse, Token
from services.db_service import get_user_by_email, create_user
from services.nin_verify import verify_nin_identity

router = APIRouter()
security = HTTPBearer()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")

def hash_password(password: str):
    # Pre-hash with SHA-256 to handle passwords > 72 chars
    pw_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return pwd_context.hash(pw_hash)

def verify_password(plain_password: str, hashed_password: str):
    # Remember to pre-hash here too for verification!
    pw_hash = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
    return pwd_context.verify(pw_hash, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        if user_id is None or email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user_id": user_id, "email": email}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/auth/signup", response_model=Token)
async def signup(user: UserCreate):
    # Check if user exists
    existing = get_user_by_email(user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password and create user
    hashed = hash_password(user.password)
    nin_verified = verify_nin_identity(user.first_name, user.last_name, user.nin)

    # if not nin_verified:
    #     raise HTTPException(status_code=400, detail="Invalid NIN")

    user_id = create_user(user.email, hashed, user.first_name, user.last_name, nin_verified)
    
    # Create token
    access_token = create_access_token(data={"sub": user_id, "email": user.email})
    return {"access_token": access_token, "token_type": "bearer", "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60}

@router.post("/auth/login", response_model=Token)
async def login(user: UserLogin):
    # Get user
    db_user = get_user_by_email(user.email)
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    access_token = create_access_token(data={"sub": str(db_user["id"]), "email": db_user["email"]})
    return {"access_token": access_token, "token_type": "bearer", "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60}