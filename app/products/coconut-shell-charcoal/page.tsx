'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Truck, Shield, Leaf, Phone, Mail } from 'lucide-react';

export default function CoconutShellCharcoal() {
  const [selectedImage, setSelectedImage] = useState(0);

  const product = {
    name: "Coconut Shell Charcoal",
    price: "$35",
    unit: "per 20kg bag",
    category: "Charcoal",
    description: "High-quality coconut shell charcoal ideal for grilling, BBQ, and industrial applications. Made from 100% natural coconut shells with no chemical additives.",
    longDescription: "Our premium coconut shell charcoal is produced through a carefully controlled carbonization process using only the finest coconut shells. This eco-friendly charcoal burns hotter and longer than traditional wood charcoal, making it perfect for professional grilling, BBQ restaurants, and industrial heating applications.",
    features: [
      "Long burning time (3-4 hours)",
      "High temperature (up to 7000°C)",
      "Low ash content (2-5%)",
      "100% eco-friendly and sustainable",
      "No chemical additives or binders",
      "Smokeless and odorless burning"
    ],
    specifications: {
      "Material": "100% Coconut Shell",
      "Ash Content": "2-5%",
      "Moisture Content": "Below 8%",
      "Burning Time": "3-4 hours",
      "Calorific Value": "7000-7500 kcal/kg",
      "Package Size": "20kg bags"
    },
    images: [
      "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800"
    ],
    benefits: [
      "Burns 3x longer than regular charcoal",
      "Reaches higher temperatures faster",
      "Produces minimal smoke and ash",
      "Made from renewable coconut waste",
      "No harmful chemicals or additives",
      "Perfect for professional grilling"
    ]
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-16">
      {/* Breadcrumb */}
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

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="mb-4">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="flex gap-4">
                {product.images.map((image, index) => (
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
            </div>

            {/* Product Info */}
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
                  <span className="text-gray-600 ml-2">(4.8/5 from 89 reviews)</span>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {product.description}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {product.longDescription}
                </p>
              </div>

              {/* Key Features */}
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

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  href="/contact"
                  className="flex-1 border-2 border-[#7BB661] text-[#7BB661] py-4 px-6 rounded-xl font-semibold text-center hover:bg-[#7BB661] hover:text-white transition-all duration-300"
                >
                  Get Quote
                </Link>
                <Link 
                  href="/checkout"
                  className="flex-1 btn-gradient text-white py-4 px-6 rounded-xl font-semibold text-center hover:shadow-lg transition-all duration-300"
                >
                  Order Now
                </Link>
              </div>

              {/* Trust Indicators */}
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

      {/* Specifications */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#333333] mb-8 text-center">Product Specifications</h2>
            <div className="grid md:grid-cols-2 gap-8">
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
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-[#333333] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Order?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today for competitive pricing and fast delivery of premium coconut shell charcoal.
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