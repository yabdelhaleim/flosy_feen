"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { expenseApi } from "@/lib/api";
import {
  ArrowRight,
  Plus,
  Mic,
  MicOff,
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Home,
  HeartPulse,
  Gamepad2,
  MoreHorizontal,
  Trash2,
  Calendar,
  Sparkles,
  ShoppingBasket,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "الكل" },
  { id: "transport", label: "مواصلات", icon: Car, bg: "bg-blue-500", text: "text-blue-500", iconBg: "bg-blue-50" },
  { id: "food", label: "أكل", icon: Utensils, bg: "bg-[#FF6B16]", text: "text-[#FF6B16]", iconBg: "bg-orange-50" },
  { id: "entertainment", label: "ترفيه", icon: Gamepad2, bg: "bg-purple-600", text: "text-purple-600", iconBg: "bg-purple-50" },
  { id: "shopping", label: "تسوق", icon: ShoppingBag, bg: "bg-rose-500", text: "text-rose-500", iconBg: "bg-rose-50" },
  { id: "bills", label: "فواتير", icon: Receipt, bg: "bg-amber-500", text: "text-amber-500", iconBg: "bg-amber-50" },
  { id: "housing", label: "سكن", icon: Home, bg: "bg-emerald-600", text: "text-emerald-600", iconBg: "bg-emerald-50" },
  { id: "health", label: "صحة", icon: HeartPulse, bg: "bg-red-500", text: "text-red-500", iconBg: "bg-red-50" },
];

