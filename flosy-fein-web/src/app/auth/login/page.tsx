"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.login({ email, password });
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "بيانات الدخول غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[720px] h-full w-full bg-white flex flex-col justify-between px-6 pt-4 pb-8 overflow-hidden select-none">
      {/* ── 1. الموجة الخضراء في الركن العلوي الأيسر (كما في الصورة المرجعية) ── */}
      <svg
        className="absolute top-0 left-0 w-36 h-36 pointer-events-none z-0"
        viewBox="0 0 140 140"
        fill="none"
      >
        <path
          d="M0 0 L140 0 C90 10 30 70 0 140 Z"
          fill="#064C3B"
        />
      </svg>

      {/* ── 2. الموجات السفلية (أخضر على اليسار وبرتقالي على اليمين) ── */}
      <svg
        className="absolute bottom-0 left-0 w-32 h-24 pointer-events-none z-0"
        viewBox="0 0 120 90"
        fill="none"
      >
        <path
          d="M0 90 L120 90 C80 60 40 40 0 45 Z"
          fill="#064C3B"
        />
      </svg>
      <svg
        className="absolute bottom-0 right-0 w-28 h-20 pointer-events-none z-0"
        viewBox="0 0 100 80"
        fill="none"
      >
        <path
          d="M100 80 L0 80 C40 60 70 40 100 45 Z"
          fill="#FF6B16"
        />
      </svg>

      {/* ── المحتوى الرئيسي المتمركز ── */}
      <div className="relative z-10 flex flex-col items-center flex-1 justify-center max-w-sm mx-auto w-full">
        {/* اللوجو المطابق للصورة المرجعية - حجم أكبر وأوضح */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative inline-block text-center">
            {/* الأشعة البرتقالية الـ 3 المشعة فوق كلمة فلوسي */}
            <svg
              width="44"
              height="26"
              viewBox="0 0 36 22"
              fill="none"
              className="absolute -top-5 -right-2"
            >
              <line x1="6" y1="18" x2="1" y2="6" stroke="#FF6B16" strokeWidth="3.4" strokeLinecap="round" />
              <line x1="18" y1="19" x2="18" y2="3" stroke="#FF6B16" strokeWidth="3.6" strokeLinecap="round" />
              <line x1="30" y1="18" x2="35" y2="6" stroke="#FF6B16" strokeWidth="3.4" strokeLinecap="round" />
            </svg>

            {/* كلمة فلوسي بالأخضر الغامق */}
            <h1 className="text-6xl font-black text-[#064C3B] tracking-tight leading-none" style={{ letterSpacing: "-1px" }}>
              فلوسى
            </h1>

            {/* كلمة فين بالبرتقالي الزاهي */}
            <div className="text-6xl font-black text-[#FF6B16] tracking-tight leading-tight -mt-2" style={{ letterSpacing: "-1px" }}>
              فين؟
            </div>

            {/* القوس الموجي البرتقالي تحت كلمة فين؟ */}
            <div className="w-32 mx-auto mt-1">
              <svg width="128" height="14" viewBox="0 0 96 12" fill="none">
                <path
                  d="M4 8 Q24 2 48 6 Q72 10 92 4"
                  stroke="#FF6B16"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* الترحيب بحجم أكبر وأوضح */}
          <div className="flex items-center gap-2 mt-5 text-[#17221F] font-black text-lg">
            <span>مرحباً بك مجدداً</span>
            <span className="text-xl">👋</span>
          </div>
        </div>

        {/* تنبيه الخطأ إن وجد */}
        {error && (
          <div className="w-full mb-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold rounded-2xl text-center">
            {error}
          </div>
        )}

        {/* نموذج تسجيل الدخول */}
        <form onSubmit={handleLogin} className="w-full space-y-4">
          {/* حقل البريد الإلكتروني (Pill Input) */}
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className="w-full bg-[#FFFFFF] border border-[#E5E9E8] focus:border-[#064C3B] focus:ring-2 focus:ring-[#064C3B]/10 rounded-full px-5 py-4 text-sm text-[#17221F] placeholder:text-[#7C8581] font-bold outline-none transition-all pl-12 text-right"
              dir="rtl"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#064C3B]">
              <Mail className="w-5 h-5 stroke-[2]" />
            </div>
          </div>

          {/* حقل كلمة المرور (Pill Input) */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full bg-[#FFFFFF] border border-[#E5E9E8] focus:border-[#064C3B] focus:ring-2 focus:ring-[#064C3B]/10 rounded-full px-5 py-4 text-sm text-[#17221F] placeholder:text-[#7C8581] font-bold outline-none transition-all pl-12 pr-12 text-right"
              dir="rtl"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#064C3B]">
              <Lock className="w-5 h-5 stroke-[2]" />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7C8581] hover:text-[#064C3B] transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* نسيت كلمة المرور؟ */}
          <div className="text-left px-2">
            <button
              type="button"
              className="text-xs font-bold text-[#17221F] hover:text-[#064C3B] underline underline-offset-4 decoration-[#064C3B]/40 transition-colors"
            >
              نسيت كلمة المرور؟
            </button>
          </div>

          {/* زر تسجيل الدخول البرتقالي الأيقوني (Pill Button) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6B16] hover:bg-[#E55A0A] active:scale-[0.98] transition-all text-white font-black text-base rounded-full py-4 shadow-[0_8px_22px_rgba(255,107,22,0.38)] mt-2"
          >
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </button>

          {/* الفاصل "أو" */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-[#EAECEB]" />
            <span className="text-xs font-bold text-[#7C8581]">أو</span>
            <div className="flex-1 h-px bg-[#EAECEB]" />
          </div>

          {/* زر Google */}
          <button
            type="button"
            onClick={() => alert("قريباً! سيتم تفعيل الدخول عبر Google")}
            className="w-full bg-white border border-[#E5E9E8] hover:border-[#064C3B]/30 hover:bg-[#F9FAFB] active:scale-[0.98] transition-all text-[#17221F] font-bold text-sm rounded-full py-3.5 flex items-center justify-center gap-2.5 shadow-xs"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
              <path
                d="M44.5 20H24v8.5h11.8C34.7 33.9 29.9 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.4-.1-2.7-.5-4z"
                fill="#FFC107"
              />
              <path
                d="M6.3 14.7l7 5.1C15.1 16 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 16.3 3 9.7 7.9 6.3 14.7z"
                fill="#FF3D00"
              />
              <path
                d="M24 45c5.8 0 10.7-1.9 14.7-5.1l-6.8-5.6C29.8 35.9 27 37 24 37c-5.9 0-10.8-4-12.4-9.4L4.5 33c3.3 7 10.2 12 19.5 12z"
                fill="#4CAF50"
              />
              <path
                d="M44.5 20H24v8.5h11.8c-.9 2.5-2.6 4.7-4.8 6.1v.1l6.8 5.6C38 39.9 44.5 33 44.5 24c0-1.4-.1-2.7-.5-4z"
                fill="#1976D2"
              />
            </svg>
            <span>تسجيل الدخول عبر Google</span>
          </button>
        </form>

        {/* رابط إنشاء حساب جديد */}
        <div className="mt-6 text-center">
          <Link
            href="/auth/register"
            className="text-sm font-black text-[#17221F] hover:text-[#064C3B] underline underline-offset-4 decoration-[#FF6B16]/60 transition-colors"
          >
            إنشاء حساب جديد
          </Link>
        </div>
      </div>
    </div>
  );
}
