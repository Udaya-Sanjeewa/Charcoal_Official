/*
  # Allow service read access to user profiles
  
  1. Changes
    - Add policy to allow anon role to read all user profiles
    - This enables admin API to fetch all users without service role key
  
  2. Security
    - Only allows read access, not write
    - Admin verification happens in the API endpoint
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow service read access to user profiles" ON user_profiles;

-- Allow anon role to read all user profiles (for admin API)
CREATE POLICY "Allow service read access to user profiles"
  ON user_profiles
  FOR SELECT
  TO anon
  USING (true);
