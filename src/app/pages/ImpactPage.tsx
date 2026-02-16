import { motion } from 'motion/react';
import { Heart, Sprout, Apple, Users } from 'lucide-react';

export function ImpactPage() {
  const impacts = [
    {
      icon: Heart,
      title: 'Farmer confidence',
      description: 'Clear guidance reduces stress and uncertainty',
      metrics: ['Lower costs', 'Better decisions', 'Peaceful mind'],
    },
    {
      icon: Sprout,
      title: 'Soil health',
      description: 'Long-term thinking improves land quality',
      metrics: ['Healthier soil', 'Better yields', 'Sustainable future'],
    },
    {
      icon: Apple,
      title: 'Food nutrition',
      description: 'Better farming creates better food for everyone',
      metrics: ['Quality crops', 'Safe produce', 'Community health'],
    },
    {
      icon: Users,
      title: 'Community strength',
      description: 'Knowledge shared builds stronger villages',
      metrics: ['Shared learning', 'Local prosperity', 'Future generations'],
    },
  ];

  return (
    <div className="min-h-screen py-[32px] px-[16px] bg-background">
      <div className="max-w-7xl mx-auto relative z-10">

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            Real Results
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-['Megrim'] tracking-tight text-foreground">
            Impact That Matters
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            When farmers thrive, communities grow stronger. Our purpose is simple: support those who feed us.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-32">
          {impacts.map((impact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden bg-card border border-border p-8 rounded-3xl hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <impact.icon className="w-7 h-7 text-primary" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-foreground font-serif">
                  {impact.title}
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {impact.description}
                </p>
                
                <div className="space-y-3 pt-6 border-t border-border">
                  {impact.metrics.map((metric, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      <span className="text-sm font-medium text-foreground/80">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visual Impact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[2rem] overflow-hidden bg-[#2A0F05] text-white"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
          
          <div className="relative z-10 px-8 py-20 md:py-32 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 font-serif">
              Every season, we learn together
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-16 leading-relaxed max-w-2xl mx-auto">
              This isn't just about technology. It's about respecting the wisdom of farmers while offering support that truly helps.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-4xl font-bold mb-2 text-[#E4490D]">Less</p>
                <p className="text-white/60 text-sm uppercase tracking-widest font-medium">Waste & Cost</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-4xl font-bold mb-2 text-[#E4490D]">More</p>
                <p className="text-white/60 text-sm uppercase tracking-widest font-medium">Confidence</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-4xl font-bold mb-2 text-[#E4490D]">Better</p>
                <p className="text-white/60 text-sm uppercase tracking-widest font-medium">Future</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}