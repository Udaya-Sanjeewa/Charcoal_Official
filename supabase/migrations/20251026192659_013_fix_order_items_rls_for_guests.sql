/*
  # Fix Order Items RLS Policies for Guest Checkout

  1. Changes
    - Drop existing restrictive policies
    - Create new policies that support both guest and authenticated users
    
  2. Guest Order Items
    - Anyone (including anon) can create order items
    - No restrictions on INSERT for order creation flow
    
  3. User Order Items
    - Authenticated users can view items from their orders
    
  4. Security
    - Anyone can INSERT (needed for checkout)
    - Only users can SELECT their own order items
*/

-- Drop existing policies
DROP POLICY IF EXISTS "System can create order items" ON order_items;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;

-- Allow anyone (including anonymous users) to create order items
CREATE POLICY "Anyone can create order items"
  ON order_items
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Users can view their own order items
CREATE POLICY "Users can view own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );
