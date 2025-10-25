/*
  # Remove Cart and Wishlist Features

  ## Overview
  This migration removes cart and wishlist functionality from the database.

  ## Changes Made
  1. Drop wishlist table and all associated policies
  2. Drop cart_items table and all associated policies
  3. Remove cart-related indexes
  4. Remove cart-related triggers

  ## Tables Dropped
  - `cart_items` - Shopping cart storage
  - `wishlist` - Wishlist items storage

  ## Important Notes
  - Orders and order_items tables are preserved for order history
  - User profiles are preserved
  - All RLS policies for dropped tables are automatically removed
  - All foreign key constraints are automatically handled by CASCADE
*/

-- Drop wishlist table if it exists
DROP TABLE IF EXISTS wishlist CASCADE;

-- Drop cart_items table if it exists
DROP TABLE IF EXISTS cart_items CASCADE;

-- Drop cart-related trigger if it exists
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
