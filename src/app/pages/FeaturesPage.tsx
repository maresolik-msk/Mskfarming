import { motion } from 'motion/react';
import { Sprout, Droplets, Bug, BookOpen, Wallet, PieChart } from 'lucide-react';
import imgSeedlings from "figma:asset/a20a758f3328babc56624328f34c10ed1139f425.png";
import imgSprinklers from "figma:asset/5a3ed7a98dd93e7ce419c1678be36e0cacdffdca.png";
import imgPest from "figma:asset/426eb80147166eed75682d2c68672a155db19486.png";

export function FeaturesPage() {
  const features = [
    {
      icon: Sprout,
      title: 'Soil Intelligence',
      benefit: 'Know exactly what your soil needs — no guesswork',
      image: imgSeedlings,
    },
    {
      icon: Droplets,
      title: 'Crop & Water Guidance',
      benefit: 'Right crop, right water — save money, grow better',
      image: imgSprinklers,
    },
    {
      icon: Bug,
      title: 'Pest & Nutrition Advisor',
      benefit: 'Catch problems early, protect your harvest',
      image: imgPest,
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
            Capabilities
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-['Megrim'] tracking-tight text-foreground">
            Features Built for Farmers
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Simple tools that help you make better decisions every day.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden bg-card border border-border rounded-3xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Icon Floating */}
                <div className="absolute top-6 left-6 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                  <feature.icon className="w-6 h-6" />
                </div>
              </div>

              <div className="p-8 relative">
                {/* Connecting Line Effect */}
                <div className="absolute -top-12 right-8 w-px h-16 bg-gradient-to-b from-transparent to-border opacity-0 group-hover:opacity-100 transition-opacity" />

                <h3 className="text-2xl font-bold mb-3 text-foreground font-serif group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
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
