import logging, threading, time
from datetime import datetime, timezone
logger = logging.getLogger(__name__)
_running = False
_thread = None

def _send_reminder(reminder):
    from services.reminder_service import update_reminder_status
    rid = reminder["id"]
    try:
        email = reminder.get("target_email", "")
        name = reminder.get("target_name", "")
        msg = reminder.get("message", "")
        rtype = reminder.get("reminder_type", "general")
        logger.info(f"Sending {rtype} reminder to {email}: {msg}")
        # Delivery: try email via email_provider if available
        try:
            from email_provider import send_email
            send_email(to=email, subject=f"Reminder: {rtype}", body=msg)
        except Exception as e:
            logger.warning(f"Email send failed: {e}")
        update_reminder_status(rid, "sent")
    except Exception as e:
        logger.error(f"Reminder {rid} failed: {e}")
        update_reminder_status(rid, "failed", str(e))

def _run_loop(interval=60):
    global _running
    logger.info("Reminder scheduler started")
    while _running:
        try:
            from services.reminder_service import get_pending_reminders
            pending = get_pending_reminders()
            for r in pending:
                _send_reminder(r)
            if pending:
                logger.info(f"Processed {len(pending)} reminders")
        except Exception as e:
            logger.error(f"Scheduler loop error: {e}")
        time.sleep(interval)
    logger.info("Reminder scheduler stopped")

def start_scheduler(interval=60):
    global _running, _thread
    if _running:
        return
    _running = True
    _thread = threading.Thread(target=_run_loop, args=(interval,), daemon=True)
    _thread.start()

def stop_scheduler():
    global _running
    _running = False