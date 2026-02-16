import { MouseEvent, useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'motion/react';
import {
  Sprout, Search, MessageCircle, TrendingUp, ArrowRight, Leaf,
  CloudRain, Mic, WifiOff, Satellite, Brain,
  Droplets, Shield, Zap, ChevronDown,
  ChevronRight, Users, MapPin, Wallet, Lock,
  CheckCircle2, XCircle, LineChart, Bell, Languages
} from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

// ─── Images ───
const images = {
  hero: 'https://images.unsplash.com/photo-1685023620523-9c726f2c499b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyaWNlJTIwcGFkZHklMjBncmVlbiUyMHRlcnJhY2VzJTIwYWVyaWFsJTIwaW5kaWF8ZW58MXx8fHwxNzcwOTE1NzA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  soilTest: 'https://images.unsplash.com/photo-1743614052683-38c4506cabb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2lsJTIwdGVzdGluZyUyMGFncmljdWx0dXJlJTIwbGFib3JhdG9yeXxlbnwxfHx8fDE3NzA5MTU3MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  drone: 'https://images.unsplash.com/photo-1585428311604-98738fc5687a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMGZseWluZyUyMG92ZXIlMjBncmVlbiUyMGZhcm0lMjBmaWVsZCUyMGFlcmlhbHxlbnwxfHx8fDE3NzA5MTU3MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  harvest: 'https://images.unsplash.com/photo-1560399474-0a30a8e9d87e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjB3aGVhdCUyMGhhcnZlc3QlMjBmaWVsZCUyMHN1bnJpc2V8ZW58MXx8fHwxNzcwOTE1NzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  satellite: 'https://images.unsplash.com/photo-1606834230438-f3b80fe1ae4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBlYXJ0aCUyMHdlYXRoZXIlMjBtb25pdG9yaW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzA5MTU3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  traditional: 'https://images.unsplash.com/photo-1762884109987-c0fb0d5838dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGluZGlhbiUyMGZhcm1lciUyMHBsb3dpbmclMjBmaWVsZCUyMGJ1bGxvY2t8ZW58MXx8fHwxNzcwOTE1NzA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  modern: 'https://images.unsplash.com/photo-1751788385441-50e19352c5ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhZ3JpY3VsdHVyZSUyMHRyYWN0b3IlMjBncmVlbiUyMGNyb3BzJTIwcm93c3xlbnwxfHx8fDE3NzA5MTU3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  market: 'https://images.unsplash.com/photo-1769685104379-0bedf8505586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB2ZWdldGFibGUlMjBtYXJrZXQlMjBjb2xvcmZ1bCUyMHByb2R1Y2V8ZW58MXx8fHwxNzcwOTE1NzA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  irrigation: 'https://images.unsplash.com/photo-1732123280395-448294940895?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGlycmlnYXRpb24lMjBzcHJpbmtsZXIlMjBmYXJtJTIwc3Vuc2V0fGVufDF8fHx8MTc3MDkxNTcwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  dashboard: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkJTIwZGFyayUyMHNjcmVlbnxlbnwxfHx8fDE3NzA5MTU3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  farmer: 'https://images.unsplash.com/photo-1744230673231-865d54a0aba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBzbWFydHBob25lJTIwdGVjaG5vbG9neSUyMGZpZWxkfGVufDF8fHx8MTc3MDkxNTcwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  village: 'https://images.unsplash.com/photo-1655974239313-5ab1747a002e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBydXJhbCUyMHZpbGxhZ2UlMjBsYW5kc2NhcGUlMjBwYW5vcmFtaWN8ZW58MXx8fHwxNzcwOTE1NzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
};

// ─── Animated Counter ───
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as any, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!isInView) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return { count, ref };
}

