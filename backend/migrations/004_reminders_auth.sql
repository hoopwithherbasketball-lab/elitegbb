-- Migration: reminders + auth tokens (run in Supabase SQL editor)

CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_email TEXT NOT NULL,
  target_name TEXT,
  message TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT "pending" CHECK (status IN ("pending","sent","failed","cancelled")),
  retry_count INT NOT NULL DEFAULT 0,
  last_attempt TIMESTAMPTZ,
  error_message TEXT,
  metadata TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rem_status ON reminders(status);
CREATE INDEX IF NOT EXISTS idx_rem_target ON reminders(target_id);
CREATE INDEX IF NOT EXISTS idx_rem_sched ON reminders(scheduled_at);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_prt_token ON password_reset_tokens(token);

ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;