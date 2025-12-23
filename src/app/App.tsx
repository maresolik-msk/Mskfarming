import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { Navigation } from './components/Navigation';
import { LoginScreen } from './components/LoginScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
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
  const [showPrototype, setShowPrototype] = useState(false);
  
  const { setUser } = useAppStore();

  // Check if user wants to see the working prototype
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('prototype') === 'true') {
      setShowPrototype(true);
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    async function checkAuth() {
      if (!showPrototype) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const response = await getSession();
        
        if (response.user) {
          setCurrentUser(response.user);
          setIsLoggedIn(true);
          
          // Try to get user profile to check if onboarding is complete
          try {
            const profile = await getUserProfile();
            if (profile && profile.onboardingComplete) {
              setHasCompletedOnboarding(true);
              setUser(profile);
            }
          } catch (error) {
            console.log('No profile found, need onboarding');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuth();
  }, [showPrototype, setUser]);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    
    // Check if user has completed onboarding (check localStorage as fallback)
    const hasOnboarded = localStorage.getItem('hasOnboarded');
    if (hasOnboarded) {
      setHasCompletedOnboarding(true);
    }
  };

  const handleOnboardingComplete = async (profileData: any) => {
    setHasCompletedOnboarding(true);
    setUser(profileData);
    localStorage.setItem('hasOnboarded', 'true');
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
    setShowPrototype(false);
    localStorage.removeItem('hasOnboarded');
  };

  // Show loading state while checking auth
  if (showPrototype && isCheckingAuth) {
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

  // If prototype mode is enabled, show the working prototype
  if (showPrototype) {
    if (!isLoggedIn) {
      return (
        <>
          <LoginScreen onLogin={handleLogin} />
          <Toaster position="top-center" richColors />
        </>
      );
    }

    if (!hasCompletedOnboarding) {
      return (
        <>
          <OnboardingFlow onComplete={handleOnboardingComplete} />
          <Toaster position="top-center" richColors />
        </>
      );
    }

    return (
      <>
        <MainDashboard 
          farmerName={currentUser?.user_metadata?.name || 'Farmer'} 
          onLogout={handleLogout} 
        />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  // Default: Show marketing website
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/journal-budget" element={<JournalBudgetPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
        
        {/* Footer */}
        <footer className="border-t border-border mt-20 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground">🌱</span>
                  </div>
                  <span className="text-xl text-foreground">Farm Companion</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Your personal farming companion for every season.
                </p>
              </div>
              
              <div>
                <h3 className="mb-4 text-foreground">Platform</h3>
                <ul className="space-y-2">
                  <li><a href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a></li>
                  <li><a href="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="/impact" className="text-muted-foreground hover:text-foreground transition-colors">Impact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-4 text-foreground">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="/communities" className="text-muted-foreground hover:text-foreground transition-colors">For Communities</a></li>
                  <li><a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
                  <li><a href="/get-started" className="text-muted-foreground hover:text-foreground transition-colors">Get Started</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-4 text-foreground">Legal</h3>
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
      </div>
    </Router>
  );
}

export default App;