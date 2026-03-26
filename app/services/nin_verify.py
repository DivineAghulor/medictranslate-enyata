import os
import base64
import requests


def get_nin_api_token() -> str:
    """Get OAuth token from NIN provider via client_credentials grant."""
    api_base = os.getenv("NIN_API_BASE_URL")
    client_id = os.getenv("NIN_CLIENT_ID")
    client_secret = os.getenv("NIN_CLIENT_SECRET")

    if not api_base or not client_id or not client_secret:
        raise EnvironmentError("NIN_API_BASE_URL, NIN_CLIENT_ID, and NIN_CLIENT_SECRET must be set")

    token_url = api_base.rstrip("/") + "/oauth/token"
    auth_header = base64.b64encode(f"{client_id}:{client_secret}".encode("utf-8")).decode("utf-8")

    headers = {
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    body = {
        "scope": "profile",
        "grant_type": "client_credentials",
    }

    response = requests.post(token_url, headers=headers, data=body, timeout=10)
    response.raise_for_status()

    token_json = response.json()
    access_token = token_json.get("access_token")
    if not access_token:
        raise ValueError("Failed to obtain access_token from NIN provider")

    return access_token


def verify_nin_identity(first_name: str, last_name: str, nin: str) -> bool:
    """Verify identity via NIN provider and return True/False."""
    if not (first_name and last_name and nin):
        return False

    api_base = os.getenv("NIN_API_BASE_URL")
    if not api_base:
        raise EnvironmentError("NIN_API_BASE_URL must be set")

    try:
        token = get_nin_api_token()
    except Exception:
        return False

    verify_url = api_base.rstrip("/") + "/verify/identity/nin"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    payload = {
        "firstName": first_name,
        "lastName": last_name,
        "nin": nin,
    }

    try:
        resp = requests.post(verify_url, headers=headers, json=payload, timeout=10)
        resp.raise_for_status()
        data = resp.json()

        # provider return format may include top-level verified flag
        verified = data.get("verified")
        if isinstance(verified, bool):
            return verified

        # first fallback: nested ninStatus in data
        if isinstance(data, dict):
            nin_status = data.get("data", {}).get("ninStatus", {})
            if isinstance(nin_status, dict):
                status = str(nin_status.get("status", "")).lower()
                if status == "verified":
                    return True

        # second fallback: top-level status field
        if isinstance(data, dict) and data.get("status"):
            status = str(data.get("status")).lower()
            if status in ["success", "verified", "true"]:
                return True

        return False
    except Exception:
        return False
