"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Mic, BellRing, TrendingUp, X, ExternalLink } from "lucide-react";

export interface OnboardingSlide {
  id: number;
  tag: string;
  tagType: "feature" | "ad" | "tip";
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  icon?: any;
  ctaText?: string;
  ctaLink?: string;
}

// ── شرائح التعليمات والإعلانات الترحيبية (يمكن إضافة إعلانات جديدة هنا بسهولة) ──
const DEFAULT_SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    tag: "ميزة حصرية 🎙️",
    tagType: "feature",
    title: "سجل مصاريفك بالصوت في ثواني!",
    subtitle: "كأنك بتسجل فويس نوت لصاحبك",
    description: "قول مثلاً: «صرفت 50 جنيه قهوة وسجاير» والتطبيق هيفهم ويسجلها في بند المصروفات لوحده بدون كتابة!",
    image: "/logo.jpg",
  },
  {
    id: 2,
    tag: "إعلان ممول / شراكة 🎁",
    tagType: "ad",
    title: "عروض وباقات خاصة لمستخدمي فلوسي فين",
    subtitle: "خصومات تصل لـ 30% مع شركائنا",
    description: "استمتع بأقوى العروض الحصرية على كروت الشحن والتقسيط والمشتريات الشهرية من خلال شبكة شركائنا المعتمدين.",
    image: "/splash-hero.jpg",
    ctaText: "تفقد العروض الحالية",
    ctaLink: "https://floseyfeen.remotelly1.site",
  },
  {
    id: 3,
    tag: "إدارة الأقساط 📅",
    tagType: "feature",
    title: "ولا قسط هيفوتك بعد النهاردة",
    subtitle: "تنبيهات ذكية قبل ميعاد السداد",
    description: "سجل قسط الموبايل، الجمعية، أو كارت الائتمان، وهنبعتلك إشعارات ذكية تفكرك بالدفع قبل ما يحسبوا عليك غرامة تأخير.",
    image: "/icons/icon-512.png",
  },
  {
    id: 4,
    tag: "تحكم مالي ذكي 📊",
    tagType: "tip",
    title: "اعرف فلوسك بتروح فين قبل آخر الشهر",
    subtitle: "متابعة المتبقي من المرتب لحظة بلحظة",
    description: "احسب صافي ميزانيتك، وشوف أكتر بند بيسحب من محفظتك عشان تحوش وتظبط مصاريفك زي المحترفين.",
    image: "/logo.jpg",
  },
];

export default function OnboardingSlider({
  forceOpen = false,
  onClose,
}: {
  forceOpen?: boolean;
  onClose?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    // التحقق هل المستخدم شاف الإعلانات والتعليمات قبل كده ولا مستخدم جديد
    const hasSeen = localStorage.getItem("flosy_seen_onboarding_v2");
    if (!hasSeen) {
      setIsOpen(true);
    }

    // توفير دالة عامة لفتح الشاشة من أي زرار للتجربة
    (window as any).showFlosyOnboarding = () => {
      setCurrentSlide(0);
      setIsOpen(true);
    };
  }, [forceOpen]);

  const handleFinish = () => {
    localStorage.setItem("flosy_seen_onboarding_v2", "true");
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  const slide = DEFAULT_SLIDES[currentSlide];
  const isLast = currentSlide === DEFAULT_SLIDES.length - 1;

  const nextSlide = () => {
    if (isLast) {
      handleFinish();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 select-none animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col relative border border-white/20">
        
        {/* ── شريط الرأس: زرار التخطي والبادج ── */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 z-10">
          <span
            className={`text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-xs ${
              slide.tagType === "ad"
                ? "bg-amber-100 text-amber-800 border border-amber-300"
                : slide.tagType === "tip"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : "bg-orange-100 text-[#FF6B16] border border-orange-200"
            }`}
          >
            <Sparkles className="w-3 h-3" />
            {slide.tag}
          </span>

          {/* زرار التخطي (Skip) */}
          <button
            onClick={handleFinish}
            className="text-xs font-bold text-[#7C8581] hover:text-[#064C3B] bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
          >
            <span>تخطي</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── حاوية الصورة الإعلانية / التعليمية ── */}
        <div className="px-5 pt-2 pb-1 flex justify-center">
          <div className="w-full h-48 bg-gradient-to-br from-[#064C3B]/5 via-[#FF6B16]/5 to-[#064C3B]/10 rounded-2xl flex items-center justify-center p-3 relative overflow-hidden border border-gray-100 shadow-inner">
            {slide.image && (
              <Image
                src={slide.image}
                alt={slide.title}
                width={200}
                height={200}
                className="max-h-40 w-auto object-contain drop-shadow-md rounded-xl transition-transform duration-300 transform hover:scale-105"
                priority
              />
            )}
          </div>
        </div>

        {/* ── محتوى النص والتعليمات ── */}
        <div className="px-6 py-3 text-center flex-1 flex flex-col justify-center" dir="rtl">
          <h3 className="text-lg font-black text-[#17221F] leading-snug tracking-tight mb-1">
            {slide.title}
          </h3>
          <p className="text-xs font-extrabold text-[#FF6B16] mb-2">
            {slide.subtitle}
          </p>
          <p className="text-xs text-[#525B58] leading-relaxed font-medium">
            {slide.description}
          </p>

          {/* زرار للإعلانات الخارجية لو متوفر */}
          {slide.ctaText && slide.ctaLink && (
            <div className="mt-3">
              <a
                href={slide.ctaLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064C3B] bg-[#064C3B]/10 hover:bg-[#064C3B]/20 px-3 py-1.5 rounded-xl transition-colors"
              >
                <span>{slide.ctaText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* ── نقاط المؤشر (Dots Indicator) ── */}
        <div className="flex items-center justify-center gap-1.5 py-2">
          {DEFAULT_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-7 bg-[#FF6B16]"
                  : "w-2 bg-gray-200 hover:bg-gray-300"
              }`}
              title={`الشريحة ${index + 1}`}
            />
          ))}
        </div>

        {/* ── أزرار التنقل (السابق / التالي / ابدأ) ── */}
        <div className="p-5 pt-2 flex items-center gap-2.5">
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="py-3 px-3.5 rounded-2xl border border-gray-200 hover:bg-gray-50 text-[#17221F] font-bold text-xs transition-colors flex items-center justify-center"
              title="السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={nextSlide}
            className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
              isLast
                ? "bg-[#FF6B16] hover:bg-[#E55A0A] text-white shadow-orange-500/20 active:scale-[0.98]"
                : "bg-[#064C3B] hover:bg-[#085E49] text-white shadow-[#064C3B]/20 active:scale-[0.98]"
            }`}
          >
            {isLast ? (
              <>
                <span>ابدأ رحلتك في فلوسي فين 🚀</span>
              </>
            ) : (
              <>
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
