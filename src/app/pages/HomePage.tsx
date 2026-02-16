import { MouseEvent, CSSProperties, useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, useInView } from 'motion/react';
import {
  Sprout, Droplets, Heart, BookOpen, TrendingUp, Shield, Scale,
  MessageSquare, Mic, WifiOff, Lock, Sun, ArrowRight,
  Leaf, CloudRain, BarChart3, Camera, Globe, Smartphone,
  Users, MapPin, Zap, ChevronRight, Star, Quote,
  Thermometer, Wallet, LineChart, Brain
} from 'lucide-react';
import heroImage from 'figma:asset/289246e7ef941e756187bde2d3672e0708c4494d.png';
import greenCropImage from 'figma:asset/66f4f8d531cdb10d4e00816eaa448938a6ed0ee0.png';
import Logo from '../../imports/Logo';
import dailyGuidanceImage from 'figma:asset/6029ecfc92dbcd80ad92e7309be1a9a13ea1a785.png';
import soilImage from 'figma:asset/0d6e9aaec2cb8d236d77797ec8d343ed41e0b43b.png';
import harvestImage from 'figma:asset/9becba947a58625019d6f5a6f03fa54f33bb6578.png';

// ─── Animated Counter Hook ───
function useCounter(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as any, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!startOnView || !isInView) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, end, duration, startOnView]);

  return { count, ref };
}

// ─── Testimonial images ───
const testimonialImages = {
  farmer1: 'https://images.unsplash.com/photo-1724996854069-a7d335193ee2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtZXIlMjBzbWlsaW5nJTIwcG9ydHJhaXQlMjBydXJhbHxlbnwxfHx8fDE3NzA5MTQ4NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  farmer2: 'https://images.unsplash.com/photo-1560838944-9e0177bbc294?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGZhcm1lciUyMHNhcmklMjBmaWVsZHxlbnwxfHx8fDE3NzA5MTQ4NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  farmer3: 'https://images.unsplash.com/photo-1518977081765-9b1b0c2538e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBlbGRlcmx5JTIwZmFybWVyJTIwdHVyYmFuJTIwd2lzZG9tfGVufDF8fHx8MTc3MDkxNDg1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
};

const bentoImages = {
  soilTest: 'https://images.unsplash.com/photo-1601408648796-349272138e57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2lsJTIwdGVzdGluZyUyMGFncmljdWx0dXJlJTIwaGFuZHxlbnwxfHx8fDE3NzA5MTQ4NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  weather: 'https://images.unsplash.com/photo-1769527818834-cc213f605ebd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWF0aGVyJTIwZm9yZWNhc3QlMjByYWluJTIwY2xvdWRzJTIwZHJhbWF0aWMlMjBza3l8ZW58MXx8fHwxNzcwOTE0ODU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  market: 'https://images.unsplash.com/photo-1741517287225-7cd8d44b3cf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBtYXJrZXQlMjBjb2xvcmZ1bCUyMHByb2R1Y2V8ZW58MXx8fHwxNzcwOTE0ODU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  ricePaddy: 'https://images.unsplash.com/photo-1750353127953-bf1f4943c343?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHJpY2UlMjBwYWRkeSUyMGZpZWxkJTIwYWVyaWFsJTIwaW5kaWF8ZW58MXx8fHwxNzcwOTE0ODUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  phoneFarmer: 'https://images.unsplash.com/photo-1589292144899-2f43a71a1b2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGluZGlhbiUyMGZhcm1lciUyMHNtYXJ0cGhvbmUlMjBtb2JpbGV8ZW58MXx8fHwxNzcwOTE0ODU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  harvest: 'https://images.unsplash.com/photo-1715530983270-0f42f93828c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtZXIlMjBoYXJ2ZXN0JTIwd2hlYXQlMjBnb2xkZW58ZW58MXx8fHwxNzcwOTE0ODUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
};


