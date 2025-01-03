import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="flex items-center space-x-2 space-x-reverse">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">HR</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  روبوت الموارد البشرية
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              <NavLink href="/" isActive={location.pathname === '/'}>
                الرئيسية
              </NavLink>
              <NavLink href="/features" isActive={location.pathname === '/features'}>
                المميزات
              </NavLink>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium hover:shadow-lg transition-shadow"
                >
                  تسجيل الدخول
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? 'auto' : 0
          }}
          className="md:hidden bg-white border-t"
        >
          <div className="px-4 py-2 space-y-1">
            <MobileNavLink href="/" isActive={location.pathname === '/'}>
              الرئيسية
            </MobileNavLink>
            <MobileNavLink href="/features" isActive={location.pathname === '/features'}>
              المميزات
            </MobileNavLink>
            <Link
              to="/login"
              className="block w-full text-center px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium"
            >
              تسجيل الدخول
            </Link>
          </div>
        </motion.div>
      </motion.nav>

      <main className="pt-20">{children}</main>

      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">روبوت الموارد البشرية</h3>
              <p className="text-gray-400">
                حلول ذكية لإدارة الموارد البشرية في مؤسستك
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    الرئيسية
                  </Link>
                </li>
                <li>
                  <Link to="/features" className="text-gray-400 hover:text-white">
                    المميزات
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">تواصل معنا</h3>
              <p className="text-gray-400">
                البريد الإلكتروني: info@hrchatbot.com
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Navigation Link Components
const NavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => (
  <Link
    to={href}
    className={`relative text-lg font-medium transition-colors ${
      isActive ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
    }`}
  >
    {children}
    {isActive && (
      <motion.div
        layoutId="underline"
        className="absolute right-0 left-0 bottom-0 h-0.5 bg-primary-600"
      />
    )}
  </Link>
);

const MobileNavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => (
  <Link
    to={href}
    className={`block px-4 py-2 rounded-lg transition-colors ${
      isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
    }`}
  >
    {children}
  </Link>
);

export default Layout;