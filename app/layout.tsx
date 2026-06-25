import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Providers } from "./components/Providers";
import VisitorTracker from "./components/VisitorTracker"; // <-- XƏTA BURADA İDİ, DÜZƏLDİLDİ

const montserrat = Montserrat({ 
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Ömər Məmmədli | Portfolio",
  description: "FPV Dron Yarışçısı və Gənc Mühəndis Ömər Məmmədlinin 3D Portfoliosu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" suppressHydrationWarning>
      {/* DİQQƏT: body-dən bg rənglərini sildik ki, şəklin qabağını kəsməsin! */}
      <body className={`${montserrat.className} text-slate-900 dark:text-white transition-colors duration-300 min-h-screen relative`}>
        <Providers>
          <VisitorTracker />
          {/* --- MÜTLƏQ ARXA FON QATI --- */}
          <div className="fixed inset-0 w-full h-full z-[-50] pointer-events-none">
            {/* 1. Gündüz Rejimi üçün Ağ/Boz Fon */}
            <div className="absolute inset-0 bg-slate-50 dark:bg-transparent transition-colors duration-500"></div>
            
            {/* 2. Qaranlıq Rejim üçün Galaxy Şəkli */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 dark:opacity-100 transition-opacity duration-1000"
              style={{ backgroundImage: "url('/galaxy.png')" }}
            ></div>
            
            {/* 3. Şəklin Parlaqlığını Azaldan Tünd Pərdə (Yazılar rahat oxunsun deyə) */}
            <div className="absolute inset-0 bg-transparent dark:bg-[#050b14]/75 transition-colors duration-700"></div>
          </div>
          {/* ----------------------------- */}

          {/* ÜST QAT (Saytın Özü) */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            {children}
          </div>

        </Providers>
      </body>
    </html>
  );
}
