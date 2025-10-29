/*
  # Add Payment Status Constraint

  ## Overview
  Add a check constraint for payment_status to ensure only valid values are used.

  ## Changes
  1. Add constraint for payment_status field with allowed values:
     - pending
     - paid
     - failed
     - refunded

  ## Security
  - No changes to RLS policies
  - Only adding validation for payment status values
*/

-- Add constraint for payment_status
ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check 
  CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));
