/*
  # Create Wishlist Table

  1. New Tables
    - `wishlist`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable for guest users)
      - `session_id` (text, for guest wishlist tracking)
      - `product_id` (uuid, foreign key to products)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `wishlist` table
    - Add policies for authenticated and anonymous users
    - Authenticated users: wishlist items linked by user_id
    - Guest users: wishlist items linked by session_id

  3. Indexes
    - Add index on user_id for faster lookups
    - Add index on session_id for guest wishlist lookups
    - Add index on product_id for wishlist item queries

  4. Constraints
    - Unique constraint on (user_id, product_id) to prevent duplicates
    - Unique constraint on (session_id, product_id) for guests

  5. Notes
    - Supports both authenticated users and guest users
    - Guest wishlists are tracked by session_id
    - When user logs in, guest wishlist can be merged with user wishlist
*/

-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_session_id ON wishlist(session_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product_id ON wishlist(product_id);

-- Add unique constraints to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_wishlist_user_product 
  ON wishlist(user_id, product_id) 
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_wishlist_session_product 
  ON wishlist(session_id, product_id) 
  WHERE session_id IS NOT NULL AND user_id IS NULL;

-- Enable RLS
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read their own wishlist items
CREATE POLICY "Authenticated users can read own wishlist"
  ON wishlist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Authenticated users can insert their own wishlist items
CREATE POLICY "Authenticated users can insert to wishlist"
  ON wishlist FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Authenticated users can delete their own wishlist items
CREATE POLICY "Authenticated users can delete from wishlist"
  ON wishlist FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Public access for guest wishlists (read)
CREATE POLICY "Public can read guest wishlist"
  ON wishlist FOR SELECT
  USING (true);

-- Policy: Public access for guest wishlists (insert)
CREATE POLICY "Public can insert to guest wishlist"
  ON wishlist FOR INSERT
  WITH CHECK (user_id IS NULL AND session_id IS NOT NULL);

-- Policy: Public access for guest wishlists (delete)
CREATE POLICY "Public can delete from guest wishlist"
  ON wishlist FOR DELETE
  USING (user_id IS NULL AND session_id IS NOT NULL);
