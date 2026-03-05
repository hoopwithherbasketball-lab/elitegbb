-- ============================================================================
-- Supabase Schema Fix for Player Creation
-- ============================================================================
-- Run this in Supabase SQL Editor to fix the "failed to create player" error
--
-- Problem: The API expects certain columns but the database schema is minimal
-- Solution: Either (A) Add missing columns OR (B) Store all data in JSONB field
-- ============================================================================

-- OPTION A: Add missing columns to match API expectations
-- Run these ALTER TABLE statements if you want full column structure:

-- Check if columns exist before adding them
DO $$
BEGIN
    -- Core fields (likely already exist)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'player_key') THEN
        ALTER TABLE players ADD COLUMN player_key TEXT UNIQUE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'password_hash') THEN
        ALTER TABLE players ADD COLUMN password_hash TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'graduation_year') THEN
        ALTER TABLE players ADD COLUMN graduation_year INTEGER;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'school') THEN
        ALTER TABLE players ADD COLUMN school TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'state') THEN
        ALTER TABLE players ADD COLUMN state TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'height') THEN
        ALTER TABLE players ADD COLUMN height TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'weight') THEN
        ALTER TABLE players ADD COLUMN weight INTEGER;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'positions') THEN
        ALTER TABLE players ADD COLUMN positions TEXT[] DEFAULT '{}';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'gender') THEN
        ALTER TABLE players ADD COLUMN gender TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'ppg') THEN
        ALTER TABLE players ADD COLUMN ppg NUMERIC(5,2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'rpg') THEN
        ALTER TABLE players ADD COLUMN rpg NUMERIC(5,2);
    END IF;

    -- Extended stats (optional - not in basic schema)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'apg') THEN
        ALTER TABLE players ADD COLUMN apg NUMERIC(5,2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'spg') THEN
        ALTER TABLE players ADD COLUMN spg NUMERIC(5,2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'bpg') THEN
        ALTER TABLE players ADD COLUMN bpg NUMERIC(5,2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'fg_percent') THEN
        ALTER TABLE players ADD COLUMN fg_percent NUMERIC(5,2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'three_p_percent') THEN
        ALTER TABLE players ADD COLUMN three_p_percent NUMERIC(5,2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'ft_percent') THEN
        ALTER TABLE players ADD COLUMN ft_percent NUMERIC(5,2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'instagram') THEN
        ALTER TABLE players ADD COLUMN instagram TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'parent_name') THEN
        ALTER TABLE players ADD COLUMN parent_name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'parent_email') THEN
        ALTER TABLE players ADD COLUMN parent_email TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'parent_phone') THEN
        ALTER TABLE players ADD COLUMN parent_phone TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'is_verified') THEN
        ALTER TABLE players ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'payment_status') THEN
        ALTER TABLE players ADD COLUMN payment_status TEXT DEFAULT 'pending';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'package_selected') THEN
        ALTER TABLE players ADD COLUMN package_selected TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'is_free_tier') THEN
        ALTER TABLE players ADD COLUMN is_free_tier BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'coach_notes') THEN
        ALTER TABLE players ADD COLUMN coach_notes TEXT;
    END IF;
END $$;

-- ============================================================================
-- CRITICAL: Enable INSERT for anonymous users
-- ============================================================================

-- Enable RLS on players table
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous inserts" ON players;
DROP POLICY IF EXISTS "Allow public read of verified players" ON players;
DROP POLICY IF EXISTS "Allow all reads" ON players;

-- Create policy to allow anonymous inserts for player registration
CREATE POLICY "Allow anonymous inserts"
ON players FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy to allow public reads for verified players
CREATE POLICY "Allow public read of verified players"
ON players FOR SELECT
TO anon
USING (is_verified = true);

-- Create policy to allow authenticated users to read all players
DROP POLICY IF EXISTS "Allow authenticated reads" ON players;
CREATE POLICY "Allow authenticated reads"
ON players FOR SELECT
TO authenticated
USING (true);

-- ============================================================================
-- Alternative: Create minimal schema using JSONB column (simpler approach)
-- ============================================================================
-- If the above doesn't work, use this approach instead:

-- Add a single JSONB column to store all player data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'players' AND column_name = 'player_data') THEN
        ALTER TABLE players ADD COLUMN player_data JSONB DEFAULT '{}';
    END IF;
END $$;

-- Then the API can store everything in player_data and use minimal top-level columns