// ─── Animated Bars for Soil ───
function SoilBar({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as any, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-[#2A0F05]/70 font-medium">{label}</span>
        <span className="text-[#2A0F05]/40">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-[#812F0F]/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// ─── Floating Particle Dots ───
function FloatingDots({ dark = false }: { dark?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${dark ? 'bg-white/20' : 'bg-[#812F0F]/15'}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── FAQ Item ───
function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-[#812F0F]/10 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-colors shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="text-base sm:text-lg font-semibold text-[#2A0F05]/90 pr-4">{q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-[#E4490D]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="px-6 pb-6 text-[#2A0F05]/60 leading-relaxed text-sm sm:text-base">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export function HowItWorksPage() {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const handleGetStartedClick = (e: MouseEvent) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('currentUser');
    const hasOnboarded = localStorage.getItem('hasOnboarded');
    if (storedUser) {
      if (hasOnboarded) navigate('/dashboard');
      else window.location.href = '/';
    } else {
      navigate('/get-started');
    }
  };

  // Pipeline counters
  const c1 = useCounter(15, 2000);
  const c2 = useCounter(200, 2500);
  const c3 = useCounter(7, 1800);
  const c4 = useCounter(98, 2200);

  // Auto-cycle steps in the interactive preview
  useEffect(() => {
    const timer = setInterval(() => setActiveStep((prev) => (prev + 1) % 4), 4000);
    return () => clearInterval(timer);
  }, []);

  // ─── Steps Data ───
  const steps = [
    {
      icon: Search,
      title: 'Create Your Digital Field Profile',
      subtitle: 'Tell us about your farm',
      description: 'Mark your field boundaries on the map, specify your soil type, water sources, and irrigation setup. MILA builds a precise digital twin of your farm in under 2 minutes.',
      image: images.farmer,
      color: '#E4490D',
      features: ['GPS Field Mapping', 'Water Source Tagging', 'Soil Type Selection', 'Crop History Import'],
      stat: { value: '2 min', label: 'Average Setup' },
    },
    {
      icon: Sprout,
      title: 'AI-Powered Soil Analysis',
      subtitle: 'Know your soil\'s secrets',
      description: 'Upload your Soil Health Card or answer a few questions — MILA\'s AI estimates your N-P-K levels, pH, organic carbon, and micronutrient deficiencies with remarkable accuracy.',
      image: images.soilTest,
      color: '#4F8F4A',
      features: ['Photo-Based Analysis', 'NPK Estimation', 'pH Detection', 'Deficiency Alerts'],
      stat: { value: '94%', label: 'Analysis Accuracy' },
    },
    {
      icon: MessageCircle,
      title: 'Strategic Crop Selection',
      subtitle: 'The perfect crop, every season',
      description: 'By combining 7-day weather forecasts, real-time market prices, and your soil profile, MILA recommends the optimal crop variety that maximizes your profit while minimizing risk.',
      image: images.market,
      color: '#E6A23C',
      features: ['Weather Integration', 'Market Price Feeds', 'Risk Assessment', 'Profit Projection'],
      stat: { value: '₹25K+', label: 'Avg. Savings/Season' },
    },
    {
      icon: TrendingUp,
      title: 'Daily Voice Guidance',
      subtitle: 'Your daily farming companion',
      description: 'Wake up to voice alerts in Telugu, Hindi, or English. Know exactly when to irrigate, fertilize, spray, and harvest — with real-time pest alerts and weather warnings.',
      image: images.irrigation,
      color: '#4A90E2',
      features: ['Voice Alerts', 'Pest Warnings', 'Irrigation Timing', 'Harvest Scheduling'],
      stat: { value: '25%', label: 'Yield Increase' },
    },
  ];

  // ─── Before vs After Data ───
  const comparisons = [
    { traditional: 'Guessing soil nutrients', mila: 'AI-analyzed soil profile with NPK data', icon: Leaf },
    { traditional: 'Watching the sky for weather', mila: 'Hyper-local 7-day forecasts + alerts', icon: CloudRain },
    { traditional: 'Selling at whatever price offered', mila: 'Real-time mandi prices + best time to sell', icon: TrendingUp },
    { traditional: 'Over-watering or under-watering', mila: 'Smart irrigation schedules by crop stage', icon: Droplets },
    { traditional: 'No record of expenses', mila: 'Auto-tracked budget with profit forecasts', icon: Wallet },
    { traditional: 'Advice from neighbors only', mila: 'AI + satellite + weather-backed insights', icon: Brain },
  ];

  // ─── Tech Stack Data ───
  const techStack = [
    { icon: Satellite, title: 'Satellite Imaging', desc: 'NDVI analysis from multi-spectral satellites for crop health monitoring', color: 'from-blue-500/10 to-cyan-500/10', iconColor: 'text-cyan-600' },
    { icon: Brain, title: 'AI Engine', desc: 'Deep learning models trained on 50M+ data points from Indian farms', color: 'from-purple-500/10 to-pink-500/10', iconColor: 'text-purple-600' },
    { icon: CloudRain, title: 'Weather Intelligence', desc: 'Hyper-local forecasts from 500+ weather stations across India', color: 'from-sky-500/10 to-blue-500/10', iconColor: 'text-sky-600' },
    { icon: LineChart, title: 'Market Data', desc: 'Live mandi prices from 3,000+ APMCs updated every 15 minutes', color: 'from-amber-500/10 to-orange-500/10', iconColor: 'text-amber-600' },
    { icon: Languages, title: 'Voice & Language', desc: 'NLP-powered voice guidance in Telugu, Hindi, Kannada & English', color: 'from-green-500/10 to-emerald-500/10', iconColor: 'text-green-600' },
    { icon: Shield, title: 'Secure & Offline', desc: 'End-to-end encrypted data with full offline functionality', color: 'from-red-500/10 to-rose-500/10', iconColor: 'text-rose-600' },
  ];

  // ─── FAQ Data ───
  const faqs = [
    { q: 'Do I need internet to use MILA?', a: 'No! MILA works offline for all core features. When you connect to the internet, it syncs your data and downloads the latest weather forecasts and market prices. Voice guidance also works offline once downloaded.' },
    { q: 'How accurate is the soil analysis?', a: 'MILA\'s AI achieves 94% accuracy compared to laboratory results. When combined with your Soil Health Card data, accuracy increases to over 97%. The model improves with each season of data from your specific field.' },
    { q: 'Which languages does MILA support?', a: 'Currently, MILA supports Telugu, Hindi, and English with full voice guidance. Kannada, Tamil, and Marathi are being added in the next release. All text interfaces support these languages too.' },
    { q: 'Is my farm data safe?', a: 'Absolutely. All data is encrypted end-to-end and stored securely. We never sell or share your data with third parties. You own your data completely and can export or delete it anytime.' },
    { q: 'How much does MILA cost?', a: 'MILA is free for basic features including soil analysis, weather alerts, and daily guidance. Premium features like satellite monitoring, advanced market analytics, and AI crop planning are available for ₹99/month — less than the cost of one bag of fertilizer.' },
    { q: 'Can I use MILA for multiple fields?', a: 'Yes! You can add unlimited fields to your MILA profile. Each field gets its own digital profile, soil analysis, and customized recommendations. Switching between fields is instant with a single tap.' },
  ];

  return (
    <div className="relative min-h-screen bg-[#F7F6F2] text-[#2A0F05] overflow-hidden">

      {/* ══════════════════════════════════════════════════════
          SECTION 1: CINEMATIC HERO
      ══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[85vh] min-h-[550px] flex items-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          <ImageWithFallback src={images.hero} alt="Terraced rice fields" className="w-full h-full object-cover scale-110" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7F6F2]/95 via-[#F7F6F2]/75 to-[#F7F6F2]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7F6F2] via-transparent to-[#F7F6F2]/40" />
        </motion.div>

        {/* Ambient Pulse */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-[#812F0F]/10 via-transparent to-transparent mix-blend-multiply"
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating Dots */}
        <FloatingDots />

        {/* Scan Line */}
        <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E4490D]/30 to-transparent z-10"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />

        {/* Content */}
        <motion.div
          className="max-w-7xl mx-auto px-6 relative z-20 w-full"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-[#812F0F]/15 text-sm font-medium mb-8 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-[#E4490D] animate-pulse" />
              <span className="text-[#2A0F05]/60 uppercase tracking-widest text-xs">The Process</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-[#2A0F05] leading-[1.05] tracking-tight font-sans">
              From seed to sale,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4490D] to-[#FF8C42]">
                MILA walks with you.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#2A0F05]/55 mb-10 leading-relaxed max-w-xl font-light">
              Four intelligent steps that transform uncertainty into clarity, and every harvest into a celebration.
            </p>

            {/* Mini Pipeline Preview */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="flex items-center gap-2 sm:gap-3"
                >
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border bg-white/70 backdrop-blur-sm shadow-sm"
                    style={{ borderColor: `${step.color}30` }}
                  >
                    <step.icon className="w-5 h-5" style={{ color: step.color }} />
                  </div>
                  {i < 3 && (
                    <div className="hidden sm:flex items-center gap-0.5">
                      {[0, 1, 2].map((d) => (
                        <motion.div
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-[#812F0F]/25"
                          animate={{ opacity: [0.2, 0.6, 0.2] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: d * 0.3 + i * 0.4 }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[#2A0F05]/30 text-[10px] uppercase tracking-[0.3em]">Discover</span>
          <div className="w-5 h-8 rounded-full border-2 border-[#812F0F]/20 flex justify-center pt-1.5">
            <motion.div
              className="w-1 h-2 rounded-full bg-[#812F0F]/40"
              animate={{ y: [0, 8, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SECTION 2: DATA PIPELINE — Numbers in Motion
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-b from-[#F7F6F2] via-[#F0ECE4] to-[#F7F6F2] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#812F0F]/10 text-[#812F0F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/15">
              Intelligence Pipeline
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2A0F05] font-sans mb-4">
              Data flows. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4490D] to-[#FF8C42]">Wisdom grows.</span>
            </h2>
            <p className="text-[#2A0F05]/50 max-w-2xl mx-auto text-lg">
              Every second, MILA processes thousands of data points to give you one clear answer.
            </p>
          </motion.div>

          {/* Pipeline Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { ref: c1.ref, count: c1.count, suffix: '+', label: 'Data Sources', icon: Satellite, desc: 'Satellites, weather stations, mandis' },
              { ref: c2.ref, count: c2.count, suffix: 'K+', label: 'Daily Signals', icon: Zap, desc: 'Processed in real time' },
              { ref: c3.ref, count: c3.count, suffix: '', label: 'AI Models', icon: Brain, desc: 'Working in parallel' },
              { ref: c4.ref, count: c4.count, suffix: '%', label: 'Uptime', icon: Shield, desc: 'Reliable even in rural areas' },
            ].map((item, i) => (
              <motion.div
                key={i}
                ref={item.ref as any}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="bg-white/70 backdrop-blur-sm border border-[#812F0F]/10 rounded-2xl p-6 sm:p-8 text-center hover:bg-white/90 transition-all duration-500 hover:border-[#812F0F]/20 relative overflow-hidden shadow-sm hover:shadow-md">
                  {/* Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#812F0F]/0 to-[#E4490D]/0 group-hover:from-[#812F0F]/5 group-hover:to-[#E4490D]/3 transition-all duration-500" />

                  <div className="relative z-10">
                    <div className="inline-flex p-3 rounded-xl bg-[#812F0F]/8 border border-[#812F0F]/10 mb-4">
                      <item.icon className="w-5 h-5 text-[#E4490D]" />
                    </div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2A0F05] mb-1 tabular-nums font-sans">
                      {item.count.toLocaleString()}{item.suffix}
                    </div>
                    <p className="text-[#2A0F05]/70 text-sm font-semibold mb-1">{item.label}</p>
                    <p className="text-[#2A0F05]/40 text-xs">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Animated data flow line */}
          <div className="hidden lg:flex items-center justify-center mt-8">
            <div className="relative w-full max-w-4xl h-1 rounded-full bg-[#812F0F]/8">
              <motion.div
                className="absolute inset-y-0 left-0 w-1/4 rounded-full bg-gradient-to-r from-[#812F0F] to-[#E4490D]"
                animate={{ left: ['0%', '75%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Pulse dots */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#E4490D] border-2 border-[#F7F6F2]"
                  style={{ left: `${p * 100}%`, marginLeft: '-6px' }}
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SECTION 3: 4-STEP DEEP DIVE — The Journey
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#F7F6F2] to-[#F0ECE4]">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#812F0F]/10 text-[#812F0F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/15">
              Your Journey
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2A0F05] font-sans">
              Four steps to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4490D] to-[#FF8C42]">
                smarter farming
              </span>
            </h2>
          </motion.div>

          {/* Steps */}
          <div className="space-y-24 sm:space-y-32">
            {steps.map((step, i) => {
              const isReversed = i % 2 !== 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.7 }}
                  className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 lg:gap-16 items-center`}
                >
                  {/* Visual Side */}
                  <div className="w-full lg:w-1/2 relative">
                    <div className="relative rounded-3xl overflow-hidden aspect-[4/3] group shadow-lg">
                      <ImageWithFallback src={step.image} alt={step.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      {/* Step Number Badge */}
                      <motion.div
                        className="absolute top-5 left-5 sm:top-6 sm:left-6"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                      >
                        <div
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold backdrop-blur-md border border-white/20"
                          style={{ background: `${step.color}80` }}
                        >
                          0{i + 1}
                        </div>
                      </motion.div>

                      {/* Stat Badge */}
                      <motion.div
                        className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl px-4 py-3 shadow-lg">
                          <p className="text-2xl font-bold text-[#2A0F05]">{step.stat.value}</p>
                          <p className="text-[#2A0F05]/50 text-xs">{step.stat.label}</p>
                        </div>
                      </motion.div>

                      {/* Animated border glow */}
                      <div
                        className="absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ borderColor: `${step.color}40` }}
                      />
                    </div>

                    {/* Connecting Line (not on last) */}
                    {i < 3 && (
                      <div className="hidden lg:block absolute -bottom-24 left-1/2 -translate-x-1/2">
                        <motion.div
                          className="w-px h-20"
                          style={{ background: `linear-gradient(to bottom, ${step.color}30, transparent)` }}
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Content Side */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    {/* Step Label */}
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2.5 rounded-xl border"
                        style={{ background: `${step.color}10`, borderColor: `${step.color}20` }}
                      >
                        <step.icon className="w-6 h-6" style={{ color: step.color }} />
                      </div>
                      <span
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: step.color }}
                      >
                        Step 0{i + 1} — {step.subtitle}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2A0F05] font-sans leading-tight">
                      {step.title}
                    </h3>

                    <p className="text-[#2A0F05]/55 text-base sm:text-lg leading-relaxed">
                      {step.description}
                    </p>

                    {/* Feature Chips */}
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      {step.features.map((f, fi) => (
                        <motion.div
                          key={fi}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + fi * 0.1 }}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/70 border border-[#812F0F]/10 text-[#2A0F05]/70 text-sm font-medium hover:bg-white hover:border-[#812F0F]/20 transition-all shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: step.color }} />
                          {f}
                        </motion.div>
                      ))}
                    </div>

                    {/* Mini Inline Visual (unique per step) */}
                    {i === 1 && (
                      <div className="bg-white/70 backdrop-blur-sm border border-[#812F0F]/10 rounded-2xl p-5 space-y-3 mt-4 shadow-sm">
                        <p className="text-xs text-[#2A0F05]/40 font-bold uppercase tracking-wider mb-3">Soil Composition Analysis</p>
                        <SoilBar label="Nitrogen (N)" value={72} color="#4F8F4A" delay={0} />
                        <SoilBar label="Phosphorus (P)" value={45} color="#E6A23C" delay={0.15} />
                        <SoilBar label="Potassium (K)" value={88} color="#4A90E2" delay={0.3} />
                        <SoilBar label="Organic Carbon" value={56} color="#E4490D" delay={0.45} />
                        <SoilBar label="pH Level" value={65} color="#8B5CF6" delay={0.6} />
                      </div>
                    )}

                    {i === 2 && (
                      <div className="bg-white/70 backdrop-blur-sm border border-[#812F0F]/10 rounded-2xl p-5 mt-4 shadow-sm">
                        <p className="text-xs text-[#2A0F05]/40 font-bold uppercase tracking-wider mb-4">AI Recommendation</p>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#E6A23C]/10 flex items-center justify-center shrink-0 border border-[#E6A23C]/15">
                            <Sprout className="w-6 h-6 text-[#E6A23C]" />
                          </div>
                          <div>
                            <p className="text-[#2A0F05]/80 font-bold text-sm">Paddy — BPT 5204 (Samba Masuri)</p>
                            <p className="text-[#2A0F05]/40 text-xs mt-1">92% match · Profit estimate: ₹45,200/acre</p>
                            <div className="flex gap-2 mt-2">
                              <span className="px-2 py-0.5 bg-green-500/10 text-green-700 text-[10px] rounded-full font-bold">High Demand</span>
                              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-700 text-[10px] rounded-full font-bold">Low Risk</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {i === 3 && (
                      <div className="bg-white/70 backdrop-blur-sm border border-[#812F0F]/10 rounded-2xl p-5 mt-4 space-y-3 shadow-sm">
                        <p className="text-xs text-[#2A0F05]/40 font-bold uppercase tracking-wider mb-3">Today's Alerts</p>
                        {[
                          { text: '🌾 Irrigate Field 2 — Soil moisture below 40%', time: '6:00 AM', type: 'water' },
                          { text: '⚠️ Pest Alert — Brown planthopper risk high', time: '7:30 AM', type: 'pest' },
                          { text: '📈 Sell window — Rice price ₹2,180/quintal (↑3.2%)', time: '9:00 AM', type: 'market' },
                        ].map((alert, ai) => (
                          <motion.div
                            key={ai}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + ai * 0.15 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-[#F7F6F2]/80 border border-[#812F0F]/8"
                          >
                            <Bell className="w-4 h-4 text-[#E4490D] mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[#2A0F05]/70 text-xs leading-relaxed">{alert.text}</p>
                              <p className="text-[#2A0F05]/30 text-[10px] mt-1">{alert.time}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SECTION 4: INTERACTIVE APP PREVIEW
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#F0ECE4] to-[#F7F6F2] overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#812F0F]/5 rounded-full blur-[200px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#812F0F]/10 text-[#812F0F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/15">
              See It in Action
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2A0F05] font-sans mb-4">
              Experience the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4490D] to-[#FF8C42]">MILA flow</span>
            </h2>
            <p className="text-[#2A0F05]/50 max-w-2xl mx-auto text-lg">
              Watch how each step seamlessly connects to give you complete farm intelligence.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            {/* Step Selector */}
            <div className="w-full lg:w-1/3 space-y-3">
              {steps.map((step, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-500 ${
                    activeStep === i
                      ? 'bg-white/80 border-[#812F0F]/15 shadow-md'
                      : 'bg-transparent border-[#812F0F]/5 hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500"
                      style={{
                        background: activeStep === i ? `${step.color}15` : 'rgba(129,47,15,0.05)',
                        borderColor: activeStep === i ? `${step.color}30` : 'transparent',
                        borderWidth: '1px',
                      }}
                    >
                      <step.icon className="w-5 h-5 transition-colors" style={{ color: activeStep === i ? step.color : 'rgba(42,15,5,0.3)' }} />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold transition-colors ${activeStep === i ? 'text-[#2A0F05]' : 'text-[#2A0F05]/40'}`}>
                        Step {i + 1}
                      </p>
                      <p className={`text-xs transition-colors truncate ${activeStep === i ? 'text-[#2A0F05]/60' : 'text-[#2A0F05]/25'}`}>
                        {step.title}
                      </p>
                    </div>
                    {activeStep === i && (
                      <motion.div
                        layoutId="activeArrow"
                        className="ml-auto shrink-0"
                      >
                        <ChevronRight className="w-4 h-4 text-[#E4490D]" />
                      </motion.div>
                    )}
                  </div>
                  {/* Progress bar */}
                  {activeStep === i && (
                    <motion.div
                      className="mt-3 h-0.5 rounded-full bg-[#812F0F]/8 overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: step.color }}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 4, ease: 'linear' }}
                        key={activeStep}
                      />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Phone Mockup — stays dark (phones look natural this way) */}
            <div className="w-full lg:w-2/3 flex justify-center">
              <div className="relative">
                {/* Phone Frame */}
                <div className="relative w-[280px] sm:w-[320px] h-[560px] sm:h-[640px] rounded-[3rem] bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-2 border-gray-300/30 shadow-[0_20px_80px_rgba(129,47,15,0.15)] overflow-hidden">
                  {/* Status bar */}
                  <div className="absolute top-0 inset-x-0 h-10 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center">
                    <div className="w-24 h-5 rounded-full bg-black border border-white/10" />
                  </div>

                  {/* Screen content */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 pt-12"
                    >
                      <ImageWithFallback
                        src={steps[activeStep].image}
                        alt={steps[activeStep].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      {/* Screen UI overlay */}
                      <div className="absolute bottom-0 inset-x-0 p-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: `${steps[activeStep].color}25` }}
                          >
                            {(() => { const Icon = steps[activeStep].icon; return <Icon className="w-4 h-4" style={{ color: steps[activeStep].color }} />; })()}
                          </div>
                          <span className="text-white/50 text-[10px] uppercase tracking-wider font-bold">
                            Step {activeStep + 1}
                          </span>
                        </div>
                        <h4 className="text-white text-lg font-bold leading-tight font-sans">
                          {steps[activeStep].title}
                        </h4>
                        <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
                          {steps[activeStep].description}
                        </p>
                        <div className="flex gap-1.5 pt-1">
                          {steps[activeStep].features.slice(0, 3).map((f, fi) => (
                            <span key={fi} className="px-2 py-1 bg-white/10 rounded-full text-white/60 text-[9px] font-medium">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Home indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-white/20 z-20" />
                </div>

                {/* Floating Badges around phone */}
                <motion.div
                  className="absolute -top-4 -right-8 sm:-right-16 bg-white/80 backdrop-blur-xl border border-[#812F0F]/10 rounded-xl px-3 py-2 hidden sm:block shadow-lg"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[#2A0F05]/70 text-xs font-medium">AI Active</span>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute top-1/3 -left-8 sm:-left-20 bg-white/80 backdrop-blur-xl border border-[#812F0F]/10 rounded-xl px-3 py-2 hidden sm:block shadow-lg"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2">
                    <Mic className="w-3.5 h-3.5 text-[#E4490D]" />
                    <span className="text-[#2A0F05]/70 text-xs font-medium">Voice Ready</span>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute bottom-20 -right-8 sm:-right-24 bg-white/80 backdrop-blur-xl border border-[#812F0F]/10 rounded-xl px-3 py-2 hidden sm:block shadow-lg"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <WifiOff className="w-3.5 h-3.5 text-sky-500" />
                    <span className="text-[#2A0F05]/70 text-xs font-medium">Works Offline</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SECTION 5: BEFORE VS AFTER
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#F7F6F2] to-[#F0ECE4] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#812F0F]/10 text-[#812F0F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/15">
              The Transformation
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2A0F05] font-sans mb-4">
              Before MILA vs{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4490D] to-[#FF8C42]">After MILA</span>
            </h2>
            <p className="text-[#2A0F05]/50 max-w-xl mx-auto text-lg">
              See the difference intelligence makes in every aspect of farming.
            </p>
          </motion.div>

          {/* Side by Side with Images */}
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            {/* Before Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden shadow-lg"
            >
              <div className="absolute inset-0">
                <ImageWithFallback src={images.traditional} alt="Traditional farming" className="w-full h-full object-cover opacity-15" />
                <div className="absolute inset-0 bg-gradient-to-b from-red-50/95 to-red-50" />
              </div>
              <div className="relative p-8 sm:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2A0F05]/80 font-sans">Without MILA</h3>
                </div>
                <div className="space-y-4">
                  {comparisons.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-red-200/50"
                    >
                      <c.icon className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                      <p className="text-[#2A0F05]/50 text-sm">{c.traditional}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* After Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden shadow-lg"
            >
              <div className="absolute inset-0">
                <ImageWithFallback src={images.modern} alt="Modern farming with MILA" className="w-full h-full object-cover opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-green-50/95 to-green-50" />
              </div>
              <div className="relative p-8 sm:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2A0F05] font-sans">With MILA</h3>
                </div>
                <div className="space-y-4">
                  {comparisons.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 + 0.2 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-green-200/50"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                      <p className="text-[#2A0F05]/70 text-sm font-medium">{c.mila}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Impact Stats Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#812F0F]/8 via-[#E4490D]/5 to-[#812F0F]/8 border border-[#812F0F]/12 rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: '25%', label: 'Higher Yield' },
                { value: '40%', label: 'Less Water Used' },
                { value: '₹15K', label: 'Saved per Season' },
                { value: '3x', label: 'Faster Decisions' },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-2xl sm:text-3xl font-bold text-[#E4490D] font-sans">{s.value}</p>
                  <p className="text-[#2A0F05]/50 text-xs sm:text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SECTION 6: TECHNOLOGY STACK
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#F0ECE4] to-[#F7F6F2] overflow-hidden">
        {/* Satellite image background */}
        <div className="absolute inset-0 opacity-5">
          <ImageWithFallback src={images.satellite} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#F0ECE4] via-transparent to-[#F7F6F2]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#812F0F]/10 text-[#812F0F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/15">
              Under the Hood
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2A0F05] font-sans mb-4">
              Powered by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4490D] to-[#FF8C42]">
                cutting-edge intelligence
              </span>
            </h2>
            <p className="text-[#2A0F05]/50 max-w-2xl mx-auto text-lg">
              Six layers of technology working together to make farming effortless.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {techStack.map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative rounded-2xl overflow-hidden"
              >
                <div className="relative bg-white/70 backdrop-blur-sm border border-[#812F0F]/10 p-6 sm:p-7 rounded-2xl hover:bg-white/90 transition-all duration-500 hover:border-[#812F0F]/20 h-full shadow-sm hover:shadow-md">
                  {/* Glow layer */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <div className="p-3 rounded-xl bg-[#812F0F]/5 border border-[#812F0F]/10 w-fit mb-5 group-hover:border-[#812F0F]/15 transition-colors">
                      <tech.icon className={`w-6 h-6 ${tech.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-[#2A0F05] mb-2 font-sans">{tech.title}</h3>
                    <p className="text-[#2A0F05]/50 text-sm leading-relaxed">{tech.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SECTION 7: FAQ
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#F7F6F2] to-[#F0ECE4]">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#812F0F]/10 text-[#812F0F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/15">
              Common Questions
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2A0F05] font-sans">
              Everything you need to know
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <FAQItem
                  q={faq.q}
                  a={faq.a}
                  isOpen={openFAQ === i}
                  onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SECTION 8: CTA — keeps burgundy branding
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <ImageWithFallback src={images.harvest} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#812F0F]/95 via-[#812F0F]/85 to-[#812F0F]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#812F0F] via-transparent to-[#812F0F]/80" />
        </div>

        <FloatingDots dark />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 mb-8"
            >
              <Sprout className="w-8 h-8 text-white" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 font-sans leading-tight">
              Ready to grow{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                smarter?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-xl mx-auto font-light">
              Join 10,000+ farmers who have already transformed their harvest with MILA. Your fields are waiting.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGetStartedClick}
                className="group px-10 py-5 bg-white text-[#812F0F] rounded-xl font-bold text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-3"
              >
                Start Farming Better
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
              <Link
                to="/features"
                className="px-10 py-5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                Explore Features
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 mt-12 pt-8 border-t border-white/10">
              {[
                { icon: Users, text: '10,000+ Farmers' },
                { icon: MapPin, text: '8 States' },
                { icon: Lock, text: 'Fully Secure' },
                { icon: WifiOff, text: 'Works Offline' },
              ].map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <badge.icon className="w-4 h-4 text-white/40" />
                  <span className="text-white/50 text-sm font-medium">{badge.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
