import { NextRequest, NextResponse } from "next/server";
import { createRecord } from "@/lib/airtable/client";

interface DonationRow {
  date: string;
  amount: string;
  campaign: string;
}

interface CauseEvent {
  name: string;
  invited: boolean;
  dateInvited: string;
  attended: boolean;
  dateAttended: string;
  donated: boolean;
  dateDonated: string;
  donationAmount: string;
}

function formatDonationHistory(rows: DonationRow[]): string {
  return rows
    .filter((r) => r.date || r.amount || r.campaign)
    .map((r) => {
      const parts: string[] = [];
      if (r.date) parts.push(`Date: ${r.date}`);
      if (r.amount) parts.push(`Amount: $${r.amount}`);
      if (r.campaign) parts.push(`Campaign: ${r.campaign}`);
      return parts.join(" | ");
    })
    .join("\n");
}

function formatConnectionToCause(events: CauseEvent[]): string {
  return events
    .filter((e) => e.name)
    .map((e) => {
      const lines: string[] = [`Event: ${e.name}`];
      if (e.invited) lines.push(`  Invited: Yes${e.dateInvited ? ` (${e.dateInvited})` : ""}`);
      if (e.attended) lines.push(`  Attended: Yes${e.dateAttended ? ` (${e.dateAttended})` : ""}`);
      if (e.donated) {
        const parts = ["  Donated: Yes"];
        if (e.donationAmount) parts.push(`Amount: $${e.donationAmount}`);
        if (e.dateDonated) parts.push(`Date: ${e.dateDonated}`);
        lines.push(parts.join(" | "));
      }
      return lines.join("\n");
    })
    .join("\n\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { donorName, company, linkedIn, donationHistory, donationFrequency, connectionToCause } = body;

    if (!donorName?.trim()) {
      return NextResponse.json({ error: "Donor name is required" }, { status: 400 });
    }

    const fields: Record<string, unknown> = {
      "Donor Name": donorName.trim(),
      "Status": "New",
    };

    if (company?.trim()) fields["Company/Employer"] = company.trim();
    if (linkedIn?.trim()) fields["LinkedIn Profile URL"] = linkedIn.trim();
    if (donationFrequency) fields["Donation Frequency"] = donationFrequency;

    const donationText = formatDonationHistory(donationHistory ?? []);
    if (donationText) fields["Donation History"] = donationText;

    const causeText = formatConnectionToCause(connectionToCause ?? []);
    if (causeText) fields["Connection to Cause"] = causeText;

    const record = await createRecord(fields);
    const recordId = record.id;

    // Trigger n8n webhook if configured
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const webhookParams = new URLSearchParams({ record_id: recordId, donorName: donorName.trim() });
        const webhookRes = await fetch(`${webhookUrl}?${webhookParams}`, {
          method: "GET",
        });
        const webhookBody = await webhookRes.text();
        console.log(`[n8n] status=${webhookRes.status} body=${webhookBody}`);
      } catch (err) {
        console.error("[n8n] Failed to trigger webhook:", err);
      }
    } else {
      console.warn("[n8n] N8N_WEBHOOK_URL is not set — skipping webhook");
    }

    return NextResponse.json({ recordId, donorName: donorName.trim() });
  } catch (err) {
    console.error("POST /api/donors error:", err);
    return NextResponse.json({ error: "Failed to create donor" }, { status: 500 });
  }
}
