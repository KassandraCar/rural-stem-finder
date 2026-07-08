"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import type { Language } from "@/data/translations";

const INTERESTS = [
  "computer science", "engineering", "biology", "math",
  "neuroscience", "chemistry", "physics",
] as const;

const INTEREST_EMOJI: Record<string, string> = {
  "computer science": "💻", engineering: "⚙️", biology: "🧬", math: "📐",
  neuroscience: "🧠", chemistry: "🧪", physics: "🔭",
};

type Copy = {
  welcome: string; welcomeSub: string; nameQ: string; namePlaceholder: string;
  gradeQ: string; highSchool: string; college: string;
  interestsQ: string; interestsSub: string;
  locationQ: string; locationSub: string; locationPlaceholder: string;
  next: string; back: string; finish: string; skip: string;
};

const copy: Record<Language, Copy> = {
  en: {
    welcome: "Welcome! 🌱", welcomeSub: "Answer 4 quick questions so we can find the STEM opportunities that fit YOU. You can skip this and do it later.",
    nameQ: "What should we call you?", namePlaceholder: "Your first name",
    gradeQ: "Where are you in school?", highSchool: "High School", college: "College",
    interestsQ: "What are you curious about?", interestsSub: "Pick as many as you like.",
    locationQ: "Where do you live?", locationSub: "We'll surface local programs first — remote ones always show.",
    locationPlaceholder: "e.g. Yakima, WA",
    next: "Next", back: "Back", finish: "Show my opportunities ✨", skip: "Skip for now",
  },
  es: {
    welcome: "¡Bienvenido! 🌱", welcomeSub: "Responde 4 preguntas rápidas para encontrar las oportunidades STEM hechas para TI. Puedes omitirlo y hacerlo después.",
    nameQ: "¿Cómo te llamamos?", namePlaceholder: "Tu nombre",
    gradeQ: "¿En qué etapa escolar estás?", highSchool: "Preparatoria", college: "Universidad",
    interestsQ: "¿Qué te da curiosidad?", interestsSub: "Elige todas las que quieras.",
    locationQ: "¿Dónde vives?", locationSub: "Mostraremos primero los programas locales — los remotos siempre aparecen.",
    locationPlaceholder: "ej. Yakima, WA",
    next: "Siguiente", back: "Atrás", finish: "Ver mis oportunidades ✨", skip: "Omitir por ahora",
  },
  vi: {
    welcome: "Chào mừng! 🌱", welcomeSub: "Trả lời 4 câu hỏi nhanh để chúng tôi tìm cơ hội STEM phù hợp với BẠN. Bạn có thể bỏ qua và làm sau.",
    nameQ: "Chúng tôi nên gọi bạn là gì?", namePlaceholder: "Tên của bạn",
    gradeQ: "Bạn đang học ở cấp nào?", highSchool: "Trung học", college: "Đại học",
    interestsQ: "Bạn tò mò về điều gì?", interestsSub: "Chọn bao nhiêu tùy thích.",
    locationQ: "Bạn sống ở đâu?", locationSub: "Chương trình địa phương sẽ hiện trước — chương trình từ xa luôn hiển thị.",
    locationPlaceholder: "vd. Yakima, WA",
    next: "Tiếp", back: "Quay lại", finish: "Xem cơ hội của tôi ✨", skip: "Bỏ qua",
  },
  so: {
    welcome: "Soo dhawoow! 🌱", welcomeSub: "Ka jawaab 4 su'aalood oo degdeg ah si aan kuu helno fursadaha STEM ee KUU habboon. Waad iska dhaafi kartaa oo mar dambe samayn kartaa.",
    nameQ: "Maxaan kugu naadaa?", namePlaceholder: "Magacaaga hore",
    gradeQ: "Halkee ayaad dugsiga kaga jirtaa?", highSchool: "Dugsiga Sare", college: "Jaamacadda",
    interestsQ: "Maxaad xiisaynaysaa?", interestsSub: "Dooro inta aad rabto.",
    locationQ: "Halkee ayaad ku nooshahay?", locationSub: "Barnaamijyada deegaanka ayaa marka hore soo bixi doona — kuwa fogaan ahaan mar walba way muuqdaan.",
    locationPlaceholder: "tusaale. Yakima, WA",
    next: "Xiga", back: "Dib u noqo", finish: "Ii tus fursadahayga ✨", skip: "Iska dhaaf hadda",
  },
  ru: {
    welcome: "Добро пожаловать! 🌱", welcomeSub: "Ответьте на 4 быстрых вопроса, чтобы мы нашли STEM-возможности именно для ВАС. Можно пропустить и вернуться позже.",
    nameQ: "Как к вам обращаться?", namePlaceholder: "Ваше имя",
    gradeQ: "Где вы учитесь?", highSchool: "Старшая школа", college: "Колледж/Университет",
    interestsQ: "Что вам интересно?", interestsSub: "Выберите сколько угодно.",
    locationQ: "Где вы живёте?", locationSub: "Сначала покажем местные программы — удалённые видны всегда.",
    locationPlaceholder: "напр. Yakima, WA",
    next: "Далее", back: "Назад", finish: "Показать мои возможности ✨", skip: "Пропустить",
  },
};

