-- ==========================================
-- STEP 4: Update Models Table (Price → Phone)
-- Run this to replace price with phone_number
-- ==========================================
-- URL: https://supabase.com/dashboard/project/sjmmvksyesuidgxkumbr/sql/new
-- ==========================================

-- Add phone_number column (if not exists)
ALTER TABLE models ADD COLUMN IF NOT EXISTS phone_number TEXT NOT NULL DEFAULT '+919876543210';

-- Remove price column (if it exists)
ALTER TABLE models DROP COLUMN IF EXISTS price;

-- Update existing models with a default phone (optional)
-- UPDATE models SET phone_number = '+919876543210' WHERE phone_number = '';

-- ==========================================
-- ✅ Schema updated!
-- ==========================================
