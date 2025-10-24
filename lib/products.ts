import { supabase } from './supabase';
import { getSupabaseClient } from './supabase-client';
import { type Product } from './types';

function getAuthenticatedClient() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  return token ? getSupabaseClient(token) : supabase;
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const client = getAuthenticatedClient();
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getActiveProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<boolean> {
  try {
    const client = getAuthenticatedClient();
    const { error } = await client
      .from('products')
      .update(product)
      .eq('id', id);

    if (error) {
      console.error('Update error:', error);
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const client = getAuthenticatedClient();
    const { error } = await client
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}
