import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { Navigation } from './components/Navigation';
import { LoginScreen } from './components/LoginScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { PostLoginOnboarding } from './components/PostLoginOnboarding';
import { MainDashboard } from './components/MainDashboard';
import { PrototypeWelcome } from './components/PrototypeWelcome';
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { JournalBudgetPage } from './pages/JournalBudgetPage';
import { ImpactPage } from './pages/ImpactPage';
import { CommunitiesPage } from './pages/CommunitiesPage';
import { AboutPage } from './pages/AboutPage';
import { GetStartedPage } from './pages/GetStartedPage';
import { DashboardPage } from './pages/DashboardPage';
import { getSession, logout as apiLogout, getUserProfile } from '../lib/api';
import { useAppStore } from './store/appStore';

function App() {
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
          // Fallback: Check for legacy 'currentUser' in localStorage
          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            console.log('Restored legacy user from storage');
            const user = JSON.parse(storedUser);
            
            // MIGRATION: Create a proper session for legacy users
            // This ensures api.ts functions like getCurrentUserId() work correctly
            const userId = user.id || `user_legacy_${Date.now()}`;
            const migratedUser = { ...user, id: userId };
            const sessionToken = `session_${userId}_${Date.now()}`;
            
            const newSession = {
                access_token: sessionToken,
                user: migratedUser
            };
            
            localStorage.setItem('current_session', JSON.stringify(newSession));
            console.log('Migrated legacy user to session-based auth');
            
            setCurrentUser(migratedUser);
            setIsLoggedIn(true);
            setHasCompletedOnboarding(true);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuth();
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
  };

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center text-3xl animate-pulse">
            🌱
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Toaster position="top-center" richColors />
      </div>
    );
  }

  // Default: Show marketing website
  return (
    <Router>
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
          <Route path="/" element={<><Navigation /><HomePage /></>} />
          <Route path="/how-it-works" element={<><Navigation /><HowItWorksPage /></>} />
          <Route path="/features" element={<><Navigation /><FeaturesPage /></>} />
          <Route path="/journal-budget" element={<><Navigation /><JournalBudgetPage /></>} />
          <Route path="/impact" element={<><Navigation /><ImpactPage /></>} />
          <Route path="/communities" element={<><Navigation /><CommunitiesPage /></>} />
          <Route path="/about" element={<><Navigation /><AboutPage /></>} />
          <Route path="/get-started" element={<><Navigation /><GetStartedPage /></>} />
          <Route path="/dashboard" element={<><Navigation /><DashboardPage /></>} />
        </Routes>
        
        {/* Footer - Only show when NOT logged in */}
        {!isLoggedIn && (
        <footer className="dark bg-background text-foreground mt-20 py-12 px-4 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground">🌱</span>
                  </div>
                  <span className="text-xl font-serif font-bold text-foreground">Farm Companion</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Your personal farming companion for every season.
                </p>
              </div>
              
              <div>
                <h3 className="mb-4 text-lg font-serif font-bold text-foreground">Platform</h3>
                <ul className="space-y-2">
                  <li><a href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a></li>
                  <li><a href="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="/impact" className="text-muted-foreground hover:text-foreground transition-colors">Impact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-4 text-lg font-serif font-bold text-foreground">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="/communities" className="text-muted-foreground hover:text-foreground transition-colors">For Communities</a></li>
                  <li><a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
                  <li><a href="/get-started" className="text-muted-foreground hover:text-foreground transition-colors">Get Started</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-4 text-lg font-serif font-bold text-foreground">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-border text-center text-muted-foreground">
              <p>© 2025 MS Farm. Built by farmer for farmers.</p>
            </div>
          </div>
        </footer>
        )}
      </div>
    </Router>
  );
}

export default App;