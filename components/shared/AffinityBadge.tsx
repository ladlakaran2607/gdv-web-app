import { DonorRecord } from "@/types/donor";

const styles: Record<string, { bg: string; color: string; label: string }> = {
  High: { bg: "rgba(42,157,143,0.12)", color: "var(--color-teal)", label: "High" },
  Medium: { bg: "rgba(200,150,62,0.12)", color: "var(--color-gold)", label: "Medium" },
  Low: { bg: "rgba(224,122,95,0.12)", color: "var(--color-coral)", label: "Low" },
};

export default function AffinityBadge({
  score,
}: {
  score: DonorRecord["affinityScore"];
}) {
  const style = styles[score ?? ""] ?? {
    bg: "var(--color-grey-100)",
    color: "var(--color-grey-400)",
    label: score || "—",
  };

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  );
}
