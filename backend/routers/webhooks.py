from fastapi import APIRouter, HTTPException, Request
from datetime import datetime, timezone
import logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

def _payload(event: str, data: dict) -> dict:
    return {"event": event, "timestamp": datetime.now(timezone.utc).isoformat(), "data": data}

@router.post("/reminder-sent")
async def webhook_reminder_sent(request: Request):
    body = await request.json()
    payload = _payload("reminder.sent", body)
    logger.info(f"n8n trigger: reminder.sent {payload}")
    return payload

@router.post("/reminder-created")
async def webhook_reminder_created(request: Request):
    body = await request.json()
    payload = _payload("reminder.created", body)
    logger.info(f"n8n trigger: reminder.created {payload}")
    return payload

@router.post("/user-invited")
async def webhook_user_invited(request: Request):
    body = await request.json()
    payload = _payload("user.invited", body)
    logger.info(f"n8n trigger: user.invited {payload}")
    return payload

@router.post("/password-reset-completed")
async def webhook_password_reset(request: Request):
    body = await request.json()
    payload = _payload("auth.password_reset_completed", body)
    logger.info(f"n8n trigger: password_reset_completed {payload}")
    return payload

@router.post("/player-registered")
async def webhook_player_registered(request: Request):
    body = await request.json()
    payload = _payload("player.registered", body)
    logger.info(f"n8n trigger: player.registered {payload}")
    return payload

@router.post("/coach-registered")
async def webhook_coach_registered(request: Request):
    body = await request.json()
    payload = _payload("coach.registered", body)
    logger.info(f"n8n trigger: coach.registered {payload}")
    return payload

@router.get("/events")
def list_events():
    return {"supported_events": ["reminder.sent","reminder.created","user.invited","auth.password_reset_completed","player.registered","coach.registered"]}