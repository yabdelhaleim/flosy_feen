export default function ModernEgyptianHeader() {
  return (
    <div className="absolute top-0 left-0 right-0 h-48 overflow-hidden pointer-events-none z-0">
      {/* تدرج هادئ راقي في أعلى الصفحة */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#ECD8BE]/60 via-[#F8F4EE]/40 to-[#F8F4EE]" />

      {/* خطوط أفق الأهرامات الهندسية المعمارية الراقية */}
      <svg
        viewBox="0 0 500 160"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 right-0 w-full h-32 opacity-25 text-[#8B4513]"
        fill="currentColor"
      >
        {/* هرم خفرع الأنيق */}
        <polygon points="60,160 140,40 220,160" opacity="0.6" />
        <polygon points="140,40 220,160 190,160" opacity="0.8" />

        {/* هرم خوفو الأكبر في المنتصف */}
        <polygon points="160,160 270,15 380,160" opacity="0.8" />
        <polygon points="270,15 380,160 340,160" opacity="1" />

        {/* هرم منقرع */}
        <polygon points="350,160 410,70 470,160" opacity="0.5" />

        {/* خط الأفق الرملي المنحني بدقة */}
        <path
          d="M0,145 Q125,130 250,145 T500,140 L500,160 L0,160 Z"
          fill="#D4A017"
          opacity="0.2"
        />
      </svg>
    </div>
  );
}
