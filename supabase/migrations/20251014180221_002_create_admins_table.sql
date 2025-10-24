/*
  # Create admins table for admin authentication

  1. New Tables
    - `admins`
      - `id` (uuid, primary key)
      - `email` (text, unique) - Admin email address
      - `password` (text) - Hashed password
      - `name` (text) - Admin full name
      - `is_active` (boolean) - Account status
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      
  2. Security
    - Enable RLS on `admins` table
    - No public access - admins table is only accessible via API routes
    
  3. Initial Data
    - Create default admin user with email: admin@example.com
    - Password: admin123 (plain text for now - will be hashed in production)
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- No public policies - admins table is accessed only through API routes with service role
-- This ensures maximum security for admin credentials

-- Insert default admin user
INSERT INTO admins (email, password, name, is_active)
VALUES ('admin@example.com', 'admin123', 'Default Admin', true)
ON CONFLICT (email) DO NOTHING;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
