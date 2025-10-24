'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Filter, Grid2x2 as Grid, List, Loader2 } from 'lucide-react';
import { getActiveProducts } from '@/lib/products';
import { type Product } from '@/lib/supabase';

export default function Products() {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchProducts() {
      const data = await getActiveProducts();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const categories = [
    { id: 'all', name: t('products.all') },
    { id: 'firewood', name: t('products.firewood') },
    { id: 'charcoal', name: t('products.charcoal') },
    { id: 'bundles', name: t('products.bundles') },
    { id: 'rentals', name: t('products.rentals') }
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-16">
      {/* Header */}
      <section className="bg-[#333333] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('products.title')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t('products.subtitle')}
          </p>
        </div>
      </section>

      {/* Filters and View Controls */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-4">
              <Filter className="text-[#333333]" size={20} />
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-[#7BB661] text-white'
                        : 'bg-gray-200 text-[#333333] hover:bg-gray-300'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-200 rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-full transition-all duration-300 ${
                  viewMode === 'grid' ? 'bg-[#7BB661] text-white' : 'text-[#333333]'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-full transition-all duration-300 ${
                  viewMode === 'list' ? 'bg-[#7BB661] text-white' : 'text-[#333333]'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid/List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-[#7BB661]" size={48} />
            </div>
          ) : (
            <div className={`${viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3' : 'space-y-6'} gap-8`}>
              {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`card-hover bg-white rounded-2xl overflow-hidden shadow-lg ${
                  viewMode === 'list' ? 'md:flex' : ''
                }`}
              >
                <div className={`${viewMode === 'list' ? 'md:w-1/3' : ''} h-64 bg-gray-200 overflow-hidden`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className={`p-6 ${viewMode === 'list' ? 'md:w-2/3 md:flex md:flex-col md:justify-between' : ''}`}>
                  <div>
                    <h3 className="text-2xl font-bold text-[#333333] mb-2">
                      {t(`product.${product.name.toLowerCase().replace(/\s+/g, '_')}`)}
                    </h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    
                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-[#333333] mb-2">Key Features:</h4>
                      <ul className="grid grid-cols-2 gap-1 text-sm text-gray-600">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-[#7BB661] rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-3xl font-bold text-[#7BB661]">{product.price}</span>
                        <span className="text-gray-500 ml-2">{t(`common.${product.unit.replace(/\s+/g, '_')}`)}</span>
                      </div>
                    </div>
                    <Link 
                      href={
                        product.category === 'rentals' 
                          ? '/bbq-rentals'
                          : ['premium-oak-firewood', 'coconut-shell-charcoal', 'mixed-hardwood-bundle'].includes(product.slug)
                            ? `/products/${product.slug}`
                            : '/contact'
                      }
                      className="w-full btn-gradient text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 block text-center"
                    >
                      {product.category === 'rentals' ? 'View Rentals' : 
                       ['premium-oak-firewood', 'coconut-shell-charcoal', 'mixed-hardwood-bundle'].includes(product.slug) ? t('common.view_details') : t('common.contact_to_order')}
                    </Link>
                  </div>
                </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-[#333333] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('products.custom_quote')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('products.custom_quote_desc')}
          </p>
          <Link 
            href="/contact"
            className="btn-gradient text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center"
          >
            {t('products.get_custom_quote')}
          </Link>
        </div>
      </section>
    </div>
  );
}