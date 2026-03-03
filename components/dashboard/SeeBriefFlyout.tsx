"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { DonorRecord, ParsedBriefSection } from "@/types/donor";
import AffinityBadge from "@/components/shared/AffinityBadge";

function parseBriefSections(notes: string): ParsedBriefSection[] {
  if (!notes) return [];

  const sections: ParsedBriefSection[] = [];
  const lines = notes.split("\n");

  const sectionMap: Record<string, { title: string; type: ParsedBriefSection["type"]; icon: string }> = {
    "💰": { title: "The Opportunity", type: "gold", icon: "💰" },
    "⚠️": { title: "The Challenge", type: "coral", icon: "⚠️" },
    "🎯": { title: "Key Cultivation Hooks", type: "teal", icon: "🎯" },
  };

  let current: ParsedBriefSection | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line starts a new section
    const matchedKey = Object.keys(sectionMap).find((k) => trimmed.startsWith(k));
    if (matchedKey) {
      if (current) sections.push(current);
      const meta = sectionMap[matchedKey];
      current = { icon: meta.icon, title: meta.title, type: meta.type, content: [] };
    } else if (current && (trimmed.startsWith("- ") || trimmed.startsWith("• "))) {
      current.content.push(trimmed.replace(/^[-•]\s*/, ""));
    } else if (current && trimmed.length > 0) {
      current.content.push(trimmed);
    }
  }

  if (current) sections.push(current);
  return sections;
}

const sectionColors: Record<ParsedBriefSection["type"], { bg: string; border: string; title: string }> = {
  gold: {
    bg: "rgba(200,150,62,0.06)",
    border: "var(--color-gold)",
    title: "var(--color-gold)",
  },
  coral: {
    bg: "rgba(224,122,95,0.06)",
    border: "var(--color-coral)",
    title: "var(--color-coral)",
  },
  teal: {
    bg: "rgba(42,157,143,0.06)",
    border: "var(--color-teal)",
    title: "var(--color-teal)",
  },
};

export default function SeeBriefFlyout({
  donor,
  onClose,
}: {
  donor: DonorRecord | null;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (donor) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [donor]);

  const briefSections = donor ? parseBriefSections(donor.quickNotes) : [];

  return (
    <AnimatePresence>
      {donor && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(10,22,40,0.5)", backdropFilter: "blur(2px)" }}
            onClick={onClose}
          />

          {/* Flyout panel */}
          <motion.aside
            key="flyout"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-full z-50 overflow-y-auto flex flex-col"
            style={{
              width: "min(680px, 100vw)",
              background: "#fff",
              boxShadow: "-8px 0 40px rgba(10,22,40,0.18)",
            }}
          >
            {/* Header */}
            <div
              className="sticky top-0 z-10 px-6 py-5 flex items-start justify-between"
              style={{ background: "#fff", borderBottom: "1px solid var(--color-grey-100)" }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--color-navy), var(--color-teal))", color: "#fff" }}
                >
                  {donor.donorName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <h2
                    className="text-xl"
                    style={{ fontFamily: "var(--font-display)", color: "var(--color-navy)" }}
                  >
                    {donor.donorName}
                  </h2>
                  {donor.company && (
                    <p className="text-sm" style={{ color: "var(--color-grey-400)" }}>
                      {donor.company}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-colors"
                style={{ color: "var(--color-grey-400)" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "var(--color-grey-100)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "transparent")}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 px-6 py-5 space-y-5">

              {/* AI info banner */}
              <div
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: "var(--color-gold-pale)", border: "1px solid rgba(200,150,62,0.3)" }}
              >
                <span className="text-lg flex-shrink-0">✨</span>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-navy)" }}>
                  This brief was compiled by AI from LinkedIn, public records, and giving history. Use it to personalise your approach.
                </p>
              </div>

              {/* Score grid */}
              <div className="grid grid-cols-3 gap-3">
                <div
                  className="flex flex-col items-center p-4 rounded-xl"
                  style={{ background: "var(--color-grey-50)", border: "1px solid var(--color-grey-100)" }}
                >
                  <span className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--color-grey-400)" }}>
                    Affinity Score
                  </span>
                  <AffinityBadge score={donor.affinityScore} />
                </div>
                <div
                  className="flex flex-col items-center p-4 rounded-xl"
                  style={{ background: "var(--color-grey-50)", border: "1px solid var(--color-grey-100)" }}
                >
                  <span className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--color-grey-400)" }}>
                    Capacity
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="text-base"
                        style={{ color: i < donor.capacityRating ? "var(--color-gold)" : "var(--color-grey-200)" }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className="flex flex-col items-center p-4 rounded-xl"
                  style={{ background: "var(--color-grey-50)", border: "1px solid var(--color-grey-100)" }}
                >
                  <span className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--color-grey-400)" }}>
                    Recommended Ask
                  </span>
                  <span
                    className="text-base font-bold"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--color-teal)" }}
                  >
                    {donor.recommendedAsk || "—"}
                  </span>
                </div>
              </div>

              {/* Brief sections parsed from Quick Notes */}
              {briefSections.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: "var(--color-grey-400)" }}>
                    AI Research Brief
                  </h3>
                  {briefSections.map((section) => {
                    const colors = sectionColors[section.type];
                    return (
                      <div
                        key={section.title}
                        className="rounded-xl p-4"
                        style={{
                          background: colors.bg,
                          borderLeft: `3px solid ${colors.border}`,
                        }}
                      >
                        <p
                          className="text-sm font-semibold mb-2"
                          style={{ color: colors.title }}
                        >
                          {section.icon} {section.title}
                        </p>
                        <ul className="space-y-1.5">
                          {section.content.map((line, i) => (
                            <li key={i} className="text-sm flex gap-2" style={{ color: "var(--color-grey-800)" }}>
                              <span style={{ color: colors.border }} className="flex-shrink-0 mt-0.5">–</span>
                              <span>{line.replace(/\*\*/g, "")}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              ) : donor.quickNotes ? (
                <div
                  className="p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ background: "var(--color-grey-50)", color: "var(--color-grey-800)" }}
                >
                  {donor.quickNotes}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "var(--color-grey-400)" }}>
                  No research brief available yet.
                </p>
              )}

              {/* Donation history if available */}
              {donor.donationHistory && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--color-grey-400)" }}>
                    Giving History
                  </h3>
                  <div
                    className="p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ background: "var(--color-grey-50)", color: "var(--color-grey-800)", border: "1px solid var(--color-grey-100)" }}
                  >
                    {donor.donationHistory}
                  </div>
                </div>
              )}

              {/* Processing times */}
              {donor.processingCompleted && (
                <div className="text-xs" style={{ color: "var(--color-grey-400)" }}>
                  Report generated:{" "}
                  {new Date(donor.processingCompleted).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </div>

            {/* Actions footer */}
            <div
              className="sticky bottom-0 px-6 py-4 flex gap-3"
              style={{ background: "#fff", borderTop: "1px solid var(--color-grey-100)" }}
            >
              {donor.researchReport && (
                <a
                  href={donor.researchReport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium flex-1 justify-center transition-all"
                  style={{
                    background: "linear-gradient(135deg, var(--color-navy), var(--color-navy-mid))",
                    color: "#fff",
                  }}
                >
                  📄 Download Full PDF Report
                </a>
              )}
              {donor.linkedinUrl && (
                <a
                  href={donor.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: "var(--color-grey-50)",
                    border: "1px solid var(--color-grey-200)",
                    color: "var(--color-navy)",
                  }}
                >
                  LinkedIn →
                </a>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
