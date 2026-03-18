"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useApp } from "@/context/AppContext";
import PageContainer from "@/components/PageContainer";
import { isSupabaseConfigured } from "@/lib/supabase";

type Mode = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useApp();

  if (!isSupabaseConfigured() || !supabase) {
    return (
      <PageContainer>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-8 max-w-lg w-full flex flex-col gap-4">
            <span className="text-3xl">⚙️</span>
            <h1 className="text-xl font-bold text-amber-900">Supabase not configured yet</h1>
            <p className="text-amber-800 text-sm leading-relaxed">
              To enable login and progress syncing, add your Supabase credentials to{" "}
              <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">.env.local</code>:
            </p>
            <pre className="bg-white border border-amber-200 rounded-xl p-4 text-xs font-mono text-stone-700 leading-relaxed overflow-x-auto">{`NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key`}</pre>
            <p className="text-amber-700 text-xs">
              Get these from{" "}
              <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">
                supabase.com
              </a>{" "}
              → your project → Settings → API. Then restart the dev server.
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const copy: Record<string, {
    loginTitle: string; loginSub: string; signupTitle: string; signupSub: string;
    nameLabel: string; namePlaceholder: string; emailLabel: string; passLabel: string;
    passPlaceholder: string; loginBtn: string; signupBtn: string; googleBtn: string;
    switchToSignup: string; switchToLogin: string; forgotPass: string;
    checkEmail: string; checkEmailSub: string; orDivider: string;
  }> = {
    en: {
      loginTitle: "Welcome back",
      loginSub: "Sign in to track your opportunities and progress.",
      signupTitle: "Create your account",
      signupSub: "Free forever. No spam. Just your STEM journey.",
      nameLabel: "Your first name", namePlaceholder: "First name",
      emailLabel: "Email address", passLabel: "Password",
      passPlaceholder: "At least 8 characters",
      loginBtn: "Sign in", signupBtn: "Create account",
      googleBtn: "Continue with Google",
      switchToSignup: "Don't have an account? Sign up",
      switchToLogin: "Already have an account? Sign in",
      forgotPass: "Forgot password?",
      checkEmail: "Check your email",
      checkEmailSub: "We sent a confirmation link to",
      orDivider: "or",
    },
    es: {
      loginTitle: "Bienvenido de nuevo",
      loginSub: "Inicia sesión para rastrear tus oportunidades y progreso.",
      signupTitle: "Crea tu cuenta",
      signupSub: "Gratis para siempre. Sin spam. Solo tu camino en STEM.",
      nameLabel: "Tu nombre", namePlaceholder: "Nombre",
      emailLabel: "Correo electrónico", passLabel: "Contraseña",
      passPlaceholder: "Al menos 8 caracteres",
      loginBtn: "Iniciar sesión", signupBtn: "Crear cuenta",
      googleBtn: "Continuar con Google",
      switchToSignup: "¿No tienes cuenta? Regístrate",
      switchToLogin: "¿Ya tienes cuenta? Inicia sesión",
      forgotPass: "¿Olvidaste tu contraseña?",
      checkEmail: "Revisa tu correo",
      checkEmailSub: "Enviamos un enlace de confirmación a",
      orDivider: "o",
    },
    vi: {
      loginTitle: "Chào mừng trở lại",
      loginSub: "Đăng nhập để theo dõi cơ hội và tiến trình của bạn.",
      signupTitle: "Tạo tài khoản của bạn",
      signupSub: "Miễn phí mãi mãi. Không spam. Chỉ là hành trình STEM của bạn.",
      nameLabel: "Tên của bạn", namePlaceholder: "Tên",
      emailLabel: "Địa chỉ email", passLabel: "Mật khẩu",
      passPlaceholder: "Ít nhất 8 ký tự",
      loginBtn: "Đăng nhập", signupBtn: "Tạo tài khoản",
      googleBtn: "Tiếp tục với Google",
      switchToSignup: "Chưa có tài khoản? Đăng ký",
      switchToLogin: "Đã có tài khoản? Đăng nhập",
      forgotPass: "Quên mật khẩu?",
      checkEmail: "Kiểm tra email của bạn",
      checkEmailSub: "Chúng tôi đã gửi liên kết xác nhận đến",
      orDivider: "hoặc",
    },
    so: {
      loginTitle: "Ku soo dhawoow",
      loginSub: "Gal si aad u raacdo fursadahaaga iyo horumarkaaga.",
      signupTitle: "Samee akoonkaaga",
      signupSub: "Bilaash weligeed. Spam ma jirto. Safarka STEM kaaga kaliya.",
      nameLabel: "Magacaaga", namePlaceholder: "Magaca hore",
      emailLabel: "Cinwaanka emailka", passLabel: "Furaha sirta",
      passPlaceholder: "Ugu yaraan 8 xaraf",
      loginBtn: "Gal", signupBtn: "Samee akoon",
      googleBtn: "Ku sii wad Google",
      switchToSignup: "Ma lihid akoon? Is diiwaan geli",
      switchToLogin: "Horey akoon u leedahay? Gal",
      forgotPass: "Ma ilowday furaha sirta?",
      checkEmail: "Hubi emailkaaga",
      checkEmailSub: "Waxaan u dirnay xiriir xaqiijin",
      orDivider: "ama",
    },
    ru: {
      loginTitle: "С возвращением",
      loginSub: "Войдите, чтобы отслеживать возможности и прогресс.",
      signupTitle: "Создайте аккаунт",
      signupSub: "Бесплатно навсегда. Без спама. Только ваш путь в STEM.",
      nameLabel: "Ваше имя", namePlaceholder: "Имя",
      emailLabel: "Адрес электронной почты", passLabel: "Пароль",
      passPlaceholder: "Не менее 8 символов",
      loginBtn: "Войти", signupBtn: "Создать аккаунт",
      googleBtn: "Продолжить с Google",
      switchToSignup: "Нет аккаунта? Зарегистрироваться",
      switchToLogin: "Уже есть аккаунт? Войти",
      forgotPass: "Забыли пароль?",
      checkEmail: "Проверьте почту",
      checkEmailSub: "Мы отправили ссылку подтверждения на",
      orDivider: "или",
    },
  };
  const authT = copy[language] ?? copy.en;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setEmailSent(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  const handleForgotPassword = async () => {
    if (!email) { setError("Enter your email first."); return; }
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    setError("Password reset email sent — check your inbox.");
  };

  if (emailSent) {
    return (
      <PageContainer>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-8 max-w-md w-full text-center flex flex-col gap-4 shadow-sm">
          <span className="text-5xl">📬</span>
          <h1 className="text-xl font-bold text-stone-900">{authT.checkEmail}</h1>
          <p className="text-stone-600 text-sm leading-relaxed">
            {authT.checkEmailSub} <span className="font-semibold text-stone-800">{email}</span>.
            {" "}{language === "en" ? "Click the link to activate your account." : language === "es" ? "Haz clic en el enlace para activar tu cuenta." : language === "vi" ? "Nhấp vào liên kết để kích hoạt tài khoản." : language === "so" ? "Guji xiriirka si aad u firfircooneyso akoonkaaga." : "Нажмите на ссылку для активации аккаунта."}
          </p>
          <button
            onClick={() => { setEmailSent(false); setMode("login"); }}
            className="text-sm text-emerald-700 hover:underline"
          >
            {language === "en" ? "Back to sign in" : language === "es" ? "Volver a iniciar sesión" : language === "vi" ? "Quay lại đăng nhập" : language === "so" ? "Ku noqo galitaanka" : "Назад к входу"}
          </button>
        </div>
      </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md flex flex-col gap-6">

        {/* Header */}
        <div className="text-center flex flex-col gap-1">
          <span className="text-3xl">🌱</span>
          <h1 className="text-2xl font-bold text-stone-900">
            {mode === "login" ? authT.loginTitle : authT.signupTitle}
          </h1>
          <p className="text-stone-500 text-sm">
            {mode === "login" ? authT.loginSub : authT.signupSub}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col gap-5 shadow-sm">

          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <GoogleIcon />
            {authT.googleBtn}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs text-stone-400 font-medium">{authT.orDivider}</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">{authT.nameLabel}</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={authT.namePlaceholder}
                  className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1">{authT.emailLabel}</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-stone-700">{authT.passLabel}</label>
                {mode === "login" && (
                  <button type="button" onClick={handleForgotPassword} className="text-xs text-emerald-700 hover:underline">
                    {authT.forgotPass}
                  </button>
                )}
              </div>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={authT.passPlaceholder}
                minLength={8}
                className="w-full border border-stone-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-semibold px-4 py-3 rounded-xl transition-colors text-sm"
            >
              {loading ? "..." : mode === "login" ? authT.loginBtn : authT.signupBtn}
            </button>
          </form>

          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            className="text-sm text-center text-stone-500 hover:text-stone-800 transition-colors"
          >
            {mode === "login" ? authT.switchToSignup : authT.switchToLogin}
          </button>
        </div>

        <p className="text-center text-xs text-stone-400">
          {language === "en" ? "Your data is private and never sold. Progress syncs across devices when signed in."
           : language === "es" ? "Tus datos son privados y nunca se venden. El progreso se sincroniza entre dispositivos."
           : language === "vi" ? "Dữ liệu của bạn là riêng tư và không bao giờ bị bán. Tiến trình đồng bộ trên các thiết bị."
           : language === "so" ? "Xogta aad tahay gaarka ah mana la iibin doonto. Horumarku wuxuu isku xidaa qalabka."
           : "Ваши данные конфиденциальны и никогда не продаются. Прогресс синхронизируется между устройствами."}
        </p>
      </div>
    </div>
    </PageContainer>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
