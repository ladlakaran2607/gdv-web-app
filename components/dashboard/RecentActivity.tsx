"use client";

import { motion } from "framer-motion";
import { DonorRecord } from "@/types/donor";

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

const activityColors = [
  "var(--color-teal)",
  "var(--color-gold)",
  "var(--color-coral)",
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.45 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function RecentActivity({ donors }: { donors: DonorRecord[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl bg-white"
      style={{ boxShadow: "var(--shadow-sm)", border: "1px solid var(--color-grey-100)" }}
    >
      <div
        className="px-5 py-4"
        style={{ borderBottom: "1px solid var(--color-grey-100)" }}
      >
        <h3 className="text-base font-semibold" style={{ color: "var(--color-navy)" }}>
          What Happened Recently
        </h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--color-grey-400)" }}>
          Latest research report completions
        </p>
      </div>

      <motion.div
        className="p-5 space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {donors.length === 0 ? (
          <p className="text-sm text-center py-2" style={{ color: "var(--color-grey-400)" }}>
            No recent activity yet.
          </p>
        ) : (
          donors.map((donor, i) => (
            <motion.div
              key={donor.id}
              variants={itemVariants}
              whileHover={{ x: 3 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="flex items-start gap-3 cursor-default"
            >
              <div
                className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                style={{ background: activityColors[i % activityColors.length] }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--color-navy)" }}>
                  Research report completed
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-grey-400)" }}>
                  <span style={{ color: "var(--color-navy-mid)", fontWeight: 500 }}>{donor.donorName}</span>
                  {donor.company ? ` · ${donor.company}` : ""}
                </p>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: "var(--color-grey-400)" }}>
                {timeAgo(donor.processingCompleted)}
              </span>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
