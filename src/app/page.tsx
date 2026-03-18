"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { opportunities } from "@/data/opportunities";

// Featured opportunity IDs — a scholarship, internship, and local program
const FEATURED_IDS = ["2", "3", "4"];

const typeColors: Record<string, string> = {
  scholarship: "bg-amber-100 text-amber-800",
  internship: "bg-purple-100 text-purple-800",
  program: "bg-emerald-100 text-emerald-800",
  mentorship: "bg-blue-100 text-blue-800",
  "college-prep": "bg-rose-100 text-rose-800",
};

function daysUntil(deadline: string) {
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (days < 0) return null;
  if (days <= 30) return `${days}d left`;
  return new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function HomePage() {
  const { language, userLocation } = useApp();
  const featured = FEATURED_IDS.map((id) => opportunities.find((o) => o.id === id)).filter(Boolean) as typeof opportunities;

  type HomeCopy = {
    locationBadge: string; heroEyebrow: string; headline: string; headlineSub: string;
    body: string; cta: string; ctaSecondary: string; whyTitle: string; whyBody: string;
    whyExtra: string; whyLink: string; featuredTitle: string; featuredSub: string;
    featuredLink: string; founderTitle: string; founderBody: string; founderSig: string;
    statsLabel: string[]; browseTitle: string;
    startExploring: string; readGuides: string;
  };

  const copy: Record<typeof language, HomeCopy> = {
    en: {
      locationBadge: userLocation ? `📍 ${userLocation}` : "📍 Rural Communities",
      heroEyebrow: "Free. No connections required. Built for you.",
      headline: "You belong in STEM.",
      headlineSub: "We're just here to help you get there.",
      body: "Growing up in a rural area shouldn't limit where you end up. This tool was built to make sure students from small towns have the same shot at scholarships, internships, and STEM careers as anyone else.",
      cta: "Find opportunities", ctaSecondary: "My saved list",
      whyTitle: "Why this exists",
      whyBody: "Most STEM opportunity databases are built for students who already have access. This one isn't. It's built specifically for students in rural communities who are figuring it out on their own.",
      whyExtra: "If you're the first in your family to think about college, if your school doesn't have a dedicated counselor — this is for you.",
      whyLink: "Read our step-by-step guides →",
      featuredTitle: "Opportunities worth knowing about", featuredSub: "A few we think every rural student should see.", featuredLink: "See all opportunities →",
      founderTitle: "A note from the community",
      founderBody: "This project started because students in Central Washington — in towns like Sunnyside, Wapato, and Granger — kept missing out on programs they were fully qualified for. Not because they weren't good enough. Because nobody told them the programs existed.\n\nWe built this to change that. Every resource here is free. Every guide is written in plain language. And if something's confusing, that's on us to fix.",
      founderSig: "— Built for rural students, by people who grew up here",
      statsLabel: ["opportunities", "mentors", "guides"],
      browseTitle: "Browse by what you need", startExploring: "Start exploring →", readGuides: "Read the guides",
    },
    es: {
      locationBadge: userLocation ? `📍 ${userLocation}` : "📍 Comunidades Rurales",
      heroEyebrow: "Gratis. Sin conexiones necesarias. Hecho para ti.",
      headline: "Tú perteneces al STEM.", headlineSub: "Estamos aquí para ayudarte a llegar.",
      body: "Crecer en un área rural no debería limitar a dónde llegas. Esta herramienta fue creada para que los estudiantes de pueblos pequeños tengan las mismas oportunidades.",
      cta: "Encontrar oportunidades", ctaSecondary: "Mi lista guardada",
      whyTitle: "Por qué existe esto",
      whyBody: "La mayoría de las bases de datos STEM están hechas para estudiantes que ya tienen acceso. Esta no. Está hecha para estudiantes en comunidades rurales que lo están descubriendo por su cuenta.",
      whyExtra: "Si eres el primero en tu familia en pensar en la universidad, si tu escuela no tiene un consejero dedicado — esto es para ti.",
      whyLink: "Lee nuestras guías paso a paso →",
      featuredTitle: "Oportunidades que vale la pena conocer", featuredSub: "Algunas que creemos que todo estudiante rural debería ver.", featuredLink: "Ver todas las oportunidades →",
      founderTitle: "Una nota de la comunidad",
      founderBody: "Este proyecto comenzó porque los estudiantes en el centro de Washington seguían perdiendo programas para los que estaban completamente calificados. No porque no fueran suficientemente buenos. Porque nadie les dijo que los programas existían.",
      founderSig: "— Construido para estudiantes rurales, por personas que crecieron aquí",
      statsLabel: ["oportunidades", "mentores", "guías"],
      browseTitle: "Explora por lo que necesitas", startExploring: "Empezar a explorar →", readGuides: "Leer las guías",
    },
    vi: {
      locationBadge: userLocation ? `📍 ${userLocation}` : "📍 Cộng đồng nông thôn",
      heroEyebrow: "Miễn phí. Không cần quan hệ. Dành cho bạn.",
      headline: "Bạn thuộc về STEM.", headlineSub: "Chúng tôi ở đây để giúp bạn đến đó.",
      body: "Lớn lên ở vùng nông thôn không nên giới hạn tương lai của bạn. Công cụ này được tạo ra để học sinh từ các thị trấn nhỏ có cơ hội như bất kỳ ai.",
      cta: "Tìm cơ hội", ctaSecondary: "Danh sách đã lưu",
      whyTitle: "Tại sao có công cụ này",
      whyBody: "Hầu hết cơ sở dữ liệu cơ hội STEM được xây dựng cho học sinh đã có sẵn điều kiện. Cái này thì không. Nó được xây dựng đặc biệt cho học sinh ở cộng đồng nông thôn.",
      whyExtra: "Nếu bạn là người đầu tiên trong gia đình nghĩ đến đại học, nếu trường bạn không có cố vấn — đây là dành cho bạn.",
      whyLink: "Đọc hướng dẫn từng bước →",
      featuredTitle: "Cơ hội đáng biết", featuredSub: "Một số cơ hội mà mọi học sinh nông thôn nên xem.", featuredLink: "Xem tất cả cơ hội →",
      founderTitle: "Một lời từ cộng đồng",
      founderBody: "Dự án này bắt đầu vì học sinh ở miền Trung Washington liên tục bỏ lỡ các chương trình mà họ hoàn toàn đủ điều kiện. Không phải vì họ không đủ giỏi. Vì không ai nói với họ rằng các chương trình đó tồn tại.\n\nChúng tôi xây dựng điều này để thay đổi điều đó. Mọi tài nguyên ở đây đều miễn phí.",
      founderSig: "— Xây dựng cho học sinh nông thôn, bởi những người lớn lên ở đây",
      statsLabel: ["cơ hội", "người hướng dẫn", "hướng dẫn"],
      browseTitle: "Duyệt theo nhu cầu của bạn", startExploring: "Bắt đầu khám phá →", readGuides: "Đọc hướng dẫn",
    },
    so: {
      locationBadge: userLocation ? `📍 ${userLocation}` : "📍 Bulshada Reer Miyiga",
      heroEyebrow: "Bilaash. Xiriir looma baahna. Kuu dhisan.",
      headline: "Adigu waxaad u taagan tahay STEM.", headlineSub: "Waxaan halkan u joogna inaan kaa caawino.",
      body: "Ku koraynta goob miyiga ah ma aha inay xaddiddo mustaqbalkaaga. Qalabkan waxaa loo dhisay si ardayda tuulooyinka yaryar ay u helaan fursad siman.",
      cta: "Raadi fursadaha", ctaSecondary: "Liistayda la keydsaday",
      whyTitle: "Sababta uu jiro",
      whyBody: "Inta badan xogta fursadaha STEM waxaa loo dhisay ardayda horeba u leh helitaanka. Kan ma aha sidaas. Waxaa gaar loogu dhisay ardayda bulshada reer miyiga.",
      whyExtra: "Haddaad tahay kii ugu horeeyay ee qoyskaaga ka fikiray jaamacadda, haddaan dugsigaagu lahayn la-taliye — kani waa kuu ah.",
      whyLink: "Akhri tilmaamaha tallaabo-tallaabo →",
      featuredTitle: "Fursadaha muhiimka ah", featuredSub: "Kuwo aan u maleynno in ardayga reer miyiga oo dhan arko.", featuredLink: "Arag dhammaan fursadaha →",
      founderTitle: "Farriin ka timid bulshada",
      founderBody: "Mashruucan wuxuu bilaabmay sababtoo ah ardayda dhexe ee Washington ayaa si joogto ah u lumisay barnaamijyo ay si buuxda u xaq u lahaayeen. Maaha sababtoo ah aysan ku filnayn. Sababtoo ah cidna kuma sheegin in barnaamijyadu jiraan.\n\nWaxaan dhisay tan si aan taas u beddelo. Kheyraad kasta halkan waa bilaash.",
      founderSig: "— Loo dhisay ardayda reer miyiga, dadka halkan ku koray",
      statsLabel: ["fursadaha", "macallimiin", "hagaha"],
      browseTitle: "Raadi waxa aad u baahan tahay", startExploring: "Bilow sahaminta →", readGuides: "Akhri hagaha",
    },
    ru: {
      locationBadge: userLocation ? `📍 ${userLocation}` : "📍 Сельские сообщества",
      heroEyebrow: "Бесплатно. Без связей. Создано для вас.",
      headline: "Вы принадлежите STEM.", headlineSub: "Мы здесь, чтобы помочь вам добраться.",
      body: "Жизнь в сельской местности не должна ограничивать ваше будущее. Этот инструмент создан для того, чтобы студенты из небольших городов имели те же возможности, что и все остальные.",
      cta: "Найти возможности", ctaSecondary: "Мой список",
      whyTitle: "Зачем это существует",
      whyBody: "Большинство баз данных возможностей STEM созданы для студентов, у которых уже есть доступ. Этот — нет. Он создан специально для студентов из сельских сообществ.",
      whyExtra: "Если вы первый в семье, кто думает о колледже, если в вашей школе нет консультанта — это для вас.",
      whyLink: "Читать пошаговые руководства →",
      featuredTitle: "Возможности, о которых стоит знать", featuredSub: "Несколько, которые должен увидеть каждый сельский студент.", featuredLink: "Смотреть все возможности →",
      founderTitle: "Слово от сообщества",
      founderBody: "Этот проект начался потому, что студенты в центральном Вашингтоне постоянно упускали программы, для которых они были полностью квалифицированы. Не потому что они были недостаточно хороши. Потому что никто не говорил им, что эти программы существуют.\n\nМы создали это, чтобы изменить ситуацию. Все ресурсы здесь бесплатны.",
      founderSig: "— Создано для сельских студентов, людьми, которые выросли здесь",
      statsLabel: ["возможности", "наставники", "руководства"],
      browseTitle: "Просматривать по потребностям", startExploring: "Начать изучение →", readGuides: "Читать руководства",
    },
  };

  const t = copy[language] ?? copy.en;

  const browseLinks: { href: string; emoji: string; label: Record<typeof language, string>; sub: Record<typeof language, string> }[] = [
    { href: "/opportunities?type=scholarship", emoji: "🎓",
      label: { en: "Scholarships", es: "Becas", vi: "Học bổng", so: "Deeqaha", ru: "Стипендии" },
      sub:   { en: "Free money for college", es: "Dinero gratis para la universidad", vi: "Tiền miễn phí cho đại học", so: "Lacag bilaash ah jaamacadda", ru: "Бесплатные деньги на учёбу" } },
    { href: "/opportunities?type=internship", emoji: "💼",
      label: { en: "Internships", es: "Pasantías", vi: "Thực tập", so: "Tababarka", ru: "Стажировки" },
      sub:   { en: "Real work experience", es: "Experiencia laboral real", vi: "Kinh nghiệm làm việc thực tế", so: "Khibrad shaqo dhabta ah", ru: "Реальный опыт работы" } },
    { href: "/opportunities?type=program", emoji: "🔬",
      label: { en: "STEM Programs", es: "Programas STEM", vi: "Chương trình STEM", so: "Barnaamijyada STEM", ru: "Программы STEM" },
      sub:   { en: "Camps, labs & more", es: "Campamentos, laboratorios y más", vi: "Trại hè, phòng thí nghiệm và hơn thế", so: "Xerooyin, shaybaarro iyo wax badan", ru: "Лагеря, лаборатории и многое другое" } },
    { href: "/mentors", emoji: "🤝",
      label: { en: "Mentors", es: "Mentores", vi: "Người hướng dẫn", so: "Tutoriyaasha", ru: "Наставники" },
      sub:   { en: "People who get it", es: "Personas que lo entienden", vi: "Những người hiểu bạn", so: "Dad fahmaya", ru: "Люди, которые понимают" } },
    { href: "/volunteer", emoji: "🌱",
      label: { en: "Volunteer", es: "Voluntariado", vi: "Tình nguyện", so: "Iskaa wax u qabso", ru: "Волонтёрство" },
      sub:   { en: "Build your resume", es: "Construye tu currículum", vi: "Xây dựng hồ sơ của bạn", so: "Dhis siiradaada", ru: "Пополните резюме" } },
    { href: "/resources", emoji: "📚",
      label: { en: "Guides", es: "Guías", vi: "Hướng dẫn", so: "Hagaha", ru: "Руководства" },
      sub:   { en: "Step-by-step help", es: "Ayuda paso a paso", vi: "Hỗ trợ từng bước", so: "Caawimo tallaabo-tallaabo", ru: "Пошаговая помощь" } },
  ];

  return (
    <div className="flex flex-col gap-0 -mt-8">

      {/* ── HERO ── */}
      <section className="hero-bg px-4 pt-14 pb-16 flex flex-col items-center text-center gap-6">
        <div className="flex items-center gap-2 bg-white border border-stone-200 text-stone-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          {t.locationBadge}
        </div>

        <div className="flex flex-col gap-2 max-w-2xl">
          <p className="text-sm text-stone-500 font-medium tracking-wide uppercase">{t.heroEyebrow}</p>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-stone-900 leading-[1.1] tracking-tight">
            {t.headline}
          </h1>
          <p className="text-2xl sm:text-3xl font-semibold text-stone-500 leading-snug">{t.headlineSub}</p>
        </div>

        <p className="text-base text-stone-600 max-w-lg leading-relaxed">{t.body}</p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/opportunities"
            className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-base shadow-sm"
          >
            {t.cta} →
          </Link>
          <Link
            href="/dashboard"
            className="bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold px-7 py-3.5 rounded-xl transition-colors text-base"
          >
            {t.ctaSecondary}
          </Link>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          {t.statsLabel.map((label, i) => (
            <span key={i} className="text-xs font-semibold text-stone-500 bg-white/70 border border-stone-200 px-3 py-1.5 rounded-full">
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* ── MOUNTAIN DIVIDER ── */}
      <div className="w-full overflow-hidden leading-none" aria-hidden="true">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60 L0 40 L180 10 L360 35 L540 5 L720 30 L900 8 L1080 32 L1260 12 L1440 28 L1440 60 Z" fill="#f0ebe2" />
        </svg>
      </div>

      {/* ── WHY THIS EXISTS ── */}
      <section className="bg-[#f0ebe2] px-4 py-14 flex flex-col gap-8 items-center">
        <div className="max-w-2xl w-full flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-1 bg-[#c2714f] rounded-full"></div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#c2714f]">{t.whyTitle}</h2>
          </div>
          <p className="text-stone-800 text-lg leading-relaxed font-medium">{t.whyBody}</p>
          <p className="text-stone-600 leading-relaxed">{t.whyExtra}</p>
          <Link href="/resources" className="text-[#4a7c59] font-semibold hover:underline text-sm self-start">
            {t.whyLink}
          </Link>
        </div>
      </section>

      {/* ── FEATURED OPPORTUNITIES ── */}
      <section className="bg-[#faf7f2] px-4 py-14 flex flex-col gap-8 items-center">
        <div className="max-w-4xl w-full flex flex-col gap-6">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-1 bg-[#4a7c59] rounded-full"></div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#4a7c59]">
                  {t.featuredTitle}
                </h2>
              </div>
              <p className="text-stone-500 text-sm mt-1">{t.featuredSub}</p>
            </div>
            <Link href="/opportunities" className="text-sm font-semibold text-stone-600 hover:text-stone-900 hover:underline whitespace-nowrap">
              {t.featuredLink}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featured.map((o) => {
              const deadline = daysUntil(o.deadline);
              return (
                <Link
                  key={o.id}
                  href={`/opportunities/${o.id}`}
                  className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md hover:border-stone-300 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[o.type]}`}>
                      {o.type.replace("-", " ")}
                    </span>
                    {deadline && (
                      <span className="text-xs text-stone-400">{deadline}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 leading-snug group-hover:text-[#4a7c59] transition-colors">{o.title}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">{o.organization}</p>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed line-clamp-2">{o.description}</p>
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {o.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">#{tag}</span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BROWSE BY CATEGORY ── */}
      <section className="bg-[#f0ebe2] px-4 py-14 flex flex-col gap-8 items-center">
        <div className="max-w-4xl w-full flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-1 bg-[#d4a853] rounded-full"></div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#b8892a]">{t.browseTitle}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {browseLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center gap-3 hover:shadow-md hover:border-stone-300 transition-all group"
              >
                <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <p className="font-semibold text-stone-800 text-sm group-hover:text-[#4a7c59] transition-colors">
                    {item.label[language]}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">{item.sub[language]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDER / COMMUNITY NOTE ── */}
      <section className="bg-stone-900 px-4 py-14 flex flex-col items-center">
        <div className="max-w-2xl w-full flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-1 bg-[#d4a853] rounded-full"></div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#d4a853]">{t.founderTitle}</h2>
          </div>
          <div className="flex flex-col gap-4">
            {t.founderBody.split("\n\n").map((para, i) => (
              <p key={i} className="text-stone-300 leading-relaxed text-base">{para}</p>
            ))}
          </div>
          <p className="text-stone-500 text-sm italic mt-2">{t.founderSig}</p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Link
              href="/opportunities"
              className="bg-[#4a7c59] hover:bg-[#3d6b4a] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              {t.startExploring}
            </Link>
            <Link
              href="/resources"
              className="border border-stone-600 hover:border-stone-400 text-stone-300 hover:text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              {t.readGuides}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
