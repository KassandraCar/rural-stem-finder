export type Language = "en" | "es" | "vi" | "so" | "ru";

export const languageOptions: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇲🇽" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "so", label: "Soomaali", flag: "🇸🇴" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export const t: Record<string, Record<Language, string>> = {
  // Nav
  home:               { en: "Home",           es: "Inicio",          vi: "Trang chủ",      so: "Guriga",         ru: "Главная" },
  opportunities:      { en: "Opportunities",  es: "Oportunidades",   vi: "Cơ hội",         so: "Fursadaha",      ru: "Возможности" },
  myDashboard:        { en: "My Dashboard",   es: "Mi Panel",        vi: "Bảng của tôi",   so: "Xaashidayda",    ru: "Мой кабинет" },
  mentors:            { en: "Mentors",         es: "Mentores",        vi: "Người hướng dẫn",so: "Tutoriyaasha",   ru: "Наставники" },
  volunteer:          { en: "Volunteer",       es: "Voluntariado",    vi: "Tình nguyện",    so: "Iskaa wax u qabso", ru: "Волонтёрство" },
  resources:          { en: "Resources",       es: "Recursos",        vi: "Tài nguyên",     so: "Kheyraadka",     ru: "Ресурсы" },
  signIn:             { en: "Sign in",         es: "Iniciar sesión",  vi: "Đăng nhập",      so: "Gal",            ru: "Войти" },
  signOut:            { en: "Sign out",        es: "Cerrar sesión",   vi: "Đăng xuất",      so: "Ka bax",         ru: "Выйти" },
  setLocation:        { en: "Set location",    es: "Ubicación",       vi: "Đặt vị trí",     so: "Goobta",         ru: "Местоположение" },
  locationPlaceholder:{ en: "Your city or town", es: "Tu ciudad o pueblo", vi: "Thành phố của bạn", so: "Magaaladaada", ru: "Ваш город" },
  save:               { en: "Save",            es: "Guardar",         vi: "Lưu",            so: "Keydi",          ru: "Сохранить" },
  firstGenMode:       { en: "First-Gen Mode",  es: "Modo Primera Gen",vi: "Chế độ Thế hệ đầu", so: "Qaabka Jiilka 1aad", ru: "Режим первого поколения" },

  // Opportunities page
  findOpportunities:  { en: "Find Opportunities", es: "Encontrar Oportunidades", vi: "Tìm cơ hội", so: "Raadi Fursadaha", ru: "Найти возможности" },
  opportunitiesSubtitle: { en: "Scholarships, internships, programs, and more — filtered for you.", es: "Becas, pasantías, programas y más — filtrados para ti.", vi: "Học bổng, thực tập, chương trình và hơn thế nữa.", so: "Deeqaha, tababarka, barnaamijyada iyo wax badan.", ru: "Стипендии, стажировки, программы и многое другое." },
  results:            { en: "results",         es: "resultados",      vi: "kết quả",        so: "natiijooyinka",  ru: "результатов" },
  clearFilters:       { en: "Clear filters",   es: "Limpiar filtros", vi: "Xóa bộ lọc",    so: "Nadiifi shaandhaynta", ru: "Сбросить фильтры" },
  noResults:          { en: "No results found",es: "Sin resultados",  vi: "Không tìm thấy kết quả", so: "Lama helin natiijo", ru: "Результатов не найдено" },
  tryAdjusting:       { en: "Try adjusting your filters", es: "Intenta ajustar los filtros", vi: "Thử điều chỉnh bộ lọc", so: "Isku day in aad hagaajiso shaandhaynta", ru: "Попробуйте изменить фильтры" },
  backToOpportunities:{ en: "Back to opportunities", es: "Volver a oportunidades", vi: "Quay lại cơ hội", so: "Ku noqo fursadaha", ru: "Назад к возможностям" },
  applyNow:           { en: "Apply Now →",     es: "Aplicar Ahora →", vi: "Đăng ký ngay →", so: "Codso Hadda →",  ru: "Подать заявку →" },

  // Dashboard
  dashboardTitle:     { en: "My Dashboard",    es: "Mi Panel",        vi: "Bảng của tôi",   so: "Xaashidayda",    ru: "Мой кабинет" },
  dashboardSubtitle:  { en: "Track your saved opportunities and application progress.", es: "Sigue tus oportunidades guardadas y tu progreso.", vi: "Theo dõi cơ hội đã lưu và tiến trình của bạn.", so: "Raadi fursadahaaga la keydsaday iyo horumarkaaga.", ru: "Отслеживайте сохранённые возможности и прогресс." },
  deadlines30:        { en: "Deadlines in the next 30 days", es: "Fechas límite en los próximos 30 días", vi: "Hạn chót trong 30 ngày tới", so: "Maalmaha dambe ee 30 ee soo socda", ru: "Дедлайны в ближайшие 30 дней" },
  savedOpportunities: { en: "Saved Opportunities", es: "Oportunidades Guardadas", vi: "Cơ hội đã lưu", so: "Fursadaha La Keydsaday", ru: "Сохранённые возможности" },
  noSaved:            { en: "No saved opportunities yet", es: "Aún no hay oportunidades guardadas", vi: "Chưa có cơ hội nào được lưu", so: "Wali ma jiraan fursado la keydsaday", ru: "Пока нет сохранённых возможностей" },
  browseOpportunities:{ en: "Browse opportunities →", es: "Ver oportunidades →", vi: "Duyệt cơ hội →", so: "Fiiri fursadaha →", ru: "Просмотреть возможности →" },

  // Opportunity card
  viewDetails:        { en: "View details →",   es: "Ver detalles →",    vi: "Xem chi tiết →",   so: "Arag faahfaahinta →", ru: "Подробнее →" },
  deadlinePassed:     { en: "Deadline passed",  es: "Fecha límite pasada", vi: "Đã hết hạn",     so: "Waqtiga dhacay",     ru: "Срок истёк" },
  daysLeft:           { en: "days left",        es: "días restantes",    vi: "ngày còn lại",     so: "maalmood ka haray",   ru: "дней осталось" },

  // Opportunity detail page
  deadline:           { en: "Deadline",         es: "Fecha límite",      vi: "Hạn chót",         so: "Xaddiga",            ru: "Дедлайн" },
  location:           { en: "Location",         es: "Ubicación",         vi: "Địa điểm",         so: "Goobta",             ru: "Местоположение" },
  aboutOpportunity:   { en: "About this opportunity", es: "Sobre esta oportunidad", vi: "Về cơ hội này", so: "Ku saabsan fursaddan", ru: "Об этой возможности" },
  eligibility:        { en: "Eligibility",      es: "Elegibilidad",      vi: "Điều kiện",        so: "Xaq u lahaanshaha",  ru: "Требования" },
  myStatus:           { en: "My Status",        es: "Mi Estado",         vi: "Trạng thái của tôi", so: "Xaaladayda",       ru: "Мой статус" },
  notStarted:         { en: "Not Started",      es: "No iniciado",       vi: "Chưa bắt đầu",     so: "Lama bilaaban",      ru: "Не начато" },
  inProgress:         { en: "In Progress",      es: "En progreso",       vi: "Đang tiến hành",   so: "Socda",              ru: "В процессе" },
  applied:            { en: "Applied ✓",        es: "Aplicado ✓",        vi: "Đã nộp ✓",         so: "La codsaday ✓",      ru: "Подано ✓" },

  // Volunteer page
  volunteerTitle:     { en: "Volunteer Opportunities", es: "Oportunidades de Voluntariado", vi: "Cơ hội tình nguyện", so: "Fursadaha Iskaa wax u qabsiga", ru: "Волонтёрские возможности" },
  volunteerSubtitle:  { en: "Build your resume, explore STEM, and give back to your community.", es: "Construye tu currículum, explora STEM y contribuye a tu comunidad.", vi: "Xây dựng hồ sơ, khám phá STEM và đóng góp cho cộng đồng.", so: "Dhis siiradaada, sahamiso STEM, oo ku celi bulshadaada.", ru: "Пополните резюме, изучите STEM и помогите своему сообществу." },
  whyVolunteer:       { en: "Why volunteer?",   es: "¿Por qué ser voluntario?", vi: "Tại sao tình nguyện?", so: "Maxaa loogu iskaa wax u qabtaa?", ru: "Зачем волонтёрить?" },
  learnMore:          { en: "Learn more →",     es: "Más info →",        vi: "Tìm hiểu thêm →",  so: "Wax badan ogow →",   ru: "Узнать больше →" },
  remote:             { en: "Remote",           es: "Remoto",            vi: "Trực tuyến",       so: "Fog",                ru: "Удалённо" },
  inPerson:           { en: "In-person",        es: "Presencial",        vi: "Trực tiếp",        so: "Shakhsi ahaan",      ru: "Очно" },
  remoteOnly:         { en: "Remote only",      es: "Solo remoto",       vi: "Chỉ trực tuyến",   so: "Fog kaliya",         ru: "Только удалённо" },
  inPersonOnly:       { en: "In-person only",   es: "Solo presencial",   vi: "Chỉ trực tiếp",    so: "Shakhsi kaliya",     ru: "Только очно" },
  all:                { en: "All",              es: "Todos",             vi: "Tất cả",           so: "Dhammaan",           ru: "Все" },
  opportunitiesCount: { en: "opportunities",    es: "oportunidades",     vi: "cơ hội",           so: "fursadaha",          ru: "возможностей" },
  noResultsFilters:   { en: "No results for these filters", es: "Sin resultados para estos filtros", vi: "Không có kết quả cho bộ lọc này", so: "Natiijo kuma jirto shaandhayntan", ru: "Нет результатов для этих фильтров" },
  gotIt:              { en: "Got it — show me opportunities", es: "Entendido — muéstrame oportunidades", vi: "Hiểu rồi — cho tôi xem cơ hội", so: "Garatay — ii tus fursadaha", ru: "Понятно — покажи возможности" },
  proTip:             { en: "Pro tip: track your hours", es: "Consejo: registra tus horas", vi: "Mẹo: theo dõi giờ của bạn", so: "Talo: raadi saacadahaaga", ru: "Совет: отслеживайте часы" },
  proTipBody:         { en: "Keep a simple log of where you volunteered, what you did, and how many hours. You'll need this for college apps, scholarship essays, and letters of recommendation.", es: "Lleva un registro simple de dónde hiciste voluntariado, qué hiciste y cuántas horas. Lo necesitarás para solicitudes universitarias, ensayos de becas y cartas de recomendación.", vi: "Ghi lại nơi bạn tình nguyện, việc bạn làm và số giờ. Bạn sẽ cần điều này cho đơn xin vào đại học và học bổng.", so: "Hay diiwaanka fudud ee meesha aad iskaa wax u qabtay, waxa aad sameysay, iyo saacadaha. Waxaad u baahan doontaa codsiyada jaamacadda iyo deeqaha.", ru: "Ведите простой журнал: где волонтёрили, что делали, сколько часов. Это нужно для заявок в колледж и стипендий." },
  showingNear:        { en: "Showing opportunities near", es: "Mostrando oportunidades cerca de", vi: "Hiển thị cơ hội gần", so: "Muujinaya fursadaha u dhow", ru: "Показываем возможности рядом с" },
  plusRemote:         { en: "plus remote options", es: "y opciones remotas", vi: "cộng với các tùy chọn trực tuyến", so: "iyo xulashooyinka fog", ru: "и удалённые варианты" },
  changeLocation:     { en: "Change location →", es: "Cambiar ubicación →", vi: "Đổi vị trí →", so: "Beddel goobta →",    ru: "Изменить местоположение →" },
  setLocationNav:     { en: "Set your location in the navbar to see local opportunities near you.", es: "Establece tu ubicación en la barra de navegación para ver oportunidades locales.", vi: "Đặt vị trí trong thanh điều hướng để xem cơ hội địa phương.", so: "Goobta ku dhig baarka wax-socodka si aad u aragto fursadaha maxalliga ah.", ru: "Укажите местоположение в навигации, чтобы видеть местные возможности." },
  localMatches:       { en: "local matches",    es: "locales",           vi: "kết quả địa phương", so: "kuwa maxalliga ah", ru: "местных совпадений" },

  // Resources page
  resourceHub:        { en: "Resource Hub",     es: "Centro de Recursos", vi: "Trung tâm tài nguyên", so: "Xarunta Kheyraadka", ru: "Центр ресурсов" },
  resourceSubtitle:   { en: "Simple guides to help you navigate college, scholarships, and STEM careers.", es: "Guías simples para ayudarte a navegar la universidad, becas y carreras STEM.", vi: "Hướng dẫn đơn giản giúp bạn điều hướng đại học, học bổng và sự nghiệp STEM.", so: "Hagaha fudud si kuu caawiya jaamacadda, deeqaha, iyo xirfadaha STEM.", ru: "Простые руководства по колледжу, стипендиям и карьере в STEM." },
  stepByStep:         { en: "Step-by-step",     es: "Paso a paso",       vi: "Từng bước",        so: "Tallaabo-tallaabo",   ru: "Пошагово" },
  tips:               { en: "Tips",             es: "Consejos",          vi: "Mẹo",              so: "Talooyin",           ru: "Советы" },
  helpfulLinks:       { en: "Helpful links",    es: "Enlaces útiles",    vi: "Liên kết hữu ích", so: "Xiriiriyeyaasha faa'iidada leh", ru: "Полезные ссылки" },

  // Mentors page
  findMentor:         { en: "Find a Mentor",    es: "Encuentra un Mentor", vi: "Tìm người hướng dẫn", so: "Raadi Macallin",  ru: "Найти наставника" },
  findMentorSub:      { en: "A practical guide to finding real mentors — where to look, what to say, and how to follow up.", es: "Una guía práctica para encontrar mentores reales — dónde buscar, qué decir y cómo hacer seguimiento.", vi: "Hướng dẫn thực tế để tìm người hướng dẫn — nơi tìm, nói gì và cách theo dõi.", so: "Hagaha waxtar leh ee helitaanka macallimiin dhabta ah — meesha la raadiyo, waxa la yiraahdo, iyo sida la raacsiiyaa.", ru: "Практическое руководство по поиску наставников — где искать, что говорить и как следить." },
  whereLook:          { en: "Where to look",    es: "Dónde buscar",      vi: "Nơi tìm kiếm",     so: "Meesha la raadiyo",  ru: "Где искать" },
  whatSay:            { en: "What to say",      es: "Qué decir",         vi: "Nói gì",           so: "Waxa la yiraahdo",   ru: "Что говорить" },
  whatSaySub:         { en: "Copy any of these templates and fill in the brackets. Keep it short — people are busy.", es: "Copia cualquiera de estas plantillas y llena los corchetes. Sé breve — las personas están ocupadas.", vi: "Sao chép bất kỳ mẫu nào và điền vào dấu ngoặc. Giữ ngắn gọn — mọi người bận.", so: "Koobiyee mid ka mid ah qaababkan oo buuxi xayndaabka. Gaaban ahow — dadku waa mashquul.", ru: "Скопируйте любой шаблон и заполните скобки. Будьте кратки — люди заняты." },
  followUpTips:       { en: "💡 Tips for following up", es: "💡 Consejos para hacer seguimiento", vi: "💡 Mẹo theo dõi", so: "💡 Talooyin raacsiinta", ru: "💡 Советы по отслеживанию" },
  leadersTitle:       { en: "Leaders worth following", es: "Líderes que vale la pena seguir", vi: "Những nhà lãnh đạo đáng theo dõi", so: "Hogaamiyeyaasha mudan in la raaco", ru: "Лидеры, за которыми стоит следить" },
  leadersSub:         { en: "Real tech leaders at the top of their fields. They're not direct mentors, but following their work and reaching out thoughtfully on LinkedIn is a real strategy.", es: "Líderes tecnológicos reales en la cima de sus campos. No son mentores directos, pero seguir su trabajo y contactarlos en LinkedIn es una estrategia real.", vi: "Các nhà lãnh đạo công nghệ thực sự. Họ không phải là người hướng dẫn trực tiếp, nhưng theo dõi công việc của họ trên LinkedIn là một chiến lược thực sự.", so: "Hogaamiyeyaasha teknoolajiyada dhabta ah. Kuma aha macallimiin toos ah, laakiin raacida shaqadooda LinkedIn waa xeeladda dhabta ah.", ru: "Настоящие технологические лидеры. Они не прямые наставники, но следить за их работой в LinkedIn — реальная стратегия." },
  requestMentorship:  { en: "Request Mentorship", es: "Solicitar Mentoría", vi: "Yêu cầu hướng dẫn", so: "Codso Macallinnimada", ru: "Запросить наставничество" },
  requestSub:         { en: "Tell us about yourself and we'll match you with the right mentor.", es: "Cuéntanos sobre ti y te conectaremos con el mentor adecuado.", vi: "Hãy cho chúng tôi biết về bạn và chúng tôi sẽ ghép bạn với người hướng dẫn phù hợp.", so: "Noo sheeg nafta aad tahay oo waxaan kula xidhi doonaa macallinka saxda ah.", ru: "Расскажите о себе, и мы подберём подходящего наставника." },
  requestSubmitted:   { en: "Request submitted!", es: "¡Solicitud enviada!", vi: "Đã gửi yêu cầu!", so: "Codsiga la gudbiyay!", ru: "Запрос отправлен!" },
  requestFollowUp:    { en: "We'll reach out within 3–5 business days.", es: "Nos comunicaremos en 3–5 días hábiles.", vi: "Chúng tôi sẽ liên hệ trong 3–5 ngày làm việc.", so: "Waxaan kula xidhi doonaa 3–5 maalmood shaqo gudahood.", ru: "Мы свяжемся с вами в течение 3–5 рабочих дней." },
  yourName:           { en: "Your name",        es: "Tu nombre",         vi: "Tên của bạn",      so: "Magacaaga",          ru: "Ваше имя" },
  firstName:          { en: "First name",       es: "Nombre",            vi: "Tên",              so: "Magaca hore",        ru: "Имя" },
  gradeLevel:         { en: "Grade level",      es: "Nivel escolar",     vi: "Cấp học",          so: "Heerka fasalka",     ru: "Уровень обучения" },
  selectGrade:        { en: "Select grade",     es: "Seleccionar",       vi: "Chọn cấp",         so: "Dooro fasalka",      ru: "Выберите уровень" },
  stemInterests:      { en: "STEM interests",   es: "Intereses en STEM", vi: "Sở thích STEM",    so: "Xiisaha STEM",       ru: "Интересы в STEM" },
  stemPlaceholder:    { en: "e.g. coding, biology, engineering", es: "ej. programación, biología, ingeniería", vi: "vd. lập trình, sinh học, kỹ thuật", so: "tusaale. koodhka, bayoolajiga, injineernimada", ru: "напр. программирование, биология, инженерия" },
  yourGoals:          { en: "What are your goals?", es: "¿Cuáles son tus metas?", vi: "Mục tiêu của bạn là gì?", so: "Maxay yihiin hadafyadaada?", ru: "Каковы ваши цели?" },
  goalPlaceholder:    { en: "Tell us what you hope to achieve...", es: "Cuéntanos qué esperas lograr...", vi: "Hãy cho chúng tôi biết bạn muốn đạt được gì...", so: "Noo sheeg waxa aad rabtid inaad gaarto...", ru: "Расскажите, чего вы хотите достичь..." },
  submitRequest:      { en: "Submit Request",   es: "Enviar Solicitud",  vi: "Gửi yêu cầu",     so: "Gudbi Codsiga",      ru: "Отправить запрос" },
  copyTemplate:       { en: "📋 Copy template", es: "📋 Copiar plantilla", vi: "📋 Sao chép mẫu", so: "📋 Koobiyee qaabka", ru: "📋 Копировать шаблон" },
  copied:             { en: "✓ Copied!",        es: "✓ ¡Copiado!",       vi: "✓ Đã sao chép!",   so: "✓ La koobiyeeyay!",  ru: "✓ Скопировано!" },

  // Mentor card
  hideAbout:          { en: "▾ Hide about",     es: "▾ Ocultar",       vi: "▾ Ẩn thông tin",  so: "▾ Qari",         ru: "▾ Скрыть" },
  viewLinkedIn:       { en: "View LinkedIn Profile", es: "Ver perfil de LinkedIn", vi: "Xem hồ sơ LinkedIn", so: "Arag LinkedIn", ru: "Просмотреть профиль LinkedIn" },
  findLinkedIn:       { en: "Find on LinkedIn", es: "Buscar en LinkedIn", vi: "Tìm trên LinkedIn", so: "Raadi LinkedIn", ru: "Найти в LinkedIn" },
  messageTemplate:    { en: "✉️ Get a message template to reach out", es: "✉️ Ver plantilla de mensaje", vi: "✉️ Lấy mẫu tin nhắn", so: "✉️ Hel qalab fariin", ru: "✉️ Получить шаблон сообщения" },
  hideTemplate:       { en: "Hide message template", es: "Ocultar plantilla", vi: "Ẩn mẫu tin nhắn", so: "Qari qaabka fariinta", ru: "Скрыть шаблон" },
  copyPasteLinkedIn:  { en: "Copy & paste this on LinkedIn:", es: "Copia y pega esto en LinkedIn:", vi: "Sao chép và dán vào LinkedIn:", so: "Koobiyee oo ku dheji LinkedIn:", ru: "Скопируйте и вставьте в LinkedIn:" },
  copyClipboard:      { en: "📋 Copy to clipboard", es: "📋 Copiar", vi: "📋 Sao chép", so: "📋 Koobiyee", ru: "📋 Копировать" },

  // Home
  startExploring:     { en: "Start exploring →", es: "Empezar a explorar →", vi: "Bắt đầu khám phá →", so: "Bilow sahaminta →", ru: "Начать изучение →" },
  readGuides:         { en: "Read the guides",  es: "Leer las guías",  vi: "Đọc hướng dẫn",  so: "Akhri tilmaamaha", ru: "Читать руководства" },
};
