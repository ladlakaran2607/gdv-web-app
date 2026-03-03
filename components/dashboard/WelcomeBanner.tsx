"use client";

import { motion } from "framer-motion";
import { DashboardKPIs } from "@/types/donor";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function WelcomeBanner({
  kpis,
  userEmail,
}: {
  kpis: DashboardKPIs;
  userEmail: string;
}) {
  const firstName = userEmail.split("@")[0].split(".")[0];
  const capitalized = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl overflow-hidden mb-6 p-6"
      style={{
        background: "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-mid) 70%, #1e3a5f 100%)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute top-0 right-0 w-56 h-56 rounded-full opacity-10 pointer-events-none"
        style={{ background: "var(--color-gold)", filter: "blur(40px)", transform: "translate(30%, -30%)" }}
      />
      <div
        className="absolute bottom-0 left-1/2 w-40 h-40 rounded-full opacity-10 pointer-events-none"
        style={{ background: "var(--color-teal)", filter: "blur(30px)", transform: "translate(-20%, 40%)" }}
      />

      <div className="relative flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2
            className="text-4xl mb-2"
            style={{ fontFamily: "var(--font-display)", color: "#fff", letterSpacing: "-0.01em" }}
          >
            {getGreeting()}, {capitalized} 👋
          </h2>
          <p className="text-sm max-w-md leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            AI has scanned your prospects and highlighted who needs attention today.
          </p>
        </div>

        <div
          className="flex flex-col items-center px-6 py-4 rounded-2xl flex-shrink-0"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(200,150,62,0.3)",
          }}
        >
          <span
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-gold-light)" }}
          >
            {kpis.totalPipelineValue}
          </span>
          <span className="text-xs mt-1 text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
            Total Potential Value
            <br />
            in Pipeline
          </span>
        </div>
      </div>
    </motion.div>
  );
}
