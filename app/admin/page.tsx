'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { type Product } from '@/lib/types';
import { getAllProducts, updateProduct, deleteProduct as deleteProductApi } from '@/lib/products';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, LogOut, Package, TrendingUp, ShoppingCart, DollarSign, BarChart3, Users, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPanel() {
  const { isAuthenticated, loading: authLoading, logout, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-16 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  const toggleProductStatus = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const success = await updateProduct(id, { is_active: newStatus });
    if (success) {
      toast.success(`Product ${newStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchProducts();
    } else {
      toast.error('Failed to update product status');
    }
  };

  const handleDeleteProduct = async (id: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) return;

    const success = await deleteProductApi(id);
    if (success) {
      toast.success('Product deleted successfully!');
      fetchProducts();
    } else {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  const activeProducts = products.filter(p => p.is_active).length;
  const totalProducts = products.length;
  const categoriesCount = Array.from(new Set(products.map(p => p.category))).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-600">Welcome back, {user?.name || user?.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/orders"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <ShoppingCart size={20} />
              Orders
            </Link>
            <Link
              href="/admin/reviews"
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <MessageSquare size={20} />
              Reviews
            </Link>
            <Link
              href="/admin/users"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Users size={20} />
              Users
            </Link>
            <Link
              href="/admin/products/new"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Plus size={20} />
              Add Product
            </Link>
            <button
              onClick={logout}
              className="border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-slate-700 hover:text-white hover:border-slate-700 transition-all duration-300"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Package size={24} />
              </div>
              <div className="text-3xl font-bold">{totalProducts}</div>
            </div>
            <h3 className="text-white/90 text-sm font-medium">Total Products</h3>
            <p className="text-white/70 text-xs mt-1">All items in inventory</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <TrendingUp size={24} />
              </div>
              <div className="text-3xl font-bold">{activeProducts}</div>
            </div>
            <h3 className="text-white/90 text-sm font-medium">Active Products</h3>
            <p className="text-white/70 text-xs mt-1">Currently available</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BarChart3 size={24} />
              </div>
              <div className="text-3xl font-bold">{categoriesCount}</div>
            </div>
            <h3 className="text-white/90 text-sm font-medium">Categories</h3>
            <p className="text-white/70 text-xs mt-1">Product types</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <ShoppingCart size={24} />
              </div>
              <div className="text-3xl font-bold">{totalProducts - activeProducts}</div>
            </div>
            <h3 className="text-white/90 text-sm font-medium">Inactive</h3>
            <p className="text-white/70 text-xs mt-1">Not available now</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Filter by Category</h2>
          <div className="flex gap-2 flex-wrap">
            {['all', 'firewood', 'charcoal', 'bundles', 'rentals'].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-5 py-2.5 rounded-xl transition-all duration-300 font-medium ${
                  filter === category
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={48} />
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-slate-200">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Product Management</h2>
              <p className="text-slate-300 text-sm mt-1">Manage your product inventory</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Image</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Product Details</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="relative group">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-xl shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{product.name}</div>
                        <div className="text-sm text-slate-500 font-mono">{product.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-xs font-semibold shadow-md">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 text-lg">{product.price}</div>
                        <div className="text-xs text-slate-500">{product.unit}</div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleProductStatus(product.id, product.is_active)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-md ${
                            product.is_active
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {product.is_active ? (
                            <>
                              <Eye size={14} />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff size={14} />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-110 transition-all duration-300"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="p-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:scale-110 transition-all duration-300"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <Package size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">No products found in this category.</p>
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <Plus size={16} />
                  Add your first product
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
