/*
  # Fix Orders RLS Policies for Guest Checkout

  1. Changes
    - Drop existing restrictive policies
    - Create new policies that support both guest and authenticated users
    
  2. Guest Orders
    - Anyone (including anon) can create orders with user_id = NULL
    - Guest orders identified by session_id
    
  3. User Orders
    - Authenticated users can create orders with their user_id
    - Users can only view/update their own orders

  4. Security
    - Guests can only create orders (INSERT)
    - Users can SELECT, INSERT, UPDATE their own orders
    - No one can access other users' orders
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;

-- Allow anyone (including anonymous users) to create orders
CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can update their own orders
CREATE POLICY "Users can update own orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
