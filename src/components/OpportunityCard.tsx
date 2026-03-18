"use client";
import Link from "next/link";
import { Opportunity } from "@/data/opportunities";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

const typeColors: Record<string, string> = {
  scholarship: "bg-blue-100 text-blue-800",
  internship: "bg-purple-100 text-purple-800",
  program: "bg-emerald-100 text-emerald-800",
  mentorship: "bg-amber-100 text-amber-800",
  "college-prep": "bg-rose-100 text-rose-800",
};

const locationLabels: Record<string, string> = {
  remote: "🌐 Remote",
  washington: "🏔️ Washington",
  national: "🇺🇸 National",
};

function daysUntil(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: "Deadline passed", urgent: false, passed: true };
  if (days <= 14) return { label: `${days} days left`, urgent: true, passed: false };
  return { label: new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), urgent: false, passed: false };
}

// Generate helpful first-gen tips based on opportunity type
function getFirstGenTip(opportunity: Opportunity): string | null {
  if (opportunity.type === "scholarship") {
    return "💡 Tip: Most scholarships are free to apply. Don't let application fees discourage you—many have fee waivers!";
  }
  if (opportunity.type === "college-prep" || opportunity.type === "mentorship") {
    return "💡 Tip: These programs are designed to help first-gen students navigate the college process. Don't hesitate to ask questions!";
  }
  if (opportunity.tags.includes("fully-funded") || opportunity.tags.includes("free")) {
    return "💡 Tip: This opportunity covers all costs, so finances shouldn't hold you back from applying.";
  }
  if (opportunity.location === "remote") {
    return "💡 Tip: Remote means you can participate from anywhere—perfect if you're in a rural area!";
  }
  return null;
}

type ScoreBreakdown = {
  profileScore: number;
  locationScore: number;
  valueScore: number;
  firstGenBonus?: number;
  bonuses: string[];
  isFirstGenFriendly?: boolean;
};

type Props = {
  opportunity: Opportunity;
  firstGenMode?: boolean;
  scoreData?: ScoreBreakdown;
};

export default function OpportunityCard({ opportunity, firstGenMode, scoreData }: Props) {
  const { toggleSave, isSaved } = useApp();
  const saved = isSaved(opportunity.id);
  const deadline = daysUntil(opportunity.deadline);
  const [showScoreDetails, setShowScoreDetails] = useState(false);

  // Calculate total score and match level
  const totalScore = scoreData
    ? scoreData.profileScore + scoreData.locationScore + scoreData.valueScore
    : 0;

  const getMatchLevel = (score: number) => {
    if (score >= 70) return { label: "Excellent Match", color: "text-emerald-700", bgColor: "bg-emerald-50" };
    if (score >= 50) return { label: "Good Match", color: "text-blue-700", bgColor: "bg-blue-50" };
    if (score >= 30) return { label: "Possible Match", color: "text-amber-700", bgColor: "bg-amber-50" };
    return { label: "Consider", color: "text-gray-600", bgColor: "bg-gray-50" };
  };

  const matchLevel = getMatchLevel(totalScore);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[opportunity.type]}`}>
            {opportunity.type.replace("-", " ")}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {locationLabels[opportunity.location]}
          </span>
          {scoreData?.isFirstGenFriendly && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              ✨ First-Gen Friendly
            </span>
          )}
          {scoreData && (
            <button
              onClick={() => setShowScoreDetails(!showScoreDetails)}
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${matchLevel.bgColor} ${matchLevel.color} hover:opacity-80 transition-opacity cursor-pointer`}
              title="Click to see match details"
            >
              ✓ {matchLevel.label}
            </button>
          )}
        </div>
        <button
          onClick={() => toggleSave(opportunity.id)}
          aria-label={saved ? "Remove bookmark" : "Bookmark this opportunity"}
          className={`text-xl transition-transform hover:scale-110 ${saved ? "text-amber-500" : "text-gray-300 hover:text-amber-400"}`}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>

      {/* Score Details Dropdown */}
      {showScoreDetails && scoreData && (
        <div className="bg-gray-50 rounded-lg p-3 text-xs border border-gray-200">
          <div className="font-semibold text-gray-700 mb-2">Why this matches you:</div>
          <div className="space-y-1">
            {scoreData.bonuses.length > 0 ? (
              scoreData.bonuses.map((bonus, idx) => (
                <div key={idx} className="text-gray-600 flex items-start gap-1">
                  <span className="text-emerald-600">•</span>
                  <span>{bonus}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">No specific matches - general opportunity</div>
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200 text-gray-500 text-[10px]">
            Score: {totalScore}/100+ (Profile: {scoreData.profileScore} | Location: {scoreData.locationScore} | Value: {scoreData.valueScore}
            {scoreData.firstGenBonus && scoreData.firstGenBonus > 0 && ` | First-Gen: +${scoreData.firstGenBonus}`})
          </div>
        </div>
      )}

      <div>
        <h3 className="font-bold text-gray-900 text-base leading-snug">{opportunity.title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{opportunity.organization}</p>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">
        {opportunity.description}
      </p>

      {/* First-Gen Mode: Show helpful tips */}
      {firstGenMode && getFirstGenTip(opportunity) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-900">
          {getFirstGenTip(opportunity)}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {opportunity.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <span className={`text-xs font-medium ${deadline.urgent ? "text-red-600" : deadline.passed ? "text-gray-400" : "text-gray-500"}`}>
          📅 {deadline.label}
        </span>
        <Link
          href={`/opportunities/${opportunity.id}`}
          className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
        >
          View details →
        </Link>
      </div>
    </div>
  );
}
