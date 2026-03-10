import { AirtableListResponse, AirtableRecord } from "./types";

const BASE_URL = "https://api.airtable.com/v0";
const BASE_ID = process.env.AIRTABLE_BASE_ID!;
// Prefer Table ID over name for robustness
const TABLE = process.env.AIRTABLE_TABLE_ID ?? "Harly-Donor-Prospects";
const API_KEY = process.env.AIRTABLE_API_KEY!;

function headers() {
  return {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function fetchAllRecords(filterFormula?: string): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams();
    if (filterFormula) params.set("filterByFormula", filterFormula);
    if (offset) params.set("offset", offset);
    params.set("pageSize", "100");

    const url = `${BASE_URL}/${BASE_ID}/${encodeURIComponent(TABLE)}?${params}`;
    const res = await fetch(url, {
      headers: headers(),
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Airtable fetch failed (${res.status}): ${err}`);
    }

    const data: AirtableListResponse = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

export async function createRecord(fields: Record<string, unknown>): Promise<AirtableRecord> {
  const url = `${BASE_URL}/${BASE_ID}/${encodeURIComponent(TABLE)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable create failed (${res.status}): ${err}`);
  }

  return res.json();
}

export async function fetchRecord(recordId: string): Promise<AirtableRecord> {
  const url = `${BASE_URL}/${BASE_ID}/${encodeURIComponent(TABLE)}/${recordId}`;
  const res = await fetch(url, {
    headers: headers(),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable fetch failed (${res.status}): ${err}`);
  }

  return res.json();
}
