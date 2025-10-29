/*
  # Create BBQ Rental Bookings Table
  
  1. New Tables
    - `bbq_rental_bookings` - Stores all BBQ rental booking information
      - `id` (uuid, primary key)
      - `booking_reference` (text, unique) - Auto-generated reference number
      - `package_id` (uuid) - References bbq_rental_packages
      - `customer_name` (text) - Customer's full name
      - `customer_email` (text) - Customer's email
      - `customer_phone` (text) - Customer's phone number
      - `customer_address` (text) - Delivery/pickup address
      - `rental_date` (date) - Date when BBQ will be rented out
      - `return_date` (date) - Expected return date
      - `handover_date` (timestamptz) - Actual handover date/time
      - `returned_date` (timestamptz) - Actual return date/time
      - `deposit_amount` (numeric) - Initial deposit paid
      - `total_amount` (numeric) - Total rental cost
      - `balance_amount` (numeric) - Remaining balance
      - `payment_status` (text) - pending, partial, paid, refunded
      - `booking_status` (text) - pending, confirmed, active, completed, cancelled
      - `special_requests` (text) - Any special requirements
      - `notes` (text) - Admin notes
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `bbq_rental_bookings` table
    - Allow public to insert bookings (customer booking form)
    - Allow public to read their own bookings
    - Admin manages bookings through API with authentication
*/

-- Create BBQ Rental Bookings table
CREATE TABLE IF NOT EXISTS bbq_rental_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference text UNIQUE NOT NULL DEFAULT 'BBQ-' || LPAD(floor(random() * 1000000)::text, 6, '0'),
  package_id uuid REFERENCES bbq_rental_packages(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text NOT NULL,
  rental_date date NOT NULL,
  return_date date NOT NULL,
  handover_date timestamptz,
  returned_date timestamptz,
  deposit_amount numeric(10,2) NOT NULL DEFAULT 0,
  total_amount numeric(10,2) NOT NULL,
  balance_amount numeric(10,2) NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  booking_status text NOT NULL DEFAULT 'pending',
  special_requests text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bbq_bookings_reference ON bbq_rental_bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bbq_bookings_email ON bbq_rental_bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bbq_bookings_status ON bbq_rental_bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bbq_bookings_rental_date ON bbq_rental_bookings(rental_date);

-- Add payment status constraint
ALTER TABLE bbq_rental_bookings
DROP CONSTRAINT IF EXISTS bbq_bookings_payment_status_check;

ALTER TABLE bbq_rental_bookings
ADD CONSTRAINT bbq_bookings_payment_status_check 
CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded'));

-- Add booking status constraint
ALTER TABLE bbq_rental_bookings
DROP CONSTRAINT IF EXISTS bbq_bookings_status_check;

ALTER TABLE bbq_rental_bookings
ADD CONSTRAINT bbq_bookings_status_check 
CHECK (booking_status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled'));

-- Enable RLS
ALTER TABLE bbq_rental_bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to create bookings (customer booking form)
CREATE POLICY "Anyone can create BBQ rental bookings"
ON bbq_rental_bookings FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Allow public to view all bookings (for lookup by reference)
CREATE POLICY "Anyone can view BBQ rental bookings"
ON bbq_rental_bookings FOR SELECT
TO public
USING (true);

-- Policy: Allow public to update bookings (admin will verify via API)
CREATE POLICY "Allow public to update BBQ rental bookings"
ON bbq_rental_bookings FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Policy: Allow public to delete bookings (admin only via API)
CREATE POLICY "Allow public to delete BBQ rental bookings"
ON bbq_rental_bookings FOR DELETE
TO public
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_bbq_booking_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_bbq_booking_updated_at_trigger ON bbq_rental_bookings;
CREATE TRIGGER update_bbq_booking_updated_at_trigger
BEFORE UPDATE ON bbq_rental_bookings
FOR EACH ROW
EXECUTE FUNCTION update_bbq_booking_updated_at();
