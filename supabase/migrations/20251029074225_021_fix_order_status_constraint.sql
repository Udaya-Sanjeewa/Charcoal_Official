/*
  # Fix Order Status Constraint

  ## Overview
  Update the orders status check constraint to include 'shipped' and 'delivered'
  instead of just 'completed'. This allows for more granular order tracking.

  ## Changes
  1. Drop the existing status check constraint
  2. Create a new constraint with all required status values:
     - pending
     - processing
     - shipped
     - delivered
     - cancelled

  ## Security
  - No changes to RLS policies
  - Only modifying the allowed status values
*/

-- Drop the old constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add the new constraint with all required statuses
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'));
