export default function ColorfulCairoBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. تدرج سماء الغروب القاهري المطرقع */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFA726] via-[#FF7043] to-[#FDF6EC]" />

      {/* 2. شمس القاهرة الذهبية الكبيرة الساطعة مع حلقات توهج */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-tr from-[#FFD54F] to-[#FFE082] rounded-full shadow-[0_0_80px_rgba(255,213,79,0.8)] opacity-70 animate-pulse" />

      {/* 3. سحاب كرتوني مرح يطوف في الأفق */}
      <div className="absolute top-14 left-4 w-28 h-10 bg-white/40 rounded-full blur-[1px]" />
      <div className="absolute top-24 right-6 w-36 h-12 bg-white/35 rounded-full blur-[1px]" />

      {/* 4. الرسمة المتجهة الكاملة للقاهرة: الأهرامات، الجوامع، المآذن، وبرج القاهرة */}
      <svg
        viewBox="0 0 500 350"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 right-0 w-full h-[55vh] z-0"
      >
        <defs>
          {/* تدرج هرم خوفو */}
          <linearGradient id="pyramidGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D4A017" />
            <stop offset="50%" stopColor="#C67D0A" />
            <stop offset="100%" stopColor="#8B4513" />
          </linearGradient>

          {/* تدرج الهرم الثاني */}
          <linearGradient id="pyramidGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E5A93C" />
            <stop offset="100%" stopColor="#9C5217" />
          </linearGradient>

          {/* تدرج قباب الجوامع الإسلامية الفيروزية */}
          <linearGradient id="domeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#00838F" />
          </linearGradient>

          {/* تدرج مآذن القاهرة البنفسجية الأنيقة */}
          <linearGradient id="minaretGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9C27B0" />
            <stop offset="100%" stopColor="#4A148C" />
          </linearGradient>
        </defs>

        {/* --- طبقة الأهرامات في الخلفية --- */}
        {/* هرم خفرع (اليسار) */}
        <polygon points="30,350 120,130 210,350" fill="url(#pyramidGrad2)" opacity="0.9" />
        <polygon points="120,130 210,350 170,350" fill="#72380F" opacity="0.5" />
        {/* قمة الهرم الذهبية */}
        <polygon points="105,160 120,130 135,160" fill="#FFD54F" />

        {/* هرم خوفو الأكبر (الوسط المرتفع) */}
        <polygon points="150,350 260,80 370,350" fill="url(#pyramidGrad1)" />
        <polygon points="260,80 370,350 320,350" fill="#5C2607" opacity="0.6" />

        {/* هرم منقرع الصغير */}
        <polygon points="340,350 400,180 460,350" fill="url(#pyramidGrad2)" opacity="0.85" />

        {/* --- طبقة جوامع ومآذن القاهرة الفاطمية والمملوكية --- */}
        {/* جامع بقبة فيروزية إسلامية مضيئة */}
        <ellipse cx="90" cy="270" rx="35" ry="25" fill="url(#domeGrad)" opacity="0.9" />
        <path d="M90,245 L90,230" stroke="#FFD54F" strokeWidth="3" />
        <circle cx="90" cy="228" r="3" fill="#FFD54F" />
        <rect x="55" y="270" width="70" height="80" fill="#FFE082" opacity="0.8" />

        {/* مئذنة قاهرية رشيقة شاهقة 1 */}
        <rect x="135" y="150" width="12" height="200" fill="url(#minaretGrad)" opacity="0.85" />
        <polygon points="131,150 141,115 151,150" fill="#FFD54F" />
        <circle cx="141" cy="112" r="2.5" fill="#FFD54F" />
        {/* شرفة المئذنة */}
        <rect x="129" y="180" width="24" height="6" rx="2" fill="#FFD54F" />

        {/* برج القاهرة في الأفق يمين الصفحة */}
        <rect x="420" y="90" width="9" height="260" fill="#283593" opacity="0.6" rx="2" />
        <ellipse cx="424.5" cy="90" rx="9" ry="5" fill="#5C6BC0" />

        {/* مئذنة ثانية دائرية */}
        <rect x="330" y="170" width="10" height="180" fill="url(#minaretGrad)" opacity="0.75" />
        <polygon points="327,170 335,135 343,170" fill="#FFD54F" />

        {/* نخيل النيل المبهج */}
        <path
          d="M20,350 Q25,270 35,230 M35,230 Q15,200 5,215 M35,230 Q25,185 30,195 M35,230 Q48,185 55,200 M35,230 Q65,210 70,230"
          stroke="#2E7D32"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M470,350 Q465,260 455,210 M455,210 Q435,180 425,195 M455,210 Q445,165 450,175 M455,210 Q468,165 475,180 M455,210 Q485,190 490,210"
          stroke="#1B5E20"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* خط رمال التلال الصفراء الدافئة السفلية */}
        <path
          d="M0,290 Q125,260 250,290 T500,280 L500,350 L0,350 Z"
          fill="#FFA000"
          opacity="0.35"
        />
        <path
          d="M0,315 Q180,285 350,320 T500,310 L500,350 L0,350 Z"
          fill="#FF8F00"
          opacity="0.25"
        />
      </svg>

      {/* 5. فلوس وجنيهات كرتونية طايرة مع الهواء في الخلفية (Animated Floating Coins & Cash) */}
      <div className="absolute top-28 left-8 text-2xl animate-bounce duration-1000 select-none opacity-85">
        💸
      </div>
      <div className="absolute top-44 right-8 text-2xl animate-bounce delay-300 duration-1000 select-none opacity-85">
        🪙
      </div>
      <div className="absolute top-80 left-4 text-xl animate-pulse select-none opacity-70">
        ✨
      </div>
      <div className="absolute top-96 right-5 text-2xl animate-pulse delay-500 select-none opacity-85">
        💸
      </div>
    </div>
  );
}
