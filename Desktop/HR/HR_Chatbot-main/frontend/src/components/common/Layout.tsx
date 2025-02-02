import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence import
import { 
  Menu, 
  X, 
  User, 
  LogOut,
  MessageSquare,
  Bot,
  FileText,
  Ticket
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const isOnChatPage = location.pathname === '/chat';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToChat = () => {
    if (!isOnChatPage) {
      navigate('/chat');
    }
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    const items = [
      { href: '/', label: 'الرئيسية', isActive: location.pathname === '/' }
    ];

    if (isAdmin) {
      items.push(
        { 
          href: '/documents', 
          label: 'المستندات', 
          isActive: location.pathname === '/documents' 
        },
        { 
          href: '/tickets', 
          label: 'التذاكر', 
          isActive: location.pathname === '/tickets' 
        }
      );
    }

    return items;
  };

  const navigationItems = getNavigationItems();

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
            {/* Logo */}
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
              {navigationItems.map((item) => (
                <NavLink 
                  key={item.href}
                  href={item.href}
                  isActive={item.isActive}
                >
                  {item.label}
                </NavLink>
              ))}
              
              {/* Chat Button */}
              {user && !isOnChatPage && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={navigateToChat}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
                >
                  <Bot className="w-5 h-5" />
                  <span>المساعد الافتراضي</span>
                </motion.button>
              )}

              {/* Login/Logout Button */}
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="px-6 py-3 rounded-full border-2 border-primary-500 text-primary-600 font-medium hover:bg-primary-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  تسجيل الخروج
                </motion.button>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium hover:shadow-lg transition-shadow"
                  >
                    <User className="w-5 h-5 inline-block mr-2" />
                    تسجيل الدخول
                  </Link>
                </motion.div>
              )}
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
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="px-4 py-2 space-y-1">
                {navigationItems.map((item) => (
                  <MobileNavLink
                    key={item.href}
                    href={item.href}
                    isActive={item.isActive}
                  >
                    {item.label}
                  </MobileNavLink>
                ))}
                
                {/* Mobile Chat Button */}
                {user && !isOnChatPage && (
                  <button
                    onClick={navigateToChat}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <Bot className="w-5 h-5" />
                    المساعد الافتراضي
                  </button>
                )}

                {/* Mobile Login/Logout Button */}
                {user ? (
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 border-2 border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    تسجيل الخروج
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg"
                  >
                    <User className="w-5 h-5 inline-block mr-2" />
                    تسجيل الدخول
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <main className="pt-20">{children}</main>
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