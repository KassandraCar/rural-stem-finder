"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { t, languageOptions } from "@/data/translations";
import type { Language } from "@/data/translations";

const navLinks = [
  { href: "/",              key: "home" },
  { href: "/opportunities", key: "opportunities" },
  { href: "/dashboard",     key: "myDashboard" },
  { href: "/mentors",       key: "mentors" },
  { href: "/volunteer",     key: "volunteer" },
  { href: "/resources",     key: "resources" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const { firstGenMode, toggleFirstGenMode, language, setLanguage, saved, userLocation, setUserLocation } = useApp();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const openEdit = () => { setDraft(userLocation); setEditingLocation(true); };

  useEffect(() => {
    if (editingLocation) inputRef.current?.focus();
  }, [editingLocation]);

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const saveLocation = () => { setUserLocation(draft.trim()); setEditingLocation(false); };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveLocation();
    if (e.key === "Escape") setEditingLocation(false);
  };

  const currentLang = languageOptions.find((l) => l.code === language)!;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-emerald-700">
          <span className="text-2xl">🌱</span>
          <span className="hidden sm:inline">Rural STEM Finder</span>
        </Link>

        <div className="flex items-center gap-1 flex-wrap">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-emerald-100 text-emerald-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t[link.key][language]}
              {link.href === "/dashboard" && saved.length > 0 && (
                <span className="ml-1 bg-emerald-600 text-white text-xs rounded-full px-1.5 py-0.5">
                  {saved.length}
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Location pill */}
          {editingLocation ? (
            <div className="flex items-center gap-1">
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.locationPlaceholder[language]}
                className="text-xs border border-emerald-400 rounded-lg px-2.5 py-1.5 w-36 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                aria-label="Enter your location"
              />
              <button
                onClick={saveLocation}
                className="text-xs bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg font-medium hover:bg-emerald-700"
              >
                {t.save[language]}
              </button>
              <button
                onClick={() => setEditingLocation(false)}
                className="text-xs text-gray-400 hover:text-gray-600 px-1"
                aria-label="Cancel"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={openEdit}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium flex items-center gap-1"
              title={t.setLocation[language]}
            >
              📍 {userLocation || t.setLocation[language]}
            </button>
          )}

          {/* Language dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              onClick={() => setLangMenuOpen((o) => !o)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium flex items-center gap-1"
              aria-label="Select language"
            >
              {currentLang.flag} {currentLang.code.toUpperCase()} ▾
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[140px] z-50">
                {languageOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => { setLanguage(opt.code as Language); setLangMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 ${
                      language === opt.code ? "font-semibold text-emerald-700" : "text-gray-700"
                    }`}
                  >
                    {opt.flag} {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* First-Gen Mode toggle */}
          <button
            onClick={toggleFirstGenMode}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
              firstGenMode
                ? "bg-amber-100 border-amber-400 text-amber-800"
                : "border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
            aria-label="Toggle First-Gen friendly mode"
          >
            {firstGenMode ? `✓ ${t.firstGenMode[language]}` : t.firstGenMode[language]}
          </button>
        </div>
      </div>
    </nav>
  );
}
