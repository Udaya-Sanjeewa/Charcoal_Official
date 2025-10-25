/*
  # Update Cart Table for Guest Users

  1. Changes
    - Add session_id column to cart_items table
    - Add index on session_id for fast guest cart lookups
    - Update RLS policies to support guest users

  2. Security
    - Authenticated users: cart linked by user_id
    - Guest users: cart linked by session_id
    - Public read access for guest carts
*/

-- Add session_id column for guest cart tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cart_items' AND column_name = 'session_id'
  ) THEN
    ALTER TABLE cart_items ADD COLUMN session_id text;
  END IF;
END $$;

-- Add index for session_id
CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);

-- Drop existing policies
DROP POLICY IF EXISTS "Public can read guest cart" ON cart_items;
DROP POLICY IF EXISTS "Public can insert to guest cart" ON cart_items;
DROP POLICY IF EXISTS "Public can update guest cart" ON cart_items;
DROP POLICY IF EXISTS "Public can delete from guest cart" ON cart_items;
DROP POLICY IF EXISTS "Authenticated users can read own cart" ON cart_items;
DROP POLICY IF EXISTS "Authenticated users can insert to cart" ON cart_items;
DROP POLICY IF EXISTS "Authenticated users can update cart" ON cart_items;
DROP POLICY IF EXISTS "Authenticated users can delete from cart" ON cart_items;

-- Policy: Authenticated users can read their own cart items
CREATE POLICY "Authenticated users can read own cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Authenticated users can insert their own cart items
CREATE POLICY "Authenticated users can insert to cart"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Authenticated users can update their own cart items
CREATE POLICY "Authenticated users can update cart"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Authenticated users can delete their own cart items
CREATE POLICY "Authenticated users can delete from cart"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Public access for guest carts (read)
CREATE POLICY "Public can read guest cart"
  ON cart_items FOR SELECT
  USING (true);

-- Policy: Public access for guest carts (insert)
CREATE POLICY "Public can insert to guest cart"
  ON cart_items FOR INSERT
  WITH CHECK (user_id IS NULL AND session_id IS NOT NULL);

-- Policy: Public access for guest carts (update)
CREATE POLICY "Public can update guest cart"
  ON cart_items FOR UPDATE
  USING (user_id IS NULL AND session_id IS NOT NULL)
  WITH CHECK (user_id IS NULL AND session_id IS NOT NULL);

-- Policy: Public access for guest carts (delete)
CREATE POLICY "Public can delete from guest cart"
  ON cart_items FOR DELETE
  USING (user_id IS NULL AND session_id IS NOT NULL);
