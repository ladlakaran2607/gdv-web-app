"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Toast from "@/components/shared/Toast";
import { DonorRecord } from "@/types/donor";

const SeeBriefFlyout = dynamic(() => import("@/components/dashboard/SeeBriefFlyout"), { ssr: false });

interface ResearchEntry {
  id: string;
  name: string;
  status: string;
}

const ACTIVE_STATUSES = new Set(["New", "AI Analysis", "Gathering Intelligence", "Report Generation"]);

function isActive(status: string) {
  return ACTIVE_STATUSES.has(status);
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Complete") {
    return (
      <span
        className="text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ background: "rgba(42,157,143,0.12)", color: "var(--color-teal)" }}
      >
        Complete ✓
      </span>
    );
  }
  if (status === "Error") {
    return (
      <span
        className="text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ background: "rgba(224,122,95,0.12)", color: "var(--color-coral)" }}
      >
        Error
      </span>
    );
  }
  return (
    <span
      className="text-xs font-medium italic"
      style={{ color: "var(--color-gold)", animation: "pulse-dot 2s infinite" }}
    >
      Researching…
    </span>
  );
}

export default function RecentResearches() {
  const router = useRouter();
  const [researches, setResearches] = useState<ResearchEntry[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [activeDonor, setActiveDonor] = useState<DonorRecord | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const prevStatusesRef = useRef<Map<string, string>>(new Map());

  const fetchRecent = useCallback(async () => {
    try {
      const res = await fetch("/api/donors/recent", { cache: "no-store" });
      if (!res.ok) return;
      const data: ResearchEntry[] = await res.json();

      setResearches((prev) => {
        const prevMap = prevStatusesRef.current;
        let completedName: string | null = null;

        for (const entry of data) {
          const prevStatus = prevMap.get(entry.id);
          if (prevStatus && prevStatus !== "Complete" && entry.status === "Complete") {
            completedName = entry.name;
            break;
          }
        }

        prevStatusesRef.current = new Map(data.map((e) => [e.id, e.status]));

        if (completedName) {
          setToast(completedName);
          router.refresh();
        }

        const serverIds = new Set(data.map((e) => e.id));
        const localOnly = prev.filter((e) => !serverIds.has(e.id));
        return [...localOnly, ...data];
      });
    } catch {
      // silently ignore
    }
  }, [router]);

  useEffect(() => { fetchRecent(); }, [fetchRecent]);
  useEffect(() => {
    const interval = setInterval(fetchRecent, 60_000);
    return () => clearInterval(interval);
  }, [fetchRecent]);

  useEffect(() => {
    function handleNewDonor(e: Event) {
      const { recordId, donorName } = (e as CustomEvent<{ recordId: string; donorName: string }>).detail;
      setResearches((prev) => {
        if (prev.some((r) => r.id === recordId)) return prev;
        return [{ id: recordId, name: donorName, status: "New" }, ...prev].slice(0, 5);
      });
      prevStatusesRef.current.set(recordId, "New");
    }
    window.addEventListener("newDonor", handleNewDonor);
    return () => window.removeEventListener("newDonor", handleNewDonor);
  }, []);

  // Poll the open flyout every 5s while the donor is in-progress
  useEffect(() => {
    const id = activeDonor?.id;
    const status = activeDonor?.status;
    if (!id || status === "Complete" || status === "Error" || !status) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/donors/${id}`);
        if (!res.ok) return;
        const donor: DonorRecord = await res.json();
        setActiveDonor(donor);
      } catch {
        // silently ignore
      }
    }, 5_000);

    return () => clearInterval(interval);
  }, [activeDonor?.id, activeDonor?.status]);

  async function handleSeeBrief(entry: ResearchEntry) {
    setLoadingId(entry.id);
    try {
      const res = await fetch(`/api/donors/${entry.id}`);
      if (!res.ok) throw new Error();
      const donor: DonorRecord = await res.json();
      setActiveDonor(donor);
    } catch {
      // silently ignore
    } finally {
      setLoadingId(null);
    }
  }

  if (researches.length === 0) return null;

  return (
    <>
      <div
        className="rounded-2xl bg-white"
        style={{ boxShadow: "var(--shadow-sm)", border: "1px solid var(--color-grey-100)" }}
      >
        <div
          className="px-5 py-4"
          style={{ borderBottom: "1px solid var(--color-grey-100)" }}
        >
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold" style={{ color: "var(--color-navy)" }}>
              Recent Researches
            </h3>
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(200,150,62,0.1)", color: "var(--color-gold)" }}
            >
              Last 5
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-grey-400)" }}>
            Live research status for recently added donors
          </p>
        </div>

        <div className="p-5 flex flex-col gap-3">
          {researches.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    background: r.status === "Complete"
                      ? "var(--color-teal)"
                      : r.status === "Error"
                      ? "var(--color-coral)"
                      : "var(--color-gold)",
                    animation: isActive(r.status) ? "pulse-dot 2s infinite" : "none",
                  }}
                />
                <span className="text-sm font-medium truncate" style={{ color: "var(--color-navy)" }}>
                  {r.name}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge status={r.status} />
                <button
                  onClick={() => handleSeeBrief(r)}
                  disabled={loadingId === r.id}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                  style={{
                    background: "var(--color-grey-50)",
                    border: "1px solid var(--color-grey-200)",
                    color: loadingId === r.id ? "var(--color-grey-400)" : "var(--color-navy)",
                    cursor: loadingId === r.id ? "wait" : "pointer",
                  }}
                >
                  {loadingId === r.id ? "…" : "See Brief →"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SeeBriefFlyout donor={activeDonor} onClose={() => setActiveDonor(null)} />

      {toast && (
        <Toast
          message={`Research complete for ${toast}`}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  );
}
