'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getSupabaseClient } from '@/lib/supabase-client';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, MapPin, Loader2, Plus } from 'lucide-react';

interface Address {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
}

export default function Checkout() {
  const router = useRouter();
  const { items, itemCount, totalAmount, clearCart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      router.push('/user-login');
      return;
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const token = localStorage.getItem('user_token');
    if (!token) return;

    try {
      const supabase = getSupabaseClient(token);
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .order('is_default', { ascending: false });

      if (error) throw error;

      setAddresses(data || []);
      const defaultAddress = data?.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAddressId) {
      alert('Please select a shipping address');
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const token = localStorage.getItem('user_token');
    if (!token) {
      router.push('/user-login');
      return;
    }

    setSubmitting(true);

    try {
      const supabase = getSupabaseClient(token);

      // Get user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        alert('Please log in to place an order');
        router.push('/user-login');
        return;
      }

      // Get selected address
      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
      if (!selectedAddress) {
        alert('Invalid address selected');
        return;
      }

      // Create order
      const orderNumber = `ORD-${Date.now()}`;
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            order_number: orderNumber,
            status: 'pending',
            total_amount: totalAmount,
            shipping_address: selectedAddress,
            notes: notes || null,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_price: item.product_price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      // Redirect to orders page
      alert(`Order ${orderNumber} placed successfully!`);
      router.push('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link href="/products">
            <button className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors">
              Browse Products
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const deliveryFee = totalAmount >= 100 ? 0 : 25;
  const tax = totalAmount * 0.08;
  const grandTotal = totalAmount + deliveryFee + tax;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Products
          </Link>
          <h1 className="text-4xl font-bold">Checkout</h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Shipping Address</h2>
                <Link href="/addresses">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Add New
                  </button>
                </Link>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-600 mb-4">No addresses saved</p>
                  <Link href="/addresses">
                    <button
                      type="button"
                      className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      Add Address
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => setSelectedAddressId(address.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedAddressId === address.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{address.label}</h3>
                            {address.is_default && (
                              <span className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium">{address.full_name}</p>
                          <p className="text-sm text-slate-600">{address.address_line1}</p>
                          {address.address_line2 && (
                            <p className="text-sm text-slate-600">{address.address_line2}</p>
                          )}
                          <p className="text-sm text-slate-600">
                            {address.city}, {address.state} {address.zip_code}
                          </p>
                          <p className="text-sm text-slate-600">Phone: {address.phone}</p>
                        </div>
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Notes */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Order Notes (Optional)</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for your order..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                rows={4}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product_id} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">{item.product_name}</h4>
                      <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                      <p className="font-semibold">{item.product_price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-3">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || addresses.length === 0}
                className="w-full mt-6 bg-slate-900 text-white py-4 rounded-lg hover:bg-slate-800 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>

              {deliveryFee > 0 && (
                <p className="text-xs text-center text-slate-500 mt-4">
                  Free delivery on orders over $100
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
