"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    // Create client lazily inside the handler (only runs in browser)
    const supabase = createClient();

    if (mode === "sign-in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setSuccessMsg("Account created! Check your email to confirm, then sign in.");
        setMode("sign-in");
      }
    }

    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-mid) 100%)" }}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "var(--color-gold)", filter: "blur(80px)", transform: "translate(30%, -30%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
        style={{ background: "var(--color-teal)", filter: "blur(60px)", transform: "translate(-30%, 30%)" }}
      />

      <div
        className="w-full max-w-md rounded-2xl p-8 relative"
        style={{
          background: "#fff",
          boxShadow: "var(--shadow-lg), 0 0 0 1px rgba(200,150,62,0.1)",
        }}
      >
        {/* Logo + branding */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Guide Dogs Victoria" width={56} height={56} className="rounded-xl mb-4" />
          <h1
            className="text-2xl text-center"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-navy)" }}
          >
            Prospect Intelligence
          </h1>
          <p className="text-sm mt-1 text-center" style={{ color: "var(--color-grey-400)" }}>
            Guide Dogs Victoria
          </p>
        </div>

        {/* Mode toggle */}
        <div
          className="flex rounded-xl p-1 mb-6"
          style={{ background: "var(--color-grey-50)" }}
        >
          {(["sign-in", "sign-up"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); setSuccessMsg(""); }}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                background: mode === m ? "#fff" : "transparent",
                color: mode === m ? "var(--color-navy)" : "var(--color-grey-400)",
                boxShadow: mode === m ? "var(--shadow-sm)" : "none",
              }}
            >
              {m === "sign-in" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {successMsg && (
          <div
            className="mb-4 p-3 rounded-xl text-sm"
            style={{ background: "rgba(42,157,143,0.1)", color: "var(--color-teal)" }}
          >
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-navy)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@guidedogs.com.au"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                border: "1.5px solid var(--color-grey-200)",
                color: "var(--color-navy)",
                background: "#fff",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-grey-200)")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-navy)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                border: "1.5px solid var(--color-grey-200)",
                color: "var(--color-navy)",
                background: "#fff",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--color-gold)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-grey-200)")}
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "var(--color-coral)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-150 mt-2"
            style={{
              background: loading
                ? "var(--color-grey-200)"
                : "linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-mid) 100%)",
              boxShadow: loading ? "none" : "var(--shadow-md)",
            }}
          >
            {loading ? "Please wait…" : mode === "sign-in" ? "Sign In →" : "Create Account →"}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: "var(--color-grey-400)" }}>
          Secure access for Guide Dogs Victoria staff
        </p>
      </div>
    </div>
  );
}
