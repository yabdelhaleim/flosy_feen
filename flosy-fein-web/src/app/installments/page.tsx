"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { installmentApi } from "@/lib/api";
import {
  CalendarCheck,
  Plus,
  Clock,
  ArrowRight,
  Check,
  Trash2,
  Calendar,
  Smartphone,
  AlertCircle,
  CreditCard,
  Layers,
} from "lucide-react";

export default function InstallmentsPage() {
  const [installments, setInstallments] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("upcoming");
  const [loading, setLoading] = useState(true);

  // نافذة إضافة قسط
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"one_time" | "recurring">("recurring");
  const [startDate, setStartDate] = useState("");
  const [totalInstallments, setTotalInstallments] = useState("12");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadInstallments = async () => {
    try {
      setStartDate(new Date().toISOString().split("T")[0]);
      const data = await installmentApi.getAll();
      setInstallments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstallments();
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("action") === "add") setShowAddModal(true);
    }
  }, []);

  const handleAddInstallment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await installmentApi.create({
        title,
        amount: parseFloat(amount),
        type,
        start_date: startDate,
        total_installments: type === "recurring" ? parseInt(totalInstallments) : undefined,
        description,
      });

      setShowAddModal(false);
      setTitle("");
      setAmount("");
      await loadInstallments();
    } catch (err: any) {
      alert(err.message || "حدث خطأ أثناء إضافة القسط");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsPaid = async (installmentId: number, paymentId: number) => {
    try {
      await installmentApi.markAsPaid(installmentId, paymentId);
      await loadInstallments();
    } catch (err: any) {
      alert(err.message || "فشل تسجيل الدفع");
    }
  };

  const handleDeleteInstallment = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا القسط وكل دفعاته؟")) return;
    try {
      await installmentApi.delete(id);
      await loadInstallments();
    } catch (err: any) {
      alert(err.message || "فشل حذف القسط");
    }
  };

  let totalInstallmentsAmount = 0;
  let paidTotal = 0;
  let remainingTotal = 0;

  installments.forEach((inst) => {
    inst.payments?.forEach((p: any) => {
      const amt = parseFloat(inst.amount);
      totalInstallmentsAmount += amt;
      if (p.status === "paid") {
        paidTotal += amt;
      } else {
        remainingTotal += amt;
      }
    });
  });

  return (
    <div className="flex-1 flex flex-col bg-[#F5F6F7] min-h-screen pb-14 select-none">
      {/* 1. الهيدر الأخضر الداكن المنحني (#064C3B) الموحد */}
      <div className="bg-[#064C3B] text-white pt-4 pb-7 px-4 rounded-b-[2rem] shadow-sm">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </Link>

          <h1 className="text-base font-bold text-white tracking-tight">
            الأقساط والالتزامات
          </h1>

          <div className="w-10 h-10 flex items-center justify-center">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-9 h-9 rounded-full bg-[#FF6B16] text-white flex items-center justify-center shadow-sm hover:bg-[#E55A0A] transition-colors"
              title="إضافة قسط جديد"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3.5 -mt-3 z-10">
        {/* 2. شريط الإحصائيات العلوية الثلاث بالكروت البيضاء النظيفة */}
        <div className="grid grid-cols-3 gap-2">
          <div className="fintech-clean-card p-3 text-center">
            <span className="text-[10px] text-[#7C8581] font-bold">إجمالي الأقساط</span>
            <div className="text-xs font-black text-[#17221F] mt-0.5">
              {totalInstallmentsAmount.toLocaleString("ar-EG")}
            </div>
            <span className="text-[9px] text-[#7C8581]">ج.م</span>
          </div>

          <div className="fintech-clean-card p-3 text-center">
            <span className="text-[10px] text-[#7C8581] font-bold">المدفوعة</span>
            <div className="text-xs font-black text-[#064C3B] mt-0.5">
              {paidTotal.toLocaleString("ar-EG")}
            </div>
            <span className="text-[9px] text-[#7C8581]">ج.م</span>
          </div>

          <div className="fintech-clean-card p-3 text-center">
            <span className="text-[10px] text-[#7C8581] font-bold">المتبقية</span>
            <div className="text-xs font-black text-[#FF6B16] mt-0.5">
              {remainingTotal.toLocaleString("ar-EG")}
            </div>
            <span className="text-[9px] text-[#7C8581]">ج.م</span>
          </div>
        </div>

        {/* 3. شريط الفلاتر الكبسولية لحالات الأقساط الموحد */}
        <div className="flex items-center gap-2 py-1">
          <button
            onClick={() => setStatusFilter("upcoming")}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all text-center ${
              statusFilter === "upcoming"
                ? "bg-[#FF6B16] text-white shadow-md shadow-[#FF6B16]/25 font-extrabold"
                : "bg-white text-[#7C8581] border border-[#EAECEB] hover:border-[#064C3B]"
            }`}
          >
            القادمة
          </button>
          <button
            onClick={() => setStatusFilter("overdue")}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all text-center ${
              statusFilter === "overdue"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/25 font-extrabold"
                : "bg-white text-[#7C8581] border border-[#EAECEB] hover:border-rose-600"
            }`}
          >
            المتأخرة
          </button>
          <button
            onClick={() => setStatusFilter("paid")}
            className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all text-center ${
              statusFilter === "paid"
                ? "bg-[#064C3B] text-white shadow-md shadow-[#064C3B]/25 font-extrabold"
                : "bg-white text-[#7C8581] border border-[#EAECEB] hover:border-[#064C3B]"
            }`}
          >
            المدفوعة
          </button>
        </div>

        {/* 4. قائمة كروت الأقساط الفخمة */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-xs text-center text-[#7C8581] py-8 font-semibold">جاري التحميل...</p>
          ) : installments.length === 0 ? (
            <div className="fintech-clean-card p-8 text-center space-y-2">
              <CalendarCheck className="w-10 h-10 mx-auto text-[#064C3B]/60" />
              <h4 className="text-xs font-bold text-[#17221F]">مفيش أقساط مسجلة بعد</h4>
              <p className="text-[11px] text-[#7C8581]">
                سجل أقساطك الشهرية عشان التطبيق ينبهك ويحسبلك المتبقي بدقة
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary-orange text-xs px-5 py-2.5 mt-2"
              >
                + تسجيل أول قسط
              </button>
            </div>
          ) : (
            installments.map((inst) => {
              const filteredPayments = inst.payments?.filter(
                (p: any) => p.status === statusFilter
              );

              if (filteredPayments.length === 0) return null;

              return (
                <div
                  key={inst.id}
                  className="fintech-clean-card p-4 space-y-3 hover:border-[#064C3B]/40 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#F0F5F3] flex items-center justify-center text-[#064C3B] shrink-0">
                        <Smartphone className="w-5 h-5 text-[#064C3B]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#17221F] flex items-center gap-1.5">
                          <span>{inst.title}</span>
                          <span className="text-[9px] bg-gray-100 text-[#7C8581] font-semibold px-2 py-0.5 rounded-md">
                            {inst.type === "recurring" ? `متكرر (${inst.total_installments} شهر)` : "مرة واحدة"}
                          </span>
                        </h4>
                        <span className="text-[10px] text-[#7C8581]">
                          القسط: <span className="font-bold text-[#17221F]">{parseFloat(inst.amount).toLocaleString("ar-EG")} ج.م</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteInstallment(inst.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      title="حذف القسط بالكامل"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* قائمة الدفعات لهذا القسط */}
                  <div className="space-y-1.5 pt-2 border-t border-gray-100">
                    {filteredPayments.map((payment: any) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F6F7] text-xs"
                      >
                        <div className="flex items-center gap-1.5 text-[11px] text-[#17221F] font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#7C8581]" />
                          <span>استحقاق: {payment.due_date}</span>
                        </div>

                        {payment.status === "paid" ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-[#064C3B] bg-[#E8F5E9] px-2.5 py-0.5 rounded-md border border-[#C8E6C9]">
                            <Check className="w-3 h-3 stroke-[2.5]" /> تم الدفع
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMarkAsPaid(inst.id, payment.id)}
                            className="bg-[#064C3B] hover:bg-[#085C47] text-white text-[10px] font-bold px-3 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <Check className="w-3 h-3 stroke-[2.5]" /> تم الدفع
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal إضافة قسط جديد */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-3.5 border border-[#EAECEB] shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-[#064C3B]">إضافة قسط جديد</h3>

            <form onSubmit={handleAddInstallment} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#7C8581] mb-1">اسم القسط</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: قسط الموبايل، جمعية"
                  className="clean-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7C8581] mb-1">قيمة القسط الشهري (ج.م)</label>
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
                <label className="block text-xs font-bold text-[#7C8581] mb-1">نوع القسط</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType("recurring")}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      type === "recurring"
                        ? "border-[#064C3B] bg-[#E8F5E9] text-[#064C3B]"
                        : "border-gray-200 text-[#7C8581]"
                    }`}
                  >
                    متكرر شهرياً
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("one_time")}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      type === "one_time"
                        ? "border-[#064C3B] bg-[#E8F5E9] text-[#064C3B]"
                        : "border-gray-200 text-[#7C8581]"
                    }`}
                  >
                    لمرة واحدة
                  </button>
                </div>
              </div>

              {type === "recurring" && (
                <div>
                  <label className="block text-xs font-bold text-[#7C8581] mb-1">عدد الأقساط (بالشهور)</label>
                  <input
                    type="number"
                    min="2"
                    max="120"
                    required
                    value={totalInstallments}
                    onChange={(e) => setTotalInstallments(e.target.value)}
                    placeholder="مثال: 12"
                    className="clean-input w-full px-3 py-2 text-xs"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#7C8581] mb-1">تاريخ أول استحقاق</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="clean-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary-orange flex-1 py-2.5 rounded-xl text-xs"
                >
                  {submitting ? "جاري الإنشاء..." : "حفظ القسط"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 bg-[#F5F6F7] text-[#7C8581] py-2.5 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
