/*
  # Fix Orders Table RLS for Anonymous Users

  1. Changes
    - Ensure anon role can insert into orders table
    - Explicitly grant permissions to anon role
    
  2. Security
    - Anon users can INSERT orders (for guest checkout)
    - Anon users CANNOT SELECT, UPDATE, or DELETE
    - Only authenticated users can view/update their orders
*/

-- Grant INSERT permission to anon role
GRANT INSERT ON orders TO anon;
GRANT INSERT ON order_items TO anon;

-- Ensure the policy allows anon role
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;

CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
