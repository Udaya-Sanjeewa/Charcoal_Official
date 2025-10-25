'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Truck, Shield, Leaf, Phone, Mail, Loader2, ShoppingCart, Heart } from 'lucide-react';
import { getProductBySlug } from '@/lib/products';
import { type Product } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

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
      <div className="min-h-screen bg-[#FAF7F2] pt-16 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#7BB661]" size={48} />
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  const displayImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const handleAddToCart = async () => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      if (confirm('You need to be logged in to add items to cart. Would you like to login?')) {
        router.push('/user-login');
      }
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product.id, product.name, product.price, product.image);
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      if (confirm('You need to be logged in to add items to wishlist. Would you like to login?')) {
        router.push('/user-login');
      }
      return;
    }

    setTogglingWishlist(true);
    try {
      await toggleWishlist(product.id, product.name, product.price, product.image, product.slug);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setTogglingWishlist(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-16">
      <section className="py-6 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#7BB661]">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/products" className="text-gray-500 hover:text-[#7BB661]">Products</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#333333] font-semibold">{product.name}</span>
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
                        selectedImage === index ? 'border-[#7BB661]' : 'border-gray-200'
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
                  className="inline-flex items-center gap-2 text-[#7BB661] hover:text-[#6B4E3D] transition-colors mb-4"
                >
                  <ArrowLeft size={20} />
                  Back to Products
                </Link>
                <span className="inline-block bg-[#7BB661] text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  {product.category}
                </span>
                <h1 className="text-4xl font-bold text-[#333333] mb-4">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold text-[#7BB661]">{product.price}</span>
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
                  <h3 className="text-xl font-bold text-[#333333] mb-4">Key Features</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#7BB661] rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 bg-[#7BB661] hover:bg-[#6B4E3D] text-white py-6 px-6 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {addingToCart ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Adding to Cart...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleToggleWishlist}
                  disabled={togglingWishlist}
                  className={`border-2 py-6 px-6 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300 ${
                    isInWishlist(product.id)
                      ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                      : 'border-[#7BB661] text-[#7BB661] hover:bg-[#7BB661] hover:text-white'
                  }`}
                >
                  {togglingWishlist ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
                <div className="text-center">
                  <Truck className="mx-auto mb-2 text-[#7BB661]" size={24} />
                  <div className="text-sm font-semibold text-[#333333]">Free Delivery</div>
                  <div className="text-xs text-gray-600">Orders over $100</div>
                </div>
                <div className="text-center">
                  <Shield className="mx-auto mb-2 text-[#7BB661]" size={24} />
                  <div className="text-sm font-semibold text-[#333333]">Quality Guarantee</div>
                  <div className="text-xs text-gray-600">100% satisfaction</div>
                </div>
                <div className="text-center">
                  <Leaf className="mx-auto mb-2 text-[#7BB661]" size={24} />
                  <div className="text-sm font-semibold text-[#333333]">Eco-Friendly</div>
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
              <h2 className="text-3xl font-bold text-[#333333] mb-8 text-center">Product Specifications</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="bg-[#FAF7F2] p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-[#333333] mb-4">Technical Details</h3>
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
                  <div className="bg-[#FAF7F2] p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-[#333333] mb-4">Benefits</h3>
                    <div className="space-y-3">
                      {product.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-[#7BB661] rounded-full mt-2"></div>
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

      <section className="py-16 bg-[#333333] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today for competitive pricing and fast delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn-gradient text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center justify-center gap-2"
            >
              <Mail size={20} />
              Get Quote
            </Link>
            <a
              href="tel:+15551234567"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#333333] transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
