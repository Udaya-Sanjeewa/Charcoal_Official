'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, Truck, Shield, Award, Phone, CircleCheck as CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface BBQPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  image_url?: string;
  is_active: boolean;
  display_order: number;
}

export default function BBQRentals() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<BBQPackage | null>(null);
  const [packages, setPackages] = useState<BBQPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLanguage();

  const [bookingForm, setBookingForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    rental_date: '',
    return_date: '',
    special_requests: ''
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('bbq_rental_packages')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching BBQ packages:', error);
        return;
      }

      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;

    setSubmitting(true);
    try {
      const totalAmount = selectedPackage.price;
      const depositAmount = totalAmount * 0.3;
      const balanceAmount = totalAmount - depositAmount;

      const { data, error } = await supabase
        .from('bbq_rental_bookings')
        .insert([
          {
            package_id: selectedPackage.id,
            customer_name: bookingForm.customer_name,
            customer_email: bookingForm.customer_email,
            customer_phone: bookingForm.customer_phone,
            customer_address: bookingForm.customer_address,
            rental_date: bookingForm.rental_date,
            return_date: bookingForm.return_date,
            special_requests: bookingForm.special_requests,
            total_amount: totalAmount,
            deposit_amount: depositAmount,
            balance_amount: balanceAmount,
            payment_status: 'pending',
            booking_status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      alert(`Booking successful! Your reference number is: ${data.booking_reference}. We will contact you shortly to confirm your booking.`);

      setShowBookingModal(false);
      setBookingForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        rental_date: '',
        return_date: '',
        special_requests: ''
      });
      setSelectedPackage(null);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again or contact us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-16">
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

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#7BB661]"></div>
              <p className="mt-4 text-gray-600">Loading packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No packages available at the moment.</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="card-hover bg-white rounded-2xl overflow-hidden shadow-lg border-2 border-transparent transition-all duration-300"
                >
                  {pkg.image_url && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={pkg.image_url}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-[#333333] mb-2">{pkg.name}</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl font-bold text-[#7BB661]">
                        LKR {parseFloat(pkg.price.toString()).toLocaleString('en-LK', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    {pkg.description && (
                      <p className="text-gray-600 mb-4 italic">{pkg.description}</p>
                    )}

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
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setShowBookingModal(true);
                      }}
                      className="w-full py-3 rounded-xl font-semibold transition-all duration-300 border-2 border-[#7BB661] text-[#7BB661] hover:bg-[#7BB661] hover:text-white"
                    >
                      {t('bbq.book_now')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

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

      {showBookingModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#333333]">Book {selectedPackage.name}</h2>
              <p className="text-sm text-gray-500 mt-1">Complete the form below to reserve your BBQ rental</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={bookingForm.customer_name}
                    onChange={(e) => setBookingForm({ ...bookingForm, customer_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={bookingForm.customer_email}
                    onChange={(e) => setBookingForm({ ...bookingForm, customer_email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={bookingForm.customer_phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, customer_phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rental Date *
                  </label>
                  <input
                    type="date"
                    value={bookingForm.rental_date}
                    onChange={(e) => setBookingForm({ ...bookingForm, rental_date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Date *
                  </label>
                  <input
                    type="date"
                    value={bookingForm.return_date}
                    onChange={(e) => setBookingForm({ ...bookingForm, return_date: e.target.value })}
                    min={bookingForm.rental_date || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  value={bookingForm.customer_address}
                  onChange={(e) => setBookingForm({ ...bookingForm, customer_address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  value={bookingForm.special_requests}
                  onChange={(e) => setBookingForm({ ...bookingForm, special_requests: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7BB661] focus:border-transparent"
                  rows={3}
                  placeholder="Any special requirements or requests..."
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Booking Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package:</span>
                    <span className="font-medium">{selectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold text-[#7BB661]">LKR {selectedPackage.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit (30%):</span>
                    <span className="font-medium">LKR {(selectedPackage.price * 0.3).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balance:</span>
                    <span className="font-medium">LKR {(selectedPackage.price * 0.7).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedPackage(null);
                  }}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-[#7BB661] text-white rounded-lg font-semibold hover:bg-[#6da555] transition-all disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
