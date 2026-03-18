"use client";
import { useState } from "react";
import { mentors } from "@/data/mentors";
import MentorCard from "@/components/MentorCard";
import { useApp } from "@/context/AppContext";
import PageContainer from "@/components/PageContainer";
import { t } from "@/data/translations";
import type { Language } from "@/data/translations";

type ML = Record<Language, string>;

type Step = {
  icon: string;
  title: ML;
  body: ML;
  links?: { label: string; url: string }[];
};

const whereToLook: Step[] = [
  {
    icon: "💼",
    title: { en: "LinkedIn", es: "LinkedIn", vi: "LinkedIn", so: "LinkedIn", ru: "LinkedIn" },
    body: {
      en: "Search for professionals in your field of interest. Filter by location, company, or school. Look for people who went to state schools or grew up in small towns — they're often the most willing to help.",
      es: "Busca profesionales en tu área de interés. Filtra por ubicación, empresa o universidad. Busca personas que fueron a universidades estatales o crecieron en pueblos pequeños — suelen ser los más dispuestos a ayudar.",
      vi: "Tìm kiếm các chuyên gia trong lĩnh vực bạn quan tâm. Lọc theo vị trí, công ty hoặc trường học. Tìm những người học trường công lập hoặc lớn lên ở thị trấn nhỏ — họ thường sẵn sàng giúp đỡ nhất.",
      so: "Raadi xirfadlayaasha goobta xiisahaaga. Shaandhayn ku samee goobta, shirkadda, ama dugsiga. Raadiyo dadka jaamacadaha dowladda ka dhigtay ama tuulooyinka yaryar ku koray — iyagu badanaa waa kuwa ugu diyaarsan inay caawiyaan.",
      ru: "Ищите специалистов в интересующей вас области. Фильтруйте по местоположению, компании или учебному заведению. Ищите людей, окончивших государственные вузы или выросших в небольших городах — они чаще всего готовы помочь.",
    },
    links: [{ label: "Search STEM professionals on LinkedIn →", url: "https://www.linkedin.com/search/results/people/?keywords=STEM+engineer+mentor" }],
  },
  {
    icon: "💬",
    title: { en: "Discord Communities", es: "Comunidades de Discord", vi: "Cộng đồng Discord", so: "Bulshada Discord", ru: "Сообщества Discord" },
    body: {
      en: "Many STEM fields have active Discord servers where professionals hang out and answer questions. ColorStack is especially great for underrepresented CS students. Also try Reactiflux (web dev) or ML Collective (AI/ML).",
      es: "Muchos campos STEM tienen servidores de Discord activos. ColorStack es especialmente útil para estudiantes de CS subrepresentados. También prueba Reactiflux o ML Collective.",
      vi: "Nhiều lĩnh vực STEM có máy chủ Discord hoạt động nơi các chuyên gia trả lời câu hỏi. ColorStack rất tốt cho sinh viên CS chưa được đại diện. Thử Reactiflux hoặc ML Collective.",
      so: "Goobaha STEM badan waxaa leh serverrada Discord firfircoon. ColorStack waa mid aad u fiican ardayda CS aan la matalnayn. Isku day Reactiflux ama ML Collective.",
      ru: "Многие области STEM имеют активные серверы Discord. ColorStack отлично подходит для недопредставленных студентов CS. Попробуйте также Reactiflux или ML Collective.",
    },
    links: [
      { label: "ColorStack (underrepresented CS students) →", url: "https://www.colorstack.org" },
      { label: "Reactiflux (web/software) →", url: "https://www.reactiflux.com" },
      { label: "ML Collective (AI/ML) →", url: "https://mlcollective.org" },
    ],
  },
  {
    icon: "🎓",
    title: { en: "College Programs & Advisors", es: "Programas universitarios y asesores", vi: "Chương trình đại học & Cố vấn", so: "Barnaamijyada Jaamacadda & La-taliyeyaasha", ru: "Программы колледжа и консультанты" },
    body: {
      en: "If you're in high school, reach out to admissions offices at colleges you're interested in — they often connect you with current students. Community colleges like Yakima Valley College have advisors specifically for first-gen students.",
      es: "Si estás en preparatoria, contacta las oficinas de admisiones de universidades que te interesan. Los colegios comunitarios como Yakima Valley College tienen asesores para estudiantes de primera generación.",
      vi: "Nếu bạn đang học trung học, hãy liên hệ với văn phòng tuyển sinh của các trường đại học bạn quan tâm. Các trường cao đẳng cộng đồng như Yakima Valley College có cố vấn cho sinh viên thế hệ đầu.",
      so: "Haddaad joogto dugsiga sare, la xiriir xafiisyada qaboolka jaamacadaha aad xiisaynayso. Kulliyadaha bulshada sida Yakima Valley College waxaa leh la-taliyeyaasha ardayda jiilka koowaad.",
      ru: "Если вы в старшей школе, свяжитесь с приёмными комиссиями интересующих вас колледжей. Общественные колледжи, такие как Yakima Valley College, имеют консультантов для студентов первого поколения.",
    },
    links: [{ label: "Yakima Valley College advising →", url: "https://www.yvcc.edu/advising" }],
  },
  {
    icon: "🏘️",
    title: { en: "Local Organizations", es: "Organizaciones locales", vi: "Tổ chức địa phương", so: "Hay'adaha Maxalliga ah", ru: "Местные организации" },
    body: {
      en: "Washington MESA, SHPE, and local STEM clubs often have built-in mentorship. These connections are more reliable than cold outreach because there's already a shared context.",
      es: "Washington MESA, SHPE y clubes STEM locales a menudo tienen mentoría integrada. Estas conexiones son más confiables porque ya hay un contexto compartido.",
      vi: "Washington MESA, SHPE và các câu lạc bộ STEM địa phương thường có chương trình hướng dẫn tích hợp. Những kết nối này đáng tin cậy hơn vì đã có bối cảnh chung.",
      so: "Washington MESA, SHPE, iyo kooxaha STEM maxalliga ah badanaa waxaa ku jira macallinnimo la dhisay. Xiriiradan waa kuwa la isku halleyn karo sababtoo ah horeba waxaa jira macno wadaag.",
      ru: "Washington MESA, SHPE и местные STEM-клубы часто имеют встроенное наставничество. Эти связи надёжнее холодных обращений, потому что уже есть общий контекст.",
    },
    links: [
      { label: "Washington MESA →", url: "https://www.mesa.wsu.edu" },
      { label: "SHPE student chapters →", url: "https://www.shpe.org/membership/student-chapters" },
    ],
  },
  {
    icon: "🌐",
    title: { en: "Virtual Programs", es: "Programas virtuales", vi: "Chương trình trực tuyến", so: "Barnaamijyada Khadka tooska ah", ru: "Виртуальные программы" },
    body: {
      en: "Programs like First Scholars, QuestBridge, and the Gates Scholarship all include mentorship components. If you're already applying to scholarships, you may already be in a pipeline that connects you with mentors.",
      es: "Programas como First Scholars, QuestBridge y la Beca Gates incluyen componentes de mentoría. Si ya estás aplicando a becas, puede que ya estés en un proceso que te conecta con mentores.",
      vi: "Các chương trình như First Scholars, QuestBridge và Học bổng Gates đều có thành phần hướng dẫn. Nếu bạn đang nộp đơn xin học bổng, bạn có thể đã trong một quy trình kết nối với người hướng dẫn.",
      so: "Barnaamijyada sida First Scholars, QuestBridge, iyo Gates Scholarship waxaa ku jira qaybaha macallinnimada. Haddaad horeba u codsanayso deeqaha, laga yaabaa inaad horeba ku jirto habka kula xidha macallimiin.",
      ru: "Программы First Scholars, QuestBridge и стипендия Gates включают компоненты наставничества. Если вы уже подаёте заявки на стипендии, возможно, вы уже в системе, которая связывает вас с наставниками.",
    },
    links: [
      { label: "QuestBridge →", url: "https://www.questbridge.org" },
      { label: "First Scholars Network →", url: "https://firstscholars.org" },
    ],
  },
];

