'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase-client';
import { useCart } from '@/contexts/CartContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  User,
  Package,
  ShoppingCart,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2,
  ArrowRight
} from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
}

interface UserProfile {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { items, itemCount, totalAmount } = useCart();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      router.push('/user-login');
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('user_token');
    if (!token) return;

    try {
      const supabase = getSupabaseClient(token);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/user-login');
        return;
      }

      const [profileResult, ordersResult] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
      ]);

      if (profileResult.data) {
        setProfile({
          full_name: profileResult.data.full_name,
          email: user.email || '',
          phone: profileResult.data.phone,
          address: profileResult.data.address,
          city: profileResult.data.city,
          state: profileResult.data.state,
        });
      }

      if (ordersResult.data) {
        setRecentOrders(ordersResult.data);

        const allOrders = ordersResult.data;
        setStats({
          totalOrders: allOrders.length,
          pendingOrders: allOrders.filter(o => o.status === 'pending').length,
          completedOrders: allOrders.filter(o => o.status === 'completed').length,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-slate-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {profile?.full_name || 'User'}!</h1>
          <p className="text-slate-600">Here's an overview of your account</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Orders</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.totalOrders}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending Orders</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.pendingOrders}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Completed</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.completedOrders}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Cart Items</p>
                  <p className="text-3xl font-bold text-slate-900">{itemCount}</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link href="/orders">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-600 mb-4">No orders yet</p>
                    <Link href="/products">
                      <Button>Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div>
                          <p className="font-semibold">Order #{order.order_number}</p>
                          <p className="text-sm text-slate-600">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <p className="font-bold text-slate-900">${order.total_amount.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
                <CardDescription>
                  {itemCount === 0 ? 'Your cart is empty' : `${itemCount} item${itemCount !== 1 ? 's' : ''} in cart`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {itemCount > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b">
                      <span className="text-slate-600">Subtotal:</span>
                      <span className="text-2xl font-bold text-slate-900">${totalAmount.toFixed(2)}</span>
                    </div>
                    <Link href="/cart" className="block">
                      <Button className="w-full">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        View Cart
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <ShoppingCart className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-600 mb-4 text-sm">Start adding items to your cart</p>
                    <Link href="/products">
                      <Button className="w-full">Browse Products</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/products">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Browse Products
                  </Button>
                </Link>
                <Link href="/orders">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    My Orders
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 mt-0.5 opacity-80" />
                  <div>
                    <p className="text-sm opacity-80">Name</p>
                    <p className="font-semibold">{profile?.full_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 mt-0.5 opacity-80" />
                  <div>
                    <p className="text-sm opacity-80">Email</p>
                    <p className="font-semibold">{profile?.email}</p>
                  </div>
                </div>
                {profile?.phone && (
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 mt-0.5 opacity-80" />
                    <div>
                      <p className="text-sm opacity-80">Phone</p>
                      <p className="font-semibold">{profile.phone}</p>
                    </div>
                  </div>
                )}
                <Link href="/profile" className="block mt-4">
                  <Button variant="secondary" className="w-full">
                    Edit Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Need help with your order?</h2>
                <p className="opacity-90">Our customer support team is here to assist you</p>
              </div>
              <Link href="/contact">
                <Button size="lg" variant="secondary">
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
