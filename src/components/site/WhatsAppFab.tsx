import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  return (
    <motion.a
      href="https://wa.me/918592866008?text=Hi%20Eduvo%20Careers%2C%20I'd%20like%20career%20guidance"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-[oklch(0.7_0.18_145)] animate-ping opacity-40" />
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[oklch(0.65_0.2_145)] text-white shadow-elevated">
        <MessageCircle className="w-6 h-6" />
      </span>
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap glass px-3 py-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none">
        Chat with us
      </span>
    </motion.a>
  );
}
