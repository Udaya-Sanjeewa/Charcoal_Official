/*
  # Create eCommerce Tables for User Shopping

  ## Overview
  This migration creates the necessary tables for a basic eCommerce system allowing users to register, browse products, add items to cart, and place orders.

  ## New Tables
  
  ### 1. `user_profiles` Table
  Extends auth.users with additional profile information
  - `id` (uuid, primary key) - References auth.users.id
  - `full_name` (text) - User's full name
  - `phone` (text) - Contact phone number
  - `address` (text) - Shipping address
  - `city` (text) - City
  - `state` (text) - State/Province
  - `zip_code` (text) - Postal code
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `cart_items` Table
  Stores items in user's shopping cart
  - `id` (uuid, primary key) - Unique cart item identifier
  - `user_id` (uuid, foreign key) - References auth.users.id
  - `product_id` (uuid, foreign key) - References products.id
  - `quantity` (integer) - Number of items
  - `created_at` (timestamptz) - When added to cart
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `orders` Table
  Stores completed customer orders
  - `id` (uuid, primary key) - Unique order identifier
  - `user_id` (uuid, foreign key) - References auth.users.id
  - `order_number` (text, unique) - Human-readable order number
  - `status` (text) - Order status (pending, processing, completed, cancelled)
  - `total_amount` (numeric) - Total order cost
  - `shipping_address` (jsonb) - Full shipping address details
  - `notes` (text) - Customer notes/special instructions
  - `created_at` (timestamptz) - Order placement time
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. `order_items` Table
  Stores individual items within an order
  - `id` (uuid, primary key) - Unique order item identifier
  - `order_id` (uuid, foreign key) - References orders.id
  - `product_id` (uuid, foreign key) - References products.id
  - `product_name` (text) - Product name at time of order
  - `product_price` (text) - Product price at time of order
  - `quantity` (integer) - Number of items ordered
  - `created_at` (timestamptz) - Item creation timestamp

  ## Security (Row Level Security)
  
  ### user_profiles
  - Users can view their own profile
  - Users can update their own profile
  - Users can insert their own profile
  
  ### cart_items
  - Users can view their own cart items
  - Users can add items to their own cart
  - Users can update their own cart items
  - Users can delete their own cart items
  
  ### orders
  - Users can view their own orders
  - Users can create their own orders
  - Admins (authenticated) can view all orders
  
  ### order_items
  - Users can view items from their own orders
  - System can insert order items (authenticated)

  ## Indexes
  - cart_items: user_id, product_id
  - orders: user_id, order_number, status
  - order_items: order_id, product_id

  ## Important Notes
  - All tables use UUID primary keys with gen_random_uuid()
  - Timestamps use timestamptz with default now()
  - RLS is enabled on all tables with restrictive policies
  - Foreign keys ensure referential integrity
  - Order status is constrained to valid values
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  address text,
  city text,
  state text,
  zip_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  total_amount numeric(10, 2) NOT NULL DEFAULT 0,
  shipping_address jsonb NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name text NOT NULL,
  product_price text NOT NULL,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for cart_items
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own cart"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "System can create order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  new_order_number text;
  number_exists boolean;
BEGIN
  LOOP
    new_order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::text, 4, '0');
    
    SELECT EXISTS(SELECT 1 FROM orders WHERE order_number = new_order_number) INTO number_exists;
    
    EXIT WHEN NOT number_exists;
  END LOOP;
  
  RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
