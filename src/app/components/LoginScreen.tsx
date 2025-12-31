import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, Phone, Mail, RefreshCw } from 'lucide-react';
import { PrototypeWelcome } from './PrototypeWelcome';
import { MobileAuthScreen } from './MobileAuthScreen';
import { DebugPanel } from './DebugPanel';
import { login, signup, setAuthToken, getAuthToken, resetDemoAccount, clearAllAuthData } from '../../lib/api';
import { toast } from 'sonner';

interface LoginScreenProps {
  onLogin: (user: any) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'email' | 'mobile'>('mobile'); // Default to mobile OTP

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(email, password);
      
      // The login function already sets the token, but let's verify
      if (response.session?.access_token) {
        setAuthToken(response.session.access_token);
        console.log('Login successful - token set');
      }
      
      toast.success('Login successful!');
      onLogin(response.user);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Auto-fix demo account if login failed
      if (email === 'demo@farmerdemo.com' && password === 'demo123') {
        console.log('Demo login failed, attempting to repair account...');
        try {
          await signup({
            email: 'demo@farmerdemo.com',
            password: 'demo123',
            name: 'Demo Farmer',
            phone: '9876543210',
            language: 'English',
            location: 'Punjab, India',
          });
          
          // Retry login
          const response = await login(email, password);
          toast.success('Login successful (account repaired)!');
          onLogin(response.user);
          return;
        } catch (repairError) {
          console.error('Failed to repair demo account:', repairError);
        }
      }

      toast.error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !name) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      console.log('=== SIGNUP FLOW START ===');
      await signup({
        email,
        password,
        name,
        language: 'English',
        location: 'India',
      });
      
      console.log('Signup successful, waiting 2 seconds before login...');
      toast.success('Account created! Logging in...');
      
      // Wait longer for the user to be fully created and confirmed
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Auto-login after signup
      console.log('Now attempting login...');
      const response = await login(email, password);
      console.log('=== LOGIN RESPONSE ===');
      console.log('Full response:', JSON.stringify(response, null, 2));
      console.log('Has session?', !!response.session);
      console.log('Has access_token?', !!response.session?.access_token);
      
      if (response.session?.access_token) {
        console.log('Access token preview:', response.session.access_token.substring(0, 30));
        console.log('MANUALLY setting auth token from LoginScreen');
        setAuthToken(response.session.access_token);
        
        // Verify token was set
        const verifyToken = getAuthToken();
        console.log('Token verification after setting:', !!verifyToken);
        console.log('LocalStorage has token:', !!localStorage.getItem('authToken'));
      } else {
        console.error('ERROR: No access token in response!');
        toast.error('Login failed - no access token received. Please try logging in manually.');
        return;
      }
      
      console.log('Has user?', !!response.user);
      console.log('=== END LOGIN RESPONSE ===');
      console.log('About to call onLogin with user:', response.user);
      onLogin(response.user);
      console.log('=== SIGNUP FLOW END ===');
    } catch (error: any) {
      console.error('Signup/Login error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      handleSignup();
    } else {
      handleLogin();
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@farmerdemo.com');
    setPassword('demo123');
    setIsLoading(true);
    
    try {
      // Try to login with demo account
      const response = await login('demo@farmerdemo.com', 'demo123');
      toast.success('Demo login successful!');
      onLogin(response.user);
      setAuthToken(response.session?.access_token);
    } catch (error) {
      // If demo account doesn't exist, create it
      try {
        await signup({
          email: 'demo@farmerdemo.com',
          password: 'demo123',
          name: 'Demo Farmer',
          phone: '9876543210',
          language: 'English',
          location: 'Punjab, India',
        });
        
        const response = await login('demo@farmerdemo.com', 'demo123');
        toast.success('Demo account created and logged in!');
        onLogin(response.user);
        setAuthToken(response.session?.access_token);
      } catch (signupError: any) {
        console.error('Demo account creation failed:', signupError);
        toast.error('Failed to access demo account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetDemoAccount = async () => {
    setIsLoading(true);
    try {
      await resetDemoAccount();
      toast.success('Demo account reset successfully!');
    } catch (error: any) {
      console.error('Failed to reset demo account:', error);
      toast.error('Failed to reset demo account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAllAuthData = async () => {
    setIsLoading(true);
    try {
      await clearAllAuthData();
      toast.success('All authentication data cleared successfully!');
    } catch (error: any) {
      console.error('Failed to clear all authentication data:', error);
      toast.error('Failed to clear all authentication data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Important Notice Banner */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-full px-4">
        
      </div>

      {/* Show Mobile Auth Screen if mobile mode is selected */}
      {authMode === 'mobile' ? (
        <MobileAuthScreen 
          onAuthSuccess={onLogin}
        />
      ) : (
        <>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* MVP Notice Banner */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-full px-4">
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 backdrop-blur-sm">
          <p className="text-xs text-center text-foreground">
            <span className="font-semibold">MVP Mode:</span> Authentication is client-side only (localStorage). Data persists locally in your browser.
          </p>
        </div>
      </div>

      <PrototypeWelcome />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center text-4xl shadow-lg">
            🌱
          </div>
          <h1 className="text-3xl mb-2 text-foreground">Farm Companion</h1>
          <p className="text-muted-foreground">Your trusted farming partner</p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl mb-6 text-foreground">
              {isSignup ? 'Create Account' : 'Login to Continue'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <div>
                  <label className="block mb-2 text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-11 pr-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block mb-2 text-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                  />
                </div>
                {isSignup && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Minimum 6 characters
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Login')}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  className="flex-1 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  {isSignup ? 'Login' : 'Sign up'}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('mobile')}
                  className="flex-1 py-2 text-primary hover:text-primary/80 transition-colors text-sm flex items-center justify-center gap-1"
                >
                  <Phone className="w-4 h-4" />
                  Mobile OTP
                </button>
              </div>

              {/* Demo credentials */}
              {!isSignup && (
                <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm mb-2">
                    <span className="font-semibold text-foreground">Demo Account:</span>
                  </p>
                  <div className="space-y-1 text-sm text-muted-foreground mb-3">
                    <p>Email: <span className="font-mono text-foreground">demo@farmerdemo.com</span></p>
                    <p>Password: <span className="font-mono text-foreground">demo123</span></p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                    className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    Auto-fill Demo Login
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          By continuing, you agree to our Terms & Privacy Policy
        </p>

        {/* Troubleshooting Section */}
        {!isSignup && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Having trouble logging in?
            </p>
            <div className="space-y-2">
              <button
                onClick={handleResetDemoAccount}
                disabled={isLoading}
                className="w-full text-xs py-2 px-3 bg-background hover:bg-background/80 text-foreground rounded border border-border transition-colors disabled:opacity-50 text-left"
              >
                Reset Demo Account (if corrupted)
              </button>
              <button
                onClick={handleClearAllAuthData}
                disabled={isLoading}
                className="w-full text-xs py-2 px-3 bg-background hover:bg-background/80 text-foreground rounded border border-border transition-colors disabled:opacity-50 text-left"
              >
                Clear All Auth Data (fresh start)
              </button>
            </div>
          </div>
        )}
      </motion.div>
      </>
      )}
    </div>
  );
}