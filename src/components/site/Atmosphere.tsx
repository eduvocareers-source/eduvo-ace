import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/* Floating glowing orbs in the background — pure decoration */
export function FloatingOrbs() {
  const orbs = [
    { x: "8%", y: "12%", size: 420, delay: 0, hue: "85" },
    { x: "82%", y: "18%", size: 360, delay: 1.2, hue: "260" },
    { x: "68%", y: "62%", size: 480, delay: 2.4, hue: "85" },
    { x: "12%", y: "78%", size: 320, delay: 0.6, hue: "260" },
  ];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-40"
          style={{
            left: o.x,
            top: o.y,
            width: o.size,
            height: o.size,
            background: `radial-gradient(circle, oklch(0.7 0.18 ${o.hue} / 0.35), transparent 70%)`,
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -30, 25, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 18 + i * 3,
            delay: o.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* Top scroll-progress bar in gold */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.2 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 inset-x-0 h-[2px] z-[60] bg-gradient-gold shadow-glow"
    />
  );
}

/* Premium first-paint loader */
export function PageLoader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 900);
    return () => clearTimeout(t);
  }, []);
  if (done) return null;
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      onAnimationComplete={() => setDone(true)}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-gradient-gold shadow-glow"
          animate={{ rotate: [0, 180, 360], scale: [1, 1.15, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-primary/40"
          animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

/* Subtle parallax wrapper for hero content */
export function Parallax({ children, strength = 80 }: { children: React.ReactNode; strength?: number }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, strength]);
  return <motion.div style={{ y }}>{children}</motion.div>;
}
