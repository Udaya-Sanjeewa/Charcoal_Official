'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { getSupabaseClient } from '@/lib/supabase-client';
import { type Product } from '@/lib/types';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  product: Product;
  created_at: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = localStorage.getItem('guest_session_id');
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('guest_session_id', sessionId);
  }
  return sessionId;
}

function getAuthenticatedSupabaseClient() {
  const userToken = typeof window !== 'undefined' ? localStorage.getItem('user_token') : null;
  if (userToken) {
    return getSupabaseClient(userToken);
  }
  return supabase;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const client = getAuthenticatedSupabaseClient();
      const { data: { user } } = await client.auth.getUser();

      let query = client
        .from('wishlist')
        .select(`
          id,
          created_at,
          product_id,
          products (*)
        `);

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        const sessionId = getSessionId();
        query = query.eq('session_id', sessionId).is('user_id', null);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const wishlistItems: WishlistItem[] = (data || []).map((item: any) => ({
        id: item.id,
        product: item.products,
        created_at: item.created_at,
      }));

      setItems(wishlistItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        fetchWishlist();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.product.id === productId);
  };

  const addToWishlist = async (product: Product) => {
    try {
      if (isInWishlist(product.id)) {
        toast.info('Already in wishlist');
        return;
      }

      const client = getAuthenticatedSupabaseClient();
      const { data: { user } } = await client.auth.getUser();

      const wishlistItem: any = {
        product_id: product.id,
      };

      if (user) {
        wishlistItem.user_id = user.id;
      } else {
        wishlistItem.session_id = getSessionId();
      }

      const { error } = await client
        .from('wishlist')
        .insert([wishlistItem]);

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }

      toast.success('Added to wishlist!');
      await fetchWishlist();
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      if (error.code === '23505') {
        toast.info('Already in wishlist');
      } else {
        toast.error(error.message || 'Failed to add to wishlist');
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      const client = getAuthenticatedSupabaseClient();
      const { data: { user } } = await client.auth.getUser();

      let query = client
        .from('wishlist')
        .delete()
        .eq('product_id', productId);

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        const sessionId = getSessionId();
        query = query.eq('session_id', sessionId).is('user_id', null);
      }

      const { error } = await query;

      if (error) throw error;

      toast.success('Removed from wishlist');
      await fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const clearWishlist = async () => {
    try {
      const client = getAuthenticatedSupabaseClient();
      const { data: { user } } = await client.auth.getUser();

      let query = client.from('wishlist').delete();

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        const sessionId = getSessionId();
        query = query.eq('session_id', sessionId).is('user_id', null);
      }

      const { error } = await query;

      if (error) throw error;

      toast.success('Wishlist cleared');
      setItems([]);
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  const itemCount = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount,
        isLoading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
