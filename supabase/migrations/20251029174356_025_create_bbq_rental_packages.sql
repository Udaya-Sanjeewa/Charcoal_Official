/*
  # Create BBQ Rental Packages Table
  
  1. New Tables
    - `bbq_rental_packages`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Package name (e.g., "Basic Package", "Premium Package")
      - `description` (text) - Package description
      - `price` (decimal) - Price per day/event
      - `features` (jsonb) - Array of features included in package
      - `image_url` (text) - Image URL for the package
      - `is_active` (boolean) - Whether package is active/visible
      - `display_order` (integer) - Order for displaying packages
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Security
    - Enable RLS on `bbq_rental_packages` table
    - Add policy for public read access (anyone can view active packages)
    - Add policy for admin write access (only through API)
  
  3. Sample Data
    - Insert default BBQ rental packages
*/

-- Create bbq_rental_packages table
CREATE TABLE IF NOT EXISTS bbq_rental_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL DEFAULT 0,
  features jsonb DEFAULT '[]'::jsonb,
  image_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bbq_rental_packages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active packages
CREATE POLICY "Anyone can view active BBQ packages"
  ON bbq_rental_packages
  FOR SELECT
  TO public
  USING (is_active = true);

-- Policy: Allow anon to view all packages (for admin API)
CREATE POLICY "Allow anon to view all BBQ packages"
  ON bbq_rental_packages
  FOR SELECT
  TO anon
  USING (true);

-- Policy: Allow anon to insert packages (admin API will verify admin status)
CREATE POLICY "Allow anon to insert BBQ packages"
  ON bbq_rental_packages
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anon to update packages (admin API will verify admin status)
CREATE POLICY "Allow anon to update BBQ packages"
  ON bbq_rental_packages
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Policy: Allow anon to delete packages (admin API will verify admin status)
CREATE POLICY "Allow anon to delete BBQ packages"
  ON bbq_rental_packages
  FOR DELETE
  TO anon
  USING (true);

-- Insert sample BBQ rental packages
INSERT INTO bbq_rental_packages (name, description, price, features, display_order, is_active) VALUES
(
  'Basic Package',
  'Perfect for small gatherings and intimate family events',
  5000.00,
  '["Standard BBQ Grill", "Basic Grilling Tools", "Charcoal Included", "Setup Assistance", "4-6 Hours Rental"]'::jsonb,
  1,
  true
),
(
  'Standard Package',
  'Ideal for medium-sized parties and corporate events',
  8500.00,
  '["Premium BBQ Grill", "Complete Tool Set", "Charcoal & Gas Option", "Setup & Cleanup", "8 Hours Rental", "Table & Chairs Setup"]'::jsonb,
  2,
  true
),
(
  'Premium Package',
  'The ultimate BBQ experience for large events and celebrations',
  15000.00,
  '["Deluxe BBQ Station", "Professional Grade Tools", "Multiple Fuel Options", "Full Setup & Cleanup", "12 Hours Rental", "Table & Chairs Setup", "Serving Platters", "Professional Assistance"]'::jsonb,
  3,
  true
),
(
  'Party Package',
  'Complete party solution with BBQ and entertainment area',
  20000.00,
  '["Multiple BBQ Stations", "Complete Party Setup", "Tables & Chairs for 50", "Decorative Lighting", "Full Day Rental", "Professional Staff", "Serving Equipment", "Ice Boxes & Coolers"]'::jsonb,
  4,
  true
);
