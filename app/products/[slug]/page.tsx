'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Truck, Shield, Leaf, Phone, Mail, Loader2, ShoppingCart, Minus, Plus, Heart } from 'lucide-react';
import { getProductBySlug } from '@/lib/products';
import { type Product } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    async function fetchProduct() {
      const data = await getProductBySlug(params.slug);
      if (!data) {
        notFound();
      }
      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF3E0] pt-16 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D97706]" size={48} />
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  const displayImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const handleContactUs = () => {
    router.push('/contact');
  };

  return (
    <div className="min-h-screen bg-[#FAF3E0] pt-16">
      <section className="py-6 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#D97706]">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/products" className="text-gray-500 hover:text-[#D97706]">Products</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#1C1917] font-semibold">{product.name}</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="mb-4">
                <img
                  src={displayImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
              </div>
              {displayImages.length > 1 && (
                <div className="flex gap-4">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index ? 'border-[#D97706]' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-6">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-[#D97706] hover:text-[#4B2E05] transition-colors mb-4"
                >
                  <ArrowLeft size={20} />
                  Back to Products
                </Link>
                <span className="inline-block bg-[#D97706] text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  {product.category}
                </span>
                <h1 className="text-4xl font-bold text-[#1C1917] mb-4">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold text-[#D97706]">{product.price}</span>
                  <span className="text-xl text-gray-600">{product.unit}</span>
                </div>
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                  <span className="text-gray-600 ml-2">(4.9/5 from 127 reviews)</span>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {product.description}
                </p>
                {product.long_description && (
                  <p className="text-gray-600 leading-relaxed">
                    {product.long_description}
                  </p>
                )}
              </div>

              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[#1C1917] mb-4">Key Features</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#D97706] rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-lg hover:border-[#D97706] transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-16 text-center text-lg font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-lg hover:border-[#D97706] transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 bg-[#EA580C] hover:bg-[#D97706] text-white py-6 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => addToWishlist(product)}
                    className={`flex-shrink-0 py-6 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                      isInWishlist(product.id)
                        ? 'bg-pink-600 text-white hover:bg-pink-700'
                        : 'border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white'
                    }`}
                  >
                    <Heart className="h-5 w-5" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleContactUs}
                    className="flex-1 border-2 border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    <Phone className="h-5 w-5" />
                    Contact Us
                  </button>
                  <Link
                    href="/contact"
                    className="flex-1 border-2 border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    <Mail className="h-5 w-5" />
                    Get a Quote
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="mx-auto mb-2 text-[#D97706]" size={24} />
                  <div className="text-sm font-semibold text-[#1C1917]">Free Delivery</div>
                  <div className="text-xs text-gray-600">Orders over $100</div>
                </div>
                <div className="text-center">
                  <Shield className="mx-auto mb-2 text-[#D97706]" size={24} />
                  <div className="text-sm font-semibold text-[#1C1917]">Quality Guarantee</div>
                  <div className="text-xs text-gray-600">100% satisfaction</div>
                </div>
                <div className="text-center">
                  <Leaf className="mx-auto mb-2 text-[#D97706]" size={24} />
                  <div className="text-sm font-semibold text-[#1C1917]">Eco-Friendly</div>
                  <div className="text-xs text-gray-600">Sustainably sourced</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {(product.specifications && Object.keys(product.specifications).length > 0) ||
       (product.benefits && product.benefits.length > 0) ? (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#1C1917] mb-8 text-center">Product Specifications</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="bg-[#FAF3E0] p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-[#1C1917] mb-4">Technical Details</h3>
                    <div className="space-y-3">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-semibold text-gray-700">{key}:</span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {product.benefits && product.benefits.length > 0 && (
                  <div className="bg-[#FAF3E0] p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-[#1C1917] mb-4">Benefits</h3>
                    <div className="space-y-3">
                      {product.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-[#D97706] rounded-full mt-2"></div>
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
