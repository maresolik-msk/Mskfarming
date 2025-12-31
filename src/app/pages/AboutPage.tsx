import { MouseEvent } from 'react';
import { motion } from 'motion/react';
import { Heart, Users, Leaf, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AboutPage() {
  const navigate = useNavigate();
  
  const handleGetStartedClick = (e: MouseEvent) => {
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
  
  return (
    <div className="min-h-screen py-[32px] px-[16px] bg-background">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Megrim&display=swap');
      `}</style>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            Our Story
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-foreground font-['Megrim'] tracking-tight">
            About MILA
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Built with respect for those who feed us. A companion for the modern farmer.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-32">
          {/* Why This Exists */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-card border border-border rounded-3xl hover:shadow-xl transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-foreground font-serif">Why this exists</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Farming is hard. Not because farmers lack skill, but because the tools they need are often confusing or designed for someone else.
              </p>
              <p>
                We believe farmers deserve technology that respects their intelligence and speaks their language — not technology that just sells to them.
              </p>
            </div>
          </motion.section>

          {/* What We Believe */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 bg-card border border-border rounded-3xl hover:shadow-xl transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-foreground font-serif">What we believe</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground block mb-2">Farmers are experts.</strong> 
                They know their land better than anyone. Our job is to support their decisions, not replace them.
              </p>
              <p>
                <strong className="text-foreground block mb-2">Trust is everything.</strong> 
                We don't sell data. We don't push products. We exist to serve farmers, period.
              </p>
            </div>
          </motion.section>

          {/* Long-term Vision */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-card border border-border rounded-3xl hover:shadow-xl transition-all duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
              <Globe className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-6 text-foreground font-serif">Long-term vision</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                We envision a future where every farmer has access to personalized, trustworthy guidance.
              </p>
              <p>
                Where farming decisions are made with confidence, and communities grow stronger because their farmers thrive. This is a commitment.
              </p>
            </div>
          </motion.section>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] bg-[#2A0F05] text-white p-12 md:p-20 text-center"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight">
              Ready to start your <span className="text-[#E4490D]">season</span> with us?
            </h2>
            <p className="text-xl text-white/70 mb-10">
              Join the community of farmers building a better future.
            </p>
            <button
              onClick={handleGetStartedClick}
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#812F0F] rounded-[0px] font-bold text-lg hover:bg-[#FFF8F0] transition-all transform hover:scale-105 shadow-xl"
            >
              Get Started Today
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}