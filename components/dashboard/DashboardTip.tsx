"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardTip({ userId }: { userId: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const key = `gdv_tip_dismissed_${userId}`;
    if (!localStorage.getItem(key)) {
      setVisible(true);
    }
  }, [userId]);

  function dismiss() {
    localStorage.setItem(`gdv_tip_dismissed_${userId}`, "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div
            className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
            style={{
              background: "rgba(200,150,62,0.05)",
              borderLeft: "3px solid var(--color-gold)",
              border: "1px solid rgba(200,150,62,0.2)",
              borderLeftWidth: "3px",
            }}
          >
            <span className="text-base flex-shrink-0 mt-0.5">💡</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--color-navy)" }}>
                What am I looking at?
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-grey-400)" }}>
                This dashboard shows the most important numbers at a glance. The four cards below are your key
                metrics. The table shows the people AI thinks you should focus on right now. On the right, AI
                highlights things it thinks your team should know — think of it as a smart assistant that watches
                your data overnight and tells you what changed.
              </p>
            </div>
            <button
              onClick={dismiss}
              className="text-xs font-medium flex-shrink-0 ml-2 mt-0.5 transition-opacity hover:opacity-60"
              style={{ color: "var(--color-grey-400)" }}
            >
              Got it ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
