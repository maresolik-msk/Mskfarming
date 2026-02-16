import { useRef, useEffect, useState, MouseEvent } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'motion/react';
import {
  Sprout, Droplets, Bug, BookOpen, Wallet, PieChart, ArrowRight,
  Search, MessageCircle, TrendingUp, Leaf, CloudRain, Mic, WifiOff,
  Satellite, Brain, Shield, Zap, ChevronRight, Users, MapPin, Lock,
  CheckCircle2, Bell, Languages, BarChart3, Smartphone, Volume2,
  Globe2, Sun, Thermometer, LineChart, Camera, Clock, Sparkles,
  Target, Activity, Layers, Database, Wifi, BatteryCharging
} from 'lucide-react';
import { useNavigate, Link } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import imgSeedlings from "figma:asset/a20a758f3328babc56624328f34c10ed1139f425.png";
import imgSprinklers from "figma:asset/5a3ed7a98dd93e7ce419c1678be36e0cacdffdca.png";
import imgPest from "figma:asset/426eb80147166eed75682d2c68672a155db19486.png";

// ─── Images ───
const img = {
  hero: 'https://images.unsplash.com/photo-1750353127953-bf1f4943c343?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBncmVlbiUyMHJpY2UlMjBwYWRkeSUyMHRlcnJhY2VzJTIwSW5kaWF8ZW58MXx8fHwxNzcwOTE2OTIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  farmer: 'https://images.unsplash.com/photo-1744230673231-865d54a0aba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBzbWFydHBob25lJTIwdGVjaG5vbG9neSUyMGZpZWxkJTIwY3JvcHN8ZW58MXx8fHwxNzcwOTE2OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  satellite: 'https://images.unsplash.com/photo-1690036357483-dd15ac5c671f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBlYXJ0aCUyMHZpZXclMjBhZ3JpY3VsdHVyZSUyMG1vbml0b3Jpbmd8ZW58MXx8fHwxNzcwOTE2OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  soil: 'https://images.unsplash.com/photo-1601408648796-349272138e57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2lsJTIwdGVzdGluZyUyMGFncmljdWx0dXJlJTIwaGFuZHN8ZW58MXx8fHwxNzcwOTE2OTIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  irrigation: 'https://images.unsplash.com/photo-1690100693182-e6d7fe91bc38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGlycmlnYXRpb24lMjBzcHJpbmtsZXIlMjBncmVlbiUyMGZhcm18ZW58MXx8fHwxNzcwOTE2OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  harvest: 'https://images.unsplash.com/photo-1560399474-0a30a8e9d87e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjB3aGVhdCUyMGhhcnZlc3QlMjBzdW5yaXNlJTIwZmllbGR8ZW58MXx8fHwxNzcwOTE2OTI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  dashboard: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkJTIwbW9kZXJuJTIwc2NyZWVufGVufDF8fHx8MTc3MDkxNjkyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  market: 'https://images.unsplash.com/photo-1769685104379-0bedf8505586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGluZGlhbiUyMHZlZ2V0YWJsZSUyMG1hcmtldCUyMHByb2R1Y2V8ZW58MXx8fHwxNzcwOTE2OTI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  drone: 'https://images.unsplash.com/photo-1585428311604-98738fc5687a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMGZseWluZyUyMGdyZWVuJTIwY3JvcCUyMGZpZWxkJTIwYWVyaWFsfGVufDF8fHx8MTc3MDkxNjkyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  pest: 'https://images.unsplash.com/photo-1694100223107-c898e5c117c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMGxlYWYlMjBwZXN0JTIwZGlzZWFzZSUyMGNsb3NldXB8ZW58MXx8fHwxNzcwOTE2OTI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  weather: 'https://images.unsplash.com/photo-1768490124155-9f38b686e88f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWF0aGVyJTIwZm9yZWNhc3QlMjBjbG91ZHMlMjBza3klMjBkcmFtYXRpY3xlbnwxfHx8fDE3NzA5MTY5MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  tractor: 'https://images.unsplash.com/photo-1585539055852-7acf76950530?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjdG9yJTIwbW9kZXJuJTIwYWdyaWN1bHR1cmUlMjBncmVlbiUyMHJvd3N8ZW58MXx8fHwxNzcwOTE2OTMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
};

// ─── Animated Counter ───
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as any, { once: true, margin: '-60px' });
  useEffect(() => {
    if (!isInView) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, end, duration]);
  return { count, ref };
}

