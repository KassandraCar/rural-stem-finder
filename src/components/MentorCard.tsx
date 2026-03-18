"use client";
import { useState } from "react";
import { Mentor } from "@/data/mentors";
import { buildLinkedInProfileSearch, getColdOutreachTemplate } from "@/lib/linkedin";
import { useApp } from "@/context/AppContext";
import { t } from "@/data/translations";

type Props = { mentor: Mentor };

const avatarColors = ["bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-amber-500", "bg-rose-500"];

export default function MentorCard({ mentor }: Props) {
  const { language, userLocation } = useApp();
  const colorIndex = parseInt(mentor.id) % avatarColors.length;
  const [showTemplate, setShowTemplate] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Use real linkedInUrl if available, otherwise fall back to search
  const linkedInUrl = mentor.linkedInUrl || buildLinkedInProfileSearch(mentor.name, mentor.role, mentor.company);
  const isDirectProfile = !!mentor.linkedInUrl;

  const template = getColdOutreachTemplate(
    mentor.name.split(" ")[0],
    "[Your name]",
    mentor.interests[0],
    userLocation || "a rural community"
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`${avatarColors[colorIndex]} text-white font-bold text-lg w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
          {mentor.avatar}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{mentor.name}</h3>
          <p className="text-sm text-gray-500">{mentor.role} · {mentor.company}</p>
        </div>
      </div>

      {/* Featured note */}
      {mentor.featuredNote && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
          ⭐ {mentor.featuredNote}
        </p>
      )}

      {/* Bio */}
      <p className="text-sm text-gray-700 leading-relaxed">{mentor.bio}</p>

      {/* About (expandable) */}
      {mentor.about && (
        <div>
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="text-xs text-emerald-700 hover:underline flex items-center gap-1"
          >
            {showAbout
              ? t.hideAbout[language]
              : `▸ ${language === "en" ? "About" : language === "es" ? "Sobre" : language === "vi" ? "Về" : language === "so" ? "Ku saabsan" : "О"} ${mentor.name.split(" ")[0]}`}
          </button>
          {showAbout && (
            <p className="text-xs text-gray-600 leading-relaxed mt-2 border-l-2 border-emerald-200 pl-3">
              {mentor.about}
            </p>
          )}
        </div>
      )}

      {/* Interest tags */}
      <div className="flex flex-wrap gap-1.5">
        {mentor.interests.map((interest) => (
          <span key={interest} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
            {interest}
          </span>
        ))}
      </div>

      {/* Location + first-gen */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-500">📍 {mentor.location}</span>
        {mentor.firstGen && (
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
            First-Gen
          </span>
        )}
      </div>

      {/* LinkedIn + outreach */}
      <div className="flex flex-col gap-2 pt-1">
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          aria-label={`${isDirectProfile ? "View" : "Find"} ${mentor.name} on LinkedIn`}
        >
          <LinkedInIcon />
          {isDirectProfile ? t.viewLinkedIn[language] : t.findLinkedIn[language]}
        </a>

        <button
          onClick={() => setShowTemplate(!showTemplate)}
          className="text-xs text-center text-emerald-700 hover:underline"
        >
          {showTemplate ? t.hideTemplate[language] : t.messageTemplate[language]}
        </button>

        {showTemplate && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              {t.copyPasteLinkedIn[language]}
            </p>
            <pre className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{template}</pre>
            <button
              onClick={() => navigator.clipboard.writeText(template)}
              className="text-xs bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg font-medium self-start transition-colors"
            >
              {t.copyClipboard[language]}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