const messageTemplates: { label: ML; template: string }[] = [
  {
    label: {
      en: "Asking for advice (LinkedIn)", es: "Pedir consejo (LinkedIn)",
      vi: "Xin lời khuyên (LinkedIn)", so: "Weydii talo (LinkedIn)", ru: "Просьба о совете (LinkedIn)",
    },
    template: `Hi [Name],\n\nI'm a [grade] student from [your town] interested in [field]. I came across your profile and was really inspired by your work at [company].\n\nI'd love to ask you a few questions about how you got started — even a 15-minute call would mean a lot.\n\nThank you for your time,\n[Your name]`,
  },
  {
    label: {
      en: "Following up after no reply", es: "Seguimiento sin respuesta",
      vi: "Theo dõi sau khi không có phản hồi", so: "Raacsiinta kadib jawaab la'aanta", ru: "Повторное обращение без ответа",
    },
    template: `Hi [Name],\n\nI sent a message a couple weeks ago and wanted to follow up in case it got buried. I'm a student from a rural community in Washington exploring a career in [field].\n\nNo pressure at all — I just wanted to make sure you saw it.\n\nThanks,\n[Your name]`,
  },
  {
    label: {
      en: "Reaching out to a program alum", es: "Contactar a un exalumno de programa",
      vi: "Liên hệ với cựu sinh viên chương trình", so: "La xiriirida qof hore ka qalin jabiyay barnaamijka", ru: "Обращение к выпускнику программы",
    },
    template: `Hi [Name],\n\nI'm applying to [program name] and noticed you went through it. I'm from [town] and would love to hear about your experience — what it was like, what you got out of it, and any advice for applicants.\n\nEven a few sentences by email would be incredibly helpful.\n\nThank you,\n[Your name]`,
  },
];

