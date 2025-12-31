import { MouseEvent } from 'react';
import { motion } from 'motion/react';
import { Sprout, Search, MessageCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScrollReveal } from '../components/ScrollReveal';

export function HowItWorksPage() {
  const navigate = useNavigate();
  
  const handleGetStartedClick = (e: MouseEvent) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('currentUser');
    const hasOnboarded = localStorage.getItem('hasOnboarded');
    
    if (storedUser) {
      if (hasOnboarded) {
        navigate('/dashboard');
      } else {
        window.location.href = '/';
      }
    } else {
      navigate('/get-started');
    }
  };

  const steps = [
    {
      icon: Search,
      title: 'Digital Field Profile',
      description: 'Tell us about your location, water sources, and historical data to calibrate the engine for your specific farm.',
    },
    {
      icon: Sprout,
      title: 'Soil Analysis',
      description: 'Upload your soil health card or let our AI estimate nutrients based on local data. We identify deficiencies instantly.',
    },
    {
      icon: MessageCircle,
      title: 'Strategic Crop Selection',
      description: 'MILA recommends the perfect crop variety by analyzing upcoming weather patterns and predicting market prices.',
    },
    {
      icon: TrendingUp,
      title: 'Daily Guidance',
      description: 'Receive daily voice alerts in your language. Know exactly when to irrigate, when to fertilize, and when to harvest.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Megrim&display=swap');
      `}</style>

      {/* Hero Section */}
      <section className="py-[32px] px-[16px] text-center">
        <ScrollReveal animation="fade-up">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            The Process
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-['Megrim'] tracking-tight text-foreground">
            How MILA Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Four simple steps to transform your farming with intelligence.
          </p>
        </ScrollReveal>
      </section>

      {/* Simple Grid Layout */}
      <section className="px-4 pb-32 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <ScrollReveal 
              key={index} 
              animation="fade-up" 
              delay={index * 0.1}
              className="h-full"
            >
              <div className="h-full bg-card border border-border p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-primary/60 text-sm font-bold tracking-widest uppercase mb-2">
                  Step 0{index + 1}
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal animation="scale-up" width="100%">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 font-serif text-white">
              Ready to grow better?
            </h2>
            <button
              onClick={handleGetStartedClick}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-[0px] bg-white px-10 py-5 text-lg font-bold text-primary shadow-xl transition-all hover:bg-white/90 hover:scale-105 hover:shadow-2xl active:scale-95"
            >
              <span className="relative z-10">Get Started Now</span>
              <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
