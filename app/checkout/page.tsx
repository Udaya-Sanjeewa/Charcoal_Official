'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus, ShoppingCart, CreditCard, Truck, Shield, Phone, Mail } from 'lucide-react';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Premium Oak Firewood",
      price: 45,
      unit: "per cord",
      quantity: 1,
      image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ]);

  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderNotes, setOrderNotes] = useState('');

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryOption === 'delivery' ? (subtotal >= 100 ? 0 : 25) : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle order submission
    alert('Order submitted successfully! We will contact you shortly to confirm your order.');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-16">
      {/* Header */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 text-[#7BB661] hover:text-[#6B4E3D] transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Products
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#333333]">
            Checkout
          </h1>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Information */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-[#333333] mb-6">Customer Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-[#333333] mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={customerInfo.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7BB661] focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-[#333333] mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={customerInfo.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7BB661] focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#333333] mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7BB661] focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-[#333333] mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7BB661] focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-[#333333] mb-6">Delivery Information</h2>
                
                {/* Delivery Options */}
                <div className="mb-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      deliveryOption === 'delivery' ? 'border-[#7BB661] bg-[#7BB661]/10' : 'border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="delivery"
                        checked={deliveryOption === 'delivery'}
                        onChange={(e) => setDeliveryOption(e.target.value)}
                        className="sr-only"
                      />
                      <Truck className="mr-3 text-[#7BB661]" size={24} />
                      <div>
                        <div className="font-semibold text-[#333333]">Home Delivery</div>
                        <div className="text-sm text-gray-600">Free delivery on orders over $100</div>
                      </div>
                    </label>
                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      deliveryOption === 'pickup' ? 'border-[#7BB661] bg-[#7BB661]/10' : 'border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="pickup"
                        checked={deliveryOption === 'pickup'}
                        onChange={(e) => setDeliveryOption(e.target.value)}
                        className="sr-only"
                      />
                      <ShoppingCart className="mr-3 text-[#7BB661]" size={24} />
                      <div>
                        <div className="font-semibold text-[#333333]">Store Pickup</div>
                        <div className="text-sm text-gray-600">Pick up from our location</div>
                      </div>
                    </label>
                  </div>
                </div>

                {deliveryOption === 'delivery' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-semibold text-[#333333] mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7BB661] focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-semibold text-[#333333] mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={customerInfo.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7BB661] focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-semibold text-[#333333] mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        required
                        value={customerInfo.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7BB661] focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-semibold text-[#333333] mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        required
                        value={customerInfo.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7BB661] focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-[#333333] mb-6">Payment Method</h2>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'card' ? 'border-[#7BB661] bg-[#7BB661]/10' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <CreditCard className="mr-3 text-[#7BB661]" size={20} />
                    <span className="font-semibold text-[#333333]">Credit Card</span>
                  </label>
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'cash' ? 'border-[#7BB661] bg-[#7BB661]/10' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <span className="mr-3 text-[#7BB661] font-bold">$</span>
                    <span className="font-semibold text-[#333333]">Cash</span>
                  </label>
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'check' ? 'border-[#7BB661] bg-[#7BB661]/10' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="check"
                      checked={paymentMethod === 'check'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <span className="mr-3 text-[#7BB661] font-bold">✓</span>
                    <span className="font-semibold text-[#333333]">Check</span>
                  </label>
                </div>
                <p className="text-sm text-gray-600">
                  {paymentMethod === 'card' && 'We accept all major credit cards. Payment will be processed upon delivery.'}
                  {paymentMethod === 'cash' && 'Cash payment due upon delivery.'}
                  {paymentMethod === 'check' && 'Check payment due upon delivery.'}
                </p>
              </div>

              {/* Order Notes */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-[#333333] mb-6">Order Notes (Optional)</h2>
                <textarea
                  name="orderNotes"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7BB661] focus:border-transparent transition-all duration-300"
                  placeholder="Any special instructions for delivery or product preferences..."
                ></textarea>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-24">
              <h2 className="text-2xl font-bold text-[#333333] mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-[#FAF7F2] rounded-xl">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#333333]">{item.name}</h3>
                      <p className="text-sm text-gray-600">${item.price} {item.unit}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#7BB661]">${(item.price * item.quantity).toFixed(2)}</p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 text-sm hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-[#333333] border-t pt-3">
                  <span>Total:</span>
                  <span className="text-[#7BB661]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                form="checkout-form"
                onClick={handleSubmit}
                className="w-full btn-gradient text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 mt-6"
              >
                Place Order
              </button>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <Shield className="mx-auto mb-2 text-[#7BB661]" size={20} />
                  <div className="text-xs font-semibold text-[#333333]">Secure Payment</div>
                </div>
                <div className="text-center">
                  <Truck className="mx-auto mb-2 text-[#7BB661]" size={20} />
                  <div className="text-xs font-semibold text-[#333333]">Fast Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <section className="py-12 bg-[#333333] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help with Your Order?</h2>
          <p className="text-lg mb-6">Our team is here to assist you with any questions.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+15551234567"
              className="inline-flex items-center gap-2 bg-[#7BB661] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#6B4E3D] transition-all duration-300"
            >
              <Phone size={20} />
              Call Us
            </a>
            <a 
              href="mailto:info@ecofuelpro.com"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-[#333333] transition-all duration-300"
            >
              <Mail size={20} />
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}