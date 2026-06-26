"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLang } from './Providers';
import { useState, useEffect } from 'react';
import { Home, Award, Layers, Mail, Globe } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: t('home') || 'Ana Səhifə', path: '/', icon: <Home className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> },
    { name: t('ach') || 'Nailiyyətlər', path: '/achievements', icon: <Award className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> },
    { name: t('pro') || 'Layihələr', path: '/projects', icon: <Layers className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> },
    { name: t('con') || 'Əlaqə', path: '/contact', icon: <Mail className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> },
  ];

  if (!mounted) {
    return (
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-white/10 border border-white/20 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-2xl opacity-50 w-max max-w-[95vw]" aria-label="Loading Navigation">
        <div className="w-40 h-6 bg-slate-700/20 rounded"></div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1.5 sm:gap-3 bg-white/10 dark:bg-black/40 border border-slate-200/50 dark:border-white/20 backdrop-blur-xl px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-2xl transition-colors duration-300 w-max max-w-[95vw]" aria-label="Main Navigation">
      
      <div className="flex items-center gap-1 sm:gap-2 border-r border-slate-300 dark:border-white/10 pr-2 sm:pr-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              title={item.name}
              aria-label={item.name}
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-300 font-bold text-xs sm:text-sm ${
                isActive 
                  ? 'text-blue-600 dark:text-cyan-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.name}</span>
              <span className="sr-only">{item.name}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="navGlow" 
                  className="absolute inset-0 bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/30 dark:border-cyan-500/30 rounded-full -z-10" 
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2 pl-1 sm:pl-0">
        <button 
          onClick={() => setLang(lang === 'AZ' ? 'EN' : 'AZ')} 
          aria-label={lang === 'AZ' ? "Switch language to English" : "Dili Azərbaycancaya dəyiş"}
          title={lang === 'AZ' ? "Switch language" : "Dil dəyiş"}
          className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 px-2 sm:px-3 py-1 sm:py-2 rounded-full hover:bg-white/5 transition-all uppercase"
        >
          <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
          <span className="mt-[1px]">{lang}</span>
        </button>
      </div>
      
    </nav>
  );
}
