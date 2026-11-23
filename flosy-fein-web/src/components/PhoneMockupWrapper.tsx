"use client";

import { usePathname } from "next/navigation";

export default function PhoneMockupWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith("/auth");

  return (
    <div className="min-h-screen bg-[#043328] flex justify-center selection:bg-[#FF6B16] selection:text-white">
      {/* حاوية التطبيق الحقيقية: على الموبايل تمتد 100% بعرض الشاشة بالكامل، وعلى الكمبيوتر تتمركز بتصميم موبايل أنيق */}
      <main
        className={`w-full max-w-md min-h-screen flex flex-col relative shadow-2xl ${
          isAuth ? "bg-white" : "bg-[#F5F6F7] pb-24"
        }`}
        dir="rtl"
      >
        {children}
      </main>
    </div>
  );
}
