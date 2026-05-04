import uuid, logging
from datetime import datetime, timezone
logger = logging.getLogger(__name__)

def _db():
    try:
        from database import supabase_client
        return supabase_client
    except Exception:
        return None

def create_reminder(reminder_type, target_id, target_email, target_name, message, scheduled_at, metadata=None):
    c = _db()
    if not c: return None
    row = {
        "id": str(uuid.uuid4()), "reminder_type": reminder_type,
        "target_id": target_id, "target_email": target_email,
        "target_name": target_name, "message": message,
        "scheduled_at": scheduled_at.isoformat(), "status": "pending",
        "retry_count": 0, "last_attempt": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    if metadata: row["metadata"] = str(metadata)
    r = c.table("reminders").insert(row).execute()
    return r.data[0] if r.data else None

def get_pending_reminders():
    c = _db()
    if not c: return []
    now = datetime.now(timezone.utc).isoformat()
    r = c.table("reminders").select("*").eq("status","pending").lte("scheduled_at",now).lt("retry_count",3).execute()
    return r.data or []

def update_reminder_status(rid, status, error=None):
    c = _db()
    if not c: return
    p = {"status": status, "last_attempt": datetime.now(timezone.utc).isoformat()}
    if status == "failed":
        cur = c.table("reminders").select("retry_count").eq("id",rid).execute()
        cnt = (cur.data[0]["retry_count"]+1) if cur.data else 1
        p["retry_count"] = cnt
        if cnt < 3: p["status"] = "pending"
    if error: p["error_message"] = error
    c.table("reminders").update(p).eq("id",rid).execute()

def list_for_target(target_id, limit=20):
    c = _db()
    if not c: return []
    r = c.table("reminders").select("*").eq("target_id",target_id).order("created_at",desc=True).limit(limit).execute()
    return r.data or []

def cancel_reminder(rid):
    c = _db()
    if not c: return False
    c.table("reminders").update({"status":"cancelled"}).eq("id",rid).execute()
    return True