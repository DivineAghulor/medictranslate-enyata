from typing import Any, List
from pydantic import BaseModel


class LabInsight(BaseModel):
    disclaimer: str
    big_picture: str
    good_results: List[Any]
    areas_of_attention: List[Any]
    next_steps: str

    class Config:
        schema_extra = {
            "example": {
                "disclaimer": "I am not a doctor...",
                "big_picture": "Overall your labs look...",
                "good_results": ["Cholesterol within range"],
                "areas_of_attention": ["Slightly elevated glucose"],
                "next_steps": "Discuss with your physician...",
            }
        }
