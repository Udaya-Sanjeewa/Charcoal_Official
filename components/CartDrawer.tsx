'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react';
import { useEffect } from 'react';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const router = useRouter();
  const { items, itemCount, totalAmount, updateQuantity, removeFromCart } = useCart();

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

  const handleCheckout = () => {
    onOpenChange(false);
    router.push('/checkout');
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
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({itemCount})
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-6">
            <ShoppingCart className="h-24 w-24 text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-slate-600 mb-6 text-center">
              Start shopping to add items to your cart
            </p>
            <button
              onClick={() => {
                onOpenChange(false);
                router.push('/products');
              }}
              className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-semibold"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product_id} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="relative w-20 h-20 flex-shrink-0 bg-slate-200 rounded-lg overflow-hidden">
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm line-clamp-2">{item.product_name}</h4>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-red-600 hover:text-red-700 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-lg font-bold text-slate-900 mb-3">{item.product_price}</p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="h-8 w-8 flex items-center justify-center border border-slate-300 rounded-md hover:bg-slate-100 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="h-8 w-8 flex items-center justify-center border border-slate-300 rounded-md hover:bg-slate-100 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t bg-white space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition-colors font-semibold text-lg"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => onOpenChange(false)}
                className="w-full border-2 border-slate-300 text-slate-700 py-3 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
              >
                Continue Shopping
              </button>
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