// ─── Animated Soil Bar ───
function SoilBar({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as any, { once: true, margin: '-40px' });
  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[#2A0F05]/60 font-medium">{label}</span>
        <span className="text-[#2A0F05]/40 tabular-nums">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-[#812F0F]/8 overflow-hidden">
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
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${dark ? 'bg-white/15' : 'bg-[#812F0F]/12'}`}
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -25, 0], opacity: [0.1, 0.4, 0.1], scale: [1, 1.4, 1] }}
          transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ─── Voice Waveform ───
function VoiceWaveform() {
  return (
    <div className="flex items-end gap-[3px] h-10">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-[#E4490D] to-[#FF8C42]"
          animate={{ height: [4, 8 + Math.random() * 28, 4] }}
          transition={{ duration: 0.6 + Math.random() * 0.8, repeat: Infinity, delay: i * 0.05, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export function FeaturesPage() {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeLanguage, setActiveLanguage] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Counters
  const c1 = useCounter(10000, 2500);
  const c2 = useCounter(94, 2000);
  const c3 = useCounter(25, 1800);
  const c4 = useCounter(500, 2200);
  const c5 = useCounter(40, 2000);
  const c6 = useCounter(3000, 2500);

  // Auto-cycle feature showcase
  useEffect(() => {
    const t = setInterval(() => setActiveFeature(p => (p + 1) % 4), 5000);
    return () => clearInterval(t);
  }, []);

  // Auto-cycle languages
  useEffect(() => {
    const t = setInterval(() => setActiveLanguage(p => (p + 1) % 4), 3000);
    return () => clearInterval(t);
  }, []);

  const handleGetStarted = (e: MouseEvent) => {
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

  // ─── Core Features Data (Bento Grid) ───
  const coreFeatures = [
    {
      icon: Sprout, title: 'Soil Intelligence', color: '#4F8F4A',
      hook: 'Know exactly what your soil needs — no guesswork, no lab visits.',
      detail: 'MILA\'s AI reads your Soil Health Card photo or asks smart questions to estimate N-P-K levels, pH, organic carbon, and micronutrient gaps with 94% accuracy.',
      image: imgSeedlings,
      stats: [{ v: '94%', l: 'Accuracy' }, { v: '2 min', l: 'Analysis' }],
    },
    {
      icon: Droplets, title: 'Smart Irrigation', color: '#4A90E2',
      hook: 'Right water, right time — save 40% water, grow 25% more.',
      detail: 'Crop-stage aware irrigation scheduling that adapts to weather forecasts, soil moisture, and your water source capacity.',
      image: imgSprinklers,
      stats: [{ v: '40%', l: 'Water Saved' }, { v: 'Daily', l: 'Alerts' }],
    },
    {
      icon: Bug, title: 'Pest & Disease Guard', color: '#C44536',
      hook: 'Catch infestations before they spread — protect your harvest.',
      detail: 'AI-powered pest identification from photos, region-based risk alerts, and organic/chemical treatment recommendations ranked by cost and effectiveness.',
      image: imgPest,
      stats: [{ v: '48hr', l: 'Early Warning' }, { v: '150+', l: 'Pests Tracked' }],
    },
    {
      icon: TrendingUp, title: 'Market Intelligence', color: '#E6A23C',
      hook: 'Sell at the best price — know when and where.',
      detail: 'Live mandi prices from 3,000+ APMCs, price trend predictions, and alerts when your crop hits peak value in nearby markets.',
      image: img.market,
      stats: [{ v: '3000+', l: 'Mandis' }, { v: '15min', l: 'Updates' }],
    },
    {
      icon: Wallet, title: 'Budget Tracker', color: '#812F0F',
      hook: 'Every rupee tracked — know your true profit per acre.',
      detail: 'Voice-input expenses, auto-categorized costs (seeds, fertilizer, labor, transport), and season-end profit summaries with charts.',
      image: img.farmer,
      stats: [{ v: '₹15K', l: 'Avg Saved' }, { v: 'Voice', l: 'Input' }],
    },
    {
      icon: BookOpen, title: 'Farm Journal', color: '#8B5CF6',
      hook: 'Your farm\'s memory — never forget what worked.',
      detail: 'Photo-tagged daily logs, spray/fertilizer records, harvest data, and AI-powered season comparisons to improve year over year.',
      image: img.tractor,
      stats: [{ v: 'Photo', l: 'Tagging' }, { v: 'Season', l: 'Compare' }],
    },
  ];

  // ─── Deep-Dive Feature Showcase ───
  const showcaseFeatures = [
    {
      icon: Brain, title: 'AI Crop Advisor', subtitle: 'Perfect crop, every season',
      desc: 'MILA combines your soil profile, weather forecasts, and live market prices to recommend the optimal crop variety — maximizing profit while minimizing risk.',
      image: img.drone,
      color: '#E4490D',
      capabilities: ['Soil-Weather-Market fusion', '7-day forecast integration', 'Risk vs reward scoring', 'Seasonal variety matching'],
      liveDemo: 'recommendation',
    },
    {
      icon: CloudRain, title: 'Weather Shield', subtitle: 'Never be caught off-guard',
      desc: 'Hyper-local forecasts from 500+ weather stations with severe weather alerts, frost warnings, and optimal spray windows — all pushed as voice alerts.',
      image: img.weather,
      color: '#4A90E2',
      capabilities: ['Hyper-local 7-day forecasts', 'Storm & frost alerts', 'Optimal spray windows', 'Rainfall predictions'],
      liveDemo: 'weather',
    },
    {
      icon: Satellite, title: 'Satellite Monitoring', subtitle: 'Eyes in the sky, insights on ground',
      desc: 'NDVI vegetation health maps from multi-spectral satellites, crop stress detection, and growth stage tracking — all visualized on your field map.',
      image: img.satellite,
      color: '#4F8F4A',
      capabilities: ['NDVI health mapping', 'Crop stress detection', 'Growth stage tracking', 'Multi-spectral analysis'],
      liveDemo: 'satellite',
    },
    {
      icon: PieChart, title: 'Profit Analytics', subtitle: 'Crystal clear financials',
      desc: 'Season-end profit/loss reports, cost breakdowns by category, yield-per-acre trends, and projected income for the next season based on market data.',
      image: img.dashboard,
      color: '#E6A23C',
      capabilities: ['Season P&L reports', 'Cost category breakdown', 'Yield trend analysis', 'Income projections'],
      liveDemo: 'analytics',
    },
  ];

  const languages = [
    { name: 'English', native: 'English', greeting: 'Good morning! Time to irrigate Field 2.', flag: '🇬🇧' },
    { name: 'Telugu', native: 'తెలుగు', greeting: 'శుభోదయం! ఫీల్డ్ 2 నీళ్ళు పెట్టే సమయం.', flag: '🇮🇳' },
    { name: 'Hindi', native: 'हिन्दी', greeting: 'सुप्रभात! खेत 2 में सिंचाई का समय।', flag: '🇮🇳' },
    { name: 'Kannada', native: 'ಕನ್ನಡ', greeting: 'ಶುಭೋದಯ! ಹೊಲ 2 ಕ್ಕೆ ನೀರು ಹಾಕುವ ಸಮಯ.', flag: '🇮🇳' },
  ];

  return (
    <div className="relative min-h-screen bg-[#F7F6F2] text-[#2A0F05] overflow-hidden" style={{ position: 'relative' }}>

      {/* ══════════════════════════════════════════════════════
          SECTION 1: CINEMATIC HERO
      ══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-[90vh] min-h-[600px] flex items-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroY }}>
          <ImageWithFallback src={img.hero} alt="Terraced rice fields" className="w-full h-full object-cover scale-110" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7F6F2]/97 via-[#F7F6F2]/80 to-[#F7F6F2]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7F6F2] via-transparent to-[#F7F6F2]/30" />
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-[#812F0F]/8 via-transparent to-transparent mix-blend-multiply"
          animate={{ opacity: [0.05, 0.2, 0.05] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <FloatingDots />

        <motion.div className="max-w-7xl mx-auto px-6 relative z-20 w-full" style={{ opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-[#812F0F]/12 text-sm font-medium mb-8 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E4490D]" />
              <span className="text-[#2A0F05]/55 uppercase tracking-widest text-xs">18 Powerful Features</span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 text-[#2A0F05] leading-[1.05] tracking-tight font-sans">
              Your entire farm,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4490D] to-[#FF8C42]">
                one intelligent app.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#2A0F05]/50 mb-10 leading-relaxed max-w-xl font-light">
              Soil analysis, weather alerts, market prices, pest warnings, budget tracking — everything a farmer needs, working together seamlessly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGetStarted}
                className="group px-8 py-4 bg-[#812F0F] text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
              >
                Start Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
              <Link
                to="/how-it-works"
                className="px-8 py-4 bg-white/70 backdrop-blur-sm border border-[#812F0F]/12 text-[#2A0F05] rounded-xl font-semibold text-base hover:bg-white transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                See How It Works
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Orbiting Feature Icons — desktop only */}
          <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2">
            <div className="relative w-[280px] h-[280px]">
              <motion.div
                className="absolute inset-0 rounded-full border border-[#812F0F]/8"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-6 rounded-full border border-dashed border-[#812F0F]/6"
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              />
              {/* Center icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-[#812F0F]/10 border border-[#812F0F]/15 flex items-center justify-center backdrop-blur-sm">
                <Brain className="w-8 h-8 text-[#812F0F]" />
              </div>
              {/* Orbiting icons */}
              {[
                { icon: Sprout, angle: 0, color: '#4F8F4A' },
                { icon: CloudRain, angle: 60, color: '#4A90E2' },
                { icon: TrendingUp, angle: 120, color: '#E6A23C' },
                { icon: Bug, angle: 180, color: '#C44536' },
                { icon: Wallet, angle: 240, color: '#812F0F' },
                { icon: Mic, angle: 300, color: '#8B5CF6' },
              ].map((item, i) => {
                const r = 125;
                const rad = (item.angle * Math.PI) / 180;
                const x = Math.cos(rad) * r;
                const y = Math.sin(rad) * r;
                return (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-11 h-11 rounded-xl bg-white/80 backdrop-blur-sm border border-[#812F0F]/10 flex items-center justify-center shadow-md"
                    style={{ marginLeft: x - 22, marginTop: y - 22 }}
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[#2A0F05]/25 text-[10px] uppercase tracking-[0.3em]">Explore</span>
          <div className="w-5 h-8 rounded-full border-2 border-[#812F0F]/15 flex justify-center pt-1.5">
            <motion.div className="w-1 h-2 rounded-full bg-[#812F0F]/30" animate={{ y: [0, 8, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SECTION 2: IMPACT NUMBERS STRIP
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-16 bg-gradient-to-b from-[#F7F6F2] to-[#F0ECE4] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { ref: c1.ref, count: c1.count, suffix: '+', label: 'Active Farmers', icon: Users, color: '#812F0F' },
              { ref: c2.ref, count: c2.count, suffix: '%', label: 'AI Accuracy', icon: Target, color: '#4F8F4A' },
              { ref: c3.ref, count: c3.count, suffix: '%', label: 'Yield Increase', icon: TrendingUp, color: '#E4490D' },
              { ref: c4.ref, count: c4.count, suffix: '+', label: 'Weather Stations', icon: CloudRain, color: '#4A90E2' },
              { ref: c5.ref, count: c5.count, suffix: '%', label: 'Water Saved', icon: Droplets, color: '#3B82F6' },
              { ref: c6.ref, count: c6.count, suffix: '+', label: 'Mandis Tracked', icon: BarChart3, color: '#E6A23C' },
            ].map((s, i) => (
              <motion.div
                key={i}
                ref={s.ref as any}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white/60 backdrop-blur-sm border border-[#812F0F]/8 rounded-2xl p-5 text-center hover:bg-white/80 transition-all shadow-sm hover:shadow-md group"
              >
                <div className="inline-flex p-2.5 rounded-xl mb-3 transition-colors" style={{ background: `${s.color}10` }}>
                  <s.icon className="w-4.5 h-4.5" style={{ color: s.color }} />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-[#2A0F05] tabular-nums font-sans">
                  {s.count.toLocaleString()}{s.suffix}
                </p>
                <p className="text-[#2A0F05]/45 text-xs font-medium mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SECTION 3: BENTO FEATURE GRID
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#F0ECE4] to-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#812F0F]/10 text-[#812F0F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/12">
              Core Features
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2A0F05] font-sans mb-4">
              Everything your farm needs,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4490D] to-[#FF8C42]">in one place</span>
            </h2>
            <p className="text-[#2A0F05]/50 max-w-2xl mx-auto text-lg">
              Six powerful tools that work together to make every decision easier and every season more profitable.
            </p>
          </motion.div>

          {/* Bento Grid — 2 large + 4 medium */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreFeatures.map((f, i) => {
              const isLarge = i < 2;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`group relative rounded-3xl overflow-hidden bg-white/70 backdrop-blur-sm border border-[#812F0F]/8 hover:border-[#812F0F]/18 shadow-sm hover:shadow-xl transition-all duration-500 ${
                    isLarge ? 'lg:col-span-1 lg:row-span-2' : ''
                  }`}
                >
                  {/* Image Section */}
                  <div className={`relative overflow-hidden ${isLarge ? 'aspect-[4/3]' : 'aspect-[16/9]'}`}>
                    <img
                      src={f.image}
                      alt={f.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Icon Badge */}
                    <div
                      className="absolute top-4 left-4 w-11 h-11 rounded-xl backdrop-blur-md border border-white/30 flex items-center justify-center"
                      style={{ background: `${f.color}40` }}
                    >
                      <f.icon className="w-5 h-5 text-white" />
                    </div>

                    {/* Stats Badges */}
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {f.stats.map((s, si) => (
                        <div key={si} className="bg-white/85 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-sm">
                          <p className="text-[#2A0F05] text-xs font-bold">{s.v}</p>
                          <p className="text-[#2A0F05]/40 text-[9px]">{s.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`p-6 ${isLarge ? 'sm:p-8' : ''}`}>
                    <h3 className="text-xl font-bold text-[#2A0F05] font-sans mb-2 group-hover:text-[#812F0F] transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-[#812F0F] text-sm font-semibold mb-3">{f.hook}</p>
                    <p className="text-[#2A0F05]/50 text-sm leading-relaxed">{f.detail}</p>
                  </div>

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: `inset 0 0 60px ${f.color}08` }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SECTION 4: AI SHOWCASE — Deep Dive with Phone Mockup
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#F7F6F2] to-[#F0ECE4] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#812F0F]/4 rounded-full blur-[200px]" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#812F0F]/10 text-[#812F0F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/12">
              Deep Intelligence
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2A0F05] font-sans mb-4">
              AI that thinks{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4490D] to-[#FF8C42]">like a farmer</span>
            </h2>
            <p className="text-[#2A0F05]/50 max-w-2xl mx-auto text-lg">
              Four specialized AI modules working in parallel to give you one clear answer.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            {/* Feature Selector */}
            <div className="w-full lg:w-2/5 space-y-3">
              {showcaseFeatures.map((sf, i) => (
                <motion.button
                  key={i}
                  onClick={() => setActiveFeature(i)}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-500 ${
                    activeFeature === i
                      ? 'bg-white/85 border-[#812F0F]/15 shadow-lg'
                      : 'bg-transparent border-[#812F0F]/5 hover:bg-white/40'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all"
                      style={{
                        background: activeFeature === i ? `${sf.color}15` : 'rgba(129,47,15,0.04)',
                        border: `1px solid ${activeFeature === i ? `${sf.color}30` : 'transparent'}`,
                      }}
                    >
                      <sf.icon className="w-5 h-5" style={{ color: activeFeature === i ? sf.color : 'rgba(42,15,5,0.25)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold transition-colors ${activeFeature === i ? 'text-[#2A0F05]' : 'text-[#2A0F05]/40'}`}>
                        {sf.title}
                      </p>
                      <p className={`text-xs transition-colors mt-0.5 ${activeFeature === i ? 'text-[#2A0F05]/55' : 'text-[#2A0F05]/25'}`}>
                        {sf.subtitle}
                      </p>
                      {activeFeature === i && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-[#2A0F05]/50 text-xs leading-relaxed mt-3"
                        >
                          {sf.desc}
                        </motion.p>
                      )}
                    </div>
                    {activeFeature === i && (
                      <motion.div layoutId="featureArrow" className="shrink-0 mt-1">
                        <ChevronRight className="w-4 h-4 text-[#E4490D]" />
                      </motion.div>
                    )}
                  </div>
                  {activeFeature === i && (
                    <motion.div className="mt-4 flex flex-wrap gap-2">
                      {sf.capabilities.map((cap, ci) => (
                        <span key={ci} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F7F6F2] border border-[#812F0F]/8 text-[10px] text-[#2A0F05]/60 font-medium">
                          <CheckCircle2 className="w-3 h-3" style={{ color: sf.color }} />
                          {cap}
                        </span>
                      ))}
                    </motion.div>
                  )}
                  {activeFeature === i && (
                    <motion.div className="mt-3 h-0.5 rounded-full bg-[#812F0F]/8 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <motion.div className="h-full rounded-full" style={{ background: sf.color }} initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 5, ease: 'linear' }} key={activeFeature} />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Phone Mockup with live demo content */}
            <div className="w-full lg:w-3/5 flex justify-center">
              <div className="relative">
                <div className="relative w-[280px] sm:w-[320px] h-[560px] sm:h-[640px] rounded-[3rem] bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] border-2 border-gray-300/30 shadow-[0_20px_80px_rgba(129,47,15,0.12)] overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-10 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center">
                    <div className="w-24 h-5 rounded-full bg-black border border-white/10" />
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeature}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 pt-12"
                    >
                      <ImageWithFallback src={showcaseFeatures[activeFeature].image} alt={showcaseFeatures[activeFeature].title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                      {/* Inline demo content */}
                      <div className="absolute bottom-0 inset-x-0 p-5 space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${showcaseFeatures[activeFeature].color}30` }}>
                            {(() => { const I = showcaseFeatures[activeFeature].icon; return <I className="w-4 h-4" style={{ color: showcaseFeatures[activeFeature].color }} />; })()}
                          </div>
                          <span className="text-white/50 text-[10px] uppercase tracking-wider font-bold">{showcaseFeatures[activeFeature].title}</span>
                        </div>

                        {/* Dynamic content per feature */}
                        {activeFeature === 0 && (
                          <div className="space-y-2">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                              <p className="text-white/50 text-[9px] uppercase tracking-wider font-bold mb-2">Top Recommendation</p>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#E6A23C]/20 flex items-center justify-center">
                                  <Sprout className="w-5 h-5 text-[#E6A23C]" />
                                </div>
                                <div>
                                  <p className="text-white text-sm font-bold">Samba Masuri (BPT 5204)</p>
                                  <p className="text-white/40 text-[10px]">92% match · ₹45,200/acre profit</p>
                                </div>
                              </div>
                              <div className="flex gap-1.5 mt-2">
                                <span className="px-2 py-0.5 bg-green-500/15 text-green-400 text-[9px] rounded-full font-bold">High Demand</span>
                                <span className="px-2 py-0.5 bg-blue-500/15 text-blue-400 text-[9px] rounded-full font-bold">Low Risk</span>
                              </div>
                            </div>
                          </div>
                        )}
                        {activeFeature === 1 && (
                          <div className="space-y-2">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-white/50 text-[9px] uppercase tracking-wider font-bold">7-Day Forecast</p>
                                <p className="text-white/30 text-[9px]">Hyderabad</p>
                              </div>
                              <div className="flex gap-2">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, di) => (
                                  <div key={di} className="flex-1 text-center">
                                    <p className="text-white/40 text-[8px]">{d}</p>
                                    <Sun className="w-3.5 h-3.5 text-amber-400 mx-auto my-1" />
                                    <p className="text-white text-[10px] font-bold">{32 + di}°</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 bg-amber-500/15 rounded-lg px-3 py-2 border border-amber-500/20">
                              <Bell className="w-3 h-3 text-amber-400" />
                              <p className="text-amber-200 text-[10px]">Heat wave expected Thursday</p>
                            </div>
                          </div>
                        )}
                        {activeFeature === 2 && (
                          <div className="space-y-2">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                              <p className="text-white/50 text-[9px] uppercase tracking-wider font-bold mb-2">Vegetation Health (NDVI)</p>
                              <div className="grid grid-cols-4 gap-1">
                                {Array.from({ length: 16 }).map((_, gi) => (
                                  <div key={gi} className="aspect-square rounded-sm" style={{ background: `hsl(${100 + Math.random() * 40}, ${50 + Math.random() * 30}%, ${30 + Math.random() * 25}%)` }} />
                                ))}
                              </div>
                              <div className="flex justify-between mt-2">
                                <span className="text-red-400 text-[8px]">Stressed</span>
                                <span className="text-green-400 text-[8px]">Healthy</span>
                              </div>
                            </div>
                          </div>
                        )}
                        {activeFeature === 3 && (
                          <div className="space-y-2">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                              <p className="text-white/50 text-[9px] uppercase tracking-wider font-bold mb-2">Season Summary</p>
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-white/50">Revenue</span>
                                  <span className="text-green-400 font-bold">₹1,45,200</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                  <span className="text-white/50">Expenses</span>
                                  <span className="text-red-400 font-bold">-₹68,400</span>
                                </div>
                                <div className="h-px bg-white/10" />
                                <div className="flex justify-between text-xs">
                                  <span className="text-white/70 font-semibold">Net Profit</span>
                                  <span className="text-green-400 font-bold">₹76,800</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-white/20 z-20" />
                </div>

                {/* Floating badges */}
                <motion.div className="absolute -top-3 -right-6 sm:-right-14 bg-white/85 backdrop-blur-xl border border-[#812F0F]/10 rounded-xl px-3 py-2 hidden sm:block shadow-lg" animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-[#2A0F05]/65 text-xs font-medium">Processing live</span>
                  </div>
                </motion.div>
                <motion.div className="absolute top-1/4 -left-6 sm:-left-18 bg-white/85 backdrop-blur-xl border border-[#812F0F]/10 rounded-xl px-3 py-2 hidden sm:block shadow-lg" animate={{ y: [0, 6, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                  <div className="flex items-center gap-2">
                    <Satellite className="w-3.5 h-3.5 text-[#4A90E2]" />
                    <span className="text-[#2A0F05]/65 text-xs font-medium">15 data sources</span>
                  </div>
                </motion.div>
                <motion.div className="absolute bottom-24 -right-6 sm:-right-20 bg-white/85 backdrop-blur-xl border border-[#812F0F]/10 rounded-xl px-3 py-2 hidden sm:block shadow-lg" animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}>
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#4F8F4A]" />
                    <span className="text-[#2A0F05]/65 text-xs font-medium">98% uptime</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SECTION 5: REAL-TIME SOIL ANALYSIS VISUAL
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#F0ECE4] to-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Visual — Soil Card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                <ImageWithFallback src={img.soil} alt="Soil analysis" className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A0F05]/80 via-[#2A0F05]/20 to-transparent" />

                {/* Overlay Analysis Card */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-[#4F8F4A]/10 flex items-center justify-center border border-[#4F8F4A]/15">
                      <Leaf className="w-4.5 h-4.5 text-[#4F8F4A]" />
                    </div>
                    <div>
                      <p className="text-[#2A0F05] text-sm font-bold">Soil Health Report</p>
                      <p className="text-[#2A0F05]/40 text-[10px]">Field 1 · Red Loamy Soil · pH 6.8</p>
                    </div>
                    <span className="ml-auto px-2 py-0.5 bg-green-500/10 text-green-700 text-[9px] rounded-full font-bold">Good</span>
                  </div>
                  <div className="space-y-2.5">
                    <SoilBar label="Nitrogen (N)" value={72} color="#4F8F4A" delay={0} />
                    <SoilBar label="Phosphorus (P)" value={45} color="#E6A23C" delay={0.12} />
                    <SoilBar label="Potassium (K)" value={88} color="#4A90E2" delay={0.24} />
                    <SoilBar label="Organic Carbon" value={56} color="#E4490D" delay={0.36} />
                    <SoilBar label="Zinc" value={32} color="#8B5CF6" delay={0.48} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 space-y-6"
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-[#4F8F4A]/10 text-[#4F8F4A] text-xs font-bold uppercase tracking-wider border border-[#4F8F4A]/15">
                Soil Intelligence
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2A0F05] font-sans leading-tight">
                Your soil has a story.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F8F4A] to-[#8BCF6A]">MILA reads it.</span>
              </h2>
              <p className="text-[#2A0F05]/50 text-base sm:text-lg leading-relaxed">
                Upload a photo of your Soil Health Card or answer 5 quick questions. MILA's AI analyzes your soil composition and gives you actionable recommendations — which fertilizer, how much, and when to apply.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { icon: Camera, text: 'Photo-based analysis', desc: 'Snap your Soil Health Card' },
                  { icon: Zap, text: '2-minute results', desc: 'Instant NPK estimation' },
                  { icon: Target, text: '94% accuracy', desc: 'Lab-grade precision' },
                  { icon: Bell, text: 'Deficiency alerts', desc: 'Know what\'s missing' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-white/60 border border-[#812F0F]/8 rounded-xl p-4 hover:bg-white/80 transition-all shadow-sm"
                  >
                    <item.icon className="w-5 h-5 text-[#4F8F4A] mb-2" />
                    <p className="text-[#2A0F05] text-sm font-bold">{item.text}</p>
                    <p className="text-[#2A0F05]/40 text-xs mt-0.5">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SECTION 6: VOICE & LANGUAGE
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#F7F6F2] to-[#F0ECE4] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-16 items-center">
            {/* Visual — Voice Demo */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <div className="bg-white/70 backdrop-blur-sm border border-[#812F0F]/10 rounded-3xl p-8 shadow-lg">
                {/* Waveform */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#E4490D]/10 flex items-center justify-center border border-[#E4490D]/15">
                    <Volume2 className="w-7 h-7 text-[#E4490D]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#2A0F05] text-sm font-bold">MILA Voice Assistant</p>
                    <p className="text-[#2A0F05]/40 text-xs">Speaking in real-time...</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-[#E4490D] animate-pulse" />
                </div>
                <VoiceWaveform />

                {/* Language Carousel */}
                <div className="mt-8 space-y-4">
                  <p className="text-[#2A0F05]/40 text-xs font-bold uppercase tracking-wider">Available Languages</p>
                  <div className="grid grid-cols-2 gap-3">
                    {languages.map((lang, i) => (
                      <motion.div
                        key={i}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          activeLanguage === i
                            ? 'bg-[#812F0F]/8 border-[#812F0F]/20 shadow-sm'
                            : 'bg-white/50 border-[#812F0F]/6 hover:bg-white/80'
                        }`}
                        onClick={() => setActiveLanguage(i)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{lang.flag}</span>
                          <div>
                            <p className={`text-xs font-bold ${activeLanguage === i ? 'text-[#812F0F]' : 'text-[#2A0F05]/60'}`}>{lang.name}</p>
                            <p className="text-[#2A0F05]/30 text-[10px]">{lang.native}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Active greeting */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeLanguage}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="bg-[#F7F6F2] border border-[#812F0F]/8 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <Mic className="w-4 h-4 text-[#E4490D] mt-0.5 shrink-0" />
                        <p className="text-[#2A0F05]/70 text-sm leading-relaxed italic">
                          "{languages[activeLanguage].greeting}"
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 space-y-6"
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-bold uppercase tracking-wider border border-[#8B5CF6]/15">
                Voice & Language
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2A0F05] font-sans leading-tight">
                Your language, your voice.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#E4490D]">MILA speaks it.</span>
              </h2>
              <p className="text-[#2A0F05]/50 text-base sm:text-lg leading-relaxed">
                Wake up to voice alerts in Telugu, Hindi, Kannada, or English. MILA tells you exactly what to do today — when to irrigate, spray, or harvest — in natural, easy-to-understand language.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  { icon: Mic, text: 'Voice alerts in your language', desc: 'Natural spoken guidance every morning' },
                  { icon: Globe2, text: '4 languages supported', desc: 'Telugu, Hindi, Kannada & English' },
                  { icon: Smartphone, text: 'Works offline', desc: 'Voice packs download once, work everywhere' },
                  { icon: MessageCircle, text: 'Voice input too', desc: 'Speak to log expenses and field notes' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-[#812F0F]/8 hover:bg-white/80 transition-all shadow-sm"
                  >
                    <item.icon className="w-5 h-5 text-[#8B5CF6] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[#2A0F05] text-sm font-bold">{item.text}</p>
                      <p className="text-[#2A0F05]/40 text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SECTION 7: OFFLINE-FIRST & SECURITY
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#F0ECE4] to-[#F7F6F2]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#812F0F]/10 text-[#812F0F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/12">
              Built for Rural India
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2A0F05] font-sans mb-4">
              Works everywhere.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4490D] to-[#FF8C42]">Even offline.</span>
            </h2>
            <p className="text-[#2A0F05]/50 max-w-2xl mx-auto text-lg">
              We built MILA for real conditions — spotty internet, old phones, and the needs of every farmer.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: WifiOff, title: 'Full Offline Mode', desc: 'All core features work without internet. Sync when connected.', color: '#4A90E2', badge: 'No Internet Needed' },
              { icon: Shield, title: 'End-to-End Encrypted', desc: 'Your farm data is fully encrypted. We never sell or share it.', color: '#4F8F4A', badge: 'Bank-Level Security' },
              { icon: Smartphone, title: 'Works on Any Phone', desc: 'Optimized for Android phones from ₹5,000. Low storage, low bandwidth.', color: '#E6A23C', badge: 'Any Device' },
              { icon: BatteryCharging, title: 'Low Battery Usage', desc: 'Background sync is minimal. MILA doesn\'t drain your battery.', color: '#8B5CF6', badge: 'Efficient' },
              { icon: Database, title: 'Auto-Backup', desc: 'Your data backs up automatically when connected. Never lose a record.', color: '#C44536', badge: 'Always Safe' },
              { icon: Clock, title: 'Instant Load', desc: 'App opens in under 2 seconds. No loading screens, no waiting.', color: '#812F0F', badge: '< 2 sec' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group bg-white/70 backdrop-blur-sm border border-[#812F0F]/8 rounded-2xl p-6 hover:bg-white/90 hover:border-[#812F0F]/18 transition-all duration-500 shadow-sm hover:shadow-lg relative overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <span className="px-2 py-0.5 bg-[#F7F6F2] border border-[#812F0F]/8 rounded-full text-[9px] font-bold text-[#2A0F05]/50 uppercase tracking-wider">{item.badge}</span>
                </div>
                <div className="p-3 rounded-xl w-fit mb-4 transition-colors" style={{ background: `${item.color}10`, border: `1px solid ${item.color}15` }}>
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <h3 className="text-lg font-bold text-[#2A0F05] mb-2 font-sans">{item.title}</h3>
                <p className="text-[#2A0F05]/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SECTION 8: DAILY LIFE WITH MILA — Timeline
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#F7F6F2] to-[#F0ECE4]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#812F0F]/10 text-[#812F0F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/12">
              A Day With MILA
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2A0F05] font-sans mb-4">
              From sunrise to sunset,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4490D] to-[#FF8C42]">MILA guides you</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#812F0F]/20 via-[#E4490D]/15 to-[#812F0F]/5" />

            <div className="space-y-8">
              {[
                { time: '5:30 AM', icon: Sun, title: 'Morning Voice Briefing', desc: 'MILA greets you with today\'s weather, soil moisture levels, and any overnight pest alerts — in Telugu.', color: '#E6A23C', tag: 'Voice Alert' },
                { time: '6:00 AM', icon: Droplets, title: 'Irrigation Reminder', desc: 'Field 2 soil moisture dropped to 38%. MILA recommends 45 minutes of drip irrigation before 8 AM.', color: '#4A90E2', tag: 'Water' },
                { time: '8:30 AM', icon: Camera, title: 'Crop Health Check', desc: 'Snap a photo of yellowing leaves — MILA identifies zinc deficiency and suggests foliar spray with ZnSO₄.', color: '#4F8F4A', tag: 'AI Analysis' },
                { time: '10:00 AM', icon: TrendingUp, title: 'Market Alert', desc: 'Rice price hits ₹2,180/quintal at Warangal mandi (↑3.2%). MILA suggests selling 40 quintals today.', color: '#E4490D', tag: 'Market' },
                { time: '12:00 PM', icon: Wallet, title: 'Expense Logged', desc: 'Voice-logged: ₹2,400 for 2 bags DAP fertilizer. Auto-categorized under "Fertilizer" for Field 1.', color: '#812F0F', tag: 'Budget' },
                { time: '4:00 PM', icon: CloudRain, title: 'Weather Warning', desc: 'Heavy rain expected in 6 hours. MILA advises: delay pesticide spray to tomorrow morning, cover harvested grain.', color: '#3B82F6', tag: 'Weather' },
                { time: '7:00 PM', icon: BookOpen, title: 'Daily Summary', desc: 'Today: irrigated Field 2, identified zinc issue, sold 40Q rice, logged ₹2,400 expense. Season profit: ₹76,800.', color: '#8B5CF6', tag: 'Summary' },
              ].map((event, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative pl-16 sm:pl-20"
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-4 sm:left-6 w-5 h-5 rounded-full border-2 border-white shadow-md z-10"
                    style={{ background: event.color, top: '6px' }}
                  />

                  <div className="bg-white/70 backdrop-blur-sm border border-[#812F0F]/8 rounded-2xl p-5 sm:p-6 hover:bg-white/85 transition-all shadow-sm hover:shadow-md group">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[#2A0F05]/40 text-xs font-bold tabular-nums">{event.time}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" style={{ background: `${event.color}12`, color: event.color, border: `1px solid ${event.color}20` }}>{event.tag}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg shrink-0" style={{ background: `${event.color}10` }}>
                        <event.icon className="w-4 h-4" style={{ color: event.color }} />
                      </div>
                      <div>
                        <h4 className="text-[#2A0F05] text-sm font-bold mb-1">{event.title}</h4>
                        <p className="text-[#2A0F05]/50 text-sm leading-relaxed">{event.desc}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SECTION 9: PRICING PREVIEW
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#F0ECE4] to-[#F7F6F2]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#812F0F]/10 text-[#812F0F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/12">
              Simple Pricing
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2A0F05] font-sans mb-4">
              Free to start.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4490D] to-[#FF8C42]">Powerful when you grow.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/70 backdrop-blur-sm border border-[#812F0F]/10 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#4F8F4A]/10 flex items-center justify-center border border-[#4F8F4A]/15">
                  <Sprout className="w-6 h-6 text-[#4F8F4A]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2A0F05] font-sans">Free</h3>
                  <p className="text-[#2A0F05]/40 text-xs">Forever free, no card needed</p>
                </div>
              </div>
              <p className="text-4xl font-bold text-[#2A0F05] mb-6 font-sans">₹0<span className="text-base font-normal text-[#2A0F05]/40">/month</span></p>
              <div className="space-y-3">
                {['Soil analysis from photo', 'Daily weather alerts', 'Voice guidance (1 language)', 'Basic crop recommendations', 'Expense tracking', '1 field profile'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4F8F4A] shrink-0" />
                    <span className="text-[#2A0F05]/60 text-sm">{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleGetStarted} className="w-full mt-8 py-3.5 rounded-xl bg-[#F7F6F2] border border-[#812F0F]/12 text-[#2A0F05] font-bold text-sm hover:bg-white transition-colors">
                Get Started Free
              </button>
            </motion.div>

            {/* Pro Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm border-2 border-[#812F0F]/20 rounded-3xl p-8 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#812F0F] text-white text-[10px] font-bold uppercase tracking-wider rounded-bl-xl">
                Most Popular
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#812F0F]/10 flex items-center justify-center border border-[#812F0F]/15">
                  <Sparkles className="w-6 h-6 text-[#812F0F]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2A0F05] font-sans">Pro</h3>
                  <p className="text-[#2A0F05]/40 text-xs">Less than 1 bag of fertilizer</p>
                </div>
              </div>
              <p className="text-4xl font-bold text-[#812F0F] mb-6 font-sans">₹99<span className="text-base font-normal text-[#2A0F05]/40">/month</span></p>
              <div className="space-y-3">
                {['Everything in Free', 'Satellite NDVI monitoring', 'All 4 languages + voice input', 'Advanced market analytics', 'AI crop planning + risk score', 'Unlimited fields', 'Profit analytics & reports', 'Priority support'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#812F0F] shrink-0" />
                    <span className="text-[#2A0F05]/70 text-sm font-medium">{f}</span>
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetStarted}
                className="w-full mt-8 py-3.5 rounded-xl bg-[#812F0F] text-white font-bold text-sm hover:bg-[#6D280D] transition-colors shadow-md"
              >
                Start Pro Trial
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          SECTION 10: CTA
      ══════════════════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback src={img.harvest} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#812F0F]/95 via-[#812F0F]/85 to-[#812F0F]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#812F0F] via-transparent to-[#812F0F]/80" />
        </div>
        <FloatingDots dark />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
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
              18 features.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">One app. Your farm.</span>
            </h2>
            <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-xl mx-auto font-light">
              Join 10,000+ farmers who have already transformed their harvest with MILA.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGetStarted}
                className="group px-10 py-5 bg-white text-[#812F0F] rounded-xl font-bold text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-3"
              >
                Start Farming Smarter
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
              <Link
                to="/how-it-works"
                className="px-10 py-5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                How It Works
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

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
