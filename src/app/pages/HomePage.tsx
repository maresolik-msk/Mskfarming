import { MouseEvent, CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sprout, Droplets, Heart, BookOpen, TrendingUp, Shield, Scale, MessageSquare, Mic, WifiOff, Lock, Sun, Wind, Twitter, Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import heroImage from 'figma:asset/289246e7ef941e756187bde2d3672e0708c4494d.png';
import greenCropImage from 'figma:asset/66f4f8d531cdb10d4e00816eaa448938a6ed0ee0.png';
import Logo from '../../imports/Logo';
import dailyGuidanceImage from 'figma:asset/6029ecfc92dbcd80ad92e7309be1a9a13ea1a785.png';
import soilImage from 'figma:asset/0d6e9aaec2cb8d236d77797ec8d343ed41e0b43b.png';
import harvestImage from 'figma:asset/9becba947a58625019d6f5a6f03fa54f33bb6578.png';

export function HomePage() {
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
      // Not logged in - go to login page
      navigate('/login');
    }
  };
  
  const problems = [
    { 
      icon: Logo, 
      text: 'No soil clarity', 
      image: 'https://images.unsplash.com/photo-1617631019193-131c512f5eca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcnklMjBzb2lsJTIwZmFybWVyJTIwaGFuZHMlMjBpbmRpYXxlbnwxfHx8fDE3NjY5MDE5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' 
    },
    { 
      icon: Droplets, 
      text: 'Guess-based fertilizers',
      image: 'https://images.unsplash.com/photo-1661932912833-b645500de79d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmVhJTIwZmVydGlsaXplciUyMGJhZyUyMGluZGlhJTIwZmFybWluZ3xlbnwxfHx8fDE3NjY5MDE5OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      icon: Droplets, 
      text: 'Water misuse',
      image: 'https://images.unsplash.com/photo-1666385459516-7b184743ba77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcnJpZ2F0aW9uJTIwd2F0ZXIlMjBwdW1wJTIwaW5kaWElMjBhZ3JpY3VsdHVyZXxlbnwxfHx8fDE3NjY5MDE5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      icon: BookOpen, 
      text: 'No money tracking',
      image: 'https://images.unsplash.com/photo-1592028617171-1087690b3575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VudGluZyUyMGluZGlhbiUyMHJ1cGVlcyUyMGZhcm1lcnxlbnwxfHx8fDE3NjY5MDE5ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      icon: TrendingUp, 
      text: 'Forced low-price selling',
      image: 'https://images.unsplash.com/photo-1724122013476-66ab604609f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2ZWdldGFibGUlMjBtYXJrZXQlMjBjcm93ZCUyMG1hbmRpfGVufDF8fHx8MTc2NjkwMTk4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
  ];

  const solution = [
    'Understand soil',
    'Choose crop',
    'Daily guidance',
    'Track money',
    'Sell better',
  ];

  const differentiation = [
    'No brand bias',
    'No dashboards',
    'Voice-first',
    'Works offline',
    'Farmer owns data',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Indian Farmer in field"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          
          {/* Breathing Brand Ambient Light */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-[#812F0F]/40 via-transparent to-transparent mix-blend-overlay"
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Interactive Hover Glow */}
          {/* Interactive Smart Scan Layer */}
          <motion.div 
            className="absolute inset-0 z-10 cursor-crosshair overflow-hidden"
            initial="idle"
            whileHover="scanning"
          >
            {/* Tech Grid Overlay */}
            <motion.div 
              className="absolute inset-0"
              style={{ 
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
              }}
              variants={{
                idle: { opacity: 0, scale: 1.1 },
                scanning: { opacity: 1, scale: 1 }
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Scanning Laser Line */}
            <motion.div 
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E4490D] to-transparent shadow-[0_0_20px_#E4490D]"
              variants={{
                idle: { top: "-10%", opacity: 0 },
                scanning: { 
                  top: ["0%", "120%"], 
                  opacity: [0, 1, 1, 0],
                  transition: { 
                    top: { duration: 2.5, repeat: Infinity, ease: "linear" },
                    opacity: { duration: 0.3 }
                  }
                }
              }}
            />

            {/* Deep Brand Focus Tint */}
            {/* Premium Atmospheric Grading */}
            <motion.div 
              className="absolute inset-0"
              variants={{
                idle: { opacity: 0 },
                scanning: { opacity: 1 }
              }}
              transition={{ duration: 0.8 }}
            >
               {/* Deep Contrast Vignette for Focus */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#2A0F05_100%)] mix-blend-multiply opacity-70" />
               
               {/* Warm Golden Sheen */}
               <div className="absolute inset-0 bg-gradient-to-tr from-[#812F0F]/50 via-transparent to-[#FFDbb5]/20 mix-blend-soft-light" />
               
               {/* Cinematic Bottom Fade */}
               <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-[#421000] via-[#812F0F]/30 to-transparent opacity-60 mix-blend-overlay" />
            </motion.div>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full pt-[44px] pr-[24px] pb-[0px] pl-[24px]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[0px] bg-white/10 backdrop-blur-md border border-white/10 text-[#CC5533] text-sm font-medium mb-6">
                <Sun className="w-4 h-4" />
                <span className="text-[rgb(255,255,255)]">Smart Farming for Everyone</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white leading-[1.1] tracking-tight">
                Your farm's <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4490D] to-[#E4490D]">
                  best friend.
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
                From soil testing to market selling — the only companion that speaks your language and walks the field with you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={handleGetStartedClick}
                  className="px-8 py-4 bg-[rgb(228,73,13)] hover:bg-[#963714] text-white rounded-[0px] transition-all shadow-[0_0_20px_rgba(129,47,15,0.3)] hover:shadow-[0_0_30px_rgba(129,47,15,0.5)] hover:-translate-y-1 text-lg font-normal text-[16px] font-bold"
                >
                  Start Farming Better
                </button>
                <Link
                  to="/get-started"
                  className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/0 text-white rounded-[0px] hover:bg-white/10 transition-all font-semibold text-lg flex items-center justify-center text-center text-[16px]"
                >
                  See How It Works
                </Link>
              </div>
              
              <div className="flex flex-wrap items-center gap-8 text-sm font-medium text-gray-300 border-t border-white/10 pt-8">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                     <Mic className="w-5 h-5 text-[#CC5533]" />
                   </div>
                   <span>Voice First</span>
                </div>
                <div className="w-px h-8 bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                     <WifiOff className="w-5 h-5 text-blue-400" />
                   </div>
                   <span>Works Offline</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Stat Card - Bottom Right */}
        <motion.div 
           initial={{ opacity: 0, x: 50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 1, duration: 0.8 }}
           className="absolute bottom-10 right-6 lg:right-12 z-20 hidden md:block"
        >
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:bg-black/40 transition-colors">
             <div className="w-12 h-12 bg-[#812F0F] rounded-full flex items-center justify-center shadow-lg shadow-[#812F0F]/30">
                <TrendingUp className="w-6 h-6 text-white" />
             </div>
             <div>
               <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-0.5">Yield Prediction</p>
               <p className="text-xl font-bold text-white">+25% Growth</p>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-[#812F0F]/10 text-[#812F0F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/20">
              The Reality
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Why farming feels <span className="text-[#812F0F] relative inline-block">
                uncertain
                <svg className="absolute w-full h-2 bottom-0 left-0 text-red-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="#812F0F" strokeWidth="4" fill="none" />
                </svg>
              </span> today
            </h2>
            <p className="text-lg text-muted-foreground">
              Farmers are facing unprecedented challenges that traditional methods can no longer solve alone.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] h-64 relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Background Image */}
                <img 
                  src={problem.image} 
                  alt={problem.text}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:via-black/70 transition-colors duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300">
                    <div className="w-6 h-6 text-white" style={{ '--fill-0': 'currentColor' } as CSSProperties}>
                      <problem.icon />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                    {problem.text}
                  </h3>
                  <div className="w-12 h-1 bg-primary rounded-full mt-2 group-hover:w-20 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-4 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              One companion. One season. <span className="text-primary">Clear guidance.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We walk with you through every stage of the crop cycle, ensuring you make the best decisions from sowing to selling.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-[40%] left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
              {[
                {
                  text: 'Understand soil',
                  image: soilImage,
                  desc: 'Know your land\'s potential'
                },
                {
                  text: 'Choose crop',
                  image: greenCropImage,
                  desc: 'Select the right crop'
                },
                {
                  text: 'Daily guidance',
                  image: dailyGuidanceImage,
                  desc: 'Timely advice & alerts'
                },
                {
                  text: 'Track money',
                  image: 'https://images.unsplash.com/photo-1650700597978-3bee20ccfc55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBydXBlZSUyMGNvaW5zJTIwZmFybWluZyUyMHByb2ZpdHxlbnwxfHx8fDE3NjY5MDEzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                  desc: 'Monitor expenses & profits'
                },
                {
                  text: 'Sell better',
                  image: harvestImage,
                  desc: 'Get the best market price'
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="group relative flex flex-col items-center text-center"
                >
                  <div className="relative w-full aspect-[3/4] mb-6 rounded-2xl overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-500 border border-border/50 bg-muted">
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10" />
                     <img 
                       src={step.image} 
                       alt={step.text}
                       className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                     />
                     <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur text-primary font-bold text-lg flex items-center justify-center z-20 shadow-lg">
                       {index + 1}
                     </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {step.text}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Differentiation Section */}
      <section className="py-24 px-4 bg-[#2A0F05] text-white overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl mb-6 text-[rgb(157,162,159)] font-normal font-bold">
              Built for farmers, <span className="text-[#CC5533]">not sellers</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              No hidden agendas. We exist solely to help you grow better crops and earn more money.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              {
                icon: Scale,
                title: 'No brand bias',
                desc: 'We recommend what works, not what pays us commissions.'
              },
              {
                icon: MessageSquare,
                title: 'No dashboards',
                desc: 'Chat with our AI just like a friend. No complex graphs.'
              },
              {
                icon: Mic,
                title: 'Voice-first',
                desc: 'Speak in your language. We listen, understand, and answer.'
              },
              {
                icon: WifiOff,
                title: 'Works offline',
                desc: 'Access your critical farm data even without internet.'
              },
              {
                icon: Lock,
                title: 'Farmer owns data',
                desc: 'Your farm details are private. We never sell your data.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[0px] hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-[#812F0F]/20 rounded-[0px] flex items-center justify-center mb-6 group-hover:bg-[#812F0F]/30 transition-colors">
                  <feature.icon className="w-7 h-7 text-[#CC5533]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl bg-[#812F0F] shadow-2xl"
          >
            {/* Abstract Field Contours Background */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay">
               <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 100 C 30 60 70 60 100 100 V 0 H 0 Z" fill="white" />
                  <path d="M0 100 C 30 80 70 80 100 100" stroke="white" strokeWidth="0.5" fill="none" />
               </svg>
            </div>
            
            {/* Gradient Overlay for Depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/30 pointer-events-none" />

            <div className="relative z-10 px-8 py-20 text-center sm:px-16 lg:py-28">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                 <h2 className="mx-auto max-w-3xl text-3xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl leading-tight">
                  Start your next season with <span className="font-serif italic text-[#FFDbb5]">clarity</span>.
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg text-white/80 leading-relaxed">
                  Join the growing network of farmers using MILA's intelligence engine to transform uncertainty into higher yields.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-10"
              >
                <button
                  onClick={handleGetStartedClick}
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-[0px] bg-white px-10 py-5 text-lg font-bold text-[#812F0F] shadow-xl transition-all hover:bg-[#FFF8F0] hover:scale-105 hover:shadow-2xl active:scale-95"
                >
                  <span className="relative z-10">Get Started Now</span>
                  <Sprout className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  
                  {/* Button Glow Effect */}
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-[#FFDbb5]/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

    
      
    </div>
  );
}
