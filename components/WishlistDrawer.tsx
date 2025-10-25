'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Heart, ShoppingCart, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';

interface WishlistDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WishlistDrawer({ open, onOpenChange }: WishlistDrawerProps) {
  const router = useRouter();
  const { items, itemCount, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [movingToCart, setMovingToCart] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleMoveToCart = async (item: any) => {
    setMovingToCart(item.product_id);
    try {
      await addToCart(item.product_id, item.product_name, item.product_price, item.product_image);
      await removeFromWishlist(item.product_id);
      alert(`${item.product_name} moved to cart!`);
    } catch (error) {
      console.error('Error moving to cart:', error);
    } finally {
      setMovingToCart(null);
    }
  };

  const handleClearWishlist = () => {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      items.forEach(item => removeFromWishlist(item.product_id));
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full sm:max-w-lg bg-white z-50 shadow-2xl flex flex-col animate-slide-in">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            <h2 className="text-xl font-bold">Wishlist</h2>
            {itemCount > 0 && (
              <span className="bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-1 rounded-full">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-6">
            <Heart className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-6 text-center">
              Save products you're interested in to view them later
            </p>
            <button
              onClick={() => {
                onOpenChange(false);
                router.push('/products');
              }}
              className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product_id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product_slug}`}
                        onClick={() => onOpenChange(false)}
                        className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2 block"
                      >
                        {item.product_name}
                      </Link>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-blue-600">
                          {item.product_price}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            disabled={movingToCart === item.product_id}
                            className="h-8 px-3 text-xs border border-slate-300 rounded-md hover:bg-slate-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                          >
                            <ShoppingCart className="h-3 w-3" />
                            {movingToCart === item.product_id ? 'Moving...' : 'Add to Cart'}
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.product_id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors flex items-center justify-center"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t bg-white space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={handleClearWishlist}
                  className="flex-1 border-2 border-slate-300 text-slate-700 py-3 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                >
                  Clear Wishlist
                </button>
                <button
                  onClick={() => onOpenChange(false)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg transition-colors font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
