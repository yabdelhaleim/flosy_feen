"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarCheck, BarChart3, User, Plus } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/auth")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-[#EAECEB] px-3 py-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="flex justify-between items-center relative">
        {/* 1. الرئيسية */}
        <Link
          href="/"
          className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${
            pathname === "/" ? "text-[#FF6B16] font-bold" : "text-[#7C8581] hover:text-[#064C3B]"
          }`}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px]">الرئيسية</span>
        </Link>

        {/* 2. الأقساط */}
        <Link
          href="/installments"
          className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${
            pathname === "/installments" ? "text-[#FF6B16] font-bold" : "text-[#7C8581] hover:text-[#064C3B]"
          }`}
        >
          <CalendarCheck className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px]">الأقساط</span>
        </Link>

        {/* 3. الزر العائم البرتقالي الأيقوني للإضافة السريعة (+) */}
        <div className="flex-1 flex justify-center -mt-6">
          <Link
            href="/expenses?action=add"
            className="w-13 h-13 rounded-full bg-[#FF6B16] hover:bg-[#E55A0A] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(255,107,22,0.45)] border-4 border-white transition-all transform hover:scale-105 active:scale-95"
            title="إضافة سريعة"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </Link>
        </div>

        {/* 4. المصروفات / الميزانية */}
        <Link
          href="/expenses"
          className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${
            pathname === "/expenses" ? "text-[#FF6B16] font-bold" : "text-[#7C8581] hover:text-[#064C3B]"
          }`}
        >
          <BarChart3 className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px]">المصروفات</span>
        </Link>

        {/* 5. حسابي */}
        <Link
          href="/profile"
          className={`flex-1 flex flex-col items-center gap-1 py-1 transition-colors ${
            pathname === "/profile" ? "text-[#FF6B16] font-bold" : "text-[#7C8581] hover:text-[#064C3B]"
          }`}
        >
          <User className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px]">حسابي</span>
        </Link>
      </div>
    </nav>
  );
}
