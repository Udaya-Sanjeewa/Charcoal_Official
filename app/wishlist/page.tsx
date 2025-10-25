'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function WishlistPage() {
  const router = useRouter();
  const { items, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [movingToCart, setMovingToCart] = useState<string | null>(null);

  const handleMoveToCart = async (item: any) => {
    setMovingToCart(item.product_id);
    try {
      await addToCart(item.product_id, item.product_name, item.product_price, item.product_image, item.product_slug);
      await removeFromWishlist(item.product_id);
      alert(`${item.product_name} moved to cart!`);
    } catch (error) {
      console.error('Error moving to cart:', error);
    } finally {
      setMovingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="animate-spin h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Products
          </Link>
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-4xl font-bold">My Wishlist</h1>
          </div>
          <p className="text-slate-600 mt-2">{items.length} {items.length === 1 ? 'item' : 'items'} in your wishlist</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-16">
            <Heart className="h-24 w-24 mx-auto text-slate-300 mb-6" />
            <h2 className="text-3xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-slate-600 mb-8 text-lg">
              Start adding products you love to your wishlist
            </p>
            <Link href="/products">
              <button className="bg-slate-900 text-white px-8 py-4 rounded-lg hover:bg-slate-800 transition-colors font-semibold text-lg">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.product_id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <Link href={`/products/${item.product_slug}`} className="block relative h-64 bg-slate-200">
                  <Image
                    src={item.product_image}
                    alt={item.product_name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="p-4">
                  <Link href={`/products/${item.product_slug}`}>
                    <h3 className="font-bold text-lg mb-2 hover:text-[#7BB661] transition-colors line-clamp-2">
                      {item.product_name}
                    </h3>
                  </Link>
                  <p className="text-2xl font-bold text-[#7BB661] mb-4">{item.product_price}</p>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      disabled={movingToCart === item.product_id}
                      className="w-full bg-[#7BB661] text-white py-3 rounded-lg hover:bg-[#6B4E3D] transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {movingToCart === item.product_id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Moving...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          Move to Cart
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => removeFromWishlist(item.product_id)}
                      className="w-full border-2 border-red-500 text-red-500 py-3 rounded-lg hover:bg-red-50 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