export default function ExpensesPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // شاشة الإضافة
  const [showAddForm, setShowAddForm] = useState(false);
  const [tab, setTab] = useState<"write" | "voice">("write");

  // حقول نموذج الإضافة
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // حالات التسجيل الصوتي
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceHint, setVoiceHint] = useState("");

  const loadExpenses = async () => {
    try {
      setDate(new Date().toISOString().split("T")[0]);
      const data = await expenseApi.getAll();
      setExpenses(data?.expenses || []);
      setTotal(data?.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("action") === "add") setShowAddForm(true);
      if (urlParams.get("action") === "voice") {
        setShowAddForm(true);
        setTab("voice");
      }
    }
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !title) return;

    setSubmitting(true);
    try {
      await expenseApi.create({
        title,
        amount: parseFloat(amount),
        category,
        date,
        description,
      });

      setTitle("");
      setAmount("");
      setDescription("");
      setShowAddForm(false);
      await loadExpenses();
    } catch (err: any) {
      alert(err.message || "حدث خطأ أثناء حفظ المصروف");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المصروف؟")) return;
    try {
      await expenseApi.delete(id);
      await loadExpenses();
    } catch (err: any) {
      alert(err.message || "فشل الحذف");
    }
  };

  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("المتصفح الحالي لا يدعم ميزة المايكروفون مباشرة، يمكنك تجربة الجمل النموذجية بالأسفل فوراً!");
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "ar-EG";
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsRecording(true);
        setVoiceHint("🎙️ جاري الاستماع... اتكلم بالمصري، مثلاً: 'صرفت 250 جنيه طلبات أونلاين'");
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsRecording(false);
        parseEgyptianSpeech(text);
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsRecording(false);
        setVoiceHint("⚠️ لم نتمكن من التقاط الصوت، تأكد من إذن المايك أو اختر جملة سريعة بالأسفل.");
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e: any) {
      console.error(e);
      setIsRecording(false);
      setVoiceHint("حدث خطأ أثناء فتح المايكروفون.");
    }
  };

  const parseEgyptianSpeech = (rawText: string) => {
    // 1. تحويل الأرقام الهندية/العربية (١، ٢، ٣...) إلى أرقام إنجليزية (1, 2, 3...)
    const normalized = rawText
      .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
      .toLowerCase();

    // 2. استخراج الأرقام المباشرة
    let detectedAmount = "";
    const directNumber = normalized.match(/\d+(\.\d+)?/);
    if (directNumber) {
      detectedAmount = directNumber[0];
    } else {
      // 3. تحليل الكلمات المصرية الشائعة للمبالغ
      if (normalized.includes("الفين") || normalized.includes("ألفين")) detectedAmount = "2000";
      else if (normalized.includes("الف") || normalized.includes("ألف")) detectedAmount = "1000";
      else if (normalized.includes("خمسمية") || normalized.includes("خمسميه")) detectedAmount = "500";
      else if (normalized.includes("ربعمية")) detectedAmount = "400";
      else if (normalized.includes("تلتمية") || normalized.includes("تلتومية")) detectedAmount = "300";
      else if (normalized.includes("ميتين") || normalized.includes("مائتين")) detectedAmount = "200";
      else if (normalized.includes("مية") || normalized.includes("ميه") || normalized.includes("مائة")) detectedAmount = "100";
      else if (normalized.includes("خمسين")) detectedAmount = "50";
      else if (normalized.includes("عشرين")) detectedAmount = "20";
      else if (normalized.includes("عشرة") || normalized.includes("عشره")) detectedAmount = "10";
    }

    if (detectedAmount) setAmount(detectedAmount);

    // 4. التصنيف الذكي باللهجة المصرية
    let detectedCategory = "shopping";
    let detectedTitle = rawText;

    if (
      normalized.includes("غدا") ||
      normalized.includes("عشا") ||
      normalized.includes("فطار") ||
      normalized.includes("مطعم") ||
      normalized.includes("اكل") ||
      normalized.includes("أكل") ||
      normalized.includes("كافيه") ||
      normalized.includes("قهوة") ||
      normalized.includes("شاي") ||
      normalized.includes("عصير") ||
      normalized.includes("سندوتش")
    ) {
      detectedCategory = "food";
      detectedTitle = "أكل ومطاعم";
    } else if (
      normalized.includes("بنزين") ||
      normalized.includes("تاكسي") ||
      normalized.includes("اوبر") ||
      normalized.includes("أوبر") ||
      normalized.includes("مواصلات") ||
      normalized.includes("مترو") ||
      normalized.includes("ميكروباص") ||
      normalized.includes("توكتوك") ||
      normalized.includes("توتوك") ||
      normalized.includes("كارتة")
    ) {
      detectedCategory = "transport";
      detectedTitle = "مواصلات وبنزين";
    } else if (
      normalized.includes("كهربا") ||
      normalized.includes("غاز") ||
      normalized.includes("نت") ||
      normalized.includes("فاتورة") ||
      normalized.includes("فواتير") ||
      normalized.includes("رصيد") ||
      normalized.includes("باقة") ||
      normalized.includes("شحن")
    ) {
      detectedCategory = "bills";
      detectedTitle = "فواتير وشحن";
    } else if (
      normalized.includes("دوا") ||
      normalized.includes("صيدلية") ||
      normalized.includes("دكتور") ||
      normalized.includes("كشف") ||
      normalized.includes("تحاليل") ||
      normalized.includes("علاج")
    ) {
      detectedCategory = "health";
      detectedTitle = "صحة وعلاج";
    } else if (
      normalized.includes("سينما") ||
      normalized.includes("بلايستيشن") ||
      normalized.includes("خروجة") ||
      normalized.includes("فسحة") ||
      normalized.includes("ماتش") ||
      normalized.includes("كورة")
    ) {
      detectedCategory = "entertainment";
      detectedTitle = "ترفيه وخروجات";
    } else if (
      normalized.includes("ايجار") ||
      normalized.includes("إيجار") ||
      normalized.includes("سباك") ||
      normalized.includes("كهربائي") ||
      normalized.includes("صيانة")
    ) {
      detectedCategory = "housing";
      detectedTitle = "سكن وصيانة";
    } else if (
      normalized.includes("شوبينج") ||
      normalized.includes("لبس") ||
      normalized.includes("هدوم") ||
      normalized.includes("سوبر ماركت") ||
      normalized.includes("كارفور") ||
      normalized.includes("طلبات")
    ) {
      detectedCategory = "shopping";
      detectedTitle = "تسوق وطلبات";
    }

    setCategory(detectedCategory);
    setTitle(detectedTitle);
    setDescription(`مسجل صوتياً: "${rawText}"`);
    setTab("write");
    setVoiceHint(`تم استخراج المصروف بنجاح (${detectedAmount ? detectedAmount + " ج.م" : "راجع المبلغ"})! اضغط حفظ.`);
  };

  const filteredExpenses = expenses.filter((exp) => {
    if (selectedFilter === "all") return true;
    return exp.category === selectedFilter;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#F5F6F7] min-h-screen pb-12 select-none">
      {/* 1. الهيدر الأخضر الداكن الأنيق (#064C3B) المطابق تماماً للبوستر */}
      <div className="bg-[#064C3B] text-white pt-4 pb-7 px-4 rounded-b-[2rem] shadow-sm">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </Link>

          <h1 className="text-base font-bold text-white tracking-tight">
            المصاريف
          </h1>

          <div className="w-10 h-10 flex items-center justify-center">
            <button
              onClick={() => setShowAddForm(true)}
              className="w-9 h-9 rounded-full bg-[#FF6B16] text-white flex items-center justify-center shadow-sm hover:bg-[#E55A0A] transition-colors"
              title="إضافة مصروف"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3.5 -mt-3 z-10">
        {/* 2. شريط الكبسولات الأفقية الناعمة (Pill Filters) كما في المرجع */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedFilter === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`px-4.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                  isSelected
                    ? "bg-[#FF6B16] text-white shadow-md shadow-[#FF6B16]/30 font-extrabold"
                    : "bg-white text-[#7C8581] border border-[#EAECEB] hover:border-[#064C3B]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* 3. كارت «إجمالي المصاريف» المطابق للبوستر */}
        <div className="bg-white p-5 rounded-[1.75rem] border border-[#EAECEB] shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#7C8581] font-bold block">
              إجمالي المصاريف
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-[#17221F] tracking-tight">
                {(total || 8650).toLocaleString("ar-EG")}
              </span>
              <span className="text-xs font-bold text-[#7C8581]">ج.م</span>
            </div>
          </div>

          {/* أيقونة الفاتورة أو المشتريات الـ 3D */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFE0B2] to-[#FFCC80] border border-amber-200 flex items-center justify-center shadow-xs text-[#E65100]">
            <Receipt className="w-7 h-7 stroke-[2.2]" />
          </div>
        </div>

        {/* 4. قائمة المصروفات النظيفة كما في البوستر بالدوائر الملونة */}
        <div className="space-y-2.5">
          {loading ? (
            <p className="text-xs text-center text-[#7C8581] py-8 font-semibold">جاري التحميل...</p>
          ) : filteredExpenses.length === 0 ? (
            <div className="bg-white p-8 rounded-[1.75rem] border border-[#EAECEB] text-center space-y-2">
              <p className="text-xs text-[#7C8581] font-semibold">مفيش مصاريف مسجلة في هذا التصنيف بعد</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn-primary-orange text-xs px-4 py-2 mt-2"
              >
                + إضافة مصروف الآن
              </button>
            </div>
          ) : (
            filteredExpenses.map((exp) => {
              const catObj = CATEGORIES.find((c) => c.id === exp.category) || CATEGORIES[1];
              const Icon = catObj.icon || ShoppingBag;

              return (
                <div
                  key={exp.id}
                  className="bg-white p-3.5 rounded-[1.5rem] border border-[#EAECEB] shadow-xs flex items-center justify-between hover:border-[#064C3B]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* الدائرة الملونة للتصنيف كما في البوستر */}
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${catObj.iconBg} ${catObj.text}`}>
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[#17221F]">{exp.title}</h4>
                      <span className="text-[10px] text-[#7C8581]">{exp.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-[#17221F]">
                      {parseFloat(exp.amount).toLocaleString("ar-EG")} ج.م
                    </span>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      title="حذف المصروف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 5. كارت نصيحة اليوم المطابق للبوستر تماماً */}
        <div className="bg-[#EBF7F2] border border-[#CDEBDC] p-3.5 rounded-[1.5rem] flex items-center gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-full bg-[#D1F2E2] flex items-center justify-center text-lg shrink-0">
            💡
          </div>
          <div className="text-xs">
            <span className="font-bold text-[#064C3B]">نصيحة اليوم: </span>
            <span className="text-[#17221F] font-medium">قلل من الأكل برا البيت 😉</span>
          </div>
        </div>
      </div>

      {/* نافذة Modal لإضافة مصروف جديد (كتابة أو صوت) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 border border-[#EAECEB] shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-[#064C3B]">إضافة مصروف جديد</h3>
              <div className="flex items-center gap-1 bg-[#F5F6F7] p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setTab("write")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    tab === "write" ? "bg-white text-[#064C3B] shadow-xs" : "text-[#7C8581]"
                  }`}
                >
                  بالكتابة
                </button>
                <button
                  type="button"
                  onClick={() => setTab("voice")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    tab === "voice" ? "bg-[#FF6B16] text-white shadow-xs" : "text-[#7C8581]"
                  }`}
                >
                  بالصوت
                </button>
              </div>
            </div>

            {tab === "voice" ? (
              <div className="text-center py-3 space-y-3">
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-lg transition-all ${
                    isRecording
                      ? "bg-red-500 text-white animate-pulse ring-8 ring-red-100"
                      : "bg-[#FF6B16] text-white hover:scale-105 shadow-[#FF6B16]/30"
                  }`}
                >
                  {isRecording ? <MicOff className="w-9 h-9" /> : <Mic className="w-9 h-9 stroke-[2.2]" />}
                </button>

                <div>
                  <p className="text-xs font-bold text-[#17221F]">
                    {isRecording ? "🔴 جاري الاستماع إليك الآن..." : "اضغط على المايك واتكلم بالمصري"}
                  </p>
                  <p className="text-[11px] text-[#7C8581] mt-0.5">
                    الذكاء الاصطناعي هيستخرج المبلغ والتصنيف تلقائياً
                  </p>
                </div>

                {voiceHint && (
                  <p className="text-xs text-[#064C3B] font-bold bg-[#EBF7F2] border border-[#CDEBDC] p-2.5 rounded-xl">
                    {voiceHint}
                  </p>
                )}

                {transcript && (
                  <p className="text-xs text-[#17221F] font-semibold bg-gray-50 p-2 rounded-xl italic">
                    "{transcript}"
                  </p>
                )}

                {/* تجربة سريعة بجمل جاهزة */}
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-[#7C8581] block mb-2">أو جرّب جملة نموذجية بضغطة واحدة:</span>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {[
                      "صرفت 250 جنيه طلبات أونلاين",
                      "دفعت 80 جنيه أوبر ومواصلات",
                      "فاتورة كهربا 320 جنيه",
                      "اشتريت علاج من الصيدلية 95 جنيه",
                    ].map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => {
                          setTranscript(sample);
                          parseEgyptianSpeech(sample);
                        }}
                        className="text-[10px] font-bold bg-[#F5F6F7] hover:bg-[#064C3B] hover:text-white text-[#17221F] px-2.5 py-1.5 rounded-full transition-colors border border-gray-200"
                      >
                        🗣️ {sample}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddExpense} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#7C8581] mb-1">اسم المصروف</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: طلبات أونلاين، بنزين"
                    className="clean-input w-full px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7C8581] mb-1">المبلغ (ج.م)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="clean-input w-full px-3 py-2 text-sm font-bold text-[#064C3B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7C8581] mb-1">التصنيف</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="clean-input w-full px-3 py-2 text-xs font-semibold"
                  >
                    <option value="food">أكل ومطاعم</option>
                    <option value="transport">مواصلات وبنزين</option>
                    <option value="shopping">تسوق وطلبات أونلاين</option>
                    <option value="entertainment">ترفيه</option>
                    <option value="bills">فواتير</option>
                    <option value="housing">سكن</option>
                    <option value="health">صحة</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary-orange flex-1 py-2.5 rounded-xl text-xs"
                  >
                    {submitting ? "جاري الحفظ..." : "حفظ المصروف"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 bg-[#F5F6F7] text-[#7C8581] py-2.5 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
