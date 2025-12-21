import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, Phone } from 'lucide-react';
import { PrototypeWelcome } from './PrototypeWelcome';

interface LoginScreenProps {
  onLogin: (phoneNumber: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = () => {
    if (phoneNumber.length >= 10) {
      setIsLoading(true);
      // Simulate OTP send
      setTimeout(() => {
        setIsLoading(false);
        setStep('otp');
      }, 1000);
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      setIsLoading(true);
      // Simulate OTP verification
      setTimeout(() => {
        setIsLoading(false);
        onLogin(phoneNumber);
      }, 1000);
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
          {step === 'phone' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-2xl mb-6 text-foreground">Login to Continue</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-foreground">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10-digit number"
                      className="w-full pl-11 pr-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors"
                      maxLength={10}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We'll send you a verification code
                  </p>
                </div>

                <button
                  onClick={handleSendOTP}
                  disabled={phoneNumber.length < 10 || isLoading}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </button>

                {/* Demo credentials */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Demo Access:</p>
                  <button
                    onClick={() => {
                      setPhoneNumber('9876543210');
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Use: 9876543210
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-2xl mb-2 text-foreground">Enter OTP</h2>
              <p className="text-muted-foreground mb-6">
                Sent to +91 {phoneNumber}
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-foreground">6-Digit Code</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className="w-full pl-11 pr-4 py-3 bg-input-background rounded-lg border-2 border-transparent focus:border-primary outline-none transition-colors text-center tracking-widest text-xl"
                      maxLength={6}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Demo: Use any 6-digit code
                  </p>
                </div>

                <button
                  onClick={handleVerifyOTP}
                  disabled={otp.length < 6 || isLoading}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </button>

                <button
                  onClick={() => setStep('phone')}
                  className="w-full py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Change Number
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}