export default function OnboardingQuiz() {
  const { language, profile, setProfile, userLocation, setUserLocation, showOnboarding, setShowOnboarding } = useApp();
  const c = copy[language] ?? copy.en;

  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile.name);
  const [gradeLevel, setGradeLevel] = useState<"high-school" | "college" | "">(profile.gradeLevel);
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [location, setLocation] = useState(userLocation);

  if (!showOnboarding) return null;

  const toggleInterest = (i: string) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const finish = (skipped: boolean) => {
    if (!skipped) {
      setProfile({ name: name.trim(), gradeLevel, interests, onboarded: true });
      if (location.trim()) setUserLocation(location.trim());
    } else {
      setProfile({ ...profile, onboarded: true });
    }
    setShowOnboarding(false);
    setStep(0);
  };

  const steps = [
    // Step 0: name
    <div key="name" className="flex flex-col gap-3">
      <h2 className="text-xl font-bold text-gray-900">{c.welcome}</h2>
      <p className="text-sm text-gray-500">{c.welcomeSub}</p>
      <label className="text-sm font-semibold text-gray-700 mt-2">{c.nameQ}</label>
      <input
        autoFocus type="text" value={name} onChange={(e) => setName(e.target.value)}
        placeholder={c.namePlaceholder}
        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
    </div>,
    // Step 1: grade level
    <div key="grade" className="flex flex-col gap-3">
      <h2 className="text-xl font-bold text-gray-900">{c.gradeQ}</h2>
      <div className="grid grid-cols-2 gap-3 mt-2">
        {([["high-school", "🎒", c.highSchool], ["college", "🎓", c.college]] as const).map(([value, emoji, label]) => (
          <button key={value} onClick={() => setGradeLevel(value)}
            className={`rounded-2xl border-2 p-5 text-center transition-colors ${
              gradeLevel === value ? "border-emerald-500 bg-emerald-50" : "border-gray-200 bg-white hover:border-gray-300"
            }`}>
            <span className="text-3xl block mb-1">{emoji}</span>
            <span className="text-sm font-semibold text-gray-800">{label}</span>
          </button>
        ))}
      </div>
    </div>,
    // Step 2: interests
    <div key="interests" className="flex flex-col gap-3">
      <h2 className="text-xl font-bold text-gray-900">{c.interestsQ}</h2>
      <p className="text-sm text-gray-500">{c.interestsSub}</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {INTERESTS.map((i) => (
          <button key={i} onClick={() => toggleInterest(i)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              interests.includes(i)
                ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
            }`}>
            {INTEREST_EMOJI[i]} {i.charAt(0).toUpperCase() + i.slice(1)}
          </button>
        ))}
      </div>
    </div>,
    // Step 3: location
    <div key="location" className="flex flex-col gap-3">
      <h2 className="text-xl font-bold text-gray-900">{c.locationQ}</h2>
      <p className="text-sm text-gray-500">{c.locationSub}</p>
      <input
        autoFocus type="text" value={location} onChange={(e) => setLocation(e.target.value)}
        placeholder={c.locationPlaceholder}
        className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 mt-2"
      />
    </div>,
  ];

  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 sm:p-8 flex flex-col gap-6">
        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center">
          {steps.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-emerald-500" : "w-1.5 bg-gray-200"}`} />
          ))}
        </div>

        {steps[step]}

        <div className="flex items-center justify-between gap-3">
          <button onClick={() => finish(true)} className="text-xs text-gray-400 hover:text-gray-600">
            {c.skip}
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50">
                {c.back}
              </button>
            )}
            <button onClick={() => (isLast ? finish(false) : setStep(step + 1))}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700">
              {isLast ? c.finish : c.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
