"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!supabase) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <p className="text-stone-500 text-sm">Supabase is not configured.</p>
      </div>
    );
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-stone-200 p-8 max-w-md w-full flex flex-col gap-5 shadow-sm">
        <div className="text-center">
          <span className="text-3xl">🔒</span>
          <h1 className="text-xl font-bold text-stone-900 mt-2">Set a new password</h1>
        </div>
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">New password</label>
            <input
              required type="password" minLength={8}
              value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">Confirm password</label>
            <input
              required type="password" minLength={8}
              value={confirm} onChange={(e) => setConfirm(e.target.value)}
              placeholder="Same password again"
              className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-semibold px-4 py-3 rounded-xl transition-colors text-sm"
          >
            {loading ? "Saving..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
