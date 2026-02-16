import { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { Sprout, Plus, AlertCircle, Mic, Camera, IndianRupee, ArrowRight, Calendar, Cloud, Droplets } from 'lucide-react';
import Logo from '../../imports/Logo';

export function DashboardPage() {
  const todayGuidance = [
    'Water your north field in the evening',
    'Check for pest signs on tomato plants',
    'Weather forecast: Light rain expected tomorrow',
  ];

  const alerts = [
    'Fertilizer application due in 3 days',
    'Harvest window opens in 2 weeks',
  ];

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-[#F5E8E9] to-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-foreground tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#812F0F] to-[#E4490D]">Farmer</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Here's what needs your attention today
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
             <Calendar className="w-4 h-4" />
             <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Guidance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50" />
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div 
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#812F0F] to-[#E4490D] flex items-center justify-center shadow-lg shadow-[#812F0F]/20 p-3"
                  style={{ '--fill-0': '#ffffff' } as CSSProperties}
                >
                  <Logo />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Today's Guidance</h2>
                  <p className="text-muted-foreground">3 tasks remaining</p>
                </div>
              </div>
              
              <div className="space-y-4 relative z-10">
                {todayGuidance.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="flex items-start gap-4 p-5 bg-background/60 hover:bg-background/80 border border-border/50 rounded-2xl transition-all cursor-pointer group/item"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-primary/30 flex items-center justify-center mt-0.5 group-hover/item:border-primary transition-colors bg-background">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg text-foreground/90 font-medium leading-relaxed">{item}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground/30 group-hover/item:text-primary transition-colors" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-foreground px-1">Quick Actions</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <motion.button 
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-start gap-4 p-6 bg-gradient-to-br from-[#F5E8E9] to-[#F5E8E9]/50 border border-[#812F0F]/10 rounded-3xl hover:shadow-lg hover:shadow-[#812F0F]/10 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Mic className="w-6 h-6 text-[#812F0F]" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-foreground block mb-1">Voice Journal</span>
                    <span className="text-sm text-muted-foreground">Record daily log</span>
                  </div>
                </motion.button>

                <motion.button 
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-start gap-4 p-6 bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100/50 rounded-3xl hover:shadow-lg hover:shadow-amber-500/10 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <IndianRupee className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-foreground block mb-1">Add Expense</span>
                    <span className="text-sm text-muted-foreground">Track spending</span>
                  </div>
                </motion.button>

                <motion.button 
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-start gap-4 p-6 bg-gradient-to-br from-[#4F8F4A]/10 to-[#4F8F4A]/5 border border-[#4F8F4A]/10 rounded-3xl hover:shadow-lg hover:shadow-[#4F8F4A]/10 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6 text-[#4F8F4A]" />
                  </div>
                  <div>
                    <span className="text-lg font-semibold text-foreground block mb-1">Take Photo</span>
                    <span className="text-sm text-muted-foreground">Analyze crop</span>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Recent Journal Entries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-sm"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">Recent Journal</h2>
                <button className="text-sm font-semibold text-primary hover:text-primary/80 hover:bg-primary/5 px-4 py-2 rounded-full transition-all">
                  View All History
                </button>
              </div>
              <div className="relative border-l-2 border-border/50 ml-3 space-y-8 pl-8 pb-2">
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-primary border-4 border-background flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">Today, 9:30 AM</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 sm:mt-0">
                      <Mic className="w-3 h-3" /> Voice Entry
                    </div>
                  </div>
                  <p className="text-lg text-foreground leading-relaxed">
                    Watered north field. Plants looking healthy, good color.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-muted-foreground/30 border-4 border-background" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Yesterday, 4:15 PM</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 sm:mt-0">
                      <Mic className="w-3 h-3" /> Voice Entry
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Applied organic fertilizer as recommended by the app.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-destructive/5 border border-destructive/10 rounded-3xl p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Action Required</h3>
              </div>
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/60 border border-destructive/10 rounded-2xl flex items-start gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                    <p className="text-sm font-medium text-foreground/80">{alert}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* This Season Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                <Cloud className="w-5 h-5 text-muted-foreground" />
                Season Tracker
              </h3>
              <div className="space-y-6">
                <div className="relative">
                   <div className="flex justify-between items-end mb-2">
                     <p className="text-sm text-muted-foreground font-medium">Days In</p>
                     <p className="text-2xl font-bold text-foreground">42</p>
                   </div>
                   <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                     <div className="h-full bg-primary w-[42%] rounded-full" />
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-muted/30 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                      <IndianRupee className="w-4 h-4 text-amber-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Expenses</p>
                    <p className="text-lg font-bold text-foreground">₹12,450</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-2xl">
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center mb-3">
                       <Droplets className="w-4 h-4 text-sky-600" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Harvest In</p>
                    <p className="text-lg font-bold text-foreground">48 days</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Help */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#812F0F] to-[#2A0F05] rounded-3xl p-8 text-white text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-10 -mb-10" />
              
              <h3 className="text-xl font-bold mb-3 relative z-10">Need Expert Help?</h3>
              <p className="text-white/70 text-sm mb-6 relative z-10 leading-relaxed">
                Our agricultural experts are just one click away to solve your farming queries.
              </p>
              <button className="w-full py-3.5 bg-white text-[#812F0F] font-bold rounded-xl hover:bg-[#F5E8E9] transition-colors shadow-lg shadow-black/10 relative z-10">
                Contact Support
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
