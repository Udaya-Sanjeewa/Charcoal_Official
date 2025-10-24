'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Leaf, Globe, LogIn, ShoppingCart, User, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';

export default function Navigation() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { language, setLanguage, t } = useLanguage();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/98 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-lg shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-[#7BB661]" />
            <span className="text-xl font-bold text-[#1a1a1a] drop-shadow-sm">
              EcoFuel Pro
            </span>
          </Link>

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

            <Link href="/cart" className="relative text-[#1a1a1a] hover:text-[#7BB661] transition-colors">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#7BB661] transition-colors font-semibold"
                >
                  <User size={20} />
                  <span>{user.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border py-2 min-w-[180px] z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-red-600 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/user-login"
                  className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#7BB661] transition-colors font-semibold"
                >
                  <LogIn size={18} />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-[#7BB661] text-white px-4 py-2 rounded-lg hover:bg-[#6B4E3D] transition-all duration-300 font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}

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
          </div>

          <div className="md:hidden flex items-center gap-4">
            <Link href="/cart" className="relative text-[#1a1a1a]">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-[#1a1a1a] drop-shadow-sm"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

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

              {user ? (
                <>
                  <div className="px-3 py-2 border-t">
                    <p className="text-sm font-medium text-[#333333] mb-2">Welcome, {user.name}</p>
                    <Link
                      href="/dashboard"
                      className="block py-2 text-[#333333] hover:text-[#7BB661] transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/orders"
                      className="block py-2 text-[#333333] hover:text-[#7BB661] transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      href="/profile"
                      className="block py-2 text-[#333333] hover:text-[#7BB661] transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 py-2 text-red-600"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/user-login"
                    className="flex items-center gap-2 mx-3 my-2 px-3 py-2 border-2 border-[#7BB661] text-[#7BB661] rounded-lg hover:bg-[#7BB661] hover:text-white transition-all duration-300 font-semibold justify-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn size={18} />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-2 mx-3 my-2 px-3 py-2 bg-[#7BB661] text-white rounded-lg hover:bg-[#6B4E3D] transition-all duration-300 font-semibold justify-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={18} />
                    Sign Up
                  </Link>
                </>
              )}

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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
