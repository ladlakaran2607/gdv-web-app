export const dynamic = "force-dynamic";

import { createClient as createSupabase } from "@/lib/supabase/server";
import { getAllDonors, computeKPIs, getTopProspects, getRecentActivity } from "@/lib/airtable/queries";
import { generateDashboardInsights } from "@/lib/anthropic/insights";
import type { AIInsight } from "@/types/donor";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import KPIGrid from "@/components/dashboard/KPIGrid";
import ProspectsTable from "@/components/dashboard/ProspectsTable";
import AIInsights from "@/components/dashboard/AIInsights";
import RecentActivity from "@/components/dashboard/RecentActivity";
import WelcomeModal from "@/components/dashboard/WelcomeModal";
import DashboardTip from "@/components/dashboard/DashboardTip";
import RecentResearches from "@/components/dashboard/RecentResearches";

export default async function DashboardPage() {
  const supabase = await createSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all data — graceful fallback if Airtable is rate-limited or unavailable
  let donors: Awaited<ReturnType<typeof getAllDonors>> = [];
  try {
    donors = await getAllDonors();
  } catch {
    // Rate limited (429) or network error — render with empty data rather than crashing
  }

  const kpis = computeKPIs(donors);
  const topProspects = getTopProspects(donors, 5);
  const recentActivity = getRecentActivity(donors, 3);

  // Generate AI insights (cached hourly, graceful fallback if no API key)
  let insights: AIInsight[] = [];
  try {
    insights = await generateDashboardInsights(topProspects);
  } catch {
    // No API key configured or rate limited — show empty state
  }

  return (
    <div>
      <WelcomeModal userId={user?.id ?? ""} />
      <WelcomeBanner kpis={kpis} userEmail={user?.email ?? ""} />
      <DashboardTip userId={user?.id ?? ""} />
      <KPIGrid kpis={kpis} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Prospects table spans 2 cols */}
        <div className="xl:col-span-2">
          <ProspectsTable donors={topProspects} />
        </div>

        {/* Right sidebar: recent researches + AI insights + recent activity */}
        <div className="flex flex-col gap-4">
          <RecentResearches />
          <AIInsights insights={insights} />
          <RecentActivity donors={recentActivity} />
        </div>
      </div>
    </div>
  );
}
