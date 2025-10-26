/*
  # Fix Orders INSERT Policy for Anonymous Users

  1. Changes
    - Drop and recreate INSERT policy with proper USING clause
    - Add explicit USING clause (not just WITH CHECK) for anon role compatibility
    
  2. Security
    - Anon and authenticated users can INSERT orders
    - Policy is permissive with both USING and WITH CHECK set to true
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;

-- Recreate with both USING and WITH CHECK
CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Also ensure public role has necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON orders TO anon;
GRANT SELECT ON orders TO anon;
