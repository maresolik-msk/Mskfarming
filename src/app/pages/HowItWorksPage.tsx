import { motion } from 'motion/react';
import { Sprout, Search, MessageCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HowItWorksPage() {
  const navigate = useNavigate();
  
  const handleGetStartedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    const hasOnboarded = localStorage.getItem('hasOnboarded');
    
    if (storedUser) {
      // User is logged in - check if they've completed onboarding
      if (hasOnboarded) {
        navigate('/dashboard');
      } else {
        // User needs to complete onboarding
        window.location.href = '/';
      }
    } else {
      // Not logged in - go to get-started page
      navigate('/get-started');
    }
  };

  const steps = [
    {
      icon: Search,
      title: 'Create your field profile',
      description: 'Tell us about your land, water access, and experience',
    },
    {
      icon: Sprout,
      title: 'Understand your soil',
      description: 'Get soil health insights and improvement suggestions',
    },
    {
      icon: MessageCircle,
      title: 'Choose the right crop & seed',
      description: 'Recommendations based on your soil, season, and market',
    },
    {
      icon: TrendingUp,
      title: 'Get daily guidance',
      description: 'Watering, fertilizer, pest alerts — in your language',
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl sm:text-5xl mb-6 text-foreground">
            How It Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your farming journey, step by step. Simple, clear, and in your own language.
          </p>
        </motion.div>

        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-6 p-8 bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl text-primary/40">{index + 1}</span>
                  <h3 className="text-2xl text-foreground">
                    {step.title}
                  </h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Ready to start your journey?
          </p>
          <button
            onClick={handleGetStartedClick}
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Get Started Today
          </button>
        </motion.div>
      </div>
    </div>
  );
}