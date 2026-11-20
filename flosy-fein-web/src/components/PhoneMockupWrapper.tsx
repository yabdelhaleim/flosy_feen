"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Wifi, Battery, Smartphone, Monitor } from "lucide-react";

export default function PhoneMockupWrapper({ children }: { children: React.ReactNode }) {
  const [showFrame, setShowFrame] = useState(true);
  const pathname = usePathname();
  const isAuth = pathname?.startsWith("/auth");

  return (
    <div className="min-h-screen bg-[#E5E9E8] flex flex-col items-center justify-center py-4 px-2 select-none relative overflow-x-hidden">
      {/* زر التبديل العائم */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D1D9D7] shadow-sm text-xs font-bold text-[#17221F]">
        <button
          onClick={() => setShowFrame(!showFrame)}
          className="flex items-center gap-1.5 hover:text-[#064C3B] transition-colors"
        >
          {showFrame ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-[#064C3B]" />
              <span>إخفاء فريم الهاتف</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#064C3B]" />
              <span>عرض داخل هاتف 📱</span>
            </>
          )}
        </button>
      </div>

      {showFrame ? (
        /* 📱 فريم هاتف أنيق */
        <div className="relative mx-auto border-[10px] border-[#1C2624] bg-[#1C2624] rounded-[48px] shadow-[0_20px_60px_rgba(6,76,59,0.2),0_0_0_2px_#334642] ring-1 ring-white/10 w-[385px] h-[830px] flex flex-col overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 w-26 h-5.5 bg-black rounded-full flex items-center justify-between px-2.5 pointer-events-none shadow-xs">
            <div className="w-2 h-2 rounded-full bg-[#111A2E]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#081830]" />
          </div>

          {/* شريط الحالة */}
          <div
            className={`h-11 w-full pt-3 px-6 flex justify-between items-center text-[11px] font-bold z-40 shrink-0 select-none ${
              isAuth
                ? "bg-white text-[#17221F]"
                : "bg-[#064C3B] text-white"
            }`}
          >
            <span className="tracking-tight">9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-current" />
            </div>
          </div>

          {/* شاشة الهاتف */}
          <div
            className={`flex-1 w-full overflow-y-auto no-scrollbar relative ${
              isAuth ? "bg-white" : "bg-[#F5F6F7] pb-24"
            }`}
          >
            {children}
          </div>

          {/* شريط Home */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#17221F]/25 rounded-full z-50 pointer-events-none" />
        </div>
      ) : (
        /* العرض العادي بدون إطار — في المنتصف تماماً بعرض الموبايل */
        <div
          className={`relative mx-auto shadow-2xl flex flex-col overflow-y-auto rounded-3xl ${
            isAuth ? "bg-white" : "bg-[#F5F6F7] pb-20"
          }`}
          style={{ width: "385px", minHeight: "830px" }}
          dir="rtl"
        >
          {children}
        </div>
      )}
    </div>
  );
}
