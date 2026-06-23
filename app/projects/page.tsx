"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { useLang } from '../components/Providers';

export default function Projects() {
  const { t } = useLang();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // DÜZƏLİŞ: viewImage əvəzinə viewProject yaratdıq və tipini any təyin etdik
  const [viewProject, setViewProject] = useState<any | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Proyektlər yüklənmədi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const badgeColors = [
    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'bg-rose-500/20 text-rose-400 border-rose-500/30',
    'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-transparent p-10 pt-32 flex justify-center items-center relative z-10">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent p-6 md:p-10 pt-32 transition-colors duration-500 relative z-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-16 uppercase tracking-tighter border-l-4 border-emerald-500 pl-6">
          {t('pro')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.length === 0 ? (
            <p className="text-slate-500 col-span-full">Hələ heç bir proyekt yüklənməyib.</p>
          ) : (
            projects.map(proj => {
              const rawStats = `${proj.speed || ''},${proj.weight || ''}`.split(',').map(s => s.trim()).filter(s => s);
              const techList = proj.tech_stack ? proj.tech_stack.split(',').map((t: string) => t.trim()) : [];

              return (
                <Tilt key={proj.id} tiltMaxAngleX={10} tiltMaxAngleY={10} className="w-full">
                  <div className="bg-black/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl group hover:border-emerald-500/50 transition-colors flex flex-col h-full cursor-pointer" onClick={() => setViewProject(proj)}>
                    
                    <div className="h-56 overflow-hidden relative">
                      <img src={proj.image} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" alt={proj.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    </div>

                    <div className="p-6 relative -mt-8 flex-1 flex flex-col">
                       <h3 className="text-2xl font-black text-white mb-3 drop-shadow-md">{proj.title}</h3>
                       <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-1">{proj.description}</p>
                       
                       {rawStats.length > 0 && (
                         <div className="flex flex-wrap gap-2 mb-6">
                           {rawStats.map((stat, i) => (
                             <span key={i} className={`px-3 py-1.5 border text-[10px] font-black rounded-lg uppercase tracking-wider ${badgeColors[i % badgeColors.length]}`}>
                               {stat}
                             </span>
                           ))}
                         </div>
                       )}

                       {techList.length > 0 && (
                         <div className="pt-4 border-t border-white/10">
                           <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">Texnologiyalar</p>
                           <div className="flex flex-wrap gap-2">
                             {techList.map((tech: string, i: number) => (
                               <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 text-slate-300 text-[11px] rounded-md shadow-sm">
                                 {tech}
                               </span>
                             ))}
                           </div>
                         </div>
                       )}
                    </div>
                  </div>
                </Tilt>
              );
            })
          )}
        </div>
      </div>

      {/* İRİ LAYİHƏ MODALI */}
      <AnimatePresence>
        {viewProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setViewProject(null)}></div>
            
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative max-w-4xl w-full bg-[#0a1120] border border-white/10 rounded-[2.5rem] overflow-hidden z-10 shadow-2xl">
              <button onClick={() => setViewProject(null)} className="absolute top-6 right-6 p-3 bg-white/10 rounded-full text-white hover:bg-red-500 z-50 transition-colors"><X /></button>
              
              <div className="flex flex-col md:flex-row h-full">
                {/* Sol: İri Şəkil */}
                <div className="flex-1 h-64 md:h-auto border-r border-white/5 bg-black/50">
                  <img src={viewProject.image} className="w-full h-full object-contain p-4" alt={viewProject.title} />
                </div>
                {/* Sağ: Məlumatlar */}
                <div className="flex-1 p-8 md:p-12 flex flex-col max-h-[80vh] overflow-y-auto">
                  <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">{viewProject.title}</h2>
                  <p className="text-slate-400 leading-relaxed mb-8">{viewProject.description}</p>
                  
                  <div className="flex flex-wrap gap-3 mb-8">
                    {viewProject.speed && viewProject.speed.split(',').map((s: string, i: number) => (
                      <span key={`speed-${i}`} className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl font-bold text-xs">
                        {s.trim()}
                      </span>
                    ))}
                    {viewProject.weight && viewProject.weight.split(',').map((w: string, i: number) => (
                      <span key={`weight-${i}`} className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl font-bold text-xs">
                        {w.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/5">
                     <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-3">İşlədilən Texnologiyalar</p>
                     <div className="flex flex-wrap gap-2">
                       {viewProject.tech_stack && viewProject.tech_stack.split(',').map((t: string, i: number) => (
                         <span key={`tech-${i}`} className="px-3 py-1.5 bg-white/5 rounded-md text-xs text-slate-300 border border-white/10 font-medium tracking-wide">
                           {t.trim()}
                         </span>
                       ))}
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}