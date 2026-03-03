"use client";

import { motion } from "framer-motion";
import { DashboardKPIs } from "@/types/donor";

interface KPICard {
  title: string;
  value: string | number;
  sub: string;
  trend: string;
  accentColor: string;
  icon: string;
}

export default function KPIGrid({ kpis }: { kpis: DashboardKPIs }) {
  const completedCount = Math.round((kpis.totalProspects * kpis.completionRate) / 100);

  const cards: KPICard[] = [
    {
      title: "Total Prospects",
      value: kpis.totalProspects,
      sub: "active in the system",
      trend: `↑ ${kpis.reportsThisMonth} added this month`,
      accentColor: "var(--color-gold)",
      icon: "👤",
    },
    {
      title: "Total Pipeline Value",
      value: kpis.totalPipelineValue,
      sub: "across completed research",
      trend: `↑ Across ${completedCount} prospects`,
      accentColor: "var(--color-teal)",
      icon: "💰",
    },
    {
      title: "Reports This Month",
      value: kpis.reportsThisMonth,
      sub: "research reports generated",
      trend: `↑ ${kpis.reportsThisMonth} completed`,
      accentColor: "var(--color-coral)",
      icon: "📄",
    },
    {
      title: "Completion Rate",
      value: `${kpis.completionRate}%`,
      sub: "of prospects fully researched",
      trend: `↑ ${kpis.completionRate}% researched`,
      accentColor: "var(--color-navy)",
      icon: "✅",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl p-5 bg-white relative overflow-hidden cursor-default"
          style={{
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--color-grey-100)",
            borderTop: `3px solid ${card.accentColor}`,
            transition: "box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(10,22,40,0.13)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-sm)")}
        >
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-grey-400)" }}>
              {card.title}
            </p>
            <span className="text-lg">{card.icon}</span>
          </div>
          <p
            className="text-4xl font-bold mb-2"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-navy)",
              letterSpacing: "-0.02em",
            }}
          >
            {card.value}
          </p>

          {/* Trend badge */}
          <span
            className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-1.5"
            style={{ background: "rgba(42,157,143,0.1)", color: "var(--color-teal)" }}
          >
            {card.trend}
          </span>

          <p className="text-xs" style={{ color: "var(--color-grey-400)" }}>
            {card.sub}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
