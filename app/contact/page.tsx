'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Phone, Mail, MapPin, Clock, Send, CircleCheck as CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Contact() {
  const searchParams = useSearchParams();
  const packageType = searchParams.get('package');
  const inquiryType = searchParams.get('type');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (packageType && inquiryType === 'bbq-rental') {
      const packageNames: { [key: string]: string } = {
        'basic': 'Basic BBQ Package - $75/day',
        'premium': 'Premium BBQ Package - $120/day',
        'commercial': 'Commercial BBQ Package - $200/day'
      };

      setFormData(prev => ({
        ...prev,
        subject: `BBQ Rental Inquiry - ${packageNames[packageType] || packageType}`,
        message: `I'm interested in the ${packageNames[packageType] || packageType}. Please provide more details about availability and booking.\n\n`
      }));
    }
  }, [packageType, inquiryType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-16">
      {/* Header */}
      <section className="bg-[#333333] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center card-hover bg-[#FAF7F2] p-8 rounded-2xl">
              <div className="w-16 h-16 bg-[#7BB661] rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-2">{t('contact.call_us')}</h3>
              <p className="text-gray-600 mb-2">{t('common.phone')}</p>
              <p className="text-sm text-gray-500">{t('contact.mon_fri')}</p>
            </div>

            <div className="text-center card-hover bg-[#FAF7F2] p-8 rounded-2xl">
              <div className="w-16 h-16 bg-[#7BB661] rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-2">{t('contact.email_us')}</h3>
              <p className="text-gray-600 mb-2">{t('common.email')}</p>
              <p className="text-sm text-gray-500">{t('contact.support_24_7')}</p>
            </div>

            <div className="text-center card-hover bg-[#FAF7F2] p-8 rounded-2xl">
              <div className="w-16 h-16 bg-[#7BB661] rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-2">{t('contact.visit_us')}</h3>
              <p className="text-gray-600 mb-2">{t('common.address')}</p>
              <p className="text-sm text-gray-500">Green City, GC 12345</p>
            </div>

            <div className="text-center card-hover bg-[#FAF7F2] p-8 rounded-2xl">
              <div className="w-16 h-16 bg-[#7BB661] rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#333333] mb-2">{t('contact.business_hours')}</h3>
              <p className="text-gray-600 mb-2">{t('contact.mon_fri_hours')}</p>
              <p className="text-sm text-gray-500">{t('contact.weekend_hours')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-[#333333] mb-6">{t('contact.send_message')}</h2>
              <p className="text-gray-600 mb-8">
                {t('contact.form_subtitle')}
              </p>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-[#333333] mb-2">
                        {t('contact.full_name')} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7BB661] focus:border-transparent transition-all duration-300"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-[#333333] mb-2">
                        {t('contact.email_address')} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7BB661] focus:border-transparent transition-all duration-300"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-[#333333] mb-2">
                        {t('contact.phone_number')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7BB661] focus:border-transparent transition-all duration-300"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-[#333333] mb-2">
                        {t('contact.subject')} *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7BB661] focus:border-transparent transition-all duration-300"
                      >
                        <option value="">{t('contact.select_subject')}</option>
                        <option value="quote">{t('contact.request_quote')}</option>
                        <option value="order">{t('contact.place_order')}</option>
                        <option value="delivery">{t('contact.delivery_inquiry')}</option>
                        <option value="product">{t('contact.product_information')}</option>
                        <option value="other">{t('contact.other')}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-[#333333] mb-2">
                      {t('contact.message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7BB661] focus:border-transparent transition-all duration-300"
                      placeholder={t('contact.message_placeholder')}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-gradient text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    {t('contact.send_message_btn')}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="mx-auto text-[#7BB661] mb-4" size={64} />
                  <h3 className="text-2xl font-bold text-[#333333] mb-2">{t('contact.message_sent')}</h3>
                  <p className="text-gray-600">
                    {t('contact.message_sent_desc')}
                  </p>
                </div>
              )}
            </div>

            {/* Map & Additional Info */}
            <div className="space-y-8">
              {/* Google Maps Embed */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-[#333333] mb-4">{t('contact.find_location')}</h3>
                <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1234567890!2d-74.0059!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjEiTiA3NMKwMDAnMjEuMyJX!5e0!3m2!1sen!2sus!4v1234567890123"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="EcoFuel Pro Location"
                  ></iframe>
                </div>
                <div className="mt-4">
                  <p className="text-gray-600">
                    <MapPin className="inline mr-2" size={16} />
                    {t('common.address')}, Green City, GC 12345
                  </p>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-[#333333] mb-4">{t('contact.quick_questions')}</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-[#7BB661] pl-4">
                    <h4 className="font-semibold text-[#333333]">{t('contact.delivery_areas')}</h4>
                    <p className="text-gray-600 text-sm">{t('contact.delivery_areas_desc')}</p>
                  </div>
                  <div className="border-l-4 border-[#7BB661] pl-4">
                    <h4 className="font-semibold text-[#333333]">{t('contact.minimum_order')}</h4>
                    <p className="text-gray-600 text-sm">{t('contact.minimum_order_desc')}</p>
                  </div>
                  <div className="border-l-4 border-[#7BB661] pl-4">
                    <h4 className="font-semibold text-[#333333]">{t('contact.payment_methods')}</h4>
                    <p className="text-gray-600 text-sm">{t('contact.payment_methods_desc')}</p>
                  </div>
                  <div className="border-l-4 border-[#7BB661] pl-4">
                    <h4 className="font-semibold text-[#333333]">{t('contact.bulk_pricing')}</h4>
                    <p className="text-gray-600 text-sm">{t('contact.bulk_pricing_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-[#333333] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('contact.need_assistance')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('contact.assistance_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:+15551234567"
              className="btn-gradient text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center justify-center gap-2"
            >
              <Phone size={20} />
              {t('contact.call_now')}
            </a>
            <a 
              href="https://wa.me/15551234567"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#333333] transition-all duration-300 inline-flex items-center justify-center"
            >
              {t('contact.whatsapp')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}