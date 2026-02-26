import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { useState, useEffect, Suspense } from 'react';
import { Toaster } from 'sonner';
import './i18n'; // Import i18n first
import { Navigation } from './components/Navigation';
import MilaAuth from './components/MilaAuth';
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
import { useTranslation } from 'react-i18next';
import { AppFooter } from './components/AppFooter';
import { ScrollToTop } from './components/ScrollToTop';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import LazyLoading from '../imports/LazyLoading';

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
          
          // Check various places where onboarding status might be stored
          // for session restoration (same logic as handleLogin)
          const isProfileComplete = 
            session.user?.profile_complete === true || 
            session.user?.onboardingComplete === true ||
            session.user?.user_metadata?.onboardingComplete === true || 
            session.user?.onboarding_status?.completed === true ||
            localStorage.getItem('hasOnboarded') === 'true';

          if (isProfileComplete) {
              setHasCompletedOnboarding(true);
          } else {
              setHasCompletedOnboarding(false);
          }
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
    
    // Check if user has onboarded (legacy check) or force new onboarding
    const hasOnboarded = localStorage.getItem('hasOnboarded') === 'true';
    
    // Check various places where onboarding status might be stored to support both
    // custom auth (profile_complete) and Supabase auth (user_metadata)
    const isProfileComplete = 
      user?.profile_complete === true || 
      user?.onboardingComplete === true ||
      user?.user_metadata?.onboardingComplete === true || 
      user?.onboarding_status?.completed === true ||
      hasOnboarded;
    
    if (isProfileComplete) {
         setHasCompletedOnboarding(true);
    } else {
         setHasCompletedOnboarding(false);
    }
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
    return <LazyLoading />;
  }

  // Default: Show marketing website
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Suspense fallback={<LazyLoading />}>
          <Routes>
            {/* Login/Auth Routes */}
            <Route 
              path="/login" 
              element={
              !isLoggedIn ? (
                <>
                  <MilaAuth onLogin={handleLogin} />
                  <Toaster position="top-center" richColors />
                </>
              ) : !hasCompletedOnboarding ? (
                <OnboardingFlow onComplete={handleOnboardingComplete} />
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
                  <MilaAuth onLogin={handleLogin} />
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
        </Suspense>
      </div>
      <PWAInstallPrompt />
    </Router>
  );
}

export default App;