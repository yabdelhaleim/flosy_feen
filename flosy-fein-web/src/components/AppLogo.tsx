const LOGO_FONT = "'Lemonada', 'IBM Plex Sans Arabic', sans-serif";

export default function AppLogo({
  size = "md",
  showSlogan = true,
  vertical = false,
}: {
  size?: "sm" | "md" | "lg";
  showSlogan?: boolean;
  vertical?: boolean;
}) {
  const textSize = size === "lg" ? "4xl" : size === "sm" ? "xl" : "3xl";
  const sizeMap: Record<string, string> = { sm: "1.3rem", md: "1.9rem", lg: "2.6rem" };
  const fontSize = sizeMap[size];

  if (vertical) {
    return (
      <div className="flex flex-col items-center select-none">
        <div
          className="flex flex-col items-center leading-tight"
          style={{ fontFamily: LOGO_FONT, fontWeight: 700 }}
        >
          <span className="text-[#064C3B]" style={{ fontSize }}>فلوسي</span>
          <span className="text-[#FF6B16]" style={{ fontSize }}>فين؟</span>
        </div>
        {showSlogan && (
          <span className="text-[11px] font-bold text-[#7C8581] mt-1 tracking-wide">
            اعرف فلوسك .. قبل ما تروح !
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center select-none">
      <div
        className="flex items-center gap-1.5"
        dir="rtl"
        style={{ fontFamily: LOGO_FONT, fontWeight: 700 }}
      >
        <span className={`text-[#064C3B] text-${textSize}`}>فلوسي</span>
        <span className={`text-[#FF6B16] text-${textSize}`}>فين؟</span>
      </div>
      {showSlogan && (
        <span className="text-[11px] font-bold text-[#7C8581] mt-1 tracking-wide">
          اعرف فلوسك .. قبل ما تروح !
        </span>
      )}
    </div>
  );
}
