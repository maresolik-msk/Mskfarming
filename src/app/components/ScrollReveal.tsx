import { motion, useInView, UseInViewOptions } from 'motion/react';
import { useRef, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  width?: "fit-content" | "100%";
  className?: string;
  animation?: "fade-up" | "fade-in" | "scale-up" | "slide-right" | "slide-left";
  delay?: number;
  duration?: number;
  viewport?: UseInViewOptions;
}

export function ScrollReveal({ 
  children, 
  width = "fit-content",
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 0.5,
  viewport = { once: true, margin: "-50px" }
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, viewport);

  const variants = {
    "fade-up": {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 }
    },
    "fade-in": {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    "scale-up": {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1 }
    },
    "slide-right": {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0 }
    },
    "slide-left": {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0 }
    }
  };

  return (
    <div ref={ref} style={{ width }} className={className}>
      <motion.div
        variants={variants[animation]}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
