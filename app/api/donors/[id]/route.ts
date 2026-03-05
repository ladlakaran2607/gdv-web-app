import { NextRequest, NextResponse } from "next/server";
import { fetchRecord } from "@/lib/airtable/client";
import { AirtableRecord } from "@/lib/airtable/types";
import { DonorRecord } from "@/types/donor";

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
    stageGatherIntelligenceTime: (f["Stage: Gather Intelligence Complete Time"] as string) ?? "",
    stageAIProcessingTime: (f["Stage: AI Processing Time"] as string) ?? "",
    stageReportGenerationTime: (f["Stage: Report Generation Time"] as string) ?? "",
    generateReport: (f["Generate Report"] as string) ?? "",
    type: (f["Type"] as DonorRecord["type"]) ?? "",
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await fetchRecord(id);
    return NextResponse.json(mapRecord(record));
  } catch (err) {
    console.error("GET /api/donors/[id] error:", err);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
