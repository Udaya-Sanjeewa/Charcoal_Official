/*
  # Fix Orders Table for Guest Checkout

  1. Changes
    - Alter user_id column to be nullable (allow NULL values)
    - Add session_id and email columns for guest orders
    - Add payment_method and payment_status columns
    
  2. Guest vs Authenticated Orders
    - Guest orders: user_id = NULL, session_id = 'guest_xxx', email = customer email
    - User orders: user_id = uuid, session_id = NULL, email = from auth.users

  3. Security
    - RLS policies will handle both cases
    - No security changes needed
*/

-- Alter user_id column to allow NULL values
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Add session_id for guest orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'session_id'
  ) THEN
    ALTER TABLE orders ADD COLUMN session_id text;
  END IF;
END $$;

-- Add email for guest orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'email'
  ) THEN
    ALTER TABLE orders ADD COLUMN email text NOT NULL DEFAULT '';
  END IF;
END $$;

-- Add payment method
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_method text DEFAULT 'cash_on_delivery';
  END IF;
END $$;

-- Add payment status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'payment_status'
  ) THEN
    ALTER TABLE orders ADD COLUMN payment_status text DEFAULT 'pending';
  END IF;
END $$;
