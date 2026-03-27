import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise EnvironmentError("DATABASE_URL must be set")

def get_connection():
    return psycopg2.connect(DATABASE_URL)

def save_lab_result(raw_json: dict, user_id: str = None) -> str:
    conn = get_connection()
    cursor = conn.cursor()
    try:
        query = "INSERT INTO lab_results (raw_json, user_id) VALUES (%s, %s) RETURNING id"
        cursor.execute(query, (json.dumps(raw_json), user_id))
        result_id = cursor.fetchone()[0]
        conn.commit()
        return str(result_id)
    except Exception as e:
        conn.rollback()
        raise RuntimeError(f"DB error: {e}")
    finally:
        cursor.close()
        conn.close()

def save_ai_insight(lab_result_id: str, insight_data: dict) -> str:
    conn = get_connection()
    cursor = conn.cursor()
    try:
        query = """
            INSERT INTO ai_insights
            (lab_result_id, disclaimer, big_picture, good_results, areas_of_attention, next_steps)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
        """
        cursor.execute(query, (
            lab_result_id,
            insight_data.get("disclaimer"),
            insight_data.get("big_picture"),
            json.dumps(insight_data.get("good_results")),
            json.dumps(insight_data.get("areas_of_attention")),
            insight_data.get("next_steps"),
        ))
        insight_id = cursor.fetchone()[0]
        conn.commit()
        return str(insight_id)
    except Exception as e:
        conn.rollback()
        raise RuntimeError(f"DB error: {e}")
    finally:
        cursor.close()
        conn.close()

def get_user_by_email(email: str):
    conn = get_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        return cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

def create_user(email: str, hashed_password: str, first_name: str, last_name: str, nin_verified: bool = False) -> str:
    conn = get_connection()
    cursor = conn.cursor()
    try:
        query = "INSERT INTO users (email, hashed_password, first_name, last_name, nin_verified) VALUES (%s, %s, %s, %s, %s) RETURNING user_id"
        cursor.execute(query, (email, hashed_password, first_name, last_name, nin_verified))
        user_id = cursor.fetchone()[0]
        conn.commit()
        return str(user_id)
    except Exception as e:
        conn.rollback()
        raise RuntimeError(f"DB error: {e}")
    finally:
        cursor.close()
        conn.close()