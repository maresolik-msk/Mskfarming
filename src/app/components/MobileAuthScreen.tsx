import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, Check, AlertCircle, Loader2, Phone, Hash, CheckCircle, User, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { setAuthToken } from '../../lib/api';
import Logo from '../../imports/Logo3-123-539';

// Import Supabase config
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

type AuthStep = 'mobile' | 'otp' | 'success';
type UserRole = 'farmer' | 'expert' | 'admin';
type Language = 'english' | 'hindi' | 'telugu' | 'tamil' | 'kannada' | 'marathi' | 'bengali' | 'gujarati';

interface MobileAuthScreenProps {
  onAuthSuccess: (user: any) => void;
}

const LANGUAGES = [
  { code: 'english', label: 'English', native: 'English' },
  { code: 'hindi', label: 'Hindi', native: 'हिंदी' },
  { code: 'telugu', label: 'Telugu', native: 'తెలుగు' },
  { code: 'tamil', label: 'Tamil', native: 'தமிழ்' },
  { code: 'kannada', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'marathi', label: 'Marathi', native: 'मराठी' },
  { code: 'bengali', label: 'Bengali', native: 'বাংলা' },
  { code: 'gujarati', label: 'Gujarati', native: 'ગુજરાતી' },
];

const ROLES = [
  { 
    value: 'farmer', 
    label: 'Farmer', 
    description: 'I grow crops and manage farmland',
    icon: '🌾'
  },
  { 
    value: 'expert', 
    label: 'Agricultural Expert', 
    description: 'I provide farming advice and consultation',
    icon: '👨‍🌾'
  },
  { 
    value: 'admin', 
    label: 'Administrator', 
    description: 'Platform management and support',
    icon: '⚙️'
  },
];

