'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const router = useRouter();
  const { items, itemCount, totalAmount, updateQuantity, removeFromCart } = useCart();

  const handleCheckout = () => {
    onOpenChange(false);
    router.push('/checkout');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-24 w-24 text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-slate-600 mb-6 text-center">
              Start shopping to add items to your cart
            </p>
            <Button onClick={() => {
              onOpenChange(false);
              router.push('/products');
            }}>
              Browse Products
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
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
            </ScrollArea>

            <SheetFooter className="flex-col space-y-4 mt-4">
              <div className="w-full space-y-2 border-t pt-4">
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

              <Button onClick={handleCheckout} size="lg" className="w-full">
                Proceed to Checkout
              </Button>

              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Continue Shopping
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
