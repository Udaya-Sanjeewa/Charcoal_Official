'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, itemCount, totalAmount, loading, updateQuantity, removeFromCart } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <ShoppingCart className="h-24 w-24 mx-auto text-slate-300" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-slate-600 mb-8">
              Start shopping to add items to your cart
            </p>
            <Link href="/products">
              <Button size="lg">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/products" className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
          <p className="text-slate-600 mt-2">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product_id} className="p-6">
                <div className="flex gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold mb-2">{item.product_name}</h3>
                    <p className="text-2xl font-bold text-slate-900 mb-4">{item.product_price}</p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-slate-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-2 hover:bg-slate-100 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="p-2 hover:bg-slate-100 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full mb-3"
                onClick={() => router.push('/checkout')}
              >
                Proceed to Checkout
              </Button>

              <Link href="/products">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
