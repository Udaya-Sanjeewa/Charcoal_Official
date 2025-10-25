'use client';

import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingCart, Trash2, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
  const router = useRouter();
  const { items, isLoading, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (product: any) => {
    await addToCart(product);
  };

  const handleRemove = async (productId: string) => {
    await removeFromWishlist(productId);
  };

  const handleClearWishlist = async () => {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      await clearWishlist();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-20 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
              <Heart className="text-pink-600" size={40} fill="currentColor" />
              My Wishlist
            </h1>
            <p className="text-slate-600">
              {items.length === 0
                ? 'Your wishlist is empty'
                : `${items.length} ${items.length === 1 ? 'item' : 'items'} saved`}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push('/products')}>
              Continue Shopping
            </Button>
            {items.length > 0 && (
              <Button
                variant="destructive"
                onClick={handleClearWishlist}
                className="bg-red-500 hover:bg-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Wishlist
              </Button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-slate-200">
            <Heart
              className="mx-auto mb-6 text-gray-300"
              size={80}
              strokeWidth={1.5}
            />
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start adding products you love to your wishlist and they'll appear here
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
              onClick={() => router.push('/products')}
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative">
                  <Link href={`/products/${item.product.slug}`}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <button
                    onClick={() => handleRemove(item.product.id)}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                  >
                    <X className="h-5 w-5 text-red-500" />
                  </button>
                  {item.product.category && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-rose-500">
                      {item.product.category}
                    </Badge>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-pink-600 transition-colors line-clamp-2">
                      {item.product.name}
                    </h3>
                  </Link>

                  {item.product.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                      {item.product.description}
                    </p>
                  )}

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-[#EA580C]">
                        {item.product.price}
                      </div>
                      {item.product.unit && (
                        <div className="text-xs text-gray-500">
                          per {item.product.unit}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-[#EA580C] hover:bg-[#D97706]"
                      onClick={() => handleAddToCart(item.product)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemove(item.product.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ready to purchase?
                </h3>
                <p className="text-sm text-gray-600">
                  Add all items to your cart or continue browsing
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/products')}
                >
                  Browse More Products
                </Button>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#EA580C] to-[#D97706] hover:from-[#D97706] hover:to-[#EA580C]"
                  onClick={() => router.push('/contact')}
                >
                  Contact for Bulk Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
