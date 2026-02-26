import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CirclePlay, FileText, Smartphone } from 'lucide-react';

export function PrototypeWelcome() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome message
    const hasSeenWelcome = localStorage.getItem('hasSeenPrototypeWelcome');
    if (!hasSeenWelcome) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenPrototypeWelcome', 'true');
    setShow(false);
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenPrototypeWelcome', 'true');
    localStorage.setItem('hasOnboarded', 'true');
    localStorage.setItem('farmerName', 'Demo User');
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-card rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6 flex-shrink-0">
              <div>
                <h2 className="text-3xl mb-2 text-foreground">Welcome to the Prototype! 🌾</h2>
                <p className="text-muted-foreground">
                  Experience the complete farmer companion journey
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 mb-6 pr-2">
              {/* Quick Guide */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-foreground mb-1">Login</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the <strong>Login with Demo Account</strong> button or email: <span className="text-primary">demo@farmerdemo.com</span> / password: <span className="text-primary">demo123</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-foreground mb-1">Complete Onboarding</h4>
                    <p className="text-sm text-muted-foreground">
                      5 simple steps to set up your farm profile (3-5 minutes)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-foreground mb-1">Explore Features</h4>
                    <p className="text-sm text-muted-foreground">
                      Try voice journal, photo analysis, expense tracking, and daily tasks
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="mb-8">
                <h3 className="text-lg mb-4 text-foreground">What You Can Try:</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      ✓
                    </div>
                    Voice Journal
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      ✓
                    </div>
                    Photo Analysis
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      ✓
                    </div>
                    Expense Tracking
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      ✓
                    </div>
                    Daily Tasks
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      ✓
                    </div>
                    Budget Overview
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      ✓
                    </div>
                    AI Recommendations
                  </div>
                </div>
              </div>

              {/* Documentation */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="text-sm mb-2 text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documentation Available
                </h4>
                <p className="text-xs text-muted-foreground">
                  Check <span className="text-primary">PROTOTYPE_GUIDE.md</span> and{' '}
                  <span className="text-primary">POST_LOGIN_FLOW.md</span> for detailed information
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={handleSkip}
                className="flex-1 py-3 rounded-lg border-2 border-border hover:bg-muted transition-colors text-sm"
              >
                Skip to Dashboard
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <CirclePlay className="w-5 h-5" />
                Start Prototype
              </button>
            </div>

            {/* Mobile Tip */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground flex-shrink-0">
              <Smartphone className="w-4 h-4" />
              Best experienced on mobile or narrow browser window
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}