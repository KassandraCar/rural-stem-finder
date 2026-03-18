"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { opportunities } from "@/data/opportunities";
import OpportunityCard from "@/components/OpportunityCard";
import FilterBar, { Filters } from "@/components/FilterBar";
import { useApp } from "@/context/AppContext";
import PageContainer from "@/components/PageContainer";
import { t } from "@/data/translations";
import { rankOpportunities, buildUserProfile } from "@/lib/opportunityScoring";

function OpportunitiesContent() {
  const { firstGenMode, language, userLocation } = useApp();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    gradeLevel: "",
    interest: "",
    identity: "",
    location: "",
    type: searchParams.get("type") || "",
    search: "",
  });

  useEffect(() => {
    const type = searchParams.get("type");
    if (type) setFilters((f) => ({ ...f, type }));
  }, [searchParams]);

  // Use ranking system instead of simple filtering
  const rankedOpportunities = useMemo(() => {
    // Build user profile from current filters, user location, and first-gen mode
    const profile = buildUserProfile(filters, userLocation, firstGenMode);

    // Rank opportunities using the scoring system
    return rankOpportunities(opportunities, profile, filters);
  }, [filters, userLocation, firstGenMode]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t.findOpportunities[language]}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {t.opportunitiesSubtitle[language]}
        </p>
      </div>

      <FilterBar filters={filters} onChange={setFilters} language={language} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {rankedOpportunities.length} {t.results[language]}
          {rankedOpportunities.length > 0 && " (ranked by relevance)"}
        </p>
        {Object.values(filters).some(Boolean) && (
          <button
            onClick={() => setFilters({ gradeLevel: "", interest: "", identity: "", location: "", type: "", search: "" })}
            className="text-sm text-emerald-700 hover:underline"
          >
            {t.clearFilters[language]}
          </button>
        )}
      </div>

      {rankedOpportunities.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">{t.noResults[language]}</p>
          <p className="text-sm mt-1">{t.tryAdjusting[language]}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rankedOpportunities.map((scored) => (
            <OpportunityCard
              key={scored.opportunity.id}
              opportunity={scored.opportunity}
              firstGenMode={firstGenMode}
              scoreData={scored.scoreBreakdown}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <PageContainer>
      <Suspense fallback={<div className="text-center py-16 text-gray-400">Loading...</div>}>
        <OpportunitiesContent />
      </Suspense>
    </PageContainer>
  );
}
