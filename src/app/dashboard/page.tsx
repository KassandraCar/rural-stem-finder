"use client";
import Link from "next/link";
import { opportunities } from "@/data/opportunities";
import { useApp } from "@/context/AppContext";
import OpportunityCard from "@/components/OpportunityCard";
import PageContainer from "@/components/PageContainer";
import { t } from "@/data/translations";
import { rankOpportunities } from "@/lib/opportunityScoring";
import type { Language } from "@/data/translations";

const recCopy: Record<Language, { title: string; sub: string; edit: string; greeting: (n: string) => string }> = {
  en: { title: "Recommended for you", sub: "Ranked by your interests, grade level, and location.", edit: "Edit profile", greeting: (n) => `Hey ${n} 👋` },
  es: { title: "Recomendado para ti", sub: "Ordenado según tus intereses, nivel escolar y ubicación.", edit: "Editar perfil", greeting: (n) => `Hola ${n} 👋` },
  vi: { title: "Gợi ý cho bạn", sub: "Xếp hạng theo sở thích, cấp học và vị trí của bạn.", edit: "Sửa hồ sơ", greeting: (n) => `Chào ${n} 👋` },
  so: { title: "Laguu soo jeediyay", sub: "Waxaa lagu kala horreysiiyay xiisahaaga, heerka dugsigaaga, iyo goobtaada.", edit: "Wax ka beddel", greeting: (n) => `Salaan ${n} 👋` },
  ru: { title: "Рекомендовано для вас", sub: "Отсортировано по вашим интересам, уровню обучения и местоположению.", edit: "Изменить профиль", greeting: (n) => `Привет, ${n} 👋` },
};

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
  const { saved, statuses, setStatus, firstGenMode, language, profile, userLocation, setShowOnboarding } = useApp();
  const rc = recCopy[language] ?? recCopy.en;
  const savedOpps = opportunities.filter((o) => saved.includes(o.id));
  const upcoming = savedOpps
    .filter((o) => daysUntil(o.deadline) > 0 && daysUntil(o.deadline) <= 30)
    .sort((a, b) => daysUntil(a.deadline) - daysUntil(b.deadline));

  // Personalized recommendations: rank unsaved opportunities against the student profile
  const hasProfile = profile.interests.length > 0 || profile.gradeLevel !== "" || userLocation !== "";
  const recommended = hasProfile
    ? rankOpportunities(
        opportunities.filter((o) => !saved.includes(o.id) && daysUntil(o.deadline) > 0),
        {
          location: userLocation || "washington",
          interests: profile.interests,
          gradeLevel: profile.gradeLevel,
          identity: [],
          firstGenMode,
        },
        { gradeLevel: "", interest: "", identity: "", location: "", type: "", search: "" }
      ).slice(0, 4)
    : [];

  return (
    <PageContainer>
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {profile.name ? rc.greeting(profile.name) : t.dashboardTitle[language]}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {t.dashboardSubtitle[language]}
          </p>
          {profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {profile.interests.map((i) => (
                <span key={i} className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full px-2.5 py-0.5">
                  {i}
                </span>
              ))}
              {userLocation && (
                <span className="text-xs bg-gray-50 text-gray-600 border border-gray-200 rounded-full px-2.5 py-0.5">
                  📍 {userLocation}
                </span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => setShowOnboarding(true)}
          className="shrink-0 text-xs font-medium text-emerald-700 border border-emerald-300 rounded-xl px-3 py-1.5 hover:bg-emerald-50"
        >
          ✏️ {rc.edit}
        </button>
      </div>

      {/* Recommended for you */}
      {recommended.length > 0 && (
        <div>
          <h2 className="font-bold text-gray-800">🎯 {rc.title}</h2>
          <p className="text-xs text-gray-500 mb-3">{rc.sub}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {recommended.map((r) => (
              <OpportunityCard key={r.opportunity.id} opportunity={r.opportunity} firstGenMode={firstGenMode} />
            ))}
          </div>
        </div>
      )}

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
