/*
  # Create Wishlist Table

  ## Summary
  Creates a wishlist feature allowing users to save products for later purchase.

  ## New Tables
  1. `wishlist_items`
    - `id` (uuid, primary key) - Unique identifier
    - `user_id` (uuid, foreign key) - References auth.users
    - `product_id` (uuid, foreign key) - References products table
    - `created_at` (timestamptz) - When item was added to wishlist

  ## Security
  - Enable RLS on `wishlist_items` table
  - Policy: Users can view their own wishlist items
  - Policy: Users can add items to their own wishlist
  - Policy: Users can remove items from their own wishlist
  - Unique constraint: One product per user in wishlist (prevent duplicates)

  ## Notes
  - Users can quickly add/remove products from wishlist
  - Wishlist persists across sessions
  - Each product can only be added once per user
*/

-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own wishlist"
  ON wishlist_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own wishlist"
  ON wishlist_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own wishlist"
  ON wishlist_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product_id ON wishlist_items(product_id);
