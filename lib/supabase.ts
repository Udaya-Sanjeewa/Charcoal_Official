import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: 'firewood' | 'charcoal' | 'bundles' | 'rentals';
  price: string;
  unit: string;
  description: string;
  long_description?: string;
  image: string;
  images?: string[];
  features: string[];
  specifications?: Record<string, string>;
  benefits?: string[];
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};
