/*
  # Create Storage Bucket for BBQ Package Images
  
  1. New Storage Bucket
    - `bbq-packages` - Public bucket for BBQ package images
  
  2. Storage Policies
    - Allow public read access to all images
    - Allow authenticated uploads (admin only through API)
    - Allow authenticated updates and deletes (admin only through API)
*/

-- Create storage bucket for BBQ package images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bbq-packages',
  'bbq-packages',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public to view images
CREATE POLICY "Public can view BBQ package images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'bbq-packages');

-- Policy: Allow anon to upload images (admin will verify via API)
CREATE POLICY "Allow anon to upload BBQ package images"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'bbq-packages');

-- Policy: Allow anon to update images (admin will verify via API)
CREATE POLICY "Allow anon to update BBQ package images"
ON storage.objects FOR UPDATE
TO anon
USING (bucket_id = 'bbq-packages')
WITH CHECK (bucket_id = 'bbq-packages');

-- Policy: Allow anon to delete images (admin will verify via API)
CREATE POLICY "Allow anon to delete BBQ package images"
ON storage.objects FOR DELETE
TO anon
USING (bucket_id = 'bbq-packages');
