from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.auth_service import request_password_reset, confirm_password_reset, complete_onboarding, get_role_redirect

router = APIRouter(prefix="/auth", tags=["auth"])

class ResetRequest(BaseModel):
    email: str

class ResetConfirm(BaseModel):
    token: str
    new_password: str

@router.post("/reset-request")
def reset_request(body: ResetRequest):
    result = request_password_reset(body.email)
    if not result["ok"]: raise HTTPException(400, result.get("error","Failed"))
    return {"ok": True, "message": "Reset link sent"}

@router.post("/reset-confirm")
def reset_confirm(body: ResetConfirm):
    result = confirm_password_reset(body.token, body.new_password)
    if not result["ok"]: raise HTTPException(400, result.get("error","Failed"))
    return {"ok": True}

@router.post("/onboarding-complete/{user_id}")
def onboarding_complete(user_id: str):
    complete_onboarding(user_id)
    return {"ok": True}

@router.get("/role-redirect/{role}")
def role_redirect(role: str):
    return {"redirect": get_role_redirect(role)}