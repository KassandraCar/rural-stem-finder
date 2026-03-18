"use client";
import { useState } from "react";
import { resources } from "@/data/resources";
import { useApp } from "@/context/AppContext";
import PageContainer from "@/components/PageContainer";
import { t } from "@/data/translations";

const categoryEmoji: Record<string, string> = {
  college: "🎓",
  internships: "💼",
  scholarships: "💰",
  "stem-careers": "🔬",
  "financial-aid": "📋",
};

const categoryColors: Record<string, string> = {
  college: "bg-blue-50 border-blue-200",
  internships: "bg-purple-50 border-purple-200",
  scholarships: "bg-amber-50 border-amber-200",
  "stem-careers": "bg-emerald-50 border-emerald-200",
  "financial-aid": "bg-rose-50 border-rose-200",
};

export default function ResourcesPage() {
  const { language } = useApp();
  const [open, setOpen] = useState<string | null>(resources[0].id);

  return (
    <PageContainer>
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t.resourceHub[language]}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {t.resourceSubtitle[language]}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {resources.map((r) => {
          const isOpen = open === r.id;
          return (
            <div key={r.id} className={`rounded-2xl border ${categoryColors[r.category]} overflow-hidden`}>
              <button
                onClick={() => setOpen(isOpen ? null : r.id)}
                className="w-full flex items-center justify-between p-5 text-left"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{categoryEmoji[r.category]}</span>
                  <div>
                    <h2 className="font-bold text-gray-900">{r.title}</h2>
                    <p className="text-sm text-gray-600 mt-0.5">{r.description}</p>
                  </div>
                </div>
                <span className={`text-gray-400 text-xl transition-transform ${isOpen ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-6 flex flex-col gap-5 border-t border-gray-200 pt-5">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">
                      {t.stepByStep[language]}
                    </h3>
                    <ol className="flex flex-col gap-2">
                      {r.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                          <span className="bg-white border border-gray-300 text-gray-600 font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">
                      💡 {t.tips[language]}
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {r.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-emerald-500 mt-0.5">→</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">
                      🔗 {t.helpfulLinks[language]}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {r.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm bg-white border border-gray-300 text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-xl font-medium transition-colors"
                        >
                          {link.label} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </PageContainer>
  );
}
