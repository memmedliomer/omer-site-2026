"use client";

import { Code, Cpu, Plane, Bot, MessageCircle, X, Terminal, Box } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

export default function Home() {
  const [settings, setSettings] = useState({ home_image: 'https://via.placeholder.com/600x800', bio: 'Yüklənir...' });
  const [viewImage, setViewImage] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
        setSettings({ 
          home_image: data.home_image || 'https://via.placeholder.com/600x800', 
          bio: data.bio || 'Mən Ömər Məmmədli, rəqəmsal dünyada innovativ həllər yaradıram.' 
        });
    });
  }, []);

  return (
    <main className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative z-10 transition-colors duration-300">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-12 relative">
        
        {/* SOL TƏRƏF - Yazılar */}
        <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">PROGRAMMER</span>
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-tight">
            ÖMƏR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              MƏMMƏDLİ
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed mb-8 whitespace-pre-wrap">
            {settings.bio}
          </p>
        </div>

        {/* SAĞ TƏRƏF - Şəkil və Fırlanan İkonlar (YENİLƏNİB - 7 Element) */}
        <div className="flex-1 relative w-full max-w-[320px] md:max-w-sm lg:max-w-md mx-auto mt-10 md:mt-0">
          <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} className="relative z-10">
            <div className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group cursor-pointer" onClick={() => setViewImage(true)}>
              <img src={settings.home_image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Ömər Məmmədli" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
          </Tilt>

          {/* ----- SOL TƏRƏF (3 Element) ----- */}

          {/* 1. Telegram Bots (Sol Üst) */}
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 2 }} className="absolute top-[12%] -left-6 lg:-left-12 bg-[#0a1120]/90 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 shadow-xl z-20 hidden md:block scale-110">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-400/20 rounded-lg"><MessageCircle className="text-blue-300" size={16} /></div>
              <p className="font-black text-white text-[11px]">Telegram Bots</p>
            </div>
          </motion.div>

          {/* 2. FPV Drone (Sol Orta) */}
          <motion.div animate={{ y: [0, -8, 0], x: [0, -5, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 0.5 }} className="absolute top-[42%] -left-12 lg:-left-20 bg-[#0a1120]/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl z-20 hidden md:block scale-110">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-cyan-500/20 rounded-lg"><Plane className="text-cyan-400" size={18} /></div>
              <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Aero</p><p className="font-black text-white text-xs">FPV Drone</p></div>
            </div>
          </motion.div>

          {/* 3. Arduino (Sol Alt) */}
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute bottom-[12%] -left-6 lg:-left-12 bg-[#0a1120]/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl z-20 hidden md:block scale-110">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/20 rounded-lg"><Cpu className="text-emerald-400" size={18} /></div>
              <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Hardware</p><p className="font-black text-white text-xs">Arduino</p></div>
            </div>
          </motion.div>


          {/* ----- SAĞ TƏRƏF (4 Element) ----- */}

          {/* 4. C++ (Sağ Üst) */}
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-[8%] -right-6 lg:-right-12 bg-[#0a1120]/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl z-20 hidden md:block scale-110">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-600/20 rounded-lg"><Code className="text-blue-400" size={18} /></div>
              <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Backend</p><p className="font-black text-white text-xs">C++</p></div>
            </div>
          </motion.div>

          {/* 5. Python (Sağ Üst-Orta) */}
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5.2, repeat: Infinity, delay: 0.8 }} className="absolute top-[32%] -right-12 lg:-right-20 bg-[#0a1120]/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl z-20 hidden md:block scale-110">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-yellow-500/20 rounded-lg"><Terminal className="text-yellow-400" size={18} /></div>
              <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Scripting</p><p className="font-black text-white text-xs">Python</p></div>
            </div>
          </motion.div>

          {/* 6. 3D Design (Sağ Alt-Orta) */}
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 4.8, repeat: Infinity, delay: 1.2 }} className="absolute bottom-[32%] -right-12 lg:-right-20 bg-[#0a1120]/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl z-20 hidden md:block scale-110">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/20 rounded-lg"><Box className="text-purple-400" size={18} /></div>
              <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Creative</p><p className="font-black text-white text-xs">3D Design</p></div>
            </div>
          </motion.div>

          {/* 7. Robotics (Sağ Alt) */}
          <motion.div animate={{ y: [0, 8, 0], x: [0, 5, 0] }} transition={{ duration: 5.5, repeat: Infinity, delay: 1.5 }} className="absolute bottom-[8%] -right-6 lg:-right-12 bg-[#0a1120]/90 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl z-20 hidden md:block scale-110">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/20 rounded-lg"><Bot className="text-amber-400" size={18} /></div>
              <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Engineering</p><p className="font-black text-white text-xs">Robotics</p></div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* İRİ ŞƏKİL MODALI */}
      <AnimatePresence>
        {viewImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10">
            <div className="absolute inset-0" onClick={() => setViewImage(false)}></div>
            <button onClick={() => setViewImage(false)} className="absolute top-6 right-6 md:top-10 md:right-10 p-3 md:p-4 bg-white/10 rounded-full text-white hover:bg-red-500 z-[130] transition-colors shadow-2xl"><X size={24} /></button>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative max-w-5xl w-full z-10 flex justify-center">
              <img src={settings.home_image} className="w-auto h-auto max-w-full max-h-[85vh] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 object-contain" alt="Full View" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}