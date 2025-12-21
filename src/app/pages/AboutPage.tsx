import { motion } from 'motion/react';
import { Heart, Target, Eye } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl sm:text-5xl mb-6 text-foreground">
            About Us
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Built with respect for those who feed us.
          </p>
        </motion.div>

        {/* Why This Exists */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-start gap-6 mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Heart className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl mb-4 text-foreground">Why this exists</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Farming is hard. Not because farmers lack skill or dedication, but because the tools and information they need are often out of reach, confusing, or designed for someone else.
                </p>
                <p>
                  We believe farmers deserve technology that respects their intelligence, speaks their language, and truly helps — not technology that sells to them.
                </p>
                <p>
                  This platform was created to walk alongside farmers through every season, offering guidance without judgment and clarity without complexity.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* What We Believe */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-start gap-6 mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Target className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl mb-4 text-foreground">What we believe</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">Farmers are experts.</strong> They know their land better than anyone. Our job is to support their decisions, not replace them.
                </p>
                <p>
                  <strong className="text-foreground">Simple is powerful.</strong> The best technology disappears into daily life. No dashboards, no jargon — just help when it's needed.
                </p>
                <p>
                  <strong className="text-foreground">Trust is everything.</strong> We don't sell data. We don't push products. We exist to serve farmers, period.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Long-term Vision */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-start gap-6 mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Eye className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl mb-4 text-foreground">Long-term vision</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  We envision a future where every farmer — regardless of land size, location, or resources — has access to personalized, trustworthy guidance.
                </p>
                <p>
                  Where farming decisions are made with confidence, not fear. Where soil health improves year after year. Where communities grow stronger because their farmers thrive.
                </p>
                <p>
                  This is not a product. This is a commitment.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-12 bg-primary/5 rounded-2xl"
        >
          <p className="text-xl text-foreground mb-6">
            Ready to start your season with us?
          </p>
          <a
            href="/get-started"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get Started Today
          </a>
        </motion.div>
      </div>
    </div>
  );
}
