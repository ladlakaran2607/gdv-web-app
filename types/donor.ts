export interface DonorRecord {
  id: string;
  donorName: string;
  company: string;
  email: string;
  linkedinUrl: string;
  connectionToCause: string;
  donationHistory: string;
  donationFrequency: string;
  donatedInLastYear: boolean;
  status: "Complete" | "AI Analysis" | "Gathering Intelligence" | "Report Generation" | "New" | "Error" | "";
  processingStarted: string;
  processingCompleted: string;
  researchReport: string; // PDF URL from Airtable attachments
  quickNotes: string;
  capacityRating: number; // 1–5
  affinityScore: "High" | "Medium" | "Low" | "";
  recommendedAsk: string; // e.g. "$5,000.00"
  createdTime: string;
  stageGatherIntelligenceTime: string;
  stageAIProcessingTime: string;
  stageReportGenerationTime: string;
  generateReport: string; // n8n webhook URL
  type: "Active" | "Soft Delete" | "";
}

export interface DashboardKPIs {
  totalProspects: number;
  totalPipelineValue: string;
  reportsThisMonth: number;
  completionRate: number;
}

export interface AIInsight {
  icon: string;
  text: string;
  type: "gold" | "teal" | "coral";
}

export interface ParsedBriefSection {
  icon: string;
  title: string;
  content: string[];
  type: "gold" | "teal" | "coral";
}
