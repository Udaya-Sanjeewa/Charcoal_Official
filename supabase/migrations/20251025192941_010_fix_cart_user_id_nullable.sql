/*
  # Fix Cart Items User ID Constraint

  1. Changes
    - Alter user_id column to be nullable (allow NULL values)
    - This allows guest users to add items to cart with session_id only
    - Authenticated users will still have user_id populated

  2. Security
    - RLS policies already handle both cases (user_id vs session_id)
    - No security changes needed

  3. Notes
    - Guest carts: user_id = NULL, session_id = 'guest_xxx'
    - User carts: user_id = uuid, session_id = NULL
*/

-- Alter user_id column to allow NULL values
ALTER TABLE cart_items ALTER COLUMN user_id DROP NOT NULL;
