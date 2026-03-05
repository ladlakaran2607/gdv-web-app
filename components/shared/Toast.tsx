"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  onDismiss: () => void;
  duration?: number;
}

export default function Toast({ message, onDismiss, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 80, y: 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: 80 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={onDismiss}
        className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-pointer select-none"
        style={{
          background: "var(--color-navy)",
          boxShadow: "var(--shadow-lg), 0 0 0 1px rgba(200,150,62,0.2)",
          maxWidth: 340,
        }}
      >
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: "var(--color-teal)", color: "#fff" }}
        >
          ✓
        </span>
        <p className="text-sm font-medium" style={{ color: "#fff" }}>
          {message}
        </p>
        <span className="ml-1 text-xs opacity-50" style={{ color: "#fff" }}>✕</span>
      </motion.div>
    </AnimatePresence>
  );
}
