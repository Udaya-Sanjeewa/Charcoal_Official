/*
  # Create User Addresses Table

  ## Overview
  This migration creates a separate table for managing multiple user addresses,
  allowing users to save and manage shipping/billing addresses.

  ## New Tables
  
  ### `user_addresses` Table
  Stores multiple addresses for each user
  - `id` (uuid, primary key) - Unique address identifier
  - `user_id` (uuid, foreign key) - References auth.users.id
  - `label` (text) - Address label (e.g., "Home", "Work", "Office")
  - `full_name` (text) - Recipient name
  - `phone` (text) - Contact phone
  - `address_line1` (text) - Street address
  - `address_line2` (text, nullable) - Apartment, suite, etc.
  - `city` (text) - City
  - `state` (text) - State/Province
  - `zip_code` (text) - Postal code
  - `country` (text) - Country (default 'United States')
  - `is_default` (boolean) - Default address flag
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security (Row Level Security)
  - Users can view their own addresses
  - Users can add their own addresses
  - Users can update their own addresses
  - Users can delete their own addresses

  ## Indexes
  - user_id for fast lookup
  - user_id + is_default for default address queries

  ## Important Notes
  - Only one address can be default per user (enforced by trigger)
  - When user sets a new default, previous default is cleared
  - Default address used for checkout if available
*/

-- Create user_addresses table
CREATE TABLE IF NOT EXISTS user_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'Home',
  full_name text NOT NULL,
  phone text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  country text NOT NULL DEFAULT 'United States',
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_default ON user_addresses(user_id, is_default);

-- Enable RLS
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own addresses"
  ON user_addresses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
  ON user_addresses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON user_addresses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON user_addresses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to ensure only one default address per user
CREATE OR REPLACE FUNCTION enforce_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE user_addresses
    SET is_default = false
    WHERE user_id = NEW.user_id
    AND id != NEW.id
    AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce single default address
DROP TRIGGER IF EXISTS trigger_enforce_single_default ON user_addresses;
CREATE TRIGGER trigger_enforce_single_default
  BEFORE INSERT OR UPDATE ON user_addresses
  FOR EACH ROW
  WHEN (NEW.is_default = true)
  EXECUTE FUNCTION enforce_single_default_address();

-- Update updated_at trigger
CREATE TRIGGER update_user_addresses_updated_at
  BEFORE UPDATE ON user_addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
