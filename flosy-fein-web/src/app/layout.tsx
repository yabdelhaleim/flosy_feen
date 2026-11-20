import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/BottomNav";
import PhoneMockupWrapper from "@/components/PhoneMockupWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "فلوسي فين؟ - اعرف فلوسك قبل ما تروح",
  description: "تطبيق مالي ذكي لإدارة المصروفات ومتابعة الأقساط الشهرية بهوية مصرية حديثة",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "فلوسي فين",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#064C3B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700;800&family=Lemonada:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Flosy Fein ServiceWorker ready: ', registration.scope);
                    },
                    function(err) {
                      console.log('ServiceWorker error: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#E5E9E8] text-[#17221F] antialiased" suppressHydrationWarning>
        <PhoneMockupWrapper>
          {children}
          <BottomNav />
        </PhoneMockupWrapper>
      </body>
    </html>
  );
}
