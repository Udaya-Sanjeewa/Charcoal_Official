'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSupabaseClient } from '@/lib/supabase-client';

interface WishlistItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: string;
  product_image: string;
  product_slug: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string, productName: string, productPrice: string, productImage: string, productSlug: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string, productName: string, productPrice: string, productImage: string, productSlug: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshWishlist = async () => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseClient(token);
      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          id,
          product_id,
          products:product_id (
            name,
            price,
            image,
            slug
          )
        `);

      if (error) throw error;

      const wishlistItems: WishlistItem[] = (data || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.products?.name || 'Unknown',
        product_price: item.products?.price || '0',
        product_image: item.products?.image || '',
        product_slug: item.products?.slug || '',
      }));

      setItems(wishlistItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, []);

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.product_id === productId);
  };

  const addToWishlist = async (productId: string, productName: string, productPrice: string, productImage: string, productSlug: string) => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      alert('Please log in to add items to wishlist');
      return;
    }

    try {
      const supabase = getSupabaseClient(token);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        alert('Please log in to add items to wishlist');
        return;
      }

      // Check if already in wishlist
      if (isInWishlist(productId)) {
        return;
      }

      const { error } = await supabase
        .from('wishlist_items')
        .insert([
          {
            user_id: user.id,
            product_id: productId,
          },
        ]);

      if (error) throw error;

      await refreshWishlist();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add item to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const token = localStorage.getItem('user_token');
    if (!token) return;

    try {
      const supabase = getSupabaseClient(token);
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('product_id', productId);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const toggleWishlist = async (productId: string, productName: string, productPrice: string, productImage: string, productSlug: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId, productName, productPrice, productImage, productSlug);
    }
  };

  const itemCount = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount,
        loading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        refreshWishlist,
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