export default function MentorsPage() {
  const { language } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", grade: "", interests: "", goals: "" });
  const [openStep, setOpenStep] = useState<number | null>(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const copyTemplate = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-10">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.findMentor[language]}</h1>
          <p className="text-gray-500 mt-1 text-sm">{t.findMentorSub[language]}</p>
        </div>

        {/* How to find a mentor guide */}
        <div className="flex flex-col gap-3">
          <h2 className="font-bold text-gray-800 text-lg">{t.whereLook[language]}</h2>
          {whereToLook.map((step, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenStep(openStep === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{step.icon}</span>
                  <span className="font-semibold text-gray-900">{step.title[language]}</span>
                </div>
                <span className="text-gray-400 text-sm">{openStep === i ? "▲" : "▼"}</span>
              </button>
              {openStep === i && (
                <div className="px-5 pb-5 flex flex-col gap-3 border-t border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed pt-3">{step.body[language]}</p>
                  {step.links && (
                    <div className="flex flex-wrap gap-2">
                      {step.links.map((link) => (
                        <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-medium transition-colors">
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* What to say */}
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">{t.whatSay[language]}</h2>
            <p className="text-sm text-gray-500 mt-1">{t.whatSaySub[language]}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {messageTemplates.map((tmpl, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
                <p className="text-sm font-semibold text-gray-800">{tmpl.label[language]}</p>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed font-sans bg-gray-50 rounded-xl p-3 flex-1">{tmpl.template}</pre>
                <button onClick={() => copyTemplate(tmpl.template, i)}
                  className="text-xs bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg font-medium transition-colors self-start">
                  {copiedIdx === i ? t.copied[language] : t.copyTemplate[language]}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Follow-up tips */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col gap-3">
          <h2 className="font-semibold text-amber-900">{t.followUpTips[language]}</h2>
          <ul className="text-sm text-amber-900 flex flex-col gap-2 leading-relaxed">
            {[
              { en: "Wait at least 1–2 weeks before following up. People are busy, not ignoring you.", es: "Espera al menos 1–2 semanas antes de hacer seguimiento. Las personas están ocupadas, no te ignoran.", vi: "Chờ ít nhất 1–2 tuần trước khi theo dõi. Mọi người bận, không phải bỏ qua bạn.", so: "Sug ugu yaraan 1–2 toddobaad ka hor inta aanad raacsiinin. Dadku waa mashquul, kuma iska indho tiraan.", ru: "Подождите не менее 1–2 недель перед повторным обращением. Люди заняты, а не игнорируют вас." },
              { en: "Follow up once. If they don't respond after that, move on — it's not personal.", es: "Haz seguimiento una vez. Si no responden después de eso, sigue adelante — no es personal.", vi: "Theo dõi một lần. Nếu họ không phản hồi sau đó, hãy tiếp tục — đó không phải là cá nhân.", so: "Raacsi hal mar. Haddayan ka jawabin ka dib, sii wad — kuma aha shakhsi.", ru: "Напишите повторно один раз. Если не ответят — двигайтесь дальше, это не личное." },
              { en: "When someone does respond, be on time, be prepared, and send a thank-you note after.", es: "Cuando alguien responda, sé puntual, prepárate y envía una nota de agradecimiento después.", vi: "Khi ai đó phản hồi, hãy đúng giờ, chuẩn bị kỹ và gửi lời cảm ơn sau.", so: "Marka qof ka jawaabo, waqtiga ahow, diyaargarow, oo ka dib soo dir warqad mahadnaq.", ru: "Когда кто-то ответит — будьте пунктуальны, подготовьтесь и отправьте благодарственное письмо." },
              { en: "Ask specific questions. \"Any advice?\" is hard to answer. \"How did you get your first internship?\" is easy.", es: "Haz preguntas específicas. \"¿Algún consejo?\" es difícil de responder. \"¿Cómo conseguiste tu primera pasantía?\" es fácil.", vi: "Đặt câu hỏi cụ thể. \"Có lời khuyên nào không?\" khó trả lời. \"Bạn có được thực tập đầu tiên như thế nào?\" thì dễ.", so: "Weydii su'aalo gaar ah. \"Wax talo ah?\" waa adag tahay in la jawaabo. \"Sideed u heshay tababarkaaga koowaad?\" waa fudud.", ru: "Задавайте конкретные вопросы. «Есть советы?» — сложно ответить. «Как вы получили первую стажировку?» — легко." },
            ].map((tip, i) => (
              <li key={i}>→ {tip[language]}</li>
            ))}
          </ul>
        </div>

        {/* Leaders worth following */}
        <div>
          <h2 className="font-bold text-gray-800 text-lg mb-1">{t.leadersTitle[language]}</h2>
          <p className="text-sm text-gray-500 mb-4">{t.leadersSub[language]}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentors.filter((m) => m.featured).map((m) => (
              <MentorCard key={m.id} mentor={m} />
            ))}
          </div>
        </div>

        {/* Request form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-1">{t.requestMentorship[language]}</h2>
          <p className="text-sm text-gray-500 mb-5">{t.requestSub[language]}</p>
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
              <p className="text-2xl mb-2">🎉</p>
              <p className="font-semibold text-emerald-800">{t.requestSubmitted[language]}</p>
              <p className="text-sm text-emerald-700 mt-1">{t.requestFollowUp[language]}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t.yourName[language]}</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder={t.firstName[language]} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t.gradeLevel[language]}</label>
                  <select required value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                    <option value="">{t.selectGrade[language]}</option>
                    <option value="9">9th Grade</option>
                    <option value="10">10th Grade</option>
                    <option value="11">11th Grade</option>
                    <option value="12">12th Grade</option>
                    <option value="college-1">College Year 1</option>
                    <option value="college-2">College Year 2</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{t.stemInterests[language]}</label>
                <input required value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder={t.stemPlaceholder[language]} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{t.yourGoals[language]}</label>
                <textarea required value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })}
                  rows={3} className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                  placeholder={t.goalPlaceholder[language]} />
              </div>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                {t.submitRequest[language]}
              </button>
            </form>
          )}
        </div>

      </div>
    </PageContainer>
  );
}
