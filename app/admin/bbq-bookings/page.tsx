'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, LogOut, Loader2, Search, Filter, CheckCircle, XCircle, Clock, Package } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { format } from 'date-fns';

interface BBQBooking {
  id: string;
  booking_reference: string;
  package_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  rental_date: string;
  return_date: string;
  handover_date: string | null;
  returned_date: string | null;
  deposit_amount: number;
  total_amount: number;
  balance_amount: number;
  payment_status: string;
  booking_status: string;
  special_requests: string;
  notes: string;
  created_at: string;
  updated_at: string;
  bbq_rental_packages?: {
    name: string;
  };
}

export default function BBQBookingsAdmin() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const [bookings, setBookings] = useState<BBQBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BBQBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<BBQBooking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [editFormData, setEditFormData] = useState({
    handover_date: '',
    returned_date: '',
    deposit_amount: '',
    balance_amount: '',
    payment_status: '',
    booking_status: '',
    notes: ''
  });

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('admin_token');

      if (!token) {
        toast.error('No authentication token found. Please log in again.');
        router.push('/login');
        return;
      }

      const response = await fetch('/api/admin/bbq-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch bookings`);
      }

      const data = await response.json();

      if (!data.bookings) {
        throw new Error('No bookings data received from server');
      }

      setBookings(data.bookings);
      setFilteredBookings(data.bookings);

      if (data.bookings.length === 0) {
        toast.info('No bookings found yet');
      }
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast.error(error.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer_phone.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.booking_status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, statusFilter, bookings]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const openDetailModal = (booking: BBQBooking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const openEditModal = (booking: BBQBooking) => {
    setSelectedBooking(booking);
    setEditFormData({
      handover_date: booking.handover_date ? format(new Date(booking.handover_date), "yyyy-MM-dd'T'HH:mm") : '',
      returned_date: booking.returned_date ? format(new Date(booking.returned_date), "yyyy-MM-dd'T'HH:mm") : '',
      deposit_amount: booking.deposit_amount.toString(),
      balance_amount: booking.balance_amount.toString(),
      payment_status: booking.payment_status,
      booking_status: booking.booking_status,
      notes: booking.notes || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/bbq-bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: selectedBooking.id,
          ...editFormData
        })
      });

      if (!response.ok) throw new Error('Failed to update booking');

      toast.success('Booking updated successfully');
      setShowEditModal(false);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/bbq-bookings', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) throw new Error('Failed to delete booking');

      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-red-100 text-red-800',
      partial: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-800">BBQ Rental Bookings</h1>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by reference, name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rental Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{booking.booking_reference}</div>
                      <div className="text-xs text-slate-500">{format(new Date(booking.created_at), 'MMM dd, yyyy')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{booking.customer_name}</div>
                      <div className="text-sm text-slate-500">{booking.customer_email}</div>
                      <div className="text-sm text-slate-500">{booking.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{booking.bbq_rental_packages?.name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">{format(new Date(booking.rental_date), 'MMM dd, yyyy')}</div>
                      <div className="text-xs text-slate-500">to {format(new Date(booking.return_date), 'MMM dd, yyyy')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">LKR {booking.total_amount.toLocaleString()}</div>
                      <div className="text-xs text-slate-500">Deposit: {booking.deposit_amount.toLocaleString()}</div>
                      <div className="text-xs text-slate-500">Balance: {booking.balance_amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(booking.payment_status)}`}>
                        {booking.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.booking_status)}`}>
                        {booking.booking_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDetailModal(booking)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEditModal(booking)}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">No bookings found</p>
                <p className="text-sm text-slate-500 mt-1">Bookings will appear here when customers make reservations</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Booking Details</h2>
              <p className="text-sm text-slate-500 mt-1">{selectedBooking.booking_reference}</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Customer Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedBooking.customer_name}</p>
                    <p><span className="font-medium">Email:</span> {selectedBooking.customer_email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedBooking.customer_phone}</p>
                    <p><span className="font-medium">Address:</span> {selectedBooking.customer_address}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Booking Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Package:</span> {selectedBooking.bbq_rental_packages?.name || 'N/A'}</p>
                    <p><span className="font-medium">Rental Date:</span> {format(new Date(selectedBooking.rental_date), 'MMM dd, yyyy')}</p>
                    <p><span className="font-medium">Return Date:</span> {format(new Date(selectedBooking.return_date), 'MMM dd, yyyy')}</p>
                    <p><span className="font-medium">Status:</span> <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedBooking.booking_status)}`}>{selectedBooking.booking_status}</span></p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Payment Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Total Amount:</span> LKR {selectedBooking.total_amount.toLocaleString()}</p>
                    <p><span className="font-medium">Deposit:</span> LKR {selectedBooking.deposit_amount.toLocaleString()}</p>
                    <p><span className="font-medium">Balance:</span> LKR {selectedBooking.balance_amount.toLocaleString()}</p>
                    <p><span className="font-medium">Payment Status:</span> <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(selectedBooking.payment_status)}`}>{selectedBooking.payment_status}</span></p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Handover Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Handover:</span> {selectedBooking.handover_date ? format(new Date(selectedBooking.handover_date), 'MMM dd, yyyy HH:mm') : 'Not yet'}</p>
                    <p><span className="font-medium">Returned:</span> {selectedBooking.returned_date ? format(new Date(selectedBooking.returned_date), 'MMM dd, yyyy HH:mm') : 'Not yet'}</p>
                  </div>
                </div>
              </div>

              {selectedBooking.special_requests && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Special Requests</h3>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{selectedBooking.special_requests}</p>
                </div>
              )}

              {selectedBooking.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Admin Notes</h3>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>Close</Button>
              <Button onClick={() => { setShowDetailModal(false); openEditModal(selectedBooking); }}>Edit Booking</Button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Edit Booking</h2>
              <p className="text-sm text-slate-500 mt-1">{selectedBooking.booking_reference}</p>
            </div>

            <form onSubmit={handleUpdateBooking} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Handover Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={editFormData.handover_date}
                    onChange={(e) => setEditFormData({ ...editFormData, handover_date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Return Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={editFormData.returned_date}
                    onChange={(e) => setEditFormData({ ...editFormData, returned_date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Deposit Amount (LKR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.deposit_amount}
                    onChange={(e) => setEditFormData({ ...editFormData, deposit_amount: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Balance Amount (LKR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.balance_amount}
                    onChange={(e) => setEditFormData({ ...editFormData, balance_amount: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={editFormData.payment_status}
                    onChange={(e) => setEditFormData({ ...editFormData, payment_status: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Booking Status
                  </label>
                  <select
                    value={editFormData.booking_status}
                    onChange={(e) => setEditFormData({ ...editFormData, booking_status: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Add any internal notes about this booking..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Booking'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
