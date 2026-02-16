import { motion } from 'motion/react';
import { User, Users2, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export function GetStartedPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'farmer' | 'partner' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    language: 'English',
    farmSize: '',
    organization: '',
    role: '',
  });

  // Redirect if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const hasOnboarded = localStorage.getItem('hasOnboarded');
    
    if (storedUser && hasOnboarded) {
      // User is already logged in and onboarded - redirect to dashboard
      navigate('/dashboard');
    } else if (storedUser) {
      // User is logged in but needs to complete onboarding
      navigate('/');
    }
  }, [navigate]);

  const languages = ['English', 'हिंदी', 'मराठी', 'தமிழ்', 'తెలుగు', 'ગુજરાતી', 'ਪੰਜਾਬੀ'];

  return (
    <div className="min-h-screen py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl mb-6 text-foreground">
            Get Started
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Choose your path to begin.
          </p>
        </motion.div>

        {!userType ? (
          <div className="grid md:grid-cols-2 gap-8">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate('/login')}
              className="p-12 bg-card rounded-2xl shadow-sm hover:shadow-lg transition-all text-left group"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl mb-4 text-foreground">I am a farmer</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Connect with your mobile number to start
              </p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate('/login')} 
              className="p-12 bg-card rounded-2xl shadow-sm hover:shadow-lg transition-all text-left group"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Users2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl mb-4 text-foreground">I am a partner</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Collaborate with us (Login required)
              </p>
            </motion.button>
          </div>
        ) : null}
      </div>
    </div>
  );
}