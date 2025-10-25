'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Leaf, 
  Shield, 
  Truck, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  Star,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { t } = useLanguage();

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Excellent quality firewood! Burns cleanly and lasts long. Fast delivery and great customer service.",
      business: "Restaurant Owner"
    },
    {
      name: "Mike Chen",
      rating: 5,
      text: "The coconut shell charcoal is amazing for BBQ. High heat, long burning, and eco-friendly. Highly recommend!",
      business: "BBQ Enthusiast"
    },
    {
      name: "Emma Wilson",
      rating: 5,
      text: "Professional service and premium quality products. EcoFuel Pro has been our reliable supplier for 2 years.",
      business: "Hotel Manager"
    }
  ];

  const products = [
    {
      name: "Premium Oak Firewood",
      price: "$45",
      unit: "per cord",
      image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Seasoned oak firewood, perfect for home heating and fireplaces"
    },
    {
      name: "Coconut Shell Charcoal",
      price: "$35",
      unit: "per 20kg bag",
      image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "High-quality coconut shell charcoal for grilling and industrial use"
    },
    {
      name: "Mixed Hardwood Bundle",
      price: "$25",
      unit: "per bundle",
      image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Assorted hardwood for outdoor fire pits and camping"
    },
    {
      name: "BBQ Machine Rental",
      price: "$75",
      unit: "per day",
      image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Professional BBQ machines for events, parties, and catering"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="hero-bg min-h-screen flex items-center justify-center text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="btn-gradient text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center justify-center"
              >
                {t('home.hero.order_now')}
              </Link>
              <Link 
                href="/products" 
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#1C1917] transition-all duration-300 inline-flex items-center justify-center"
              >
                {t('home.hero.view_products')}
              </Link>
              <Link 
                href="/gallery" 
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#1C1917] transition-all duration-300 inline-flex items-center justify-center"
              >
                {t('home.hero.view_gallery')}
              </Link>
              <Link 
                href="/bbq-rentals" 
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#1C1917] transition-all duration-300 inline-flex items-center justify-center"
              >
                {t('home.hero.bbq_rentals')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Selling Points */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1C1917] mb-6">
              {t('home.why_choose.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.why_choose.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center card-hover bg-[#FAF3E0] p-8 rounded-2xl">
              <div className="w-20 h-20 bg-[#D97706] rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#1C1917] mb-4">{t('home.why_choose.eco_friendly')}</h3>
              <p className="text-gray-600">
                {t('home.why_choose.eco_friendly_desc')}
              </p>
            </div>

            <div className="text-center card-hover bg-[#FAF3E0] p-8 rounded-2xl">
              <div className="w-20 h-20 bg-[#D97706] rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#1C1917] mb-4">{t('home.why_choose.premium_quality')}</h3>
              <p className="text-gray-600">
                {t('home.why_choose.premium_quality_desc')}
              </p>
            </div>

            <div className="text-center card-hover bg-[#FAF3E0] p-8 rounded-2xl">
              <div className="w-20 h-20 bg-[#D97706] rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#1C1917] mb-4">{t('home.why_choose.fast_delivery')}</h3>
              <p className="text-gray-600">
                {t('home.why_choose.fast_delivery_desc')}
              </p>
            </div>

            <div className="text-center card-hover bg-[#FAF3E0] p-8 rounded-2xl">
              <div className="w-20 h-20 bg-[#D97706] rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#1C1917] mb-4">{t('home.why_choose.trusted')}</h3>
              <p className="text-gray-600">
                {t('home.why_choose.trusted_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[#FAF3E0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1C1917] mb-6">
              {t('home.featured_products.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.featured_products.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div key={index} className="card-hover bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="h-64 bg-gray-200 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={t(`product.${product.name.toLowerCase().replace(/\s+/g, '_')}`)}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#1C1917] mb-2">
                    {t(`product.${product.name.toLowerCase().replace(/\s+/g, '_')}`)}
                  </h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-3xl font-bold text-[#D97706]">{product.price}</span>
                      <span className="text-gray-500 ml-2">{t(`common.${product.unit.replace(/\s+/g, '_')}`)}</span>
                    </div>
                  </div>
                  <Link 
                    href="/contact"
                    className="w-full btn-gradient text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 block text-center"
                  >
                    {t('home.featured_products.contact_to_order')}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/products"
              className="btn-gradient text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center"
            >
              {t('home.featured_products.view_all')}
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1C1917] mb-6">
              {t('home.testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.testimonials.subtitle')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="bg-[#FAF3E0] rounded-2xl p-8 md:p-12 text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={24} />
                  ))}
                </div>
                <blockquote className="text-xl md:text-2xl text-[#1C1917] mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div>
                  <h4 className="text-xl font-bold text-[#1C1917]">
                    {testimonials[currentTestimonial].name}
                  </h4>
                  <p className="text-gray-600">{testimonials[currentTestimonial].business}</p>
                </div>
              </div>

              {/* Navigation buttons */}
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ChevronLeft className="text-[#1C1917]" size={24} />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ChevronRight className="text-[#1C1917]" size={24} />
              </button>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-[#D97706]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-[#1C1917] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('home.contact_cta.title')}
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('home.contact_cta.subtitle')}
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#D97706] rounded-full flex items-center justify-center mb-4">
                  <Phone className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('home.contact_cta.call_us')}</h3>
                <p className="text-gray-300">{t('common.phone')}</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#D97706] rounded-full flex items-center justify-center mb-4">
                  <Mail className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('home.contact_cta.email_us')}</h3>
                <p className="text-gray-300">{t('common.email')}</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#D97706] rounded-full flex items-center justify-center mb-4">
                  <MapPin className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('home.contact_cta.visit_us')}</h3>
                <p className="text-gray-300">{t('common.address')}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="btn-gradient text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center justify-center"
              >
                {t('home.contact_cta.get_free_quote')}
              </Link>
              <Link 
                href="tel:+15551234567" 
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#1C1917] transition-all duration-300 inline-flex items-center justify-center"
              >
                {t('home.contact_cta.call_now')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C1917] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-8 w-8 text-[#D97706]" />
                <span className="text-xl font-bold">EcoFuel Pro</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Premium eco-friendly firewood and coconut shell charcoal for sustainable energy solutions.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.quick_links')}</h3>
              <div className="space-y-2">
                <Link href="/" className="block text-gray-300 hover:text-[#D97706] transition-colors">{t('nav.home')}</Link>
                <Link href="/products" className="block text-gray-300 hover:text-[#D97706] transition-colors">{t('nav.products')}</Link>
                <Link href="/about" className="block text-gray-300 hover:text-[#D97706] transition-colors">{t('nav.about')}</Link>
                <Link href="/gallery" className="block text-gray-300 hover:text-[#D97706] transition-colors">{t('nav.gallery')}</Link>
                <Link href="/bbq-rentals" className="block text-gray-300 hover:text-[#D97706] transition-colors">{t('nav.bbq_rentals')}</Link>
                <Link href="/contact" className="block text-gray-300 hover:text-[#D97706] transition-colors">{t('nav.contact')}</Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.products_list')}</h3>
              <div className="space-y-2">
                <p className="text-gray-300">{t('product.premium_oak_firewood')}</p>
                <p className="text-gray-300">{t('product.coconut_shell_charcoal')}</p>
                <p className="text-gray-300">{t('product.mixed_hardwood_bundle')}</p>
                <p className="text-gray-300">{t('product.professional_bbq_grill')}</p>
                <p className="text-gray-300">Custom Orders</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">{t('footer.contact_info')}</h3>
              <div className="space-y-2">
                <p className="text-gray-300">{t('common.phone')}</p>
                <p className="text-gray-300">{t('common.email')}</p>
                <p className="text-gray-300">{t('common.address')}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}