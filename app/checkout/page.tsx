'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { ShoppingBag, CreditCard, Truck, Check } from 'lucide-react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

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

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    full_name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push('/products');
    }
  }, [items, orderComplete, router]);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserAddresses();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadUserAddresses = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });

    if (!error && data) {
      setAddresses(data);
      const defaultAddress = data.find(addr => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    }
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    setShowNewAddressForm(false);
  };

  const handleUseNewAddress = () => {
    setSelectedAddressId('');
    setShowNewAddressForm(true);
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  };

  const parsePrice = (priceString: string): number => {
    const cleaned = priceString.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let shippingAddress;

      if (user && selectedAddressId && !showNewAddressForm) {
        const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
        if (selectedAddress) {
          shippingAddress = {
            full_name: selectedAddress.full_name,
            phone: selectedAddress.phone,
            address_line1: selectedAddress.address_line1,
            address_line2: selectedAddress.address_line2 || '',
            city: selectedAddress.city,
            state: selectedAddress.state,
            zip_code: selectedAddress.zip_code,
            country: selectedAddress.country
          };
        }
      } else {
        shippingAddress = shippingInfo;
      }

      const orderNum = generateOrderNumber();
      const sessionId = user ? null : `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          session_id: sessionId,
          email: user?.email || shippingInfo.email,
          order_number: orderNum,
          status: 'pending',
          total_amount: total,
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          payment_status: 'pending',
          notes: notes || null
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      setOrderNumber(orderNum);
      setOrderComplete(true);

    } catch (error: any) {
      console.error('Error placing order:', error);
      const errorMessage = error?.message || 'Failed to place order. Please try again.';
      alert(`Error: ${errorMessage}\n\nPlease check the console for more details.`);
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-green-600" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-[#333333] mb-4">Order Placed Successfully!</h1>
            <p className="text-lg text-gray-600 mb-2">Thank you for your order</p>
            <p className="text-2xl font-bold text-[#EA580C] mb-8">Order #{orderNumber}</p>
            <div className="bg-[#FAF7F2] rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-[#333333] mb-3">What's Next?</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="text-[#7BB661] mt-1 flex-shrink-0" size={16} />
                  <span>You'll receive an order confirmation email shortly</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-[#7BB661] mt-1 flex-shrink-0" size={16} />
                  <span>We'll process your order and prepare it for delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="text-[#7BB661] mt-1 flex-shrink-0" size={16} />
                  <span>Track your order status in your account</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user && (
                <Button asChild className="bg-[#EA580C] hover:bg-[#D97706]">
                  <Link href="/orders">View My Orders</Link>
                </Button>
              )}
              <Button asChild variant="outline">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-20 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-[#333333] mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#7BB661] rounded-full flex items-center justify-center">
                    <Truck className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-[#333333]">Shipping Information</h2>
                </div>

                {user && addresses.length > 0 && !showNewAddressForm && (
                  <div className="space-y-3 mb-4">
                    <label className="font-semibold text-[#333333]">Select Delivery Address</label>
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        onClick={() => handleAddressSelect(address.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedAddressId === address.id
                            ? 'border-[#7BB661] bg-green-50'
                            : 'border-gray-200 hover:border-[#7BB661]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-[#333333]">{address.label}</span>
                              {address.is_default && (
                                <span className="text-xs bg-[#7BB661] text-white px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{address.full_name}</p>
                            <p className="text-sm text-gray-600">{address.address_line1}</p>
                            {address.address_line2 && (
                              <p className="text-sm text-gray-600">{address.address_line2}</p>
                            )}
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.zip_code}
                            </p>
                            <p className="text-sm text-gray-600">{address.phone}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleUseNewAddress}
                      className="text-[#7BB661] hover:text-[#6A9B51] font-semibold"
                    >
                      + Use a different address
                    </button>
                  </div>
                )}

                {(!user || addresses.length === 0 || showNewAddressForm) && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#333333] mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.full_name}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, full_name: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#7BB661] focus:outline-none"
                      />
                    </div>
                    {!user && (
                      <div>
                        <label className="block text-sm font-semibold text-[#333333] mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={shippingInfo.email}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#7BB661] focus:outline-none"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-semibold text-[#333333] mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#7BB661] focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#333333] mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.address_line1}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address_line1: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#7BB661] focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#333333] mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.address_line2}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address_line2: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#7BB661] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#333333] mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#7BB661] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#333333] mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#7BB661] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#333333] mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.zip_code}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, zip_code: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#7BB661] focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#7BB661] rounded-full flex items-center justify-center">
                    <CreditCard className="text-white" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-[#333333]">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  <div
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'border-[#7BB661] bg-green-50'
                        : 'border-gray-200 hover:border-[#7BB661]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'cash_on_delivery' ? 'border-[#7BB661]' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'cash_on_delivery' && (
                          <div className="w-3 h-3 bg-[#7BB661] rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[#333333]">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when your order arrives</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <label className="block text-sm font-semibold text-[#333333] mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for your order?"
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#7BB661] focus:outline-none resize-none"
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag className="text-[#EA580C]" size={24} />
                <h2 className="text-2xl font-bold text-[#333333]">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#333333] line-clamp-2">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#EA580C]">
                        {item.product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-200 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-[#7BB661] font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-gray-200">
                  <span>Total</span>
                  <span className="text-[#EA580C]">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-[#EA580C] hover:bg-[#D97706] text-white py-6 text-lg font-semibold"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