export function HomePage() {
  const navigate = useNavigate();

  const handleGetStartedClick = (e: MouseEvent) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('currentUser');
    const hasOnboarded = localStorage.getItem('hasOnboarded');
    if (storedUser) {
      if (hasOnboarded) navigate('/dashboard');
      else window.location.href = '/';
    } else {
      navigate('/login');
    }
  };

  // Counters
  const farmersCounter = useCounter(10000, 2500);
  const acresCounter = useCounter(50000, 2500);
  const yieldCounter = useCounter(25, 2000);
  const statesCounter = useCounter(8, 1800);

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

  return (
    <div className="min-h-screen">

      {/* ════════════════════════════════════════════════════════
          SECTION 1: HERO
      ════════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Indian Farmer in field" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Breathing Brand Ambient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-[#812F0F]/40 via-transparent to-transparent mix-blend-overlay"
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Interactive Smart Scan Layer */}
          <motion.div
            className="absolute inset-0 z-10 cursor-crosshair overflow-hidden"
            initial="idle"
            whileHover="scanning"
          >
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
            <motion.div
              className="absolute inset-0"
              variants={{ idle: { opacity: 0 }, scanning: { opacity: 1 } }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#2A0F05_100%)] mix-blend-multiply opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#812F0F]/50 via-transparent to-[#FFDbb5]/20 mix-blend-soft-light" />
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[#CC5533] text-sm font-medium mb-6">
                <Sun className="w-4 h-4" />
                <span className="text-white">Smart Farming for Everyone</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white leading-[1.1] tracking-tight font-sans">
                Your farm's <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E4490D] to-[#FF8C42]">
                  best friend.
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
                From soil testing to market selling — the only companion that speaks your language and walks the field with you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGetStartedClick}
                  className="px-8 py-4 bg-[rgb(228,73,13)] hover:bg-[#963714] text-white rounded-xl transition-all shadow-[0_0_30px_rgba(228,73,13,0.4)] hover:shadow-[0_0_40px_rgba(228,73,13,0.6)] text-lg font-bold flex items-center justify-center gap-2"
                >
                  Start Farming Better
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <Link
                  to="/how-it-works"
                  className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all font-semibold text-lg flex items-center justify-center gap-2"
                >
                  See How It Works
                  <ChevronRight className="w-5 h-5" />
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
                <div className="w-px h-8 bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Globe className="w-5 h-5 text-green-400" />
                  </div>
                  <span>Your Language</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Stat Card */}
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

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex justify-center pt-1.5">
            <motion.div
              className="w-1 h-2 rounded-full bg-white/50"
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>


      {/* ════════════════════════════════════════════════════════
          SECTION 2: IMPACT STATS (NEW)
      ════════════════════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-b from-[#2A0F05] to-[#1A0903] overflow-hidden">
        {/* Animated grain */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#812F0F]/30 text-[#FF8C42] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/40">
              Growing Impact
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white/90 font-sans">
              Trusted by farmers across India
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { ref: farmersCounter.ref, count: farmersCounter.count, suffix: '+', label: 'Farmers Onboarded', icon: Users, color: 'from-[#E4490D] to-[#FF8C42]' },
              { ref: acresCounter.ref, count: acresCounter.count, suffix: '+', label: 'Acres Monitored', icon: MapPin, color: 'from-green-500 to-emerald-400' },
              { ref: yieldCounter.ref, count: yieldCounter.count, suffix: '%', label: 'Avg. Yield Increase', icon: TrendingUp, color: 'from-amber-500 to-yellow-400' },
              { ref: statesCounter.ref, count: statesCounter.count, suffix: '', label: 'States & Growing', icon: Globe, color: 'from-blue-500 to-cyan-400' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                ref={stat.ref as any}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 sm:p-8 text-center hover:bg-white/[0.08] transition-all duration-500 hover:border-white/[0.15]">
                  {/* Glow on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />

                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 tabular-nums font-sans">
                    {stat.count.toLocaleString()}{stat.suffix}
                  </div>
                  <p className="text-white/50 text-sm font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          SECTION 3: PROBLEMS
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
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
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight font-sans">
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
                <img src={problem.image} alt={problem.text} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:via-black/70 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300">
                    <div className="w-6 h-6 text-white" style={{ '--fill-0': 'currentColor' } as CSSProperties}>
                      <problem.icon />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300 font-sans">{problem.text}</h3>
                  <div className="w-12 h-1 bg-primary rounded-full mt-2 group-hover:w-20 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          SECTION 4: BENTO FEATURE GRID (NEW)
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-background relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#812F0F]/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] translate-x-1/2" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#812F0F]/10 text-[#812F0F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/20">
              Everything You Need
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-sans">
              Your entire farm, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#812F0F] to-[#E4490D]">in your pocket</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Six powerful tools woven into one simple app. No complexity, just clarity.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* Card 1: Soil Intelligence - Large */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="lg:col-span-2 relative rounded-3xl overflow-hidden group h-[320px] sm:h-[360px]"
            >
              <img src={bentoImages.soilTest} alt="Soil Testing" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <Leaf className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-white/60 text-sm font-medium uppercase tracking-wider">Soil Intelligence</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-sans">Know your soil's secrets</h3>
                <p className="text-white/70 max-w-lg text-base">
                  Test pH, nutrients, and organic matter. Get precise fertilizer recommendations based on your exact soil profile — not guesswork.
                </p>
                {/* Mini data chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {['pH Level', 'NPK Analysis', 'Organic Carbon', 'Micro Nutrients'].map((chip) => (
                    <span key={chip} className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/70 text-xs font-medium border border-white/10">{chip}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Card 2: Weather Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative rounded-3xl overflow-hidden group h-[320px] sm:h-[360px]"
            >
              <img src={bentoImages.weather} alt="Weather" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
              <div className="absolute inset-0 p-7 flex flex-col justify-end z-10">
                <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 w-fit mb-4">
                  <CloudRain className="w-6 h-6 text-sky-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-sans">Weather Alerts</h3>
                <p className="text-white/60 text-sm">Hyper-local 7-day forecasts with smart sowing & spraying advisories.</p>
                {/* Mini weather preview */}
                <div className="flex items-center gap-3 mt-4 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span className="text-white/80 text-sm font-medium">32°C</span>
                  <div className="w-px h-4 bg-white/20" />
                  <CloudRain className="w-4 h-4 text-sky-400" />
                  <span className="text-white/80 text-sm font-medium">70%</span>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Budget Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="relative rounded-3xl overflow-hidden group h-[280px] sm:h-[300px] bg-gradient-to-br from-[#1A0903] to-[#2A0F05]"
            >
              <div className="absolute inset-0 p-7 flex flex-col justify-between z-10">
                <div>
                  <div className="p-2.5 bg-[#812F0F]/20 rounded-xl border border-[#812F0F]/30 w-fit mb-4">
                    <Wallet className="w-6 h-6 text-[#FF8C42]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-sans">Budget Tracker</h3>
                  <p className="text-white/50 text-sm">Every rupee in, every rupee out. Know your true profit per acre.</p>
                </div>
                {/* Mini chart visualization */}
                <div className="flex items-end gap-1.5 h-20 mt-4">
                  {[35, 55, 40, 70, 50, 85, 60, 90, 75, 65, 80, 95].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{ height: `${h}%`, background: i >= 8 ? '#E4490D' : 'rgba(255,255,255,0.1)' }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-white/30 mt-2">
                  <span>Jan</span>
                  <span>Jun</span>
                  <span>Dec</span>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Crop Intelligence */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden group h-[280px] sm:h-[300px]"
            >
              <img src={bentoImages.ricePaddy} alt="Crops" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-7 flex flex-col justify-end z-10">
                <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 w-fit mb-4">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-sans">Crop Intelligence</h3>
                <p className="text-white/60 text-sm">AI-powered crop selection based on your soil, season, and market demand.</p>
              </div>
            </motion.div>

            {/* Card 5: Market Prices - Large */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="relative rounded-3xl overflow-hidden group h-[280px] sm:h-[300px]"
            >
              <img src={bentoImages.market} alt="Market" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />
              <div className="absolute inset-0 p-7 flex flex-col justify-end z-10">
                <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 w-fit mb-4">
                  <LineChart className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-sans">Market Prices</h3>
                <p className="text-white/60 text-sm">Live mandi prices, price trend predictions, and best time-to-sell alerts.</p>
                {/* Price trend mini */}
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-green-500/20 rounded-full">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 text-xs font-bold">+12%</span>
                  </div>
                  <span className="text-white/40 text-xs">Rice - Guntur Mandi</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          SECTION 5: SOLUTION JOURNEY (Enhanced)
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#812F0F]/10 text-[#812F0F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/20">
              Your Journey
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-sans">
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
                { text: 'Understand soil', image: soilImage, desc: 'Know your land\'s potential', icon: Leaf, color: 'text-green-500' },
                { text: 'Choose crop', image: greenCropImage, desc: 'Select the right crop', icon: Sprout, color: 'text-emerald-500' },
                { text: 'Daily guidance', image: dailyGuidanceImage, desc: 'Timely advice & alerts', icon: Sun, color: 'text-amber-500' },
                { text: 'Track money', image: 'https://images.unsplash.com/photo-1650700597978-3bee20ccfc55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBydXBlZSUyMGNvaW5zJTIwZmFybWluZyUyMHByb2ZpdHxlbnwxfHx8fDE3NjY5MDEzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', desc: 'Monitor expenses & profits', icon: BarChart3, color: 'text-blue-500' },
                { text: 'Sell better', image: harvestImage, desc: 'Get the best market price', icon: TrendingUp, color: 'text-[#E4490D]' }
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
                    <img src={step.image} alt={step.text} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur text-primary font-bold text-lg flex items-center justify-center z-20 shadow-lg font-sans">
                      {index + 1}
                    </div>
                    {/* Icon badge */}
                    <div className="absolute bottom-4 right-4 p-2 bg-white/90 backdrop-blur rounded-lg z-20 shadow-lg">
                      <step.icon className={`w-4 h-4 ${step.color}`} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors font-sans">{step.text}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          SECTION 6: APP PREVIEW / PHONE SHOWCASE (NEW)
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-[#2A0F05] relative overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-[#E4490D]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-[#812F0F]/20 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Text content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-white/5 text-[#FF8C42] text-xs font-bold uppercase tracking-wider mb-6 border border-white/10">
                Designed for the Field
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight font-sans">
                Feels like talking to a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFDbb5] to-[#FF8C42]">wise friend</span>
              </h2>
              <p className="text-lg text-white/60 mb-10 leading-relaxed max-w-lg">
                No complex menus. No confusing graphs. Just speak or tap, and MILA guides you through every decision with warmth and clarity.
              </p>

              {/* Feature list */}
              <div className="space-y-5">
                {[
                  { icon: Mic, title: 'Voice-first interface', desc: 'Speak in Telugu, Hindi, or English — MILA understands you', color: 'bg-orange-500/20 text-orange-400' },
                  { icon: Smartphone, title: 'Works on any phone', desc: 'Even basic smartphones. No high-end device needed', color: 'bg-blue-500/20 text-blue-400' },
                  { icon: WifiOff, title: 'Offline capable', desc: 'Critical features work without internet. Syncs when back online', color: 'bg-green-500/20 text-green-400' },
                  { icon: Camera, title: 'Snap & diagnose', desc: 'Take a photo of any pest or disease and get instant identification', color: 'bg-purple-500/20 text-purple-400' },
                ].map((feat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className={`p-2.5 rounded-xl ${feat.color} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <feat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-0.5 font-sans">{feat.title}</h4>
                      <p className="text-white/40 text-sm">{feat.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Phone mockup visual */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Glow behind phone */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#E4490D]/30 via-[#812F0F]/20 to-transparent rounded-full blur-[60px] scale-110" />

                {/* Phone Frame */}
                <div className="relative w-[280px] sm:w-[320px] h-[560px] sm:h-[640px] bg-[#1A0903] rounded-[3rem] border-[6px] border-white/10 overflow-hidden shadow-2xl shadow-black/50">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1A0903] rounded-b-2xl z-30" />

                  {/* Screen content */}
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={bentoImages.phoneFarmer}
                      alt="MILA App in action"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A0903] via-transparent to-[#1A0903]/50" />

                    {/* App UI overlay elements */}
                    <div className="absolute top-10 left-0 right-0 px-5 z-20">
                      <div className="flex items-center justify-between">
                        <div className="text-white text-sm font-bold font-sans">MILA</div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                          <span className="text-white/60 text-xs">Online</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom chat-like UI */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 space-y-3">
                      <motion.div
                        className="bg-white/10 backdrop-blur-xl rounded-2xl rounded-bl-none p-3.5 border border-white/10 max-w-[85%]"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                      >
                        <p className="text-white/90 text-xs leading-relaxed">Your Kharif paddy is in week 6. Nitrogen levels are low — apply 20kg Urea per acre this week.</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <Zap className="w-3 h-3 text-[#FF8C42]" />
                          <span className="text-[#FF8C42] text-[10px] font-medium">AI Recommendation</span>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-[#E4490D]/90 backdrop-blur-xl rounded-2xl rounded-br-none p-3.5 ml-auto max-w-[70%]"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.1 }}
                      >
                        <p className="text-white text-xs">Which fertilizer brand is best?</p>
                      </motion.div>

                      {/* Voice input bar */}
                      <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-4 py-2.5 border border-white/10">
                        <Mic className="w-4 h-4 text-[#FF8C42]" />
                        <span className="text-white/30 text-xs flex-1">Tap to speak...</span>
                        <ArrowRight className="w-4 h-4 text-white/30" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badges around phone */}
                <motion.div
                  className="absolute -left-6 top-24 bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/10 shadow-lg"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-sky-400" />
                    <span className="text-white text-xs font-medium">Rain in 2hrs</span>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -right-4 top-48 bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/10 shadow-lg"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-white text-xs font-medium">Price up 8%</span>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -left-8 bottom-32 bg-white/10 backdrop-blur-xl rounded-xl p-3 border border-white/10 shadow-lg"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-white text-xs font-medium">Crop healthy</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          SECTION 7: DIFFERENTIATION
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#812F0F]/10 text-[#812F0F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/20">
              Why MILA
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-sans">
              Built for farmers, <span className="text-[#812F0F]">not sellers</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              No hidden agendas. We exist solely to help you grow better crops and earn more money.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-5">
            {[
              { icon: Scale, title: 'No brand bias', desc: 'We recommend what works, not what pays us commissions.', gradient: 'from-amber-500/10 to-orange-500/5' },
              { icon: MessageSquare, title: 'No dashboards', desc: 'Chat with our AI just like a friend. No complex graphs.', gradient: 'from-blue-500/10 to-indigo-500/5' },
              { icon: Mic, title: 'Voice-first', desc: 'Speak in your language. We listen, understand, and answer.', gradient: 'from-[#812F0F]/10 to-[#E4490D]/5' },
              { icon: WifiOff, title: 'Works offline', desc: 'Access your critical farm data even without internet.', gradient: 'from-green-500/10 to-emerald-500/5' },
              { icon: Lock, title: 'Farmer owns data', desc: 'Your farm details are private. We never sell your data.', gradient: 'from-purple-500/10 to-violet-500/5' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`w-full md:w-[calc(50%-10px)] lg:w-[calc(33.33%-14px)] bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border border-border/50 p-8 rounded-2xl hover:border-primary/20 transition-all duration-300 group hover:shadow-lg`}
              >
                <div className="w-14 h-14 bg-[#812F0F]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#812F0F]/20 transition-colors group-hover:scale-110 duration-300">
                  <feature.icon className="w-7 h-7 text-[#812F0F]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground font-sans">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          SECTION 8: TESTIMONIALS (NEW)
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#812F0F]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-[#812F0F]/10 text-[#812F0F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#812F0F]/20">
              Farmer Stories
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-sans">
              Hear from the <span className="text-[#812F0F]">field</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from real farmers who transformed their seasons with MILA.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rajesh Kumar',
                location: 'Warangal, Telangana',
                crop: 'Paddy & Cotton',
                image: testimonialImages.farmer1,
                quote: 'MILA told me exactly when to apply fertilizer and how much. My paddy yield went up by 30% this season. I saved money on inputs and earned more at the market.',
                stat: '+30% yield',
                stars: 5,
              },
              {
                name: 'Lakshmi Devi',
                location: 'Karimnagar, Telangana',
                crop: 'Turmeric & Chilli',
                image: testimonialImages.farmer2,
                quote: 'I used to spend blindly on pesticides. Now MILA tells me exactly what my crop needs. The voice feature in Telugu is a blessing — I just talk and it helps.',
                stat: '40% saved on inputs',
                stars: 5,
              },
              {
                name: 'Venkataiah',
                location: 'Guntur, Andhra Pradesh',
                crop: 'Red Gram & Groundnut',
                image: testimonialImages.farmer3,
                quote: 'At my age, I thought technology was not for me. But MILA is simple — I speak, it listens. My grandson set it up and now I use it every day in the field.',
                stat: 'Daily user at 68',
                stars: 5,
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative"
              >
                <div className="bg-card border border-border/50 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500 hover:border-primary/20 h-full flex flex-col">
                  {/* Top Image Strip */}
                  <div className="relative h-48 overflow-hidden">
                    <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                    {/* Stat badge */}
                    <div className="absolute bottom-3 left-4 px-3 py-1.5 bg-[#812F0F] rounded-full shadow-lg">
                      <span className="text-white text-xs font-bold">{testimonial.stat}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: testimonial.stars }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>

                    {/* Quote */}
                    <div className="relative flex-1">
                      <Quote className="w-8 h-8 text-[#812F0F]/10 absolute -top-1 -left-1" />
                      <p className="text-foreground/80 text-sm leading-relaxed pl-4 italic">
                        "{testimonial.quote}"
                      </p>
                    </div>

                    {/* Farmer info */}
                    <div className="mt-6 pt-4 border-t border-border/50">
                      <h4 className="font-bold text-foreground text-sm font-sans">{testimonial.name}</h4>
                      <p className="text-muted-foreground text-xs">{testimonial.location}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Leaf className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">{testimonial.crop}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          SECTION 9: LANGUAGES & ACCESSIBILITY (NEW)
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/10 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#2A0F05] via-[#1A0903] to-[#2A0F05] rounded-3xl overflow-hidden relative"
          >
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#E4490D]/10 rounded-full blur-[80px]" />

            <div className="relative z-10 px-8 sm:px-12 py-16 sm:py-20 flex flex-col lg:flex-row items-center gap-12">
              {/* Left: Language visual */}
              <div className="flex-shrink-0">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { lang: 'English', script: 'Hello', flag: '🇬🇧' },
                    { lang: 'తెలుగు', script: 'నమస్కారం', flag: '🇮🇳' },
                    { lang: 'हिंदी', script: 'नमस्ते', flag: '🇮🇳' },
                    { lang: 'More...', script: 'Coming', flag: '🌍' },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-colors min-w-[120px]"
                    >
                      <span className="text-2xl mb-1 block">{item.flag}</span>
                      <p className="text-white font-medium text-sm mb-0.5">{item.lang}</p>
                      <p className="text-white/40 text-xs">{item.script}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right: Text */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-sans">
                  Speaks your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFDbb5] to-[#FF8C42]">mother tongue</span>
                </h2>
                <p className="text-white/60 text-lg leading-relaxed mb-6">
                  MILA works in English and Telugu today, with Hindi and more regional languages coming soon. Voice input means even farmers who can't read can use every feature.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                    <Mic className="w-4 h-4 text-[#FF8C42]" />
                    <span className="text-white/70 text-sm">Voice in your language</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                    <Globe className="w-4 h-4 text-[#FF8C42]" />
                    <span className="text-white/70 text-sm">Switch anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ════════════════════════════════════════════════════════
          SECTION 10: CTA
      ════════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl bg-[#812F0F] shadow-2xl"
          >
            {/* Background Art */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay">
              <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 30 60 70 60 100 100 V 0 H 0 Z" fill="white" />
                <path d="M0 100 C 30 80 70 80 100 100" stroke="white" strokeWidth="0.5" fill="none" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/30 pointer-events-none" />

            {/* Side image strip */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block overflow-hidden">
              <img src={bentoImages.harvest} alt="Happy harvest" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#812F0F] to-transparent" />
            </div>

            <div className="relative z-10 px-8 py-20 text-center sm:px-16 lg:py-28 lg:text-left lg:max-w-[65%]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-tight font-sans">
                  Start your next season with <span className="font-serif italic text-[#FFDbb5]">clarity</span>.
                </h2>
                <p className="mt-6 max-w-xl text-lg text-white/80 leading-relaxed">
                  Join the growing network of farmers using MILA's intelligence engine to transform uncertainty into higher yields and better profits.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-10 flex flex-col sm:flex-row gap-4 lg:justify-start justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStartedClick}
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-white px-10 py-5 text-lg font-bold text-[#812F0F] shadow-xl transition-all hover:bg-[#FFF8F0] hover:shadow-2xl"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <Sprout className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  <div className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-[#FFDbb5]/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </motion.button>

                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-5 text-lg font-semibold text-white/90 border border-white/20 rounded-xl hover:bg-white/10 transition-all"
                >
                  Learn More
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>

              {/* Trust signals */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-white/40 text-sm lg:justify-start justify-center">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Data Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Setup in 2 min</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
