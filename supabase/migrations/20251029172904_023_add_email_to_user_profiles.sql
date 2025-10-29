/*
  # Add email to user_profiles table
  
  1. Changes
    - Add `email` column to `user_profiles` table
    - Make it unique and required
    - Update existing profiles with email from auth.users
  
  2. Notes
    - This allows admins to view user emails without service role access
    - Email will be synced from auth.users when profiles are created/updated
*/

-- Add email column to user_profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'email'
    AND table_schema = 'public'
  ) THEN
    ALTER TABLE user_profiles 
    ADD COLUMN email text;
    
    -- Add unique constraint
    ALTER TABLE user_profiles 
    ADD CONSTRAINT user_profiles_email_key UNIQUE (email);
  END IF;
END $$;

-- Update existing profiles with emails from auth.users
UPDATE user_profiles up
SET email = au.email
FROM auth.users au
WHERE up.id = au.id AND up.email IS NULL;

-- Make email required for future records
ALTER TABLE user_profiles 
ALTER COLUMN email SET NOT NULL;
