/*
  # Fix Order Items Table RLS for Anonymous Users

  1. Changes
    - Ensure anon role can insert into order_items table
    - Explicitly allow both anon and authenticated roles
    
  2. Security
    - Anon users can INSERT order items (for guest checkout)
    - Anon users CANNOT SELECT, UPDATE, or DELETE
    - Only authenticated users can view their order items
*/

-- Ensure the policy allows anon role
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;

CREATE POLICY "Anyone can create order items"
  ON order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
