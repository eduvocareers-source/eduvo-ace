import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms / 3600000) % 24);
  const m = Math.floor((ms / 60000) % 60);
  const s = Math.floor((ms / 1000) % 60);
  return { d, h, m, s };
}

export function Countdown({ target }: { target: Date }) {
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells = [
    { label: "Days", value: t.d },
    { label: "Hours", value: t.h },
    { label: "Minutes", value: t.m },
    { label: "Seconds", value: t.s },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {cells.map((c) => (
        <div key={c.label} className="glass rounded-xl px-2 py-3 sm:px-3 sm:py-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="relative">
            <div className="font-display text-2xl sm:text-4xl text-gradient-gold tabular-nums leading-none h-[1em] flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={mounted ? c.value : `s-${c.label}`}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {String(mounted ? c.value : 0).padStart(2, "0")}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="mt-1 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
