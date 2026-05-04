from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from services.reminder_service import (
    create_reminder, get_pending_reminders, update_reminder_status,
    list_for_target, cancel_reminder
)

router = APIRouter(prefix="/reminders", tags=["reminders"])

class ReminderCreate(BaseModel):
    reminder_type: str
    target_id: str
    target_email: str
    target_name: str
    message: str
    scheduled_at: datetime
    metadata: Optional[dict] = None

@router.post("/")
def create(body: ReminderCreate):
    r = create_reminder(body.reminder_type,body.target_id,body.target_email,body.target_name,body.message,body.scheduled_at,body.metadata)
    if not r: raise HTTPException(status_code=500,detail="Failed")
    return r

@router.get("/pending")
def pending(): return get_pending_reminders()

@router.get("/target/{target_id}")
def for_target(target_id: str, limit: int=20): return list_for_target(target_id,limit)

@router.patch("/{rid}/cancel")
def cancel(rid: str): cancel_reminder(rid); return {"ok":True}