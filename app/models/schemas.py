from typing import Any, List, Optional
from pydantic import BaseModel, EmailStr


class LabInsight(BaseModel):
    disclaimer: str
    big_picture: str
    good_results: List[Any]
    areas_of_attention: List[Any]
    next_steps: str

    class Config:
        json_schema_extra = {
            "example": {
                "disclaimer": "I am not a doctor...",
                "big_picture": "Overall your labs look...",
                "good_results": ["Cholesterol within range"],
                "areas_of_attention": ["Slightly elevated glucose"],
                "next_steps": "Discuss with your physician...",
            }
        }


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    created_at: str


class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int


class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None
