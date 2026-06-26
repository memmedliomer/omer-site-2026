"use client";

import { Code, Cpu, Plane, Bot, MessageCircle, X, Terminal, Box, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

export default function Home() {
  // via.placeholder.com xəta verdiyi üçün, şəbəkə xətası yaratmayan etibarlı (boş/boz) CSS/Base64 şəkli istifadə edirik
  const safePlaceholder = "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
  
  const [settings, setSettings] = useState({ home_image: safePlaceholder, bio: 'Yüklənir...', cv_link: '' });
  const [viewImage, setViewImage] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings({ 
          home_image: data.home_image || safePlaceholder, 
          bio: data.bio || 'Mən Ömər Məmmədli, rəqəmsal dünyada innovativ həllər yaradıram.',
          cv_link: data.cv_link || '' 
        });
      })
      .catch(() => {
        // Hər hansı API xətasında səhifənin çökməməsi üçün
        setSettings({ home_image: safePlaceholder, bio: 'Məlumatlar yüklənərkən xəta baş verdi.', cv_link: '' });
      });
  }, []);

  // Cloudinary şəklini dinamik olaraq 143 KB yüngülləşdirən "Performance" mühərriki
  const getOptimizedUrl = (url: string) => {
    if (!url) return safePlaceholder;
    if (url.includes('cloudinary.com') && !url.includes('q_auto')) {
      // Əgər w_800 varsa, onu w_500 edir və q_auto,f_auto (WebP/AVIF formatı) əlavə edir
      return url
        .replace(/w_\d+,h_\d+/, 'w_500,h_500')
        .replace('/upload/', '/upload/q_auto,f_auto/');
    }
    return url;
  };

  return (
    // CLS xətasını (0.103) sıfırlamaq üçün əsas qutuya min-h-[85vh] rezervi verdik
    <main className="min-h-[100dvh] bg-transparent flex flex-col items-center justify-center p-4 pt-20 md:p-8 overflow-hidden relative z-10 transition-colors duration-300">
      <div className="max-w-7xl w-full min-h-[85vh] md:min-h-[600px] flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-16 relative">
        
        {/* SOL TƏRƏF - Yazılar və CV Düyməsi */}
        <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start z-20 mt-2 md:mt-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-2 md:mb-4 inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[9px] md:text-xs font-bold text-cyan-400 uppercase tracking-widest">PROGRAMMER</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white mb-2 md:mb-6 tracking-tighter leading-tight">
            ÖMƏR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              MƏMMƏDLİ
            </span>
          </h1>
          
          <p className="text-slate-400 text-xs sm:text-sm md:text-lg max-w-xl font-medium leading-snug md:leading-relaxed mb-3 md:mb-6 whitespace-pre-wrap px-2 md:px-0">
            {settings.bio}
          </p>

          {/* CV YÜKLƏ DÜYMƏSİ */}
          <AnimatePresence>
            {settings.cv_link && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-0 mb-2 md:mb-0">
                <a 
                  href={settings.cv_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative inline-flex items-center gap-2 md:gap-3 px-5 py-2.5 md:px-6 md:py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                  <Download className="w-4 h-4 md:w-5 md:h-5 relative z-10 group-hover:-translate-y-1 transition-transform" />
                  <span className="relative z-10 uppercase tracking-wider text-xs md:text-sm">CV Yüklə</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SAĞ TƏRƏF - Şəkil və Fırlanan İkonlar */}
        <div className="flex-1 relative w-full max-w-[170px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-[360px] mx-auto z-10 mt-2 md:mt-0">
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} className="relative z-10">
            <div className="relative w-full aspect-[3/4] rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group cursor-pointer bg-[#02050a]" onClick={() => setViewImage(true)}>
              {/* LCP (Largest Contentful Paint) Xalını 100 etmək üçün fetchpriority="high" əlavə olundu */}
              <img 
                src={getOptimizedUrl(settings.home_image)} 
                fetchpriority="high"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt="Ömər Məmmədli Profil Şəkli" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
          </Tilt>

          {/* ----- SOL TƏRƏF (3 Element) ----- */}
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 2 }} className="absolute top-[6%] md:top-[12%] -left-[4.5rem] sm:-left-[5.5rem] md:-left-20 lg:-left-24 bg-[#0a1120]/90 backdrop-blur-md p-1.5 md:p-2.5 rounded-xl md:rounded-2xl border border-white/10 shadow-xl z-20 scale-[0.55] sm:scale-75 md:scale-90 lg:scale-100 origin-right">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="p-1 md:p-1.5 bg-blue-400/20 rounded-lg"><MessageCircle className="text-blue-300" size={14} /></div>
              <p className="font-black text-white text-[10px] md:text-[11px]">Telegram Bots</p>
            </div>
          </motion.div>

          <motion.div animate={{ y: [0, -5, 0], x: [0, -3, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 0.5 }} className="absolute top-[42%] md:top-[42%] -left-[5rem] sm:-left-[6rem] md:-left-24 lg:-left-32 bg-[#0a1120]/90 backdrop-blur-md p-1.5 md:p-3 rounded-xl md:rounded-2xl border border-white/10 shadow-xl z-20 scale-[0.55] sm:scale-75 md:scale-90 lg:scale-100 origin-right">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="p-1 md:p-1.5 bg-cyan-500/20 rounded-lg"><Plane className="text-cyan-400" size={14} /></div>
              <div><p className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Aero</p><p className="font-black text-white text-[10px] md:text-xs">FPV Drone</p></div>
            </div>
          </motion.div>

          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-[6%] md:bottom-[12%] -left-[4.5rem] sm:-left-[5.5rem] md:-left-20 lg:-left-24 bg-[#0a1120]/90 backdrop-blur-md p-1.5 md:p-3 rounded-xl md:rounded-2xl border border-white/10 shadow-xl z-20 scale-[0.55] sm:scale-75 md:scale-90 lg:scale-100 origin-right">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="p-1 md:p-1.5 bg-emerald-500/20 rounded-lg"><Cpu className="text-emerald-400" size={14} /></div>
              <div><p className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Hardware</p><p className="font-black text-white text-[10px] md:text-xs">Arduino</p></div>
            </div>
          </motion.div>


          {/* ----- SAĞ TƏRƏF (4 Element) ----- */}
          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-[3%] md:top-[8%] -right-[4.5rem] sm:-right-[5.5rem] md:-right-20 lg:-right-24 bg-[#0a1120]/90 backdrop-blur-md p-1.5 md:p-3 rounded-xl md:rounded-2xl border border-white/10 shadow-xl z-20 scale-[0.55] sm:scale-75 md:scale-90 lg:scale-100 origin-left">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="p-1 md:p-1.5 bg-blue-600/20 rounded-lg"><Code className="text-blue-400" size={14} /></div>
              <div><p className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Backend</p><p className="font-black text-white text-[10px] md:text-xs">C++</p></div>
            </div>
          </motion.div>

          <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 5.2, repeat: Infinity, delay: 0.8 }} className="absolute top-[30%] md:top-[32%] -right-[5rem] sm:-right-[6rem] md:-right-24 lg:-right-32 bg-[#0a1120]/90 backdrop-blur-md p-1.5 md:p-3 rounded-xl md:rounded-2xl border border-white/10 shadow-xl z-20 scale-[0.55] sm:scale-75 md:scale-90 lg:scale-100 origin-left">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="p-1 md:p-1.5 bg-yellow-500/20 rounded-lg"><Terminal className="text-yellow-400" size={14} /></div>
              <div><p className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Scripting</p><p className="font-black text-white text-[10px] md:text-xs">Python</p></div>
            </div>
          </motion.div>

          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 4.8, repeat: Infinity, delay: 1.2 }} className="absolute bottom-[30%] md:bottom-[32%] -right-[5rem] sm:-right-[6rem] md:-right-24 lg:-right-32 bg-[#0a1120]/90 backdrop-blur-md p-1.5 md:p-3 rounded-xl md:rounded-2xl border border-white/10 shadow-xl z-20 scale-[0.55] sm:scale-75 md:scale-90 lg:scale-100 origin-left">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="p-1 md:p-1.5 bg-purple-500/20 rounded-lg"><Box className="text-purple-400" size={14} /></div>
              <div><p className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Creative</p><p className="font-black text-white text-[10px] md:text-xs">3D Design</p></div>
            </div>
          </motion.div>

          <motion.div animate={{ y: [0, 5, 0], x: [0, 3, 0] }} transition={{ duration: 5.5, repeat: Infinity, delay: 1.5 }} className="absolute bottom-[3%] md:bottom-[8%] -right-[4.5rem] sm:-right-[5.5rem] md:-right-20 lg:-right-24 bg-[#0a1120]/90 backdrop-blur-md p-1.5 md:p-3 rounded-xl md:rounded-2xl border border-white/10 shadow-xl z-20 scale-[0.55] sm:scale-75 md:scale-90 lg:scale-100 origin-left">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="p-1 md:p-1.5 bg-amber-500/20 rounded-lg"><Bot className="text-amber-400" size={14} /></div>
              <div><p className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Engineering</p><p className="font-black text-white text-[10px] md:text-xs">Robotics</p></div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* İRİ ŞƏKİL MODALI (Burada şəkil tam original keyfiyyətdə və kəsilmədən yüklənəcək) */}
      <AnimatePresence>
        {viewImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10">
            <div className="absolute inset-0" onClick={() => setViewImage(false)}></div>
            <button onClick={() => setViewImage(false)} className="absolute top-4 right-4 md:top-10 md:right-10 p-2 md:p-4 bg-white/10 rounded-full text-white hover:bg-red-500 z-[130] transition-colors shadow-2xl"><X size={24} /></button>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative max-w-5xl w-full z-10 flex justify-center">
              <img 
                // Modalda orijinal keyfiyyəti saxlamaq üçün optimallaşdırılmış yox, birbaşa şəklin özünü istifadə edirik
                src={settings.home_image} 
                className="w-auto h-auto max-w-full max-h-[85vh] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 object-contain" 
                alt="Full View" 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