export function MobileAuthScreen({ onAuthSuccess }: MobileAuthScreenProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<AuthStep>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [language, setLanguage] = useState<Language>('english');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSentMessage, setOtpSentMessage] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);

  const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6fdef95d`;

  // Format mobile number as user types
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(value);
    setError(null);
  };

  // Validate mobile number
  const isValidMobile = (mobile: string) => {
    return /^[6-9]\d{9}$/.test(mobile);
  };

  // Send OTP
  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    // Validation
    if (!isValidMobile(mobileNumber)) {
      setError('Please enter a valid 10-digit Indian mobile number (starting with 6-9)');
      return;
    }

    setLoading(true);

    try {
      console.log('📱 Sending OTP to:', mobileNumber);
      
      const response = await fetch(`${SERVER_URL}/auth/otp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          mobile_number: mobileNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      console.log('✅ OTP sent successfully:', data);
      setIsNewUser(data.isNewUser);
      
      // In development, the OTP is returned in the response (REMOVE IN PRODUCTION!)
      if (data.otp) {
        setOtpSentMessage(`OTP sent! (Dev mode: ${data.otp})`);
        toast.success(`OTP sent to ${mobileNumber}!`, {
          duration: 5000,
        });
        console.log('🔐 OTP (FOR TESTING):', data.otp);
        setIsDevelopment(true);
      } else {
        setOtpSentMessage('OTP sent successfully!');
        toast.success(`OTP sent to ${mobileNumber}!`);
      }

      setStep('otp');
    } catch (err: any) {
      console.error('Send OTP error:', err);
      setError(err.message || 'Failed to send OTP');
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Verifying OTP...');
      
      const response = await fetch(`${SERVER_URL}/auth/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          mobile_number: mobileNumber,
          otp: otp,
          role: role,
          language: language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      console.log('✅ OTP verified successfully:', data);
      console.log('Session data:', data.session);
      console.log('Access token:', data.session?.access_token ? 'EXISTS' : 'MISSING');
      console.log('User data:', data.user);

      // Store auth tokens - CRITICAL for authentication!
      if (data.session?.access_token) {
        console.log('💾 Storing authentication tokens in localStorage...');
        setAuthToken(data.session.access_token);
        localStorage.setItem('refresh_token', data.session.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Verify storage
        const storedToken = localStorage.getItem('authToken');
        console.log('✅ Token stored successfully:', storedToken ? 'YES' : 'NO');
        console.log('Token preview:', storedToken ? storedToken.substring(0, 30) + '...' : 'NONE');
      } else {
        console.error('❌ NO ACCESS TOKEN IN RESPONSE!');
        console.error('Response structure:', JSON.stringify(data, null, 2));
        throw new Error('No access token received from server');
      }

      toast.success(data.isNewUser ? 'Welcome! Account created successfully!' : 'Welcome back!');
      
      setStep('success');
      
      // Call parent callback after a brief delay
      setTimeout(() => {
        onAuthSuccess(data.user);
      }, 1500);

    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setError(err.message || 'Failed to verify OTP');
      toast.error(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = () => {
    setOtp('');
    handleSendOTP();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Back Button */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-4 left-4 z-50 p-2 rounded-[0px] bg-background/20 backdrop-blur-sm border border-foreground/10 text-foreground hover:bg-background/40 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* OTP Authentication Notice */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-full px-4">
      
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-[12px] mt-[0px] mr-[0px] ml-[0px]">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center text-4xl shadow-lg">
            <Logo />
          </div>
          <h1 className="text-3xl mb-2 text-foreground font-[Kugile]">MILA</h1>
          <p className="text-muted-foreground">Your farming companion</p>
        </div>

        {/* Auth Card */}
        <div className="bg-card rounded-[0px] p-8 shadow-xl border border-border">
          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Step 1: Enter Mobile Number + Role + Language + Consent */}
            {step === 'mobile' && (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div>
                  <h2 className="text-2xl mb-2 text-foreground">Login or Signup</h2>
                  <p className="text-sm text-muted-foreground">
                    We'll send you a one-time password
                  </p>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block mb-2 text-sm text-foreground">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={handleMobileChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full pl-11 pr-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter 10-digit Indian mobile number
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isValidMobile(mobileNumber)}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-[0px] hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Get OTP
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Enter OTP */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div>
                  <h2 className="text-2xl mb-2 text-foreground">
                    {isNewUser ? 'Complete Signup' : 'Enter OTP'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Sent to {mobileNumber}
                    <button
                      type="button"
                      onClick={() => setStep('mobile')}
                      className="ml-2 text-primary hover:underline"
                    >
                      Change
                    </button>
                  </p>
                  {otpSentMessage && (
                    <div className="mt-2 p-2 bg-primary/10 border border-primary/30 rounded-[0px]">
                      <p className="text-xs text-foreground flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {otpSentMessage}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm text-foreground">6-Digit OTP</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => {
                        // Only allow digits and limit to 6
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(value);
                        setError(null);
                      }}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full pl-11 pr-4 py-3 bg-input-background rounded-[0px] border-2 border-transparent focus:border-primary outline-none transition-colors text-center text-2xl tracking-widest font-mono"
                      autoFocus
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    OTP expires in 5 minutes
                  </p>
                </div>

                {/* New User: Role & Language & Consent */}
                {isNewUser && (
                  <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="h-px bg-border my-4" />
                    
                    {/* Role Selection */}
                    <div>
                      <label className="block mb-2 text-sm text-foreground">I am a *</label>
                      <div className="space-y-2">
                        {ROLES.map((r) => (
                          <label
                            key={r.value}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              role === r.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="role"
                              value={r.value}
                              checked={role === r.value}
                              onChange={(e) => setRole(e.target.value as UserRole)}
                              className="sr-only"
                            />
                            <div className="text-2xl">{r.icon}</div>
                            <div className="flex-1">
                              <div className="text-sm text-foreground">{r.label}</div>
                              <div className="text-xs text-muted-foreground">{r.description}</div>
                            </div>
                            {role === r.value && (
                              <Check className="w-5 h-5 text-primary" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Language Selection */}
                    <div>
                      <label className="block mb-2 text-sm text-foreground">Preferred Language *</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="w-full px-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                      >
                        {LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.label} ({lang.native})
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-muted-foreground">
                        AI recommendations will be in this language
                      </p>
                    </div>

                    {/* Consent Checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-border focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-xs text-muted-foreground">
                        I agree to the{' '}
                        <a href="#" className="text-primary hover:underline">
                          Terms & Conditions
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                        . I consent to receiving AI-powered agronomic advice based on my data.
                      </span>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6 || (isNewUser && !consent)}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-[0px] hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      {isNewUser ? 'Create Account' : 'Verify & Login'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    Didn't receive OTP? Resend
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Success */}
            {step === 'success' && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <Check className="w-10 h-10 text-primary" />
                </motion.div>
                <h2 className="text-2xl mb-2 text-foreground">Success!</h2>
                <p className="text-sm text-muted-foreground">
                  Logging you in...
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}