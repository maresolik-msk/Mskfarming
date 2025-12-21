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
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl sm:text-5xl mb-6 text-foreground">
            Impact That Matters
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            When farmers thrive, communities grow stronger. Our purpose is simple: support those who feed us.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {impacts.map((impact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-10 bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <impact.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl mb-4 text-foreground">
                {impact.title}
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {impact.description}
              </p>
              <div className="space-y-3">
                {impact.metrics.map((metric, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground/80">{metric}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visual Impact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative py-20 px-8 bg-primary/5 rounded-3xl overflow-hidden"
        >
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl mb-6 text-foreground">
              Every season, we learn together
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              This isn't just about technology. It's about respecting the wisdom of farmers while offering support that truly helps.
            </p>
            <div className="grid sm:grid-cols-3 gap-8 mt-12">
              <div className="p-6 bg-card rounded-xl">
                <p className="text-3xl mb-2 text-primary">Less</p>
                <p className="text-muted-foreground">Waste & Cost</p>
              </div>
              <div className="p-6 bg-card rounded-xl">
                <p className="text-3xl mb-2 text-primary">More</p>
                <p className="text-muted-foreground">Confidence</p>
              </div>
              <div className="p-6 bg-card rounded-xl">
                <p className="text-3xl mb-2 text-primary">Better</p>
                <p className="text-muted-foreground">Future</p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
