import './globals.css';
import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';

export const metadata: Metadata = {
  title: 'EcoFuel Pro - Premium Firewood & Coconut Shell Charcoal',
  description: 'High-quality, sustainable firewood and coconut shell charcoal for domestic and commercial use. Eco-friendly energy solutions delivered to your door. View our gallery of production facilities, stores, and delivery operations.',
  keywords: 'firewood, coconut shell charcoal, sustainable fuel, eco-friendly, charcoal supplier',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans">
        <LanguageProvider>
          <CartProvider>
            <WishlistProvider>
              <Navigation />
              <main>{children}</main>
              <WhatsAppFloat />
            </WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}