import os
from supabase import create_client, Client
from postgrest.exceptions import APIError


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise EnvironmentError("SUPABASE_URL and SUPABASE_KEY must be configured in environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def save_lab_result(raw_json: dict) -> str:
    """Insert raw lab result and return inserted row id."""
    try:
        # Remove .select() and .single()
        response = supabase.table("lab_results").insert({"raw_json": raw_json}).execute()
        
        # .data is a list of inserted rows. We want the first one.
        if response.data:
            return response.data[0]["id"]
        raise RuntimeError("No data returned after saving lab_result")
        
    except APIError as e:
        raise RuntimeError(f"Database error saving lab_result: {e.message}")
    except Exception as e:
        raise RuntimeError(f"Unexpected error saving lab_result: {str(e)}")


def save_ai_insight(lab_result_id: str, insight_data: dict) -> str:
    """Insert AI insight with reference to lab_result_id."""
    payload = {
        "lab_result_id": lab_result_id,
        "disclaimer": insight_data.get("disclaimer"),
        "big_picture": insight_data.get("big_picture"),
        "good_results": insight_data.get("good_results"),
        "areas_of_attention": insight_data.get("areas_of_attention"),
        "next_steps": insight_data.get("next_steps"),
    }
    
    try:
        # Simplified chain
        response = supabase.table("ai_insights").insert(payload).execute()
        
        if response.data:
            return response.data[0]["id"]
        raise RuntimeError("No data returned after saving ai_insight")
        
    except APIError as e:
        raise RuntimeError(f"Database error saving ai_insight: {e.message}")
    except Exception as e:
        raise RuntimeError(f"Unexpected error saving ai_insight: {str(e)}")