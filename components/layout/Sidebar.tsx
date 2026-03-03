"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  {
    section: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: "📊" },
      { href: "/prospects", label: "Who Should We Talk To?", icon: "👤", badge: null },
      { href: "/pipeline", label: "Donor Journey Board", icon: "🔄" },
    ],
  },
  {
    section: "AI Tools",
    items: [
      { href: "/pitch", label: "Write a Pitch", icon: "✍️" },
      { href: "/chat", label: "Ask the AI", icon: "💬", badge: "Soon" },
    ],
  },
  {
    section: "Business Case",
    items: [
      { href: "/analytics", label: "Is It Working?", icon: "📈" },
    ],
  },
];

function getInitials(email: string) {
  const parts = email.split("@")[0].split(".");
  return parts.map((p) => p[0]?.toUpperCase() ?? "").slice(0, 2).join("");
}

export default function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside
      className="flex flex-col w-[272px] min-h-screen flex-shrink-0"
      style={{ background: "var(--color-navy)", borderRight: "1px solid var(--color-navy-mid)" }}
    >
      {/* Logo */}
      <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--color-navy-mid)" }}>
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Guide Dogs Victoria" width={36} height={36} className="rounded-lg" />
          <div>
            <div
              className="text-base font-semibold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-gold)" }}
            >
              Prospect Intelligence
            </div>
            <div
              className="text-[10px] tracking-widest uppercase mt-0.5"
              style={{ color: "var(--color-grey-400)" }}
            >
              Guide Dogs Victoria
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map((group) => (
          <div key={group.section} className="mb-6">
            <p
              className="px-3 mb-2 text-[10px] font-semibold tracking-widest uppercase"
              style={{ color: "var(--color-grey-400)" }}
            >
              {group.section}
            </p>
            {group.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150 group relative"
                  style={{
                    background: active ? "rgba(200,150,62,0.12)" : "transparent",
                    color: active ? "var(--color-gold-light)" : "var(--color-grey-400)",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "var(--color-grey-400)";
                    }
                  }}
                >
                  {active && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r"
                      style={{ background: "var(--color-gold)" }}
                    />
                  )}
                  <span className="text-base">{item.icon}</span>
                  <span className="flex-1 leading-tight">{item.label}</span>
                  {item.badge && (
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(42,157,143,0.2)", color: "var(--color-teal-light)" }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid var(--color-navy-mid)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--color-navy-mid), var(--color-coral))", color: "#fff" }}
          >
            {getInitials(userEmail)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: "#fff" }}>
              {userEmail.split("@")[0]}
            </div>
            <div className="text-[11px] truncate" style={{ color: "var(--color-grey-400)" }}>
              {userEmail}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="text-xs px-2 py-1 rounded-lg transition-colors"
            style={{ color: "var(--color-grey-400)" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-coral)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-grey-400)")}
            title="Sign out"
          >
            ↪
          </button>
        </div>
      </div>
    </aside>
  );
}
