'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSupabaseClient } from '@/lib/supabase-client';

interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: string;
  product_image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  loading: boolean;
  addToCart: (productId: string, productName: string, productPrice: string, productImage: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseClient(token);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          products:product_id (
            name,
            price,
            image
          )
        `);

      if (error) throw error;

      const cartItems: CartItem[] = (data || []).map((item: any) => ({
        id: item.id,
        product_id: item.product_id,
        product_name: item.products?.name || 'Unknown',
        product_price: item.products?.price || '0',
        product_image: item.products?.image || '',
        quantity: item.quantity,
      }));

      setItems(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productId: string, productName: string, productPrice: string, productImage: string, quantity: number = 1) => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      alert('Please log in to add items to cart');
      return;
    }

    try {
      const supabase = getSupabaseClient(token);

      const existingItem = items.find(item => item.product_id === productId);

      if (existingItem) {
        await updateQuantity(productId, existingItem.quantity + quantity);
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert([
            {
              product_id: productId,
              quantity,
            },
          ]);

        if (error) throw error;

        setItems(prev => [...prev, {
          id: '',
          product_id: productId,
          product_name: productName,
          product_price: productPrice,
          product_image: productImage,
          quantity,
        }]);

        await refreshCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const token = localStorage.getItem('user_token');
    if (!token) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      const supabase = getSupabaseClient(token);
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('product_id', productId);

      if (error) throw error;

      setItems(prev =>
        prev.map(item =>
          item.product_id === productId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    const token = localStorage.getItem('user_token');
    if (!token) return;

    try {
      const supabase = getSupabaseClient(token);
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('product_id', productId);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem('user_token');
    if (!token) return;

    try {
      const supabase = getSupabaseClient(token);
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalAmount = items.reduce((sum, item) => {
    const price = parseFloat(item.product_price.replace(/[^0-9.]/g, ''));
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalAmount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
