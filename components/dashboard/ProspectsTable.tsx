"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DonorRecord } from "@/types/donor";
import AffinityBadge from "@/components/shared/AffinityBadge";
import SeeBriefFlyout from "./SeeBriefFlyout";

export default function ProspectsTable({ donors }: { donors: DonorRecord[] }) {
  const [activeDonor, setActiveDonor] = useState<DonorRecord | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl bg-white overflow-hidden"
        style={{ boxShadow: "var(--shadow-sm)", border: "1px solid var(--color-grey-100)" }}
      >
        {/* Card header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--color-grey-100)" }}
        >
          <div>
            <h3 className="text-base font-semibold" style={{ color: "var(--color-navy)" }}>
              People Needing Attention
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-grey-400)" }}>
              Top prospects sorted by affinity score
            </p>
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(42,157,143,0.1)", color: "var(--color-teal)" }}
          >
            {donors.length} prospects
          </span>
        </div>

        {/* Table */}
        {donors.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm" style={{ color: "var(--color-grey-400)" }}>
              No completed research reports yet. Trigger the AI research pipeline to see prospects here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr style={{ background: "var(--color-grey-50)" }}>
                  {["Prospect", "Affinity", "Capacity", "Recommended Ask", ""].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide"
                      style={{ color: "var(--color-grey-400)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donors.map((donor, i) => (
                  <tr
                    key={donor.id}
                    className="border-t transition-colors cursor-pointer"
                    style={{ borderColor: "var(--color-grey-100)" }}
                    onClick={() => setActiveDonor(donor)}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--color-grey-50)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                  >
                    {/* Prospect */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{
                            background: `hsl(${(i * 47 + 200) % 360}, 40%, 85%)`,
                            color: `hsl(${(i * 47 + 200) % 360}, 40%, 30%)`,
                          }}
                        >
                          {donor.donorName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "var(--color-navy)" }}>
                            {donor.donorName}
                          </p>
                          {donor.company && (
                            <p className="text-xs" style={{ color: "var(--color-grey-400)" }}>
                              {donor.company}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Affinity */}
                    <td className="px-5 py-4">
                      <AffinityBadge score={donor.affinityScore} />
                    </td>

                    {/* Capacity stars */}
                    <td className="px-5 py-4">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <span
                            key={j}
                            className="text-sm"
                            style={{ color: j < donor.capacityRating ? "var(--color-gold)" : "var(--color-grey-200)" }}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Recommended ask */}
                    <td className="px-5 py-4">
                      <span
                        className="text-sm font-medium"
                        style={{ fontFamily: "var(--font-mono)", color: "var(--color-teal)" }}
                      >
                        {donor.recommendedAsk || "—"}
                      </span>
                    </td>

                    {/* CTA */}
                    <td className="px-5 py-4">
                      <motion.button
                        onClick={(e) => { e.stopPropagation(); setActiveDonor(donor); }}
                        whileHover={{ scale: 1.05, boxShadow: "0 6px 20px rgba(10,22,40,0.2)" }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
                        style={{
                          background: "linear-gradient(135deg, var(--color-navy), var(--color-navy-mid))",
                        }}
                      >
                        See Brief →
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <SeeBriefFlyout donor={activeDonor} onClose={() => setActiveDonor(null)} />
    </>
  );
}
