import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { Navigation } from './components/Navigation';
import { LoginScreen } from './components/LoginScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { MainDashboard } from './components/MainDashboard';
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { JournalBudgetPage } from './pages/JournalBudgetPage';
import { ImpactPage } from './pages/ImpactPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { GetStartedPage } from './pages/GetStartedPage';
import { DashboardPage } from './pages/DashboardPage';
import { getSession, logout as apiLogout, getUserProfile } from '../lib/api';
import { useAppStore } from './store/appStore';
import './i18n';
import { useTranslation } from 'react-i18next';
import { AppFooter } from './components/AppFooter';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const { setUser } = useAppStore();

  useEffect(() => {
    async function checkAuth() {
      setIsCheckingAuth(true);

      try {
        // Check for active session FIRST via api (which checks localStorage 'current_session')
        const session = await getSession();
        
        if (session && session.user) {
          console.log('Restored session from storage:', session.user);
          setCurrentUser(session.user);
          setIsLoggedIn(true);
          setHasCompletedOnboarding(true);
        } else {
          // No valid session found on server.
          // We strictly require server-side validation now.
          // Legacy client-side sessions are no longer supported as they cause "Invalid Token" errors.
          console.log('No valid session found. User must log in.');
          setIsLoggedIn(false);
          setHasCompletedOnboarding(false);
          setCurrentUser(null);
          
          // Clear any stale auth data to prevent confusion
          localStorage.removeItem('current_session');
          localStorage.removeItem('authToken');
          // We intentionally do NOT clear 'currentUser' so we can potentially pre-fill email/phone later if needed,
          // but for now we force a fresh login.
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuth();
    
    // Listen for global logout events from api.ts (e.g. on 401 Unauthorized)
    const handleGlobalLogout = () => {
      console.log('App: Received global logout event');
      setIsLoggedIn(false);
      setHasCompletedOnboarding(false);
      setCurrentUser(null);
      // Clear legacy storage just in case
      localStorage.removeItem('hasOnboarded');
      localStorage.removeItem('currentUser');
    };
    
    window.addEventListener('auth:logout', handleGlobalLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleGlobalLogout);
    };
  }, [setUser]);

  const handleLogin = (user: any) => {
    console.log('=== handleLogin called ===');
    console.log('User object:', user);
    
    setCurrentUser(user);
    setIsLoggedIn(true);
    
    // Persist user to localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user)); // Also store for compatibility
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authStateChanged'));
    
    // SKIP Onboarding Screen - Go straight to Dashboard
    // We will show a tour guide instead
    console.log('✓ Skipping onboarding screen -> Going to Dashboard');
    setHasCompletedOnboarding(true);
    localStorage.setItem('hasOnboarded', 'true');
    
    // Set a flag to trigger the tour in the dashboard
    localStorage.setItem('showDashboardTour', 'true');
  };

  const handleOnboardingComplete = async (profileData: any) => {
    setHasCompletedOnboarding(true);
    setUser(profileData);
    localStorage.setItem('hasOnboarded', 'true');
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authStateChanged'));
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setIsLoggedIn(false);
    setHasCompletedOnboarding(false);
    setCurrentUser(null);
    localStorage.removeItem('hasOnboarded');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('showDashboardTour');
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authStateChanged'));

    // Redirect to home page
    window.location.href = '/';
  };

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center text-3xl animate-pulse">
            🌱
          </div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  // Default: Show marketing website
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Login/Auth Routes */}
          <Route 
            path="/login" 
            element={
              !isLoggedIn ? (
                <>
                  <LoginScreen onLogin={handleLogin} />
                  <Toaster position="top-center" richColors />
                </>
              ) : (
                <>
                  <MainDashboard 
                    farmerName={currentUser?.user_metadata?.name || currentUser?.mobile_number || 'Farmer'} 
                    onLogout={handleLogout} 
                  />
                  <Toaster position="top-center" richColors />
                </>
              )
            } 
          />
          
          {/* App Routes - Redirect to /login if not logged in */}
          <Route 
            path="/app" 
            element={
              !isLoggedIn ? (
                <>
                  <LoginScreen onLogin={handleLogin} />
                  <Toaster position="top-center" richColors />
                </>
              ) : (
                <>
                  <MainDashboard 
                    farmerName={currentUser?.user_metadata?.name || currentUser?.mobile_number || 'Farmer'} 
                    onLogout={handleLogout} 
                  />
                  <Toaster position="top-center" richColors />
                </>
              )
            } 
          />
          
          {/* Marketing Pages */}
          <Route path="/" element={<><Navigation /><HomePage /><AppFooter /></>} />
          <Route path="/how-it-works" element={<><Navigation /><HowItWorksPage /><AppFooter /></>} />
          <Route path="/features" element={<><Navigation /><FeaturesPage /><AppFooter /></>} />
          <Route path="/journal-budget" element={<><Navigation /><JournalBudgetPage /><AppFooter /></>} />
          <Route path="/impact" element={<><Navigation /><ImpactPage /><AppFooter /></>} />
          <Route path="/communities" element={<><Navigation /><CommunitiesPage /><AppFooter /></>} />
          <Route path="/about" element={<><Navigation /><AboutPage /><AppFooter /></>} />
          <Route path="/contact" element={<><Navigation /><ContactPage /><AppFooter /></>} />
          <Route path="/get-started" element={<><Navigation /><GetStartedPage /><AppFooter /></>} />
          <Route path="/dashboard" element={<><Navigation /><DashboardPage /></>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;