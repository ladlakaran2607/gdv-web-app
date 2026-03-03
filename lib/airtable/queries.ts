import { fetchAllRecords } from "./client";
import { AirtableRecord } from "./types";
import { DonorRecord, DashboardKPIs } from "@/types/donor";

function mapRecord(r: AirtableRecord): DonorRecord {
  const f = r.fields;
  const reportAttachments = f["Research Report"];
  const reportUrl =
    Array.isArray(reportAttachments) && reportAttachments.length > 0
      ? reportAttachments[0].url
      : "";

  return {
    id: r.id,
    donorName: (f["Donor Name"] as string) ?? "",
    company: (f["Company/Employer"] as string) ?? "",
    email: (f["Email"] as string) ?? "",
    linkedinUrl: (f["LinkedIn Profile URL"] as string) ?? "",
    connectionToCause: (f["Connection to Cause"] as string) ?? "",
    donationHistory: (f["Donation History"] as string) ?? "",
    donationFrequency: (f["Donation Frequency"] as string) ?? "",
    donatedInLastYear: (f["Donated in the Last Year?"] as boolean) ?? false,
    status: (f["Status"] as DonorRecord["status"]) ?? "",
    processingStarted: (f["Processing Started"] as string) ?? "",
    processingCompleted: (f["Processing Completed"] as string) ?? "",
    researchReport: reportUrl,
    quickNotes: (f["Quick Notes"] as string) ?? "",
    capacityRating: (f["Capacity Rating"] as number) ?? 0,
    affinityScore: (f["Affinity Score"] as DonorRecord["affinityScore"]) ?? "",
    recommendedAsk: (f["Recommended Ask"] as string) ?? "",
    createdTime: r.createdTime,
    stageGatherIntelligenceTime:
      (f["Stage: Gather Intelligence Complete Time"] as string) ?? "",
    stageAIProcessingTime: (f["Stage: AI Processing Time"] as string) ?? "",
    stageReportGenerationTime:
      (f["Stage: Report Generation Time"] as string) ?? "",
    generateReport: (f["Generate Report"] as string) ?? "",
    type: (f["Type"] as DonorRecord["type"]) ?? "",
  };
}

export async function getAllDonors(): Promise<DonorRecord[]> {
  const records = await fetchAllRecords(`NOT({Type} = 'Soft Delete')`);
  return records.map(mapRecord);
}

export async function getCompletedDonors(): Promise<DonorRecord[]> {
  const records = await fetchAllRecords(`{Status} = 'Complete'`);
  return records
    .map(mapRecord)
    .sort((a, b) => affinityToNum(b.affinityScore) - affinityToNum(a.affinityScore));
}

export function affinityToNum(score: DonorRecord["affinityScore"]): number {
  if (score === "High") return 3;
  if (score === "Medium") return 2;
  if (score === "Low") return 1;
  return 0;
}

export function parseDollarAmount(value: string): number {
  if (!value) return 0;
  return parseFloat(value.replace(/[$,\s]/g, "")) || 0;
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export function computePipelineValue(donors: DonorRecord[]): string {
  const completed = donors.filter((d) => d.status === "Complete");
  const total = completed.reduce(
    (sum, d) => sum + parseDollarAmount(d.recommendedAsk),
    0
  );
  return formatCurrency(total);
}

export function computeKPIs(donors: DonorRecord[]): DashboardKPIs {
  const active = donors.filter((d) => d.type !== "Soft Delete");
  const completed = active.filter((d) => d.status === "Complete");

  const now = new Date();
  const reportsThisMonth = completed.filter((d) => {
    if (!d.processingCompleted) return false;
    const date = new Date(d.processingCompleted);
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  const total = completed.reduce(
    (sum, d) => sum + parseDollarAmount(d.recommendedAsk),
    0
  );

  const completionRate =
    active.length > 0 ? Math.round((completed.length / active.length) * 100) : 0;

  return {
    totalProspects: active.length,
    totalPipelineValue: formatCurrency(total),
    reportsThisMonth,
    completionRate,
  };
}

export function getTopProspects(donors: DonorRecord[], limit = 5): DonorRecord[] {
  return donors
    .filter((d) => d.status === "Complete" && d.donorName)
    .sort((a, b) => affinityToNum(b.affinityScore) - affinityToNum(a.affinityScore))
    .slice(0, limit);
}

export function getRecentActivity(
  donors: DonorRecord[],
  limit = 3
): DonorRecord[] {
  return donors
    .filter((d) => d.processingCompleted)
    .sort(
      (a, b) =>
        new Date(b.processingCompleted).getTime() -
        new Date(a.processingCompleted).getTime()
    )
    .slice(0, limit);
}
