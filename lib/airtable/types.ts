export interface AirtableField {
  [key: string]: string | number | boolean | string[] | AirtableAttachment[] | undefined;
}

export interface AirtableAttachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  thumbnails?: {
    small?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  };
}

export interface AirtableRecord {
  id: string;
  createdTime: string;
  fields: {
    "Donor Name"?: string;
    "Company/Employer"?: string;
    "Email"?: string;
    "LinkedIn Profile URL"?: string;
    "Connection to Cause"?: string;
    "Donation History"?: string;
    "Donation Frequency"?: string;
    "Donated in the Last Year?"?: boolean;
    "Status"?: string;
    "Processing Started"?: string;
    "Processing Completed"?: string;
    "Research Report"?: AirtableAttachment[];
    "Quick Notes"?: string;
    "Capacity Rating"?: number;
    "Affinity Score"?: string;
    "Recommended Ask"?: string;
    "Created Time"?: string;
    "Stage: Gather Intelligence Complete Time"?: string;
    "Stage: AI Processing Time"?: string;
    "Stage: Report Generation Time"?: string;
    "Generate Report"?: string;
    "Type"?: string;
  };
}

export interface AirtableListResponse {
  records: AirtableRecord[];
  offset?: string;
}
