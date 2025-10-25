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
        className="fixed inset-0 bg-black/50 z-[100] transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed right-0 top-0 h-full w-full sm:max-w-lg bg-white z-[101] shadow-2xl flex flex-col animate-slide-in overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6" />
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-bold">Wishlist</h2>
              {itemCount > 0 && (
                <span className="text-sm text-slate-500">
                  {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <X className="h-6 w-6" />
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
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product_id} className="flex gap-3 pb-3 border-b last:border-b-0">
                    <div className="relative w-20 h-20 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <Link
                        href={`/products/${item.product_slug}`}
                        onClick={() => onOpenChange(false)}
                        className="font-semibold text-base text-gray-900 hover:text-blue-600 line-clamp-1 mb-1"
                      >
                        {item.product_name}
                      </Link>

                      <p className="text-sm text-slate-500 mb-2">Galle</p>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-bold text-lg text-blue-600">
                          {item.product_price}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMoveToCart(item)}
                            disabled={movingToCart === item.product_id}
                            className="h-8 px-3 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50 font-medium"
                          >
                            <ShoppingCart className="h-3 w-3" />
                            {movingToCart === item.product_id ? 'Moving...' : 'Add to Cart'}
                          </button>
                          <button
                            onClick={() => removeFromWishlist(item.product_id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t bg-white space-y-3 flex-shrink-0">
              <div className="flex gap-3">
                <button
                  onClick={handleClearWishlist}
                  className="flex-1 border-2 border-slate-300 text-slate-700 py-2.5 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-base"
                >
                  Clear Wishlist
                </button>
                <button
                  onClick={() => onOpenChange(false)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg transition-colors font-semibold text-base"
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
