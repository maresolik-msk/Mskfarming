import { motion } from 'motion/react';
import { Sprout, Droplets, Bug, BookOpen, Wallet, PieChart } from 'lucide-react';

export function FeaturesPage() {
  const features = [
    {
      icon: Sprout,
      title: 'Soil Intelligence',
      benefit: 'Know exactly what your soil needs — no guesswork',
      image: 'https://images.unsplash.com/photo-1599320092708-8a9dde49fc2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2lsJTIwYWdyaWN1bHR1cmUlMjBoYW5kc3xlbnwxfHx8fDE3NjYyOTI5NjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icon: Droplets,
      title: 'Crop & Water Guidance',
      benefit: 'Right crop, right water — save money, grow better',
      image: 'https://images.unsplash.com/photo-1691384630414-09dad88b297b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9wJTIwZmllbGQlMjBncmVlbnxlbnwxfHx8fDE3NjYyOTI5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icon: Bug,
      title: 'Pest & Nutrition Advisor',
      benefit: 'Catch problems early, protect your harvest',
      image: 'https://images.unsplash.com/photo-1623211269755-569fec0536d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYXJtZXIlMjBmaWVsZHxlbnwxfHx8fDE3NjYyOTI5NjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icon: BookOpen,
      title: 'Farmer Journal',
      benefit: 'Your farm memory — never forget what worked',
      image: 'https://images.unsplash.com/photo-1718258554481-2891e0647ce9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBtb2JpbGUlMjBwaG9uZXxlbnwxfHx8fDE3NjYyOTI5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icon: Wallet,
      title: 'Budget & Expense Tracking',
      benefit: 'Know where your money goes — plan better',
      image: 'https://images.unsplash.com/photo-1599320092708-8a9dde49fc2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2lsJTIwYWdyaWN1bHR1cmUlMjBoYW5kc3xlbnwxfHx8fDE3NjYyOTI5NjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      icon: PieChart,
      title: 'Profit Summary',
      benefit: 'Clear picture of costs and earnings each season',
      image: 'https://images.unsplash.com/photo-1691384630414-09dad88b297b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9wJTIwZmllbGQlMjBncmVlbnxlbnwxfHx8fDE3NjYyOTI5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
            Features Built for Farmers
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Simple tools that help you make better decisions every day.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {feature.benefit}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
