'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  const phoneNumber = '+1234567890'; // Replace with actual phone number
  const message = 'Hello! I would like to inquire about your firewood and charcoal products.';
  
  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 floating-animation"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={24} />
    </button>
  );
}