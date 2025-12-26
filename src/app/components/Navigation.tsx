import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  
  const handleGetStartedClick = (e: React.MouseEvent) => {
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
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground">🌱</span>
              </div>
              <span className="text-xl text-foreground">MS Farm</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 text-foreground/80 hover:text-foreground transition-colors"
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <button
              onClick={handleGetStartedClick}
              className="ml-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-6 space-y-2"
          >
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg ${
                  location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/80 hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleGetStartedClick}
              className="w-full block px-4 py-3 bg-primary text-primary-foreground rounded-lg text-center mt-4"
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
            </button>
          </motion.div>
        )}
      </div>
    </nav>
  );
}