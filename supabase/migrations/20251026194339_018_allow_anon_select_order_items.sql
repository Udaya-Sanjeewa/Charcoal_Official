/*
  # Allow Anonymous Users to SELECT Order Items

  1. Changes
    - Add SELECT policy for anon users to read order items
    - Allows RETURNING clause to work after INSERT
    
  2. Security
    - Anon users can SELECT all order_items (needed for RETURNING)
    - More restrictive policies can be added later if needed
    - Authenticated users maintain their existing SELECT policy
*/

-- Grant SELECT to anon role
GRANT SELECT ON order_items TO anon;

-- Add SELECT policy for anon users
CREATE POLICY "Guests can view order items"
  ON order_items
  FOR SELECT
  TO anon
  USING (true);
