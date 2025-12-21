import { motion } from 'motion/react';
import { Mic, Camera, Clock, TrendingDown, Calendar, PiggyBank } from 'lucide-react';

export function JournalBudgetPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Journal Section */}
        <section className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl mb-6 text-foreground">
              Your farm memory. Nothing forgotten.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Track what you do, when you do it — in your own words.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4 p-6 bg-card rounded-xl shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl mb-2 text-foreground">Voice notes</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Just speak — we'll remember everything for you
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-card rounded-xl shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl mb-2 text-foreground">Photo entries</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Capture what you see — compare over time
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-card rounded-xl shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl mb-2 text-foreground">Automatic tracking</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Date, time, and location saved automatically
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[3/4] rounded-2xl bg-muted/30 p-8 flex items-center justify-center shadow-xl">
                <div className="w-full max-w-sm bg-card rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mic className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 h-8 bg-primary/5 rounded-lg flex items-center px-3">
                      <div className="w-full h-2 bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-primary animate-pulse rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Today, 9:30 AM</p>
                      <p className="text-foreground">Watered north field, plants looking healthy</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Yesterday, 4:15 PM</p>
                      <p className="text-foreground">Applied fertilizer as recommended</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Budget Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl mb-6 text-foreground">
              Know where your money goes — without stress.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Simple tracking. Clear picture. Better decisions.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-card rounded-2xl shadow-sm"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl mb-4 text-foreground">Pre-season budget</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Plan your expenses before you start planting
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-card rounded-2xl shadow-sm"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <TrendingDown className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl mb-4 text-foreground">Daily expense entry</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Quick entries — voice or numbers, your choice
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 bg-card rounded-2xl shadow-sm"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <PiggyBank className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl mb-4 text-foreground">End-of-season clarity</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Total costs, total earnings — know your profit
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
