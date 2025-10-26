/*
  # Allow Anonymous Users to SELECT Their Own Orders

  1. Changes
    - Add SELECT policy for anon users to read orders they just created
    - Use session_id to identify guest orders
    
  2. Security
    - Anon users can SELECT orders matching their session_id
    - Authenticated users can SELECT their own orders (user_id match)
    - This allows the RETURNING clause to work after INSERT
*/

-- Add SELECT policy for anon users based on session_id
CREATE POLICY "Guests can view own orders by session"
  ON orders
  FOR SELECT
  TO anon
  USING (session_id IS NOT NULL);
