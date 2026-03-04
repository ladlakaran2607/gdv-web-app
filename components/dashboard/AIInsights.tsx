"use client";

import { motion } from "framer-motion";
import { AIInsight } from "@/types/donor";

const typeStyles = {
  gold: { border: "var(--color-gold)", bg: "rgba(200,150,62,0.05)" },
  teal: { border: "var(--color-teal)", bg: "rgba(42,157,143,0.05)" },
  coral: { border: "var(--color-coral)", bg: "rgba(224,122,95,0.05)" },
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.35 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function AIInsights({ insights }: { insights: AIInsight[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
      className="rounded-2xl bg-white"
      style={{ boxShadow: "var(--shadow-sm)", border: "1px solid var(--color-grey-100)" }}
    >
      <div
        className="px-5 py-4"
        style={{ borderBottom: "1px solid var(--color-grey-100)" }}
      >
        <h3 className="text-base font-semibold" style={{ color: "var(--color-navy)" }}>
          What AI Noticed Today
        </h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--color-grey-400)" }}>
          Refreshed hourly from your prospect data
        </p>
      </div>

      <motion.div
        className="p-5 space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {insights.map((insight, i) => {
          const styles = typeStyles[insight.type];
          return (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="flex items-start gap-3 p-3 rounded-xl cursor-default"
              style={{
                background: styles.bg,
                borderLeft: `3px solid ${styles.border}`,
              }}
            >
              <span className="text-lg flex-shrink-0">{insight.icon}</span>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-grey-800)" }}>
                {insight.text}
              </p>
            </motion.div>
          );
        })}

        {insights.length === 0 && (
          <p className="text-sm text-center py-4" style={{ color: "var(--color-grey-400)" }}>
            Add your Anthropic API key to see AI insights.
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
