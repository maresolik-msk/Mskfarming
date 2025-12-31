import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, X, Sprout } from 'lucide-react';
import { useState, useEffect, MouseEvent } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MilaLogo } from './MilaLogo';
import Logo from '../../imports/Logo';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    const checkAuthState = () => {
      const storedUser = localStorage.getItem('currentUser');
      setIsLoggedIn(!!storedUser);
    };
    
    // Check on mount
    checkAuthState();
    
    // Listen for auth state changes
    window.addEventListener('authStateChanged', checkAuthState);
    
    // Cleanup
    return () => {
      window.removeEventListener('authStateChanged', checkAuthState);
    };
  }, []);
  
  const handleGetStartedClick = (e: MouseEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    const hasOnboarded = localStorage.getItem('hasOnboarded');
    
    console.log('[Navigation] Get Started clicked:', { 
      isLoggedIn: !!storedUser, 
      hasOnboarded: !!hasOnboarded 
    });
    
    if (storedUser) {
      // User is logged in - check if they've completed onboarding
      if (hasOnboarded) {
        console.log('[Navigation] Redirecting to dashboard');
        navigate('/app');
      } else {
        // User needs to complete onboarding (or just go to app since we auto-complete now)
        console.log('[Navigation] Redirecting to app');
        navigate('/app');
      }
    } else {
      // Not logged in - go to get-started page
      console.log('[Navigation] Redirecting to get-started page');
      navigate('/get-started');
    }
    
    setMobileMenuOpen(false);
  };
  
  const links = [
    { path: '/', label: 'Home' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/features', label: 'Features' },
    { path: '/impact', label: 'Impact' },
    { path: '/communities', label: 'Communities' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-24">
          {/* Left: Desktop Navigation Links */}
          <div className="hidden md:flex flex-1 items-center justify-start z-20">
            <div className="flex items-center gap-1 p-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] border border-black/5">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-5 py-2.5 text-sm font-medium transition-colors rounded-full ${
                      isActive 
                        ? 'text-[#812F0F]' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-[#812F0F]/10 rounded-full"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <Link 
              to="/"  
              className="flex items-center group relative"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10"
              >
                <MilaLogo className="h-10 md:h-12 w-auto" />
              </motion.div>
              {/* Subtle glow behind logo on hover */}
              <div className="absolute inset-0 bg-[#812F0F]/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
            </Link>
          </div>

          {/* Right: Actions & Mobile Menu */}
          <div className="flex flex-1 items-center justify-end gap-4 z-20">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <div className="border-r border-gray-200 pr-4">
                <LanguageSwitcher />
              </div>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#6b260c' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetStartedClick}
                className="px-6 py-2.5 bg-[#812F0F] text-white font-medium rounded-full shadow-lg shadow-[#812F0F]/20 transition-all text-sm flex items-center gap-2"
              >
                {isLoggedIn ? 'Dashboard' : 'Get Started'}
                {!isLoggedIn && <Sprout size={16} className="text-[#FFDbb5]" />}
              </motion.button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={mobileMenuOpen ? { height: 'auto', opacity: 1, display: 'block' } : { height: 0, opacity: 0, transitionEnd: { display: 'none' } }}
          className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-gray-100"
        >
            <div className="px-4 py-6 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl transition-all text-base ${
                    location.pathname === link.path
                      ? 'bg-[#812F0F]/5 text-[#812F0F] font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl transition-all text-base ${
                  location.pathname === '/contact'
                    ? 'bg-[#812F0F]/5 text-[#812F0F] font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Contact
              </Link>
              <div className="pt-6 mt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6 px-2">
                   <span className="text-gray-500 font-medium">Language</span>
                   <LanguageSwitcher />
                </div>
                <button
                  onClick={handleGetStartedClick}
                  className="w-full flex justify-center items-center gap-2 px-4 py-3.5 bg-[#812F0F] text-white font-medium rounded-xl text-center shadow-lg shadow-[#812F0F]/20 active:scale-95 transition-all"
                >
                  {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
                  {!isLoggedIn && <Sprout size={18} className="text-[#FFDbb5]" />}
                </button>
              </div>
            </div>
        </motion.div>
      </div>
    </nav>
  );
}