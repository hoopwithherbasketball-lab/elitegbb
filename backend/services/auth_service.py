import secrets, hashlib, logging
from datetime import datetime, timezone, timedelta
logger = logging.getLogger(__name__)

def _db():
    try:
        from database import supabase_client
        return supabase_client
    except Exception:
        return None

def generate_reset_token():
    return secrets.token_urlsafe(32)

def request_password_reset(email: str) -> dict:
    c = _db()
    if not c: return {"ok": False, "error": "DB unavailable"}
    user = c.table("users").select("id,email,name").eq("email",email).execute()
    if not user.data: return {"ok": False, "error": "User not found"}
    u = user.data[0]
    token = generate_reset_token()
    expires = (datetime.now(timezone.utc) + timedelta(hours=2)).isoformat()
    c.table("password_reset_tokens").insert({"user_id": u["id"], "token": token, "expires_at": expires, "used": False}).execute()
    try:
        from email_provider import send_email
        reset_url = f"https://elitegbb.app/reset-password?token={token}"
        send_email(to=email, subject="Reset your password", body=f"Click to reset: {reset_url}")
    except Exception as e:
        logger.warning(f"Reset email failed: {e}")
    return {"ok": True, "token": token}

def confirm_password_reset(token: str, new_password: str) -> dict:
    c = _db()
    if not c: return {"ok": False, "error": "DB unavailable"}
    now = datetime.now(timezone.utc).isoformat()
    row = c.table("password_reset_tokens").select("*").eq("token",token).eq("used",False).gte("expires_at",now).execute()
    if not row.data: return {"ok": False, "error": "Invalid or expired token"}
    r = row.data[0]
    hashed = hashlib.sha256(new_password.encode()).hexdigest()
    c.table("users").update({"password_hash": hashed}).eq("id",r["user_id"]).execute()
    c.table("password_reset_tokens").update({"used": True}).eq("token",token).execute()
    return {"ok": True}

def complete_onboarding(user_id: str) -> bool:
    c = _db()
    if not c: return False
    c.table("users").update({"onboarding_complete": True, "onboarding_completed_at": datetime.now(timezone.utc).isoformat()}).eq("id",user_id).execute()
    return True

def get_role_redirect(role: str) -> str:
    mapping = {"admin": "/admin", "coach": "/coach", "player": "/player", "parent": "/parent"}
    return mapping.get(role, "/dashboard")