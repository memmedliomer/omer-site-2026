"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useLang } from './Providers';
import { useState, useEffect } from 'react';
import { Home, Award, Layers, Mail, Sun, Moon, Globe } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: t('home'), path: '/', icon: <Home size={18} /> },
    { name: t('ach'), path: '/achievements', icon: <Award size={18} /> },
    { name: t('pro'), path: '/projects', icon: <Layers size={18} /> },
    { name: t('con'), path: '/contact', icon: <Mail size={18} /> },
  ];

  if (!mounted) {
    return (
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-white/10 border border-white/20 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-2xl opacity-50">
        <div className="w-40 h-6 bg-slate-700/20 rounded"></div>
      </nav>
    );
  }

 

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-white/10 dark:bg-black/40 border border-slate-200/50 dark:border-white/20 backdrop-blur-xl px-5 py-2.5 rounded-full shadow-2xl transition-colors duration-300">
      
      <div className="flex items-center gap-2 border-r border-slate-300 dark:border-white/10 pr-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-bold text-sm ${
                isActive 
                  ? 'text-blue-600 dark:text-cyan-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.icon}
              <span className="hidden sm:inline">{item.name}</span>
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

      <div className="flex items-center gap-3">
        <button 
          onClick={() => setLang(lang === 'AZ' ? 'EN' : 'AZ')} 
          className="flex items-center gap-1 text-xs font-black text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 px-2 transition-colors"
        >
          <Globe size={16} /> {lang}
        </button>

       
      </div>
    </nav>
  );
}