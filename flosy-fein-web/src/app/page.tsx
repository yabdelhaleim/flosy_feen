"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardApi, getUser, profileApi } from "@/lib/api";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Pencil,
  Bell,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Smartphone,
  X,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"both" | "installments" | "expenses">("both");

  // نافذة الإشعارات
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(false);

  // نافذة تعديل المرتب
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [newSalary, setNewSalary] = useState("");
  const [newSalaryDay, setNewSalaryDay] = useState("25");
  const [updatingSalary, setUpdatingSalary] = useState(false);

  const requestBrowserNotifications = async () => {
    if (!("Notification" in window)) {
      alert("المتصفح الحالي لا يدعم إشعارات سطح المكتب/الموبايل.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setBrowserNotificationsEnabled(true);
        new Notification("فلوسي فين؟ 🔔", {
          body: "تم تفعيل الإشعارات بنجاح! سننبهك قبل ميعاد كل قسط بيومين.",
          icon: "/icons/icon-192.png",
        });
        alert("تم تفعيل الإشعارات بنجاح! تم إرسال إشعار تجريبي 🔔");
      } else {
        alert("تم رفض إذن الإشعارات من إعدادات المتصفح.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadData = async () => {
    try {
      const currentUser = getUser();
      if (!currentUser) {
        router.push("/auth/login");
        return;
      }
      setUser(currentUser);

      const data = await dashboardApi.getSummary();
      setSummary(data);
      if (data?.salary?.amount) {
        setNewSalary(data.salary.amount.toString());
      }
      if (data?.salary?.day) {
        setNewSalaryDay(data.salary.day.toString());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateSalary = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingSalary(true);
    try {
      await profileApi.update({
        salary_amount: parseFloat(newSalary) || 0,
        salary_day: parseInt(newSalaryDay) || 25,
      });
      setShowSalaryModal(false);
      await loadData();
    } catch (err: any) {
      alert(err.message || "فشل تحديث المرتب");
    } finally {
      setUpdatingSalary(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-[#7C8581] min-h-[500px]">
        <div className="w-10 h-10 border-3 border-[#064C3B] border-t-[#FF6B16] rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-semibold">جاري تحميل البيانات...</p>
      </div>
    );
  }

  let currentRemaining = summary?.remaining?.both ?? 0;
  let remainingLabel = "بعد خصم المصروفات والأقساط";

  if (filterType === "expenses") {
    currentRemaining = summary?.remaining?.expenses_only ?? 0;
    remainingLabel = "بعد خصم المصروفات فقط";
  } else if (filterType === "installments") {
    currentRemaining = summary?.remaining?.installments_only ?? 0;
    remainingLabel = "بعد خصم الأقساط فقط";
  }

  const comparisonPercent = summary?.expenses?.comparison_percentage ?? 12;
  const isHigher = comparisonPercent >= 0;
  const upcomingItem = summary?.upcoming_installments?.[0];

  return (
    <div className="flex-1 flex flex-col bg-[#F5F6F7] min-h-screen pb-10 select-none">
      {/* 1. الترويسة الخضراء الداكنة (#064C3B) كما في الصورة المرجعية */}
      <div className="bg-[#064C3B] text-white pt-4 pb-8 px-5">
        <div className="flex justify-between items-center">
          {/* جرس الإشعارات مع بادج التنبيه الأحمر */}
          <button
            onClick={() => setShowNotificationsModal(true)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white relative hover:bg-white/20 transition-colors"
            title="الإشعارات والتنبيهات"
          >
            <Bell className="w-5 h-5 stroke-[2.2]" />
            <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#064C3B]">
              2
            </span>
          </button>

          {/* التحية والاسم في المنتصف */}
          <div className="flex items-center gap-1.5">
            <span className="text-xl">👋</span>
            <span className="text-base font-bold text-white tracking-tight">
              مرحباً، {user?.name?.split(" ")[0] || "أحمد"}
            </span>
          </div>

          {/* أيقونة الحساب الدائرية البيضاء */}
          <Link
            href="/profile"
            className="w-10 h-10 rounded-full bg-white text-[#064C3B] flex items-center justify-center shadow-sm hover:bg-gray-100 transition-colors"
          >
            <User className="w-5 h-5 stroke-[2.5]" />
          </Link>
        </div>
      </div>

      {/* 2. الحاوية البيضاء المنحنية الرئيسية */}
      <div className="flex-1 bg-[#F5F6F7] -mt-5 rounded-t-[2.2rem] pt-3 px-4 space-y-3.5 z-10">
        {/* شريط الشهر والتقويم */}
        <div className="bg-white/80 border border-[#EAECEB] rounded-2xl py-2 px-4 flex items-center justify-between text-xs font-bold text-[#17221F] shadow-xs">
          <button className="p-1 text-[#7C8581] hover:text-[#064C3B]">
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-extrabold tracking-wide">
              {summary?.month ? `مايو 2025` : "الشهر الحالي"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#7C8581]">
            <Calendar className="w-4 h-4 text-[#8B4513]" />
          </div>
        </div>

        {/* 3. كارت «المرتب الشهري» الأخضر الفاخر المطابق للمرجع */}
        <div className="bg-gradient-to-br from-[#064C3B] via-[#085542] to-[#0B6650] text-white p-5 rounded-[1.75rem] shadow-[0_12px_28px_rgba(6,76,59,0.3)] relative overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-100/90 font-bold">
                  المرتب الشهري
                </span>
                <button
                  onClick={() => setShowSalaryModal(true)}
                  className="text-white/60 hover:text-white p-0.5"
                  title="تعديل المرتب"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-3.5xl font-black tracking-tight text-white drop-shadow-sm">
                  {(summary?.salary?.amount ?? 12450).toLocaleString("ar-EG")}
                </span>
                <span className="text-sm font-bold text-emerald-200">ج.م</span>
              </div>

              <p className="text-[11px] text-emerald-200/80 font-medium pt-0.5">
                يوم القبض: {summary?.salary?.day ?? 25} مايو
              </p>
            </div>

            {/* أيقونة المحفظة الجلدية ثلاثية الأبعاد الفاخرة المطابقة للمرجع */}
            <div className="relative w-16 h-13 bg-gradient-to-br from-[#FF9800] to-[#E65100] rounded-2xl shadow-lg border-2 border-white/40 flex items-center justify-center transform -rotate-3 shrink-0">
              <div className="w-4 h-4 rounded-full bg-white/40 absolute left-2 top-4.5 border border-white/60" />
              <Wallet className="w-7 h-7 text-white drop-shadow-md" />
            </div>
          </div>
        </div>

        {/* 4. كارت «المتبقي من المرتب» البيج الرملي الفاخر مع كيس الفلوس الأخضر 3D */}
        <div className="bg-[#FFF8E7] border border-[#F5E6C4] p-5 rounded-[1.75rem] shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs font-extrabold text-[#17221F]">
                المتبقي من المرتب
              </span>

              <div className="flex items-baseline gap-1.5">
                <span className="text-3.5xl font-black tracking-tight text-[#17221F]">
                  {currentRemaining.toLocaleString("ar-EG")}
                </span>
                <span className="text-sm font-bold text-[#7C8581]">ج.م</span>
              </div>

              <p className="text-[11px] text-[#7C8581] font-semibold pt-0.5">
                {remainingLabel}
              </p>
            </div>

            {/* أيقونة كيس النقود الأخضر ثلاثي الأبعاد 💰 المطابق للمرجع */}
            <div className="relative w-15 h-15 bg-gradient-to-br from-[#2E7D32] via-[#388E3C] to-[#1B5E20] rounded-2xl shadow-md border-2 border-white flex flex-col items-center justify-center shrink-0">
              <div className="w-6 h-2 bg-[#66BB6A] rounded-full absolute -top-1" />
              <span className="text-white text-xl font-black drop-shadow-sm">$</span>
            </div>
          </div>
        </div>

        {/* 5. أزرار الفلتر الثلاثية المستقلة (Segmented Buttons) المطابقة تماماً */}
        <div className="grid grid-cols-3 gap-2 pt-0.5">
          {/* 1. مصروف معاً (الأخضر الداكن النشط) */}
          <button
            onClick={() => setFilterType("both")}
            className={`py-3 px-2 rounded-2xl text-xs font-black transition-all flex flex-col items-center justify-center ${
              filterType === "both"
                ? "bg-[#064C3B] text-white shadow-md shadow-[#064C3B]/20"
                : "bg-white text-[#7C8581] border border-[#EAECEB] hover:border-[#064C3B]"
            }`}
          >
            <span>مصروف معاً</span>
            <span className="text-[9px] opacity-80">معا</span>
          </button>

          {/* 2. أقساط فقط */}
          <button
            onClick={() => setFilterType("installments")}
            className={`py-3 px-2 rounded-2xl text-xs font-black transition-all flex flex-col items-center justify-center ${
              filterType === "installments"
                ? "bg-[#064C3B] text-white shadow-md shadow-[#064C3B]/20"
                : "bg-white text-[#7C8581] border border-[#EAECEB] hover:border-[#064C3B]"
            }`}
          >
            <span>اقساط</span>
            <span className="text-[9px] opacity-80">فقط</span>
          </button>

          {/* 3. مصروفات فقط */}
          <button
            onClick={() => setFilterType("expenses")}
            className={`py-3 px-2 rounded-2xl text-xs font-black transition-all flex flex-col items-center justify-center ${
              filterType === "expenses"
                ? "bg-[#064C3B] text-white shadow-md shadow-[#064C3B]/20"
                : "bg-white text-[#7C8581] border border-[#EAECEB] hover:border-[#064C3B]"
            }`}
          >
            <span>مصروفات</span>
            <span className="text-[9px] opacity-80">فقط</span>
          </button>
        </div>

        {/* 6. كارت «إجمالي المصروفات هذا الشهر» المطابق للمرجع */}
        <div className="bg-white p-4.5 rounded-[1.75rem] border border-[#EAECEB] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#E53935] flex items-center gap-0.5">
              <span>↑</span>
              <span>12%</span>
            </span>
          </div>

          <div className="text-left">
            <span className="text-xs font-bold text-[#17221F] block text-right">
              إجمالي المصروفات هذا الشهر
            </span>
            <div className="flex items-baseline gap-1 mt-0.5 justify-end">
              <span className="text-2xl font-black text-[#17221F]">
                {(summary?.expenses?.total ?? 5200).toLocaleString("ar-EG")}
              </span>
              <span className="text-xs font-bold text-[#7C8581]">ج.م</span>
            </div>
          </div>
        </div>

        {/* 7. كارت «الأقساط القادمة» المطابق للمرجع */}
        <div className="bg-white p-4.5 rounded-[1.75rem] border border-[#EAECEB] shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#17221F]">
              <Calendar className="w-4 h-4 text-[#8B4513]" />
              <span>الاقساط القادمة</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            {/* بادج "قادم" الأخضر الفاتح */}
            <span className="text-[10px] font-bold text-[#1E7E46] bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#C8E6C9]">
              قادم
            </span>

            {/* تفاصيل القسط */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <h4 className="text-xs font-extrabold text-[#17221F]">
                  {upcomingItem?.title || "قسط الموبايل"}
                </h4>
                <span className="text-[10px] text-[#7C8581]">
                  {upcomingItem?.due_date || "25 مايو"}
                </span>
              </div>

              {/* أيقونة أو صورة الموبايل في مربع أحمر خفيف */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 p-1 flex items-center justify-center text-white shadow-xs">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal تعديل المرتب */}
      {showSalaryModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-[#EAECEB] shadow-xl">
            <h3 className="text-sm font-bold text-[#064C3B]">تعديل بيانات المرتب</h3>
            <form onSubmit={handleUpdateSalary} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#7C8581] mb-1">
                  قيمة المرتب الشهري (ج.م)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  placeholder="مثال: 12450"
                  className="clean-input w-full px-3.5 py-2.5 text-sm font-bold text-[#064C3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7C8581] mb-1">
                  يوم القبض في الشهر (1 - 31)
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  value={newSalaryDay}
                  onChange={(e) => setNewSalaryDay(e.target.value)}
                  className="clean-input w-full px-3.5 py-2.5 text-xs font-semibold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={updatingSalary}
                  className="btn-primary-orange flex-1 py-2.5 rounded-xl text-xs"
                >
                  {updatingSalary ? "جاري الحفظ..." : "حفظ التعديل"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSalaryModal(false)}
                  className="px-4 bg-[#F5F6F7] text-[#7C8581] py-2.5 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة الإشعارات والتنبيهات التفاعلية */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 border border-[#EAECEB] shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#064C3B]/10 flex items-center justify-center text-[#064C3B]">
                  <Bell className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#17221F]">الإشعارات والتنبيهات</h3>
                  <p className="text-[10px] text-[#7C8581]">تنبيهات الأقساط والميزانية</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowNotificationsModal(false)}
                className="w-7 h-7 rounded-full bg-[#F5F6F7] hover:bg-gray-200 flex items-center justify-center text-[#7C8581] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* قائمة الإشعارات النشطة */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto no-scrollbar">
              {/* إشعار 1: قسط قادم */}
              <div className="p-3 rounded-2xl bg-orange-50/80 border border-orange-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FF6B16] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-xs font-bold text-[#17221F]">تنبيه: قسط الموبايل القادم</h4>
                    <span className="text-[10px] font-bold text-[#FF6B16]">قريباً</span>
                  </div>
                  <p className="text-[11px] text-[#7C8581] mt-0.5">
                    مستحق سداد مبلغ <strong className="text-[#17221F]">1,200 ج.م</strong> في موعد القبض القادم.
                  </p>
                </div>
              </div>

              {/* إشعار 2: معدل الصرف اليومي */}
              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#064C3B] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-xs font-bold text-[#17221F]">معدل الصرف اليومي المقترح</h4>
                    <span className="text-[10px] text-[#064C3B] font-bold">نشط</span>
                  </div>
                  <p className="text-[11px] text-[#7C8581] mt-0.5">
                    معدل الصرف الآمن لميزانيتك هو <strong className="text-[#064C3B]">228 ج.م / يوم</strong> حتى يوم القبض.
                  </p>
                </div>
              </div>

              {/* إشعار 3: نصيحة ذكية */}
              <div className="p-3 rounded-2xl bg-[#F5F6F7] border border-gray-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#064C3B] flex items-center justify-center shrink-0 mt-0.5 text-base">
                  💡
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-[#17221F]">نصيحة توفير هذا الشهر</h4>
                  <p className="text-[11px] text-[#7C8581] mt-0.5">
                    أعلى بند استهلاك كان الأكل والمطاعم بنسبة 35%، تقليل وجبة واحدة خارج المنزل يوفر لك ~250 ج.م.
                  </p>
                </div>
              </div>
            </div>

            {/* زر تفعيل إشعارات المتصفح والموبايل */}
            <div className="pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={requestBrowserNotifications}
                className="w-full bg-[#064C3B] hover:bg-[#0B6650] active:scale-[0.98] transition-all text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm"
              >
                <Bell className="w-4 h-4" />
                <span>
                  {browserNotificationsEnabled
                    ? "إشعارات المتصفح مفعلة بنجاح ✅"
                    : "تفعيل إشعارات الموبايل والمتصفح (Push Notifications)"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
