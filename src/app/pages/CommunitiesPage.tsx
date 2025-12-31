import { motion } from 'motion/react';
import { Users, Building2, GraduationCap, ArrowRight } from 'lucide-react';

export function CommunitiesPage() {
  const communities = [
    {
      icon: Users,
      title: 'NGOs',
      description: 'Partner with us to empower farmers in your region',
      benefits: [
        'Bulk farmer onboarding',
        'Progress tracking',
        'Impact measurement',
        'Custom training modules',
      ],
      cta: 'Start a Pilot',
    },
    {
      icon: Building2,
      title: 'FPOs',
      description: 'Strengthen your members with better farming tools',
      benefits: [
        'Member management',
        'Group knowledge sharing',
        'Collective insights',
        'Market readiness',
      ],
      cta: 'Connect With Us',
    },
    {
      icon: GraduationCap,
      title: 'Institutions',
      description: 'Research, education, and agricultural development',
      benefits: [
        'Data partnership',
        'Research collaboration',
        'Student programs',
        'Innovation testing',
      ],
      cta: 'Explore Partnership',
    },
  ];

  return (
    <div className="min-h-screen py-[32px] px-[16px]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl sm:text-5xl mb-6 text-foreground">
            For Communities
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stronger together. Partner with us to bring clarity and support to farmers at scale.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {communities.map((community, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col p-8 bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <community.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl mb-4 text-foreground">
                {community.title}
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {community.description}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {community.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-foreground/80">{benefit}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group">
                {community.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1728584388081-819a78aa30ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBjb21tdW5pdHklMjBncm91cHxlbnwxfHx8fDE3NjYyOTI5NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Farmer community"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end">
            <div className="p-12 text-primary-foreground">
              <h2 className="text-3xl sm:text-4xl mb-4">
                Let's build this together
              </h2>
              <p className="text-xl opacity-90 max-w-2xl leading-relaxed">
                Reach out to discuss how we can support farmers in your community.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
