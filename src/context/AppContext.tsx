"use client";
import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import type { Language } from "@/data/translations";

type ApplicationStatus = "not-started" | "in-progress" | "applied";

export type StudentProfile = {
  name: string;
  gradeLevel: "high-school" | "college" | "";
  interests: string[];
  onboarded: boolean; // true once the welcome quiz is finished or skipped
};

const emptyProfile: StudentProfile = { name: "", gradeLevel: "", interests: [], onboarded: false };

type AppContextType = {
  saved: string[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  statuses: Record<string, ApplicationStatus>;
  setStatus: (id: string, status: ApplicationStatus) => void;
  firstGenMode: boolean;
  toggleFirstGenMode: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  userLocation: string;
  setUserLocation: (loc: string) => void;
  profile: StudentProfile;
  setProfile: (p: StudentProfile) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  // Only create supabase client when configured (memoized so effects can depend on it)
  const supabase = useMemo(() => (isSupabaseConfigured() ? createClient()! : null), []);

  const [saved, setSaved] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<Record<string, ApplicationStatus>>({});
  const [firstGenMode, setFirstGenMode] = useState(false);
  const [language, setLanguageState] = useState<Language>("en");
  const [userLocation, setUserLocationState] = useState("");
  const [profile, setProfileState] = useState<StudentProfile>(emptyProfile);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load from Supabase if logged in, else localStorage
  useEffect(() => {
    if (user && supabase) {
      supabase
        .from("user_progress")
        .select("saved, statuses, location, first_gen_mode, language, profile")
        .eq("user_id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            if (data.saved) setSaved(data.saved);
            if (data.statuses) setStatuses(data.statuses);
            if (data.location) setUserLocationState(data.location);
            if (data.first_gen_mode != null) setFirstGenMode(data.first_gen_mode);
            if (data.language) setLanguageState(data.language as Language);
            const p = (data.profile as StudentProfile | null) || emptyProfile;
            setProfileState(p);
            if (!p.onboarded) setShowOnboarding(true);
          }
        });
    } else {
      // Fallback to localStorage. Hydrate in a microtask so state updates
      // happen asynchronously (same as the Supabase branch above).
      queueMicrotask(() => {
        const s = localStorage.getItem("saved");
        const st = localStorage.getItem("statuses");
        const fg = localStorage.getItem("firstGenMode");
        const lang = localStorage.getItem("language");
        const loc = localStorage.getItem("userLocation");
        const p = localStorage.getItem("profile");
        if (s) setSaved(JSON.parse(s));
        if (st) setStatuses(JSON.parse(st));
        if (fg) setFirstGenMode(JSON.parse(fg));
        if (lang) setLanguageState(JSON.parse(lang) as Language);
        if (loc) setUserLocationState(loc);
        const parsed: StudentProfile = p ? JSON.parse(p) : emptyProfile;
        setProfileState(parsed);
        if (!parsed.onboarded) setShowOnboarding(true);
      });
    }
  }, [user, supabase]);

  // Persist to Supabase or localStorage
  const persist = async (patch: Record<string, unknown>) => {
    if (user && supabase) {
      await supabase.from("user_progress").upsert({ user_id: user.id, ...patch });
    }
  };

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      if (!user || !supabase) localStorage.setItem("saved", JSON.stringify(next));
      else persist({ saved: next });
      return next;
    });
  };

  const isSaved = (id: string) => saved.includes(id);

  const setStatus = (id: string, status: ApplicationStatus) => {
    setStatuses((prev) => {
      const next = { ...prev, [id]: status };
      if (!user || !supabase) localStorage.setItem("statuses", JSON.stringify(next));
      else persist({ statuses: next });
      return next;
    });
  };

  const toggleFirstGenMode = () => {
    setFirstGenMode((prev) => {
      if (!user || !supabase) localStorage.setItem("firstGenMode", JSON.stringify(!prev));
      else persist({ first_gen_mode: !prev });
      return !prev;
    });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (!user || !supabase) localStorage.setItem("language", JSON.stringify(lang));
    else persist({ language: lang });
  };

  const setProfile = (p: StudentProfile) => {
    setProfileState(p);
    if (!user || !supabase) localStorage.setItem("profile", JSON.stringify(p));
    else persist({ profile: p });
  };

  const setUserLocation = (loc: string) => {
    setUserLocationState(loc);
    if (!user || !supabase) localStorage.setItem("userLocation", loc);
    else persist({ location: loc });
  };

  return (
    <AppContext.Provider value={{
      saved, toggleSave, isSaved,
      statuses, setStatus,
      firstGenMode, toggleFirstGenMode,
      language: language as Language, setLanguage,
      userLocation, setUserLocation,
      profile, setProfile,
      showOnboarding, setShowOnboarding,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
