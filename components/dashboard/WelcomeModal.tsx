"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    n: 1,
    title: "AI finds the needles in the haystack",
    desc: "The platform scans your entire donor database and automatically ranks the people most likely to become major donors — based on their giving history, wealth signals, and donor type.",
  },
  {
    n: 2,
    title: "It writes research briefs for your team",
    desc: "For each prospect, AI creates a one-page summary with everything your team needs: who they are, how much they could give, and exactly how to approach them.",
  },
  {
    n: 3,
    title: "It drafts grant applications in minutes, not days",
    desc: "Your team currently spends 2–3 days writing each philanthropic submission. AI generates a tailored first draft in under 30 minutes.",
  },
  {
    n: 4,
    title: "Everything flows through one place",
    desc: "Track every prospect from discovery to donation on a single dashboard. No more spreadsheets, no more guesswork.",
  },
];

export default function WelcomeModal({ userId }: { userId: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const key = `gdv_welcome_seen_${userId}`;
    if (!localStorage.getItem(key)) {
      setVisible(true);
    }
  }, [userId]);

  function dismiss() {
    localStorage.setItem(`gdv_welcome_seen_${userId}`, "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(10,22,40,0.65)", backdropFilter: "blur(4px)" }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div
              className="w-full max-w-lg rounded-2xl overflow-hidden pointer-events-auto"
              style={{ background: "#fff", boxShadow: "0 24px 80px rgba(10,22,40,0.28)" }}
            >
              {/* Header */}
              <div
                className="px-8 pt-10 pb-8 flex flex-col items-center text-center"
                style={{
                  background: "linear-gradient(160deg, var(--color-navy) 0%, var(--color-navy-mid) 100%)",
                }}
              >
                <div className="text-5xl mb-4">🤖</div>
                <h2
                  className="text-2xl mb-3"
                  style={{ fontFamily: "var(--font-display)", color: "#fff" }}
                >
                  Welcome to Prospect Intelligence
                </h2>
                <p className="text-sm leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Your AI-powered platform that finds potential major donors hiding in the organisation&apos;s database — and helps your team turn them into committed supporters.
                </p>
              </div>

              {/* Steps */}
              <div className="px-8 py-6 space-y-5">
                {steps.map((step) => (
                  <div key={step.n} className="flex gap-4">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ background: "var(--color-gold-pale)", color: "var(--color-gold)" }}
                    >
                      {step.n}
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--color-navy)" }}>
                        {step.title}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--color-grey-400)" }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div
                className="px-8 py-5 flex items-center justify-between"
                style={{ borderTop: "1px solid var(--color-grey-100)" }}
              >
                <button
                  onClick={dismiss}
                  className="text-sm transition-opacity hover:opacity-60"
                  style={{ color: "var(--color-grey-400)" }}
                >
                  Skip tour
                </button>
                <button
                  onClick={dismiss}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-light))",
                    boxShadow: "0 4px 14px rgba(200,150,62,0.3)",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(200,150,62,0.45)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 4px 14px rgba(200,150,62,0.3)")}
                >
                  Explore the Platform →
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
