import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Send, ArrowRight } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="min-h-screen py-[32px] px-[16px] bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#812F0F]/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            Get in Touch
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground font-['Megrim'] tracking-tight">
            Contact MILA
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Have questions? We're here to help you grow.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-12"
          >
            <div className="prose prose-lg text-muted-foreground">
              <p>
                Whether you're a farmer looking for support, a partner interested in collaboration, or just curious about what we do, we'd love to hear from you.
              </p>
            </div>

            <div className="grid gap-8">
              <div className="flex items-start gap-6 group p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Email Us</h3>
                  <p className="text-muted-foreground mb-2">For general inquiries and support</p>
                  <a href="mailto:contact@mila.ag" className="text-primary font-medium hover:underline inline-flex items-center gap-2">
                    contact@mila.ag <ArrowRight size={16} />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6 group p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Visit Us</h3>
                  <p className="text-muted-foreground mb-2">Headquarters</p>
                  <p className="text-foreground font-medium">
                    Kurnool (AP) India.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group p-6 rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Call Us</h3>
                  <p className="text-muted-foreground mb-2">Mon-Fri from 9am to 6pm</p>
                  <a href="tel:+910000000000" className="text-foreground font-medium hover:text-primary transition-colors">
                    +91 630 33O 1002
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden"
          >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <h2 className="text-2xl font-serif font-bold mb-8 text-foreground">Send us a message</h2>
            
            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-foreground/80 ml-1">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                    placeholder=""
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-foreground/80 ml-1">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground/80 ml-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2 m-[0px]">
                <label htmlFor="subject" className="text-sm font-medium text-foreground/80 ml-1">Subject</label>
                <select
                  id="subject"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-muted-foreground"
                >
                  <option>General Inquiry</option>
                  <option>Partnership</option>
                  <option>Support</option>
                  <option>Press</option>
                </select>
              </div>

              <div className="space-y-2 m-[0px] px-[0px] py-[16px]">
                <label htmlFor="message" className="text-sm font-medium text-foreground/80 ml-1">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50 resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button className="w-full bg-[#812F0F] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#812F0F]/20 hover:bg-[#6b260c] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4">
                <span>Send Message</span>
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
