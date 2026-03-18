"use client";
import Link from "next/link";
import { opportunities } from "@/data/opportunities";
import { useApp } from "@/context/AppContext";
import OpportunityCard from "@/components/OpportunityCard";
import PageContainer from "@/components/PageContainer";
import { t } from "@/data/translations";

const statusLabels = {
  "not-started": { label: "Not Started", color: "bg-gray-100 text-gray-700", emoji: "⬜" },
  "in-progress": { label: "In Progress", color: "bg-amber-100 text-amber-800", emoji: "🔄" },
  applied: { label: "Applied", color: "bg-emerald-100 text-emerald-800", emoji: "✅" },
};

function daysUntil(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function DashboardPage() {
  const { saved, statuses, setStatus, firstGenMode, language } = useApp();
  const savedOpps = opportunities.filter((o) => saved.includes(o.id));
  const upcoming = savedOpps
    .filter((o) => daysUntil(o.deadline) > 0 && daysUntil(o.deadline) <= 30)
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline));

  return (
    <PageContainer>
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t.dashboardTitle[language]}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {t.dashboardSubtitle[language]}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {(["not-started", "in-progress", "applied"] as const).map((s) => {
          const count = savedOpps.filter((o) => (statuses[o.id] || "not-started") === s).length;
          return (
            <div key={s} className={`rounded-2xl p-4 text-center ${statusLabels[s].color}`}>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs font-medium mt-0.5">{statusLabels[s].label}</p>
            </div>
          );
        })}
      </div>

      {/* Upcoming deadlines */}
      {upcoming.length > 0 && (
        <div>
          <h2 className="font-bold text-gray-800 mb-3">
            ⏰ {t.deadlines30[language]}
          </h2>
          <div className="flex flex-col gap-2">
            {upcoming.map((o) => {
              const days = daysUntil(o.deadline);
              return (
                <Link
                  key={o.id}
                  href={`/opportunities/${o.id}`}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between hover:shadow-sm transition-shadow"
                >
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{o.title}</p>
                    <p className="text-xs text-gray-500">{o.organization}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${days <= 7 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {days}d left
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Saved opportunities */}
      <div>
        <h2 className="font-bold text-gray-800 mb-3">
          ★ {t.savedOpportunities[language]} ({savedOpps.length})
        </h2>

        {savedOpps.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200">
            <p className="text-4xl mb-3">☆</p>
            <p className="font-medium">{t.noSaved[language]}</p>
            <Link href="/opportunities" className="text-emerald-700 text-sm hover:underline mt-2 inline-block">
              {t.browseOpportunities[language]}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {savedOpps.map((o) => {
              const currentStatus = statuses[o.id] || "not-started";
              return (
                <div key={o.id} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <OpportunityCard opportunity={o} firstGenMode={firstGenMode} />
                  </div>
                  <div className="flex sm:flex-col gap-2 sm:w-36">
                    {(["not-started", "in-progress", "applied"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(o.id, s)}
                        className={`text-xs px-2 py-1.5 rounded-lg font-medium border flex-1 transition-colors ${
                          currentStatus === s
                            ? statusLabels[s].color + " border-transparent"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {statusLabels[s].emoji} {statusLabels[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </PageContainer>
  );
}
