"use client";
import { use } from "react";
import Link from "next/link";
import { opportunities } from "@/data/opportunities";
import { useApp } from "@/context/AppContext";
import { notFound } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import { t } from "@/data/translations";

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toggleSave, isSaved, statuses, setStatus, language } = useApp();
  const o = opportunities.find((x) => x.id === id);

  if (!o) notFound();

  const saved = isSaved(o.id);
  const currentStatus = statuses[o.id] || "not-started";

  const statusLabels = {
    "not-started": { label: t.notStarted[language], color: "bg-gray-100 text-gray-700" },
    "in-progress": { label: t.inProgress[language], color: "bg-amber-100 text-amber-800" },
    applied: { label: t.applied[language], color: "bg-emerald-100 text-emerald-800" },
  };

  return (
    <PageContainer>
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <Link href="/opportunities" className="text-sm text-emerald-700 hover:underline">
        ← {t.backToOpportunities[language]}
      </Link>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              {o.type.replace("-", " ")}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">{o.title}</h1>
            <p className="text-gray-500 mt-0.5">{o.organization}</p>
          </div>
          <button
            onClick={() => toggleSave(o.id)}
            aria-label={saved ? "Remove bookmark" : "Bookmark"}
            className={`text-3xl transition-transform hover:scale-110 ${saved ? "text-amber-500" : "text-gray-300 hover:text-amber-400"}`}
          >
            {saved ? "★" : "☆"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{t.deadline[language]}</p>
            <p className="font-semibold text-gray-800 mt-0.5">
              {new Date(o.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{t.location[language]}</p>
            <p className="font-semibold text-gray-800 mt-0.5 capitalize">{o.location}</p>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 mb-2">{t.aboutOpportunity[language]}</h2>
          <p className="text-gray-700 leading-relaxed text-sm">{o.fullDescription}</p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 mb-2">{t.eligibility[language]}</h2>
          <ul className="flex flex-col gap-1.5">
            {o.eligibility.map((e) => (
              <li key={e} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-emerald-500 mt-0.5">✓</span> {e}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {o.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">#{tag}</span>
          ))}
        </div>

        <div>
          <h2 className="font-semibold text-gray-800 mb-2">{t.myStatus[language]}</h2>
          <div className="flex gap-2 flex-wrap">
            {(["not-started", "in-progress", "applied"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(o.id, s)}
                className={`text-sm px-3 py-1.5 rounded-xl font-medium border transition-colors ${
                  currentStatus === s
                    ? statusLabels[s].color + " border-transparent"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {statusLabels[s].label}
              </button>
            ))}
          </div>
        </div>

        <a
          href={o.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl text-center transition-colors"
        >
          {t.applyNow[language]}
        </a>
      </div>
    </div>
    </PageContainer>
  );
}
