"use client";

import { motion } from "framer-motion";

const messages: Record<string, { headline: string; sub: string; icon: string }> = {
  "Who Should We Talk To?": {
    icon: "🧠",
    headline: "Our AI is briefing itself.",
    sub: "The prospect discovery engine is being calibrated. Check back soon.",
  },
  "Donor Journey Board": {
    icon: "🗺️",
    headline: "The pipeline is being assembled.",
    sub: "Your donor journey board is under construction. It'll be worth the wait.",
  },
  "Write a Pitch": {
    icon: "✍️",
    headline: "The typewriter is warming up.",
    sub: "AI-powered pitch drafting is on its way. Stand by.",
  },
  "Ask the AI": {
    icon: "💬",
    headline: "The AI is clearing its throat.",
    sub: "Your intelligent assistant is getting ready to answer all your questions.",
  },
  "Is It Working?": {
    icon: "📈",
    headline: "Crunching the numbers.",
    sub: "ROI tracking and analytics are being wired up. Stay tuned.",
  },
};

export default function ComingSoon({ pageName }: { pageName: string }) {
  const msg = messages[pageName] ?? {
    icon: "🔧",
    headline: "Under construction.",
    sub: "This feature is on its way.",
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md"
      >
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-6xl mb-6"
        >
          {msg.icon}
        </motion.div>

        <h2
          className="text-2xl mb-3"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-navy)" }}
        >
          {msg.headline}
        </h2>

        <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--color-grey-400)" }}>
          {msg.sub}
        </p>

        <div
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium"
          style={{
            background: "rgba(200,150,62,0.1)",
            color: "var(--color-gold)",
            border: "1px solid rgba(200,150,62,0.2)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--color-gold)", animation: "pulse-dot 2s infinite" }}
          />
          Coming soon
        </div>
      </motion.div>
    </div>
  );
}
