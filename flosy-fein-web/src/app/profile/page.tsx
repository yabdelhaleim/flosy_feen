"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, profileApi, authApi } from "@/lib/api";
import {
  User,
  Wallet,
  Calendar,
  LogOut,
  Download,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [salary, setSalary] = useState("");
  const [salaryDay, setSalaryDay] = useState("25");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/auth/login");
      return;
    }
    setUser(currentUser);
    setName(currentUser.name || "");
    setSalary(currentUser.salary_amount ? currentUser.salary_amount.toString() : "");
    setSalaryDay(currentUser.salary_day ? currentUser.salary_day.toString() : "25");
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setErrorMsg("");

    try {
      const updated = await profileApi.update({
        name,
        salary_amount: parseFloat(salary) || 0,
        salary_day: parseInt(salaryDay) || 25,
      });
      setUser(updated);
      setMessage("تم تحديث بياناتك بنجاح ومزامنة الميزانية! 🎉");
      setTimeout(() => setMessage(""), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء التحديث");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("هل أنت متأكد من تسجيل الخروج؟")) {
      await authApi.logout();
      router.push("/auth/login");
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-3 pb-24 bg-[#F5F6F7]">
      {/* 1. الهيدر الأخضر الداكن الأنيق (#064C3B) */}
      <div className="bg-[#064C3B] text-white pt-4 pb-7 px-4 rounded-b-[2rem] shadow-sm relative overflow-hidden">
        {/* خلفية فنية خفيفة مستوحاة من الهوية */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FF6B16]/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex justify-between items-center relative z-10">
          <Link
            href="/"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title="رجوع للرئيسية"
          >
            <ArrowRight className="w-5 h-5 stroke-[2.2]" />
          </Link>

          <h1 className="text-base font-bold text-white tracking-tight">
            حسابي والميزانية
          </h1>

          <div className="w-9 h-9" />
        </div>
      </div>

      <div className="px-3.5 space-y-3 -mt-3 relative z-20">
        {/* 2. كارت الملف الشخصي المعاصر */}
        <div className="fintech-clean-card p-4 text-center relative overflow-hidden">
          <div className="relative inline-block mx-auto mb-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#064C3B] to-[#0B6650] border-3 border-white shadow-md flex items-center justify-center text-white text-2xl font-bold">
              {user?.name ? user.name[0] : "م"}
            </div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-[#FF6B16] border-2 border-white flex items-center justify-center text-white text-[10px]">
              ✨
            </div>
          </div>

          <h2 className="text-base font-black text-[#17221F]">{user?.name || "صاحب الحساب"}</h2>
          <p className="text-[11px] text-[#7C8581] font-medium">{user?.email}</p>

          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-[#064C3B]/8 text-[#064C3B] rounded-full text-[11px] font-bold border border-[#064C3B]/10">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B16]" />
            <span>متحكم في مصاريفه مع فلوسي فين</span>
          </div>
        </div>

        {/* تنبيهات النجاح والخطأ */}
        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#064C3B] text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 3. نموذج تعديل المرتب ويوم القبض */}
        <form onSubmit={handleUpdate} className="fintech-clean-card p-4 space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#F5F6F7] pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#064C3B]/10 flex items-center justify-center text-[#064C3B]">
                <Wallet className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h3 className="text-xs font-bold text-[#17221F]">إعدادات القبض والميزانية</h3>
            </div>
            <span className="text-[10px] text-[#7C8581] font-medium">شهرياً</span>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#7C8581] mb-1">
              اسمك كما تحب أن يظهر
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="clean-input w-full px-3.5 py-2.5 text-xs text-[#17221F] font-bold"
                placeholder="اسمك"
              />
              <User className="w-4 h-4 text-[#7C8581] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#7C8581] mb-1">
              المرتب أو الدخل الشهري الثابت (ج.م)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="مثال: 15000"
                className="clean-input w-full px-3.5 py-2.5 text-sm font-black text-[#064C3B]"
              />
              <span className="absolute left-3 top-2.5 text-xs font-bold text-[#FF6B16] bg-[#FF6B16]/10 px-2 py-0.5 rounded-md">
                ج.م
              </span>
            </div>
            <p className="text-[10px] text-[#7C8581] mt-1">
              يُستخدم لاحتساب صافي المتبقي من المرتب تلقائياً بعد المصاريف والأقساط.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-[#7C8581]">
                يوم استلام المرتب (يوم القبض)
              </label>
              <span className="text-xs font-black text-[#064C3B] bg-[#E8F5E9] px-2 py-0.5 rounded-md">
                يوم {salaryDay} في الشهر
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="31"
                required
                value={salaryDay}
                onChange={(e) => setSalaryDay(e.target.value)}
                className="clean-input w-full px-3.5 py-2.5 text-xs font-bold text-[#17221F]"
              />
              <Calendar className="w-4 h-4 text-[#7C8581] absolute left-3 top-3" />
            </div>
            <p className="text-[10px] text-[#7C8581] mt-1">
              يحسب التطبيق كم يوم فاضلين على القبض الجاي ومعدل الصرف اليومي.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary-orange w-full py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#FF6B16]/25 mt-2"
          >
            <span>{saving ? "جاري الحفظ..." : "حفظ بيانات الميزانية"}</span>
          </button>
        </form>

        {/* 4. كارت تطبيق PWA والأمان */}
        <div className="fintech-clean-card p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-[#064C3B]">
            <div className="w-7 h-7 rounded-lg bg-[#FF6B16]/10 flex items-center justify-center text-[#FF6B16]">
              <Download className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#17221F]">تطبيق الويب التقدمي (PWA)</h4>
              <p className="text-[10px] text-[#7C8581]">تصفح سريع وبدون إنترنت على موبايلك</p>
            </div>
          </div>
          <p className="text-[11px] text-[#7C8581] leading-relaxed bg-[#F5F6F7] p-2.5 rounded-xl">
            💡 اضغط على قائمة المتصفح (الثلاث نقاط) واختر <strong className="text-[#17221F]">"إضافة إلى الشاشة الرئيسية"</strong> ليعمل التطبيق كأنه مثبت من المتجر بأيقونة "فلوسي فين؟".
          </p>
        </div>

        {/* زر عرض التعليمات والإعلانات الترحيبية */}
        <button
          onClick={() => {
            if (typeof window !== "undefined" && (window as any).showFlosyOnboarding) {
              (window as any).showFlosyOnboarding();
            }
          }}
          className="w-full bg-[#064C3B]/10 hover:bg-[#064C3B]/20 text-[#064C3B] border border-[#064C3B]/20 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-[#FF6B16]" />
          <span>عرض تعليمات التطبيق والإعلانات الترحيبية 💡</span>
        </button>

        {/* 5. زر تسجيل الخروج الأنيق */}
        <button
          onClick={handleLogout}
          className="w-full bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 py-3 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج من الحساب</span>
        </button>

        {/* توقيع الهوية المصرية */}
        <div className="text-center text-[10px] text-[#7C8581] pt-2">
          فلوسي فين؟ · اعرف فلوسك قبل ما تروح 🇪🇬
        </div>
      </div>
    </div>
  );
}
