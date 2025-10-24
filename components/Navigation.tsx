'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Leaf, Globe, LogIn } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/98 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-lg shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-[#7BB661]" />
            <span className="text-xl font-bold text-[#1a1a1a] drop-shadow-sm">
              EcoFuel Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-[#1a1a1a] hover:text-[#7BB661] transition-colors font-semibold drop-shadow-sm"
            >
              {t('nav.home')}
            </Link>
            <Link 
              href="/products" 
              className="text-[#1a1a1a] hover:text-[#7BB661] transition-colors font-semibold drop-shadow-sm"
            >
              {t('nav.products')}
            </Link>
            <Link 
              href="/about" 
              className="text-[#1a1a1a] hover:text-[#7BB661] transition-colors font-semibold drop-shadow-sm"
            >
              {t('nav.about')}
            </Link>
            <Link 
              href="/gallery" 
              className="text-[#1a1a1a] hover:text-[#7BB661] transition-colors font-semibold drop-shadow-sm"
            >
              {t('nav.gallery')}
            </Link>
            <Link 
              href="/bbq-rentals" 
              className="text-[#1a1a1a] hover:text-[#7BB661] transition-colors font-semibold drop-shadow-sm"
            >
              {t('nav.bbq_rentals')}
            </Link>
            <Link 
              href="/contact" 
              className="text-[#1a1a1a] hover:text-[#7BB661] transition-colors font-semibold drop-shadow-sm"
            >
              {t('nav.contact')}
            </Link>
            
            {/* Login Button */}
            <Link
              href="/login"
              className="flex items-center gap-2 bg-[#7BB661] text-white px-4 py-2 rounded-lg hover:bg-[#6B4E3D] transition-all duration-300 font-semibold"
            >
              <LogIn size={18} />
              Login
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#7BB661] transition-colors font-semibold drop-shadow-sm"
              >
                <Globe size={20} />
                <span>{language === 'en' ? 'EN' : 'සි'}</span>
              </button>
              
              {showLanguageMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border py-2 min-w-[120px] z-50">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors font-medium ${
                      language === 'en' ? 'bg-[#7BB661] text-white' : 'text-[#333333]'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('si');
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors font-medium ${
                      language === 'si' ? 'bg-[#7BB661] text-white' : 'text-[#333333]'
                    }`}
                  >
                    සිංහල
                  </button>
                </div>
              )}
            </div>
            
            <Link 
              href="/contact" 
              className="btn-gradient text-white px-6 py-2 rounded-full font-semibold"
            >
              {t('nav.get_quote')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-[#1a1a1a] drop-shadow-sm"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-lg">
              <Link 
                href="/" 
                className="block px-3 py-2 text-[#333333] hover:text-[#7BB661] transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link 
                href="/products" 
                className="block px-3 py-2 text-[#333333] hover:text-[#7BB661] transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.products')}
              </Link>
              <Link 
                href="/about" 
                className="block px-3 py-2 text-[#333333] hover:text-[#7BB661] transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.about')}
              </Link>
              <Link 
                href="/gallery" 
                className="block px-3 py-2 text-[#333333] hover:text-[#7BB661] transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.gallery')}
              </Link>
              <Link 
                href="/bbq-rentals" 
                className="block px-3 py-2 text-[#333333] hover:text-[#7BB661] transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.bbq_rentals')}
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-[#333333] hover:text-[#7BB661] transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.contact')}
              </Link>

              {/* Mobile Login Button */}
              <Link
                href="/login"
                className="flex items-center gap-2 mx-3 my-2 px-3 py-2 bg-[#7BB661] text-white rounded-lg hover:bg-[#6B4E3D] transition-all duration-300 font-semibold justify-center"
                onClick={() => setIsOpen(false)}
              >
                <LogIn size={18} />
                Login
              </Link>

              {/* Mobile Language Selector */}
              <div className="px-3 py-2">
                <div className="flex items-center gap-2 text-[#333333] mb-2 font-medium">
                  <Globe size={16} />
                  <span className="font-medium">Language</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsOpen(false);
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      language === 'en' ? 'bg-[#7BB661] text-white' : 'bg-gray-200 text-[#333333]'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('si');
                      setIsOpen(false);
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      language === 'si' ? 'bg-[#7BB661] text-white' : 'bg-gray-200 text-[#333333]'
                    }`}
                  >
                    සිංහල
                  </button>
                </div>
              </div>
              
              <Link 
                href="/contact" 
                className="block mx-3 my-2 btn-gradient text-white px-6 py-2 rounded-full font-semibold text-center"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.get_quote')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}