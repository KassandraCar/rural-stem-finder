"use client";
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { volunteerOpportunities, categoryEmoji } from "@/data/volunteer";
import PageContainer from "@/components/PageContainer";
import { t, Language } from "@/data/translations";

const categoryColors: Record<string, string> = {
  tutoring: "bg-blue-100 text-blue-800",
  environment: "bg-emerald-100 text-emerald-800",
  community: "bg-amber-100 text-amber-800",
  stem: "bg-purple-100 text-purple-800",
  health: "bg-rose-100 text-rose-800",
  food: "bg-orange-100 text-orange-800",
};

function WhyVolunteerModal({ onClose, language }: { onClose: () => void; language: Language }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 flex flex-col gap-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-3xl mb-1">🌟</p>
            <h2 id="modal-title" className="text-xl font-bold text-gray-900">
              {language === "en" ? "Why volunteering matters for your future" :
               language === "es" ? "Por qué el voluntariado importa para tu futuro" :
               language === "vi" ? "Tại sao tình nguyện quan trọng cho tương lai của bạn" :
               language === "so" ? "Sababta iskaa wax u qabashu muhiim u tahay mustaqbalkaaga" :
               "Почему волонтёрство важно для вашего будущего"}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600 text-2xl leading-none mt-1">✕</button>
        </div>

        <div className="flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="font-semibold text-emerald-800 mb-1">
              {language === "en" ? "📄 It strengthens your resume" :
               language === "es" ? "📄 Fortalece tu currículum" :
               language === "vi" ? "📄 Nó củng cố hồ sơ của bạn" :
               language === "so" ? "📄 Waxay xoojisaa siiradaada" :
               "📄 Это укрепляет ваше резюме"}
            </p>
            <p>
              {language === "en" ? "Colleges and employers want to see that you care about your community. Even a few hours a month shows initiative and character — especially when you're just starting out." :
               language === "es" ? "Las universidades y empleadores quieren ver que te importa tu comunidad. Incluso unas pocas horas al mes muestran iniciativa y carácter." :
               language === "vi" ? "Các trường đại học và nhà tuyển dụng muốn thấy bạn quan tâm đến cộng đồng. Chỉ vài giờ mỗi tháng cũng thể hiện sự chủ động." :
               language === "so" ? "Jaamacadaha iyo shaqo-bixiyeyaashu waxay doonayaan inay arkaan inaad danaynayso bulshadaada." :
               "Колледжи и работодатели хотят видеть, что вы заботитесь о своём сообществе. Даже несколько часов в месяц показывают инициативу."}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="font-semibold text-blue-800 mb-1">
              {language === "en" ? "✍️ It gives you something to write about" :
               language === "es" ? "✍️ Te da algo sobre qué escribir" :
               language === "vi" ? "✍️ Nó cho bạn điều gì đó để viết" :
               language === "so" ? "✍️ Waxay kuu siisaa wax aad ku qorto" :
               "✍️ Это даёт вам о чём писать"}
            </p>
            <p>
              {language === "en" ? "College essays and scholarship applications ask about your experiences. Volunteering gives you real stories — moments where you made a difference — that stand out." :
               language === "es" ? "Los ensayos universitarios y las solicitudes de becas preguntan sobre tus experiencias. El voluntariado te da historias reales que destacan." :
               language === "vi" ? "Bài luận đại học và đơn xin học bổng hỏi về kinh nghiệm của bạn. Tình nguyện cho bạn những câu chuyện thực sự nổi bật." :
               language === "so" ? "Qoraalada jaamacadda iyo codsiyada deeqaha waxay ka weydiin karaan khibradahaaga. Iskaa wax u qabashu waxay kuu siisaa sheekooyin dhabta ah." :
               "Эссе для колледжа и заявки на стипендии спрашивают о вашем опыте. Волонтёрство даёт вам реальные истории, которые выделяются."}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="font-semibold text-amber-800 mb-1">
              {language === "en" ? "🤝 It builds your network" :
               language === "es" ? "🤝 Construye tu red de contactos" :
               language === "vi" ? "🤝 Nó xây dựng mạng lưới của bạn" :
               language === "so" ? "🤝 Waxay dhisaa shabakadaada" :
               "🤝 Это строит вашу сеть"}
            </p>
            <p>
              {language === "en" ? "The people you meet while volunteering — supervisors, fellow volunteers, community members — can become mentors, references, and connections that open doors." :
               language === "es" ? "Las personas que conoces mientras haces voluntariado pueden convertirse en mentores, referencias y conexiones que abren puertas." :
               language === "vi" ? "Những người bạn gặp khi tình nguyện có thể trở thành người hướng dẫn, tài liệu tham khảo và kết nối mở ra cơ hội." :
               language === "so" ? "Dadka aad la kulanto markaad iskaa wax u qabanayso waxay noqon karaan macallimiin, tixraacyo, iyo xiriirro furaya albaabada." :
               "Люди, которых вы встречаете во время волонтёрства, могут стать наставниками, рекомендателями и связями, открывающими двери."}
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="font-semibold text-purple-800 mb-1">
              {language === "en" ? "🔬 It helps you explore STEM in the real world" :
               language === "es" ? "🔬 Te ayuda a explorar STEM en el mundo real" :
               language === "vi" ? "🔬 Nó giúp bạn khám phá STEM trong thế giới thực" :
               language === "so" ? "🔬 Waxay kaa caawisaa sahaminta STEM adduunka dhabta ah" :
               "🔬 Это помогает вам исследовать STEM в реальном мире"}
            </p>
            <p>
              {language === "en" ? "Volunteering in science fairs, environmental projects, or health organizations lets you test your interests before committing to a major or career path." :
               language === "es" ? "El voluntariado en ferias de ciencias, proyectos ambientales u organizaciones de salud te permite probar tus intereses antes de comprometerte con una carrera." :
               language === "vi" ? "Tình nguyện tại hội chợ khoa học, dự án môi trường hoặc tổ chức y tế cho phép bạn thử nghiệm sở thích trước khi chọn ngành." :
               language === "so" ? "Iskaa wax u qabashu xafladaha sayniska, mashaariicda deegaanka, ama hay'adaha caafimaadka waxay kuu oggolaanaysaa inaad tijaabiso xiisahaaga." :
               "Волонтёрство на научных ярмарках, экологических проектах или в организациях здравоохранения позволяет проверить свои интересы."}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-center"
        >
          {t.gotIt[language]}
        </button>
      </div>
    </div>
  );
}

export default function VolunteerPage() {
  const { language, userLocation } = useApp();
  const [showModal, setShowModal] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [remoteFilter, setRemoteFilter] = useState<"all" | "remote" | "in-person">("all");

  const locationLower = userLocation.toLowerCase();

  const localOpps = volunteerOpportunities.filter(
    (o) => o.locationKeywords.length > 0 && o.locationKeywords.some((kw) => locationLower.includes(kw))
  );
  const remoteOpps = volunteerOpportunities.filter((o) => o.locationKeywords.length === 0);

  const allFiltered = volunteerOpportunities.filter((o) => {
    const matchesLocation =
      o.locationKeywords.length === 0 ||
      (locationLower && o.locationKeywords.some((kw) => locationLower.includes(kw)));
    const matchesCategory = !categoryFilter || o.category === categoryFilter;
    const matchesRemote =
      remoteFilter === "all" ||
      (remoteFilter === "remote" && o.remote) ||
      (remoteFilter === "in-person" && !o.remote);
    return matchesLocation && matchesCategory && matchesRemote;
  });

  const categories = [...new Set(volunteerOpportunities.map((o) => o.category))];

  return (
    <PageContainer>
    <>
      {showModal && <WhyVolunteerModal onClose={() => setShowModal(false)} language={language} />}

      <div className="flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t.volunteerTitle[language]}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {t.volunteerSubtitle[language]}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm bg-amber-50 border border-amber-300 text-amber-800 font-medium px-4 py-2 rounded-xl hover:bg-amber-100 transition-colors flex items-center gap-2"
          >
            🌟 {t.whyVolunteer[language]}
          </button>
        </div>

        {/* Location context banner */}
        {userLocation ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm text-emerald-800">
              📍 {t.showingNear[language]} {userLocation} {t.plusRemote[language]}
              {localOpps.length > 0 && (
                <span className="ml-2 bg-emerald-200 text-emerald-900 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {localOpps.length} {t.localMatches[language]}
                </span>
              )}
            </p>
            <Link href="/" className="text-xs text-emerald-700 hover:underline">
              {t.changeLocation[language]}
            </Link>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm text-amber-800">
              📍 {t.setLocationNav[language]}
            </p>
            <Link href="/" className="text-xs text-amber-700 hover:underline font-medium">
              {t.setLocation[language]} →
            </Link>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setCategoryFilter(""); setRemoteFilter("all"); }}
            className={`text-sm px-3 py-1.5 rounded-xl border font-medium transition-colors ${!categoryFilter && remoteFilter === "all" ? "bg-emerald-600 text-white border-transparent" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`}
          >
            {t.all[language]}
          </button>
          <button
            onClick={() => setRemoteFilter(remoteFilter === "remote" ? "all" : "remote")}
            className={`text-sm px-3 py-1.5 rounded-xl border font-medium transition-colors ${remoteFilter === "remote" ? "bg-emerald-600 text-white border-transparent" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`}
          >
            🌐 {t.remoteOnly[language]}
          </button>
          <button
            onClick={() => setRemoteFilter(remoteFilter === "in-person" ? "all" : "in-person")}
            className={`text-sm px-3 py-1.5 rounded-xl border font-medium transition-colors ${remoteFilter === "in-person" ? "bg-emerald-600 text-white border-transparent" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`}
          >
            🏘️ {t.inPersonOnly[language]}
          </button>
          <div className="w-px bg-gray-200 self-stretch mx-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat === categoryFilter ? "" : cat)}
              className={`text-sm px-3 py-1.5 rounded-xl border font-medium transition-colors ${categoryFilter === cat ? "bg-emerald-600 text-white border-transparent" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`}
            >
              {categoryEmoji[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Results */}
        <p className="text-sm text-gray-500">
          {allFiltered.length} {t.opportunitiesCount[language]}
        </p>

        {allFiltered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">{t.noResultsFilters[language]}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allFiltered.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[o.category]}`}>
                    {categoryEmoji[o.category]} {o.category}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.remote ? "bg-sky-100 text-sky-700" : "bg-gray-100 text-gray-600"}`}>
                    {o.remote ? `🌐 ${t.remote[language]}` : `📍 ${t.inPerson[language]}`}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-base leading-snug">{o.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{o.organization}</p>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed flex-1">{o.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {o.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">#{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">⏱ {o.commitment}</span>
                  <a
                    href={o.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                  >
                    {t.learnMore[language]}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips callout */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col gap-2">
          <p className="font-semibold text-blue-900 text-sm">
            💡 {t.proTip[language]}
          </p>
          <p className="text-sm text-blue-800 leading-relaxed">
            {t.proTipBody[language]}
          </p>
        </div>
      </div>
    </>
    </PageContainer>
  );
}
