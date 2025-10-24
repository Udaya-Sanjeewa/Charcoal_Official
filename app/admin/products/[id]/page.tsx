'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, type Product } from '@/lib/supabase';
import { ArrowLeft, Save, Loader2, Plus, X } from 'lucide-react';

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    slug: '',
    category: 'firewood',
    price: '',
    unit: '',
    description: '',
    long_description: '',
    image: '',
    images: [],
    features: [''],
    specifications: {},
    benefits: [''],
    is_active: true,
    sort_order: 0,
  });
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  useEffect(() => {
    if (params.id !== 'new') {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        ...product,
        features: product.features?.filter(f => f.trim() !== ''),
        benefits: product.benefits?.filter(b => b.trim() !== ''),
        updated_at: new Date().toISOString(),
      };

      if (params.id === 'new') {
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', params.id);

        if (error) throw error;
      }

      router.push('/admin');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Product, value: any) => {
    setProduct(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: 'features' | 'benefits') => {
    const current = product[field] || [];
    updateField(field, [...current, '']);
  };

  const updateArrayItem = (field: 'features' | 'benefits', index: number, value: string) => {
    const current = [...(product[field] || [])];
    current[index] = value;
    updateField(field, current);
  };

  const removeArrayItem = (field: 'features' | 'benefits', index: number) => {
    const current = [...(product[field] || [])];
    current.splice(index, 1);
    updateField(field, current);
  };

  const addSpecification = () => {
    if (newSpecKey && newSpecValue) {
      updateField('specifications', {
        ...(product.specifications || {}),
        [newSpecKey]: newSpecValue,
      });
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    const specs = { ...(product.specifications || {}) };
    delete specs[key];
    updateField('specifications', specs);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] pt-16 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#7BB661]" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-[#7BB661] hover:text-[#6B4E3D] transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Products
          </Link>
          <h1 className="text-4xl font-bold text-[#333333]">
            {params.id === 'new' ? 'Add New Product' : 'Edit Product'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#333333] mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={product.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#333333] mb-2">
                Slug *
              </label>
              <input
                type="text"
                required
                value={product.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#333333] mb-2">
                Category *
              </label>
              <select
                required
                value={product.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
              >
                <option value="firewood">Firewood</option>
                <option value="charcoal">Charcoal</option>
                <option value="bundles">Bundles</option>
                <option value="rentals">Rentals</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#333333] mb-2">
                Price *
              </label>
              <input
                type="text"
                required
                value={product.price}
                onChange={(e) => updateField('price', e.target.value)}
                placeholder="$45"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#333333] mb-2">
                Unit *
              </label>
              <input
                type="text"
                required
                value={product.unit}
                onChange={(e) => updateField('unit', e.target.value)}
                placeholder="per cord"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#333333] mb-2">
                Sort Order
              </label>
              <input
                type="number"
                value={product.sort_order}
                onChange={(e) => updateField('sort_order', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-[#333333] mb-2">
              Short Description *
            </label>
            <textarea
              required
              rows={3}
              value={product.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-[#333333] mb-2">
              Long Description
            </label>
            <textarea
              rows={5}
              value={product.long_description || ''}
              onChange={(e) => updateField('long_description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-[#333333] mb-2">
              Main Image URL *
            </label>
            <input
              type="url"
              required
              value={product.image}
              onChange={(e) => updateField('image', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-[#333333] mb-2">
              Features
            </label>
            <div className="space-y-2">
              {product.features?.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateArrayItem('features', index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('features', index)}
                    className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('features')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#7BB661] text-white rounded-lg hover:bg-[#6B4E3D] transition-colors"
              >
                <Plus size={18} />
                Add Feature
              </button>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-[#333333] mb-2">
              Benefits
            </label>
            <div className="space-y-2">
              {product.benefits?.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => updateArrayItem('benefits', index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('benefits', index)}
                    className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('benefits')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#7BB661] text-white rounded-lg hover:bg-[#6B4E3D] transition-colors"
              >
                <Plus size={18} />
                Add Benefit
              </button>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-[#333333] mb-2">
              Specifications
            </label>
            <div className="space-y-2 mb-4">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="flex gap-2 items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-[#333333]">{key}:</span>
                  <span className="flex-1 text-gray-700">{value}</span>
                  <button
                    type="button"
                    onClick={() => removeSpecification(key)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Key"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Value"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
              />
              <button
                type="button"
                onClick={addSpecification}
                className="px-4 py-3 bg-[#7BB661] text-white rounded-lg hover:bg-[#6B4E3D] transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={product.is_active}
                onChange={(e) => updateField('is_active', e.target.checked)}
                className="w-5 h-5 text-[#7BB661] border-gray-300 rounded focus:ring-[#7BB661]"
              />
              <span className="font-semibold text-[#333333]">Active (visible to customers)</span>
            </label>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 btn-gradient text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Product
                </>
              )}
            </button>
            <Link
              href="/admin"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
