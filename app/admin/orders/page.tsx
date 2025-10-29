'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Loader2,
  Package,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  product_name: string;
  product_price: string;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  session_id: string | null;
  email: string;
  status: string;
  payment_status: string;
  payment_method: string;
  total_amount: number;
  shipping_address: {
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

export default function AdminOrdersPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchOrders();
    }
  }, [authLoading, isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status?: string, paymentStatus?: string) => {
    try {
      console.log('Updating order:', { orderId, status, paymentStatus });

      const token = localStorage.getItem('admin_token');
      if (!token) {
        toast.error('Not authenticated');
        return;
      }

      const payload: any = { orderId };
      if (status !== undefined) payload.status = status;
      if (paymentStatus !== undefined) payload.paymentStatus = paymentStatus;

      console.log('Sending payload:', payload);

      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update order');
      }

      toast.success('Order updated successfully');
      await fetchOrders();

      if (selectedOrder?.id === orderId) {
        const updatedOrder = orders.find(o => o.id === orderId);
        if (updatedOrder) {
          setSelectedOrder(updatedOrder);
        }
      }
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast.error(error.message || 'Failed to update order');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      shipped: 'bg-purple-100 text-purple-800 border-purple-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      pending: <Clock size={16} />,
      processing: <Package size={16} />,
      shipped: <Truck size={16} />,
      delivered: <CheckCircle size={16} />,
      cancelled: <XCircle size={16} />,
    };
    return icons[status] || <Clock size={16} />;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address.full_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-16 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Order Management
          </h1>
          <p className="text-slate-600">View and manage customer orders</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Total Orders</div>
            <div className="text-2xl font-bold text-slate-900">{orderStats.total}</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 shadow-sm border border-yellow-200">
            <div className="text-sm text-yellow-700 mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-900">{orderStats.pending}</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-200">
            <div className="text-sm text-blue-700 mb-1">Processing</div>
            <div className="text-2xl font-bold text-blue-900">{orderStats.processing}</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 shadow-sm border border-purple-200">
            <div className="text-sm text-purple-700 mb-1">Shipped</div>
            <div className="text-2xl font-bold text-purple-900">{orderStats.shipped}</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 shadow-sm border border-green-200">
            <div className="text-sm text-green-700 mb-1">Delivered</div>
            <div className="text-2xl font-bold text-green-900">{orderStats.delivered}</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 shadow-sm border border-red-200">
            <div className="text-sm text-red-700 mb-1">Cancelled</div>
            <div className="text-2xl font-bold text-red-900">{orderStats.cancelled}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by order number, email, or customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Package className="mx-auto text-slate-300 mb-2" size={48} />
                      <p className="text-slate-500">No orders found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{order.order_number}</div>
                        <div className="text-sm text-slate-500">{order.order_items.length} items</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{order.shipping_address.full_name}</div>
                        <div className="text-sm text-slate-500">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {format(new Date(order.created_at), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">Rs. {order.total_amount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                          order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                        }`}>
                          <DollarSign size={14} />
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailsModal(true);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Order Details</h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedOrder(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="text-slate-400" size={16} />
                        <span className="text-slate-600">Order Number:</span>
                        <span className="font-semibold text-slate-900">{selectedOrder.order_number}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="text-slate-400" size={16} />
                        <span className="text-slate-600">Date:</span>
                        <span className="text-slate-900">{format(new Date(selectedOrder.created_at), 'PPP')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="text-slate-400" size={16} />
                        <span className="text-slate-600">Total:</span>
                        <span className="font-semibold text-slate-900">Rs. {selectedOrder.total_amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="text-slate-400" size={16} />
                        <span className="text-slate-900">{selectedOrder.shipping_address.full_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="text-slate-400" size={16} />
                        <span className="text-slate-900">{selectedOrder.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="text-slate-400" size={16} />
                        <span className="text-slate-900">{selectedOrder.shipping_address.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <MapPin size={16} />
                      Shipping Address
                    </h3>
                    <div className="text-sm text-slate-900 leading-relaxed">
                      <p>{selectedOrder.shipping_address.full_name}</p>
                      <p>{selectedOrder.shipping_address.address_line1}</p>
                      {selectedOrder.shipping_address.address_line2 && (
                        <p>{selectedOrder.shipping_address.address_line2}</p>
                      )}
                      <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zip_code}</p>
                      <p>{selectedOrder.shipping_address.country}</p>
                    </div>
                  </div>

                  {selectedOrder.notes && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700 mb-2">Order Notes</h3>
                      <p className="text-sm text-slate-900 bg-slate-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Order Items</h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-700">Product</th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-slate-700">Quantity</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700">Price</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-slate-700">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedOrder.order_items.map((item) => {
                        const price = parseFloat(item.product_price.replace(/[^0-9.]/g, ''));
                        const itemTotal = price * item.quantity;
                        return (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-sm text-slate-900">{item.product_name}</td>
                            <td className="px-4 py-3 text-sm text-slate-600 text-center">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-slate-900 text-right">Rs. {price.toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-slate-900 text-right">Rs. {itemTotal.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <DollarSign size={16} />
                    Payment Verification
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, undefined, 'paid')}
                      disabled={selectedOrder.payment_status === 'paid'}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Mark as Paid
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, undefined, 'pending')}
                      disabled={selectedOrder.payment_status === 'pending'}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Clock size={16} />
                      Mark as Pending
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, undefined, 'failed')}
                      disabled={selectedOrder.payment_status === 'failed'}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <XCircle size={16} />
                      Mark as Failed
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Package size={16} />
                    Order Status
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'pending', undefined)}
                      disabled={selectedOrder.status === 'pending'}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Clock size={16} />
                      Pending
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'processing', undefined)}
                      disabled={selectedOrder.status === 'processing'}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Package size={16} />
                      Processing
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'shipped', undefined)}
                      disabled={selectedOrder.status === 'shipped'}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Truck size={16} />
                      Shipped
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'delivered', undefined)}
                      disabled={selectedOrder.status === 'delivered'}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Delivered
                    </button>
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled', undefined)}
                      disabled={selectedOrder.status === 'cancelled'}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <XCircle size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
