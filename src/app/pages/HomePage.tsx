import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sprout, Droplets, Heart, BookOpen, TrendingUp, Shield } from 'lucide-react';

export function HomePage() {
  const problems = [
    { icon: Sprout, text: 'No soil clarity' },
    { icon: Droplets, text: 'Guess-based fertilizers' },
    { icon: Droplets, text: 'Water misuse' },
    { icon: BookOpen, text: 'No money tracking' },
    { icon: TrendingUp, text: 'Forced low-price selling' },
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
      <section className="relative py-20 lg:py-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 text-foreground leading-tight">
                A personal farming companion for every season.
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                From soil to selling — one AI that walks with the farmer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="?prototype=true"
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center shadow-lg"
                >
                  Try Working Prototype
                </a>
                <Link
                  to="/get-started"
                  className="px-8 py-4 bg-card border-2 border-border text-foreground rounded-lg hover:border-primary transition-colors text-center"
                >
                  Learn More
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                ✨ Click "Try Working Prototype" to experience the full app flow
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1623211269755-569fec0536d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtZXIlMjBmaWVsZHxlbnwxfHx8fDE3NjYyOTI5NjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Farmer in field"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl text-center mb-16 text-foreground"
          >
            Why farming feels uncertain today
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-6 bg-card rounded-xl shadow-sm"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <problem.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-lg text-foreground/90 pt-2">{problem.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl text-center mb-16 text-foreground"
          >
            One companion. One season. Clear guidance.
          </motion.h2>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {solution.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="w-40 h-40 rounded-full bg-primary/10 flex flex-col items-center justify-center text-center p-6">
                  <div className="text-2xl mb-2 text-primary">{index + 1}</div>
                  <p className="text-sm text-foreground">{step}</p>
                </div>
                {index < solution.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-8 w-8 h-0.5 bg-primary/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiation Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl text-center mb-4 text-foreground"
          >
            Built for farmers, not sellers
          </motion.h2>
          <p className="text-lg text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            No hidden agendas. Just clarity and support.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiation.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-6 bg-card rounded-xl shadow-sm"
              >
                <Shield className="w-6 h-6 text-primary flex-shrink-0" />
                <p className="text-lg text-foreground">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 bg-primary rounded-2xl"
          >
            <h2 className="text-3xl sm:text-4xl mb-6 text-primary-foreground">
              Start your next season with clarity.
            </h2>
            <Link
              to="/get-started"
              className="inline-block px-8 py-4 bg-primary-foreground text-primary rounded-lg hover:bg-primary-foreground/90 transition-colors"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}