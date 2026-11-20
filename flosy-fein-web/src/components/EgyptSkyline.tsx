export default function EgyptSkyline() {
  return (
    <div className="absolute top-0 left-0 right-0 h-44 overflow-hidden pointer-events-none z-0 opacity-40">
      <svg
        viewBox="0 0 500 150"
        preserveAspectRatio="none"
        className="w-full h-full text-[#D4A017]"
        fill="currentColor"
      >
        {/* الشمس المصرية الدافئة */}
        <circle cx="250" cy="55" r="32" fill="#E8732A" opacity="0.3" />

        {/* أهرامات الجيزة في الخلفية */}
        {/* الهرم الأكبر (خوفو) */}
        <polygon points="120,150 190,45 260,150" opacity="0.45" />
        <polygon points="190,45 260,150 240,150" opacity="0.6" fill="#8B4513" />

        {/* الهرم الثاني (خفرع) */}
        <polygon points="50,150 115,65 180,150" opacity="0.35" />

        {/* الهرم الصغير (منقرع) */}
        <polygon points="230,150 275,85 320,150" opacity="0.3" />

        {/* مئذنة القاهرة العتيقة وبرج القاهرة والنخيل في الأفق */}
        {/* المئذنة */}
        <rect x="370" y="40" width="7" height="110" opacity="0.5" />
        <polygon points="366,40 373.5,20 381,40" opacity="0.6" />
        <circle cx="373.5" cy="18" r="2.5" opacity="0.7" />

        {/* النخيل على ضفاف النيل */}
        <path
          d="M430,150 Q435,110 440,90 M440,90 Q425,75 415,85 M440,90 Q430,65 435,70 M440,90 Q450,65 455,75 M440,90 Q460,80 465,95"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          opacity="0.45"
        />
        <path
          d="M30,150 Q33,120 38,105 M38,105 Q25,95 20,105 M38,105 Q30,85 35,90 M38,105 Q48,85 52,95"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.35"
        />

        {/* خط الكثبان الرملية السفلي */}
        <path
          d="M0,135 Q125,120 250,135 T500,135 L500,150 L0,150 Z"
          fill="#ECD8BE"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
