'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Loader2,
  Star,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  LayoutDashboard,
  MessageSquare,
  Save,
  X,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  customer_name: string;
  customer_title: string;
  review_text: string;
  rating: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_title: '',
    review_text: '',
    rating: 5,
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    if (!authLoading) {
      fetchReviews();
    }
  }, [authLoading]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/reviews', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch reviews');

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('admin_token');
      const url = '/api/admin/reviews';
      const method = editingReview ? 'PATCH' : 'POST';
      const body = editingReview
        ? { ...formData, id: editingReview.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save review');

      toast.success(editingReview ? 'Review updated successfully' : 'Review created successfully');
      setShowModal(false);
      setEditingReview(null);
      resetForm();
      fetchReviews();
    } catch (error) {
      console.error('Error saving review:', error);
      toast.error('Failed to save review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/reviews?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Delete failed:', data);
        toast.error(data.error || 'Failed to delete review');
        return;
      }

      toast.success('Review deleted successfully');
      await fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
      await fetchReviews();
    }
  };

  const toggleActive = async (review: Review) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: review.id,
          is_active: !review.is_active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Toggle failed:', data);
        toast.error(data.error || 'Failed to update review');
        return;
      }

      toast.success(review.is_active ? 'Review hidden' : 'Review activated');
      await fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
      await fetchReviews();
    }
  };

  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setFormData({
      customer_name: review.customer_name,
      customer_title: review.customer_title,
      review_text: review.review_text,
      rating: review.rating,
      is_active: review.is_active,
      display_order: review.display_order,
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingReview(null);
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      customer_name: '',
      customer_title: '',
      review_text: '',
      rating: 5,
      is_active: true,
      display_order: 0,
    });
  };

  const updateDisplayOrder = async (reviewId: string, newOrder: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: reviewId,
          display_order: newOrder,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Update order failed:', data);
        toast.error(data.error || 'Failed to update order');
        return;
      }

      toast.success('Display order updated');
      await fetchReviews();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
      await fetchReviews();
    }
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Customer Reviews
            </h1>
            <p className="text-slate-600">Manage customer testimonials</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Plus size={20} />
              Add Review
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="text-blue-600" size={24} />
              <h2 className="text-xl font-semibold text-slate-800">All Reviews ({reviews.length})</h2>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto text-slate-300 mb-4" size={64} />
                <p className="text-slate-500 text-lg">No reviews yet</p>
                <button
                  onClick={openCreateModal}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Add your first review
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className={`border rounded-xl p-6 transition-all ${
                      review.is_active
                        ? 'bg-white border-slate-200'
                        : 'bg-slate-50 border-slate-300 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900 text-lg">
                                {review.customer_name}
                              </h3>
                              {!review.is_active && (
                                <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-full">
                                  Hidden
                                </span>
                              )}
                            </div>
                            {review.customer_title && (
                              <p className="text-sm text-slate-600">{review.customer_title}</p>
                            )}
                            <div className="flex items-center gap-1 mt-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-slate-300'
                                  }
                                />
                              ))}
                              <span className="text-sm text-slate-500 ml-1">
                                ({review.rating}/5)
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-slate-500">
                            Order: {review.display_order}
                          </div>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{review.review_text}</p>
                      </div>

                      <div className="flex lg:flex-col gap-2">
                        <button
                          onClick={() => updateDisplayOrder(review.id, review.display_order - 1)}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Move up"
                        >
                          <ArrowUp size={18} />
                        </button>
                        <button
                          onClick={() => updateDisplayOrder(review.id, review.display_order + 1)}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Move down"
                        >
                          <ArrowDown size={18} />
                        </button>
                        <button
                          onClick={() => toggleActive(review)}
                          className={`p-2 rounded-lg transition-colors ${
                            review.is_active
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-slate-400 hover:bg-slate-100'
                          }`}
                          title={review.is_active ? 'Hide review' : 'Show review'}
                        >
                          {review.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <button
                          onClick={() => openEditModal(review)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit review"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete review"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingReview ? 'Edit Review' : 'Add New Review'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingReview(null);
                  resetForm();
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Customer Title / Role
                </label>
                <input
                  type="text"
                  value={formData.customer_title}
                  onChange={(e) => setFormData({ ...formData, customer_title: e.target.value })}
                  placeholder="e.g., Event Planner, Restaurant Owner"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Review Text *
                </label>
                <textarea
                  value={formData.review_text}
                  onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Rating *
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[5, 4, 3, 2, 1].map((num) => (
                      <option key={num} value={num}>
                        {num} Star{num !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>
                  <label className="flex items-center gap-3 px-4 py-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2 hover:shadow-xl transition-all"
                >
                  <Save size={20} />
                  {editingReview ? 'Update Review' : 'Create Review'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingReview(null);
                    resetForm();
                  }}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
