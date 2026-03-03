import Anthropic from "@anthropic-ai/sdk";
import { DonorRecord, AIInsight } from "@/types/donor";
import { unstable_cache } from "next/cache";

const client = new Anthropic();

async function _generateInsights(donors: DonorRecord[]): Promise<AIInsight[]> {
  if (!donors.length) return [];

  const donorSummaries = donors
    .slice(0, 5)
    .map(
      (d) =>
        `- ${d.donorName} (${d.company || "Independent"}): Affinity ${d.affinityScore}, Recommended Ask ${d.recommendedAsk}, Notes: ${d.quickNotes?.slice(0, 300)}`
    )
    .join("\n");

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `You are an AI assistant for a fundraising team at Guide Dogs Victoria. Based on these top donor prospects, generate exactly 3 short, action-oriented insights (1-2 sentences each) about who needs attention and why. Be specific and use donor names.

Prospects:
${donorSummaries}

Respond as a JSON array with exactly 3 objects, each with: "icon" (single emoji), "text" (the insight), "type" (one of: "gold", "teal", or "coral"). Use different types for variety. No markdown, just raw JSON array.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") return fallbackInsights(donors);

  try {
    const cleaned = content.text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned) as AIInsight[];
    return parsed.slice(0, 3);
  } catch {
    return fallbackInsights(donors);
  }
}

function fallbackInsights(donors: DonorRecord[]): AIInsight[] {
  const top = donors[0];
  return [
    {
      icon: "⚡",
      text: top
        ? `${top.donorName} is your highest-affinity prospect — recommended ask ${top.recommendedAsk}.`
        : "Review your top prospects and schedule outreach this week.",
      type: "gold",
    },
    {
      icon: "🎯",
      text: `${donors.filter((d) => d.affinityScore === "High").length} donors rated High affinity — prioritise personal outreach.`,
      type: "teal",
    },
    {
      icon: "📋",
      text: "Check your pipeline for any donors who completed processing recently and need follow-up.",
      type: "coral",
    },
  ];
}

export const generateDashboardInsights = unstable_cache(
  _generateInsights,
  ["dashboard-insights"],
  { revalidate: 3600 }
);
