import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, Phone, Mail } from 'lucide-react';
import { PrototypeWelcome } from './PrototypeWelcome';
import { login, signup, setAuthToken, getAuthToken } from '../../lib/api';
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
    setEmail('demo@farmcompanion.com');
    setPassword('demo123456');
    setIsLoading(true);
    
    try {
      // Try to login with demo account
      const response = await login('demo@farmcompanion.com', 'demo123456');
      toast.success('Demo login successful!');
      onLogin(response.user);
      setAuthToken(response.session?.access_token);
    } catch (error) {
      // If demo account doesn't exist, create it
      try {
        await signup({
          email: 'demo@farmcompanion.com',
          password: 'demo123456',
          name: 'Rajesh Kumar',
          language: 'English',
          location: 'Maharashtra, India',
        });
        
        const response = await login('demo@farmcompanion.com', 'demo123456');
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-primary/5 to-background">
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

              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="w-full py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
              </button>

              {/* Demo credentials */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Quick Demo Access:</p>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="text-sm text-primary hover:underline disabled:opacity-50"
                >
                  Login with Demo Account
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}