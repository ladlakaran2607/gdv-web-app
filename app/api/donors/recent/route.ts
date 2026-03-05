import { NextResponse } from "next/server";

const BASE_URL = "https://api.airtable.com/v0";
const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const TABLE = process.env.AIRTABLE_TABLE_ID ?? "Harly-Donor-Prospects";
const API_KEY = process.env.AIRTABLE_API_KEY!;

export async function GET() {
  try {
    const params = new URLSearchParams({
      filterByFormula: "NOT({Type} = 'Soft Delete')",
      "sort[0][field]": "Created Time",
      "sort[0][direction]": "desc",
      pageSize: "5",
      "fields[]": "Donor Name",
    });
    // Add Status field
    params.append("fields[]", "Status");
    params.append("fields[]", "Created Time");

    const url = `${BASE_URL}/${BASE_ID}/${encodeURIComponent(TABLE)}?${params}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Airtable fetch failed (${res.status}): ${err}`);
    }

    const data = await res.json();
    const records = data.records.map((r: { id: string; fields: Record<string, string> }) => ({
      id: r.id,
      name: r.fields["Donor Name"] ?? "Unknown",
      status: r.fields["Status"] ?? "New",
      createdAt: r.fields["Create Time"] ?? null,
    }));

    return NextResponse.json(records);
  } catch (err) {
    console.error("GET /api/donors/recent error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
