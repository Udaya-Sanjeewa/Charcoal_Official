'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, Truck, Shield, Award, Phone, Mail, CircleCheck as CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BBQRentals() {
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const { t } = useLanguage();

  const rentalPackages = [
    {
      id: 'basic',
      name: t('bbq.basic_package'),
      price: '$75',
      duration: t('bbq.per_day'),
      capacity: t('bbq.people_15_25'),
      image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: [
        'Professional gas BBQ grill',
        'Cooking utensils and tools',
        'Propane tank included',
        'Basic setup instructions',
        'Pickup or delivery available'
      ],
      ideal: t('bbq.basic_ideal')
    },
    {
      id: 'premium',
      name: t('bbq.premium_package'),
      price: '$120',
      duration: t('bbq.per_day'),
      capacity: t('bbq.people_25_50'),
      image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: [
        'Large capacity professional grill',
        'Complete cooking utensil set',
        'Multiple propane tanks',
        'Side burner included',
        'Professional setup service',
        'Cleaning service included'
      ],
      ideal: t('bbq.premium_ideal')
    },
    {
      id: 'commercial',
      name: t('bbq.commercial_package'),
      price: '$200',
      duration: t('bbq.per_day'),
      capacity: t('bbq.people_50_plus'),
      image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=600',
      features: [
        'Commercial-grade BBQ smoker',
        'Multiple cooking surfaces',
        'Temperature monitoring system',
        'Professional chef tools',
        'Full setup and breakdown service',
        'On-site support available',
        'Premium charcoal included'
      ],
      ideal: t('bbq.commercial_ideal')
    }
  ];

  const additionalServices = [
    {
      name: t('bbq.setup_breakdown'),
      price: '$50',
      description: t('bbq.setup_breakdown_desc')
    },
    {
      name: t('bbq.chef_service'),
      price: '$150/day',
      description: t('bbq.chef_service_desc')
    },
    {
      name: t('bbq.premium_charcoal_package'),
      price: '$25',
      description: t('bbq.premium_charcoal_desc')
    },
    {
      name: t('bbq.extended_rental'),
      price: '+50%',
      description: t('bbq.extended_rental_desc')
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-16">
      {/* Header */}
      <section className="bg-[#333333] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('bbq.title')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t('bbq.subtitle')}
          </p>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              {t('bbq.why_choose')}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center card-hover bg-[#FAF7F2] p-6 rounded-2xl">
              <div className="w-16 h-16 bg-[#7BB661] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-2">{t('bbq.professional_grade')}</h3>
              <p className="text-gray-600">{t('bbq.professional_grade_desc')}</p>
            </div>
            <div className="text-center card-hover bg-[#FAF7F2] p-6 rounded-2xl">
              <div className="w-16 h-16 bg-[#7BB661] rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-2">{t('bbq.delivery_setup')}</h3>
              <p className="text-gray-600">{t('bbq.delivery_setup_desc')}</p>
            </div>
            <div className="text-center card-hover bg-[#FAF7F2] p-6 rounded-2xl">
              <div className="w-16 h-16 bg-[#7BB661] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-2">{t('bbq.fully_insured')}</h3>
              <p className="text-gray-600">{t('bbq.fully_insured_desc')}</p>
            </div>
            <div className="text-center card-hover bg-[#FAF7F2] p-6 rounded-2xl">
              <div className="w-16 h-16 bg-[#7BB661] rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-2">{t('bbq.support_24_7')}</h3>
              <p className="text-gray-600">{t('bbq.support_24_7_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rental Packages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              {t('bbq.rental_packages')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('bbq.packages_subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {rentalPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`card-hover bg-white rounded-2xl overflow-hidden shadow-lg border-2 transition-all duration-300 ${
                  selectedPackage === pkg.id ? 'border-[#7BB661]' : 'border-transparent'
                }`}
              >
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#333333] mb-2">{pkg.name}</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-[#7BB661]">{pkg.price}</span>
                    <span className="text-gray-600">{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="text-[#7BB661]" size={16} />
                    <span className="text-gray-600">{pkg.capacity}</span>
                  </div>
                  <p className="text-gray-600 mb-4 italic">{pkg.ideal}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-[#333333] mb-3">{t('bbq.package_includes')}</h4>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="text-[#7BB661] mt-0.5 flex-shrink-0" size={16} />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      selectedPackage === pkg.id
                        ? 'btn-gradient text-white'
                        : 'border-2 border-[#7BB661] text-[#7BB661] hover:bg-[#7BB661] hover:text-white'
                    }`}
                  >
                    {selectedPackage === pkg.id ? t('bbq.selected') : t('bbq.select_package')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              {t('bbq.additional_services')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('bbq.services_subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {additionalServices.map((service, index) => (
              <div key={index} className="card-hover bg-[#FAF7F2] p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-[#333333]">{service.name}</h3>
                  <span className="text-lg font-bold text-[#7BB661]">{service.price}</span>
                </div>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
              {t('bbq.easy_booking')}
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#7BB661] rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-bold text-[#333333] mb-2">{t('bbq.choose_package')}</h3>
              <p className="text-gray-600">{t('bbq.choose_package_desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#7BB661] rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-bold text-[#333333] mb-2">{t('bbq.contact_us')}</h3>
              <p className="text-gray-600">{t('bbq.contact_us_desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#7BB661] rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-bold text-[#333333] mb-2">{t('bbq.confirm_booking')}</h3>
              <p className="text-gray-600">{t('bbq.confirm_booking_desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#7BB661] rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h3 className="text-lg font-bold text-[#333333] mb-2">{t('bbq.enjoy_event')}</h3>
              <p className="text-gray-600">{t('bbq.enjoy_event_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-[#333333] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('bbq.ready_to_book')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('bbq.book_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="btn-gradient text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center justify-center gap-2"
            >
              <Calendar size={20} />
              {t('bbq.book_now')}
            </Link>
            <a 
              href="tel:+15551234567"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#333333] transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              {t('bbq.call_for_quote')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}