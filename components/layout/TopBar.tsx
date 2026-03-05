"use client";

import { usePathname } from "next/navigation";

const pageMeta: Record<string, { title: string; tag: string }> = {
  "/dashboard": { title: "Your Daily Snapshot", tag: "Dashboard" },
  "/prospects": { title: "Who Should We Talk To?", tag: "Prospects" },
  "/pipeline": { title: "Donor Journey Board", tag: "Pipeline" },
  "/pitch": { title: "Write a Pitch", tag: "AI Tools" },
  "/chat": { title: "Ask the AI", tag: "AI Tools" },
  "/analytics": { title: "Is It Working?", tag: "Business Case" },
};

export default function TopBar() {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? { title: "Guide Dogs Victoria", tag: "" };

  return (
    <>
      <header
        className="flex items-center justify-between px-7 py-4 flex-shrink-0"
        style={{
          background: "#fff",
          borderBottom: "1px solid var(--color-grey-100)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div className="flex items-center gap-3">
          <h1
            className="text-xl font-semibold"
            style={{ color: "var(--color-navy)", letterSpacing: "-0.01em" }}
          >
            {meta.title}
          </h1>
          {meta.tag && (
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(42,157,143,0.1)", color: "var(--color-teal)" }}
            >
              {meta.tag}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* AI status */}
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: "#4CAF50",
                boxShadow: "0 0 6px rgba(76,175,80,0.6)",
                animation: "pulse-dot 2s infinite",
              }}
            />
            <span className="text-xs font-medium" style={{ color: "var(--color-grey-600)" }}>
              AI Engine Active
            </span>
          </div>

          {/* Notification dot */}
          <button className="relative p-2 rounded-xl transition-colors hover:bg-gray-100">
            <span className="text-lg">🔔</span>
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: "var(--color-coral)" }}
            />
          </button>
        </div>
      </header>

    </>
  );
}
