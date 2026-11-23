import Image from "next/image";

const LOGO_FONT = "'Lemonada', 'IBM Plex Sans Arabic', sans-serif";

export default function AppLogo({
  size = "md",
  showSlogan = false,
  vertical = false,
}: {
  size?: "sm" | "md" | "lg";
  showSlogan?: boolean;
  vertical?: boolean;
}) {
  const imgSize = size === "lg" ? 160 : size === "sm" ? 72 : 110;

  return (
    <div className="flex flex-col items-center select-none">
      <Image
        src="/logo.jpg"
        alt="فلوسي فين؟"
        width={imgSize}
        height={imgSize}
        className="rounded-2xl object-contain drop-shadow-lg"
        priority
      />
      {showSlogan && (
        <span
          className="text-[11px] font-bold text-[#7C8581] mt-1 tracking-wide"
          style={{ fontFamily: LOGO_FONT }}
        >
          اعرف فلوسك .. قبل ما تروح !
        </span>
      )}
    </div>
  );
}
