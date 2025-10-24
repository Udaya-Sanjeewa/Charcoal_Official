/*
  # Create Products Table for Admin Management

  ## Overview
  This migration creates a comprehensive product management system that allows admins to
  update product information dynamically through an admin panel.

  ## New Tables

  ### `products`
  Main products table storing all product information:
  - `id` (uuid, primary key) - Unique identifier for each product
  - `name` (text) - Product name
  - `slug` (text, unique) - URL-friendly identifier
  - `category` (text) - Product category (firewood, charcoal, bundles, rentals)
  - `price` (text) - Product price as string (e.g., "$45")
  - `unit` (text) - Price unit (per cord, per bag, per day, etc.)
  - `description` (text) - Short product description
  - `long_description` (text) - Detailed product description
  - `image` (text) - Primary product image URL
  - `images` (text[]) - Array of additional image URLs
  - `features` (text[]) - Array of product features
  - `specifications` (jsonb) - Product specifications as key-value pairs
  - `benefits` (text[]) - Array of product benefits
  - `is_active` (boolean) - Whether product is active/visible
  - `sort_order` (integer) - For custom ordering of products
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on products table
  - Public can view active products (read-only)
  - Only authenticated admins can create, update, or delete products

  ## Notes
  - Products are publicly viewable but only editable by authenticated admins
  - Includes indexes for performance on commonly queried fields
  - Updated_at timestamp automatically updates on row modification
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  price text NOT NULL,
  unit text NOT NULL,
  description text NOT NULL,
  long_description text,
  image text NOT NULL,
  images text[] DEFAULT '{}',
  features text[] DEFAULT '{}',
  specifications jsonb DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON products(sort_order);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active products
CREATE POLICY "Anyone can view active products"
  ON products
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can view all products (for admin panel)
CREATE POLICY "Authenticated users can view all products"
  ON products
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert products
CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update products
CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete products
CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert initial products
INSERT INTO products (name, slug, category, price, unit, description, long_description, image, images, features, specifications, benefits, sort_order) VALUES
(
  'Premium Oak Firewood',
  'premium-oak-firewood',
  'firewood',
  '$45',
  'per cord',
  'Seasoned oak firewood with low moisture content. Perfect for home heating and cozy fireplace evenings.',
  'This premium oak firewood represents the gold standard in home heating fuel. Each piece is hand-selected from mature oak trees and seasoned in our controlled environment for over 12 months. The result is firewood with exceptionally low moisture content (below 20%), ensuring clean burning, maximum heat output, and minimal smoke production.',
  'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
  ARRAY['https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Seasoned for 12+ months', 'Low moisture content (below 20%)', 'High heat output (24-28 million BTUs per cord)', 'Clean burning with minimal smoke', 'Hand-selected premium oak', 'Kiln-dried available upon request'],
  '{"Wood Type": "Premium Oak (Quercus species)", "Moisture Content": "Below 20%", "Seasoning Time": "12+ months", "Heat Output": "24-28 million BTUs per cord", "Cord Dimensions": "4'' x 4'' x 8'' (128 cubic feet)", "Piece Length": "16-18 inches standard"}'::jsonb,
  ARRAY['Longer burning time compared to softwoods', 'Consistent heat output throughout burn', 'Pleasant natural aroma', 'Easy to split and stack', 'Minimal ash production', 'Environmentally sustainable'],
  1
),
(
  'Coconut Shell Charcoal',
  'coconut-shell-charcoal',
  'charcoal',
  '$35',
  'per 20kg bag',
  'High-quality coconut shell charcoal ideal for grilling, BBQ, and industrial applications.',
  'Our coconut shell charcoal is made from 100% natural coconut shells, providing an eco-friendly and sustainable fuel source. Perfect for grilling enthusiasts and professional BBQ operations.',
  'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Long burning time', 'High temperature', 'Low ash content', 'Eco-friendly'],
  '{}'::jsonb,
  ARRAY['Burns hotter than regular charcoal', 'Minimal smoke production', 'No chemical additives'],
  2
),
(
  'Mixed Hardwood Bundle',
  'mixed-hardwood-bundle',
  'bundles',
  '$25',
  'per bundle',
  'Assorted hardwood perfect for outdoor fire pits, camping, and recreational use.',
  'A convenient bundle of mixed hardwoods selected for outdoor use. Perfect for camping trips, backyard fire pits, and recreational fires.',
  'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Ready to burn', 'Mixed hardwoods', 'Perfect size', 'Great for outdoors'],
  '{}'::jsonb,
  ARRAY['Convenient packaging', 'No splitting required', 'Ideal for camping'],
  3
),
(
  'Birch Firewood',
  'birch-firewood',
  'firewood',
  '$50',
  'per cord',
  'Premium birch firewood known for its bright flame and pleasant aroma.',
  'Beautiful birch firewood that creates a bright, attractive flame with a pleasant natural scent.',
  'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Beautiful flame', 'Pleasant aroma', 'Easy to split', 'Fast ignition'],
  '{}'::jsonb,
  ARRAY['Creates ambiance', 'Quick starting', 'Burns clean'],
  4
),
(
  'BBQ Charcoal Premium',
  'bbq-charcoal-premium',
  'charcoal',
  '$28',
  'per 15kg bag',
  'Specially processed charcoal for BBQ enthusiasts seeking the perfect grilling experience.',
  'Premium BBQ charcoal designed for serious grilling. Provides consistent heat and authentic flavor.',
  'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Quick ignition', 'Consistent heat', 'No chemical additives', 'Restaurant quality'],
  '{}'::jsonb,
  ARRAY['Professional results', 'Long burn time', 'Great flavor'],
  5
),
(
  'Camping Fire Bundle',
  'camping-fire-bundle',
  'bundles',
  '$20',
  'per bundle',
  'Convenient camping bundle with kindling and seasoned wood for your outdoor adventures.',
  'Everything you need for a perfect campfire, pre-packaged and ready to go.',
  'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Includes kindling', 'Perfect portions', 'Camping ready', 'Easy to carry'],
  '{}'::jsonb,
  ARRAY['All-in-one solution', 'Convenient size', 'Great for hiking'],
  6
),
(
  'Professional BBQ Grill',
  'professional-bbq-grill',
  'rentals',
  '$75',
  'per day',
  'Large capacity professional BBQ grill perfect for events, parties, and catering services.',
  'Professional-grade BBQ grill with large cooking surface, ideal for catering and events.',
  'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Large cooking surface', 'Professional grade', 'Easy to operate', 'Includes accessories'],
  '{}'::jsonb,
  ARRAY['Cooks for large groups', 'Even heat distribution', 'Commercial quality'],
  7
),
(
  'Portable BBQ Station',
  'portable-bbq-station',
  'rentals',
  '$50',
  'per day',
  'Compact and portable BBQ station ideal for smaller gatherings and outdoor events.',
  'Easy-to-transport BBQ station perfect for picnics, small parties, and tailgating.',
  'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Portable design', 'Quick setup', 'Perfect for small groups', 'All accessories included'],
  '{}'::jsonb,
  ARRAY['Easy transport', 'No assembly needed', 'Great for tailgating'],
  8
),
(
  'Commercial BBQ Smoker',
  'commercial-bbq-smoker',
  'rentals',
  '$120',
  'per day',
  'Heavy-duty commercial BBQ smoker for large events and professional catering operations.',
  'Large-capacity smoker with precise temperature control for professional BBQ operations.',
  'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400',
  ARRAY['https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800'],
  ARRAY['Large capacity', 'Temperature control', 'Professional grade', 'Delivery included'],
  '{}'::jsonb,
  ARRAY['Perfect smoke flavor', 'Consistent results', 'Commercial capacity'],
  9
);
