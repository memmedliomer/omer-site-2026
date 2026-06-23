"use client";

import { createContext, useContext, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from "next-themes";

const LanguageContext = createContext({
  lang: 'AZ',
  setLang: (l: 'AZ' | 'EN') => {},
  t: (key: string) => key
});

export const useLang = () => useContext(LanguageContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<'AZ' | 'EN'>('AZ');

  // Tərcümə lüğəti
 const translations: any = {
    AZ: { home: "Ana Səhifə", ach: "Nailiyyətlər", pro: "Layihələr", con: "Əlaqə", cv: "CV Yüklə", group: "Qrup", ind: "Fərdi", close: "Bağla" },
    EN: { home: "Home", ach: "Achievements", pro: "Projects", con: "Contact", cv: "Download CV", group: "Group", ind: "Individual", close: "Close" }
  };

  const t = (key: string) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {/* mounted yoxlaması silindi, çünki next-themes özü bunu idarə edir */}
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
      </NextThemesProvider>
    </LanguageContext.Provider>
  );
}