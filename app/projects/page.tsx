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
  
  const [viewProject, setViewProject] = useState<any | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          // 1. Ən yeni proyektlər ən üstdə görünsün deyə ID-yə görə tərsinə sıralayırıq
          const sortedProjects = [...data].sort((a, b) => b.id - a.id);
          setProjects(sortedProjects);
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Proyektlər yüklənmədi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // ŞƏKİLLƏRİ İLDIRIM SÜRƏTİNDƏ AÇMAQ ÜÇÜN OPTİMİZASİYA FUNKSİYASI
  const getOptimizedUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('cloudinary.com') && !url.includes('q_auto')) {
      return url.replace('/upload/', '/upload/w_800,q_auto,f_auto/');
    }
    return url;
  };

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
      <main className="min-h-screen bg-transparent p-4 md:p-10 pt-32 flex justify-center items-center relative z-10">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent p-4 sm:p-6 md:p-10 pt-24 md:pt-32 transition-colors duration-500 relative z-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-10 md:mb-16 uppercase tracking-tighter border-l-4 border-emerald-500 pl-4 md:pl-6">
          {t('pro')}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {projects.length === 0 ? (
            <p className="text-slate-500 col-span-full text-center">Hələ heç bir proyekt yüklənməyib.</p>
          ) : (
            projects.map(proj => {
              const rawStats = `${proj.speed || ''},${proj.weight || ''}`.split(',').map(s => s.trim()).filter(s => s);
              const techList = proj.tech_stack ? proj.tech_stack.split(',').map((t: string) => t.trim()) : [];

              return (
                <Tilt key={proj.id} tiltMaxAngleX={8} tiltMaxAngleY={8} className="w-full h-full">
                  <div 
                    className="bg-black/40 border border-white/10 rounded-[2rem] md:rounded-3xl overflow-hidden shadow-2xl group hover:border-emerald-500/50 transition-colors flex flex-col h-full cursor-pointer" 
                    onClick={() => setViewProject(proj)}
                  >
                    
                    {/* ZİREHLİ ŞƏKİL QUTUSU: aspect-[4/3] və object-contain ilə şəkil əzilmir, çərçivə forması qorunur */}
                    <div className="w-full aspect-[4/3] bg-[#050b14] overflow-hidden relative flex items-center justify-center p-3 border-b border-white/5">
                      <img 
                        src={getOptimizedUrl(proj.image)} 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500 rounded-xl bg-black/20" 
                        alt={proj.title} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                    </div>

                    <div className="p-5 md:p-6 flex-1 flex flex-col relative bg-gradient-to-b from-[#0a1120] to-[#050b14]">
                       <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4 drop-shadow-md">{proj.title}</h3>
                       <p className="text-slate-400 text-xs md:text-sm mb-5 md:mb-6 line-clamp-3 flex-1">{proj.description}</p>
                       
                       {rawStats.length > 0 && (
                         <div className="flex flex-wrap gap-1.5 md:gap-2 mb-5 md:mb-6">
                           {rawStats.map((stat, i) => (
                             <span key={i} className={`px-2.5 py-1 md:px-3 md:py-1.5 border text-[9px] md:text-[10px] font-black rounded-lg uppercase tracking-wider ${badgeColors[i % badgeColors.length]}`}>
                               {stat}
                             </span>
                           ))}
                         </div>
                       )}

                       {techList.length > 0 && (
                         <div className="pt-4 md:pt-5 border-t border-white/10">
                           <p className="text-[9px] md:text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2 md:mb-3">Texnologiyalar</p>
                           <div className="flex flex-wrap gap-1.5 md:gap-2">
                             {techList.map((tech: string, i: number) => (
                               <span key={i} className="px-2 py-1 md:px-2.5 md:py-1.5 bg-white/5 border border-white/10 text-slate-300 text-[10px] md:text-[11px] rounded-md shadow-sm">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-8 pt-20 md:pt-4">
            <div className="absolute inset-0" onClick={() => setViewProject(null)}></div>
            
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative max-w-5xl w-full max-h-[85vh] md:max-h-[90vh] flex flex-col bg-[#0a1120] border border-white/10 rounded-3xl md:rounded-[2.5rem] overflow-hidden z-10 shadow-2xl">
              
              <button onClick={() => setViewProject(null)} className="absolute top-3 right-3 md:top-6 md:right-6 p-2 md:p-3 bg-black/50 md:bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-red-500 z-50 transition-colors">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              <div className="flex flex-col md:flex-row h-full overflow-hidden">
                {/* SOL: İri Şəkil (Böyüdəndə orijinal keyfiyyətdə və kəsilmədən tam göstərir) */}
                <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:h-full border-b md:border-b-0 md:border-r border-white/5 bg-[#050b14] shrink-0 relative flex items-center justify-center p-4">
                  <img src={viewProject.image} className="w-full h-full object-contain" alt={viewProject.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1120] via-transparent to-transparent md:hidden"></div>
                </div>
                
                {/* SAĞ: Məlumatlar (Scroll olunur) */}
                <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-10 flex flex-col overflow-y-auto custom-scrollbar bg-[#0a1120]">
                  <h2 className="text-2xl md:text-4xl font-black text-white mb-3 md:mb-4 uppercase tracking-tighter pr-8 md:pr-0 leading-tight">{viewProject.title}</h2>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6 md:mb-8">{viewProject.description}</p>
                  
                  <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
                    {viewProject.speed && viewProject.speed.split(',').map((s: string, i: number) => (
                      <span key={`speed-${i}`} className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-bold text-[10px] md:text-xs tracking-wide">
                        {s.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-5 md:pt-6 border-t border-white/5">
                     <p className="text-[9px] md:text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-3 md:mb-4">İşlədilən Texnologiyalar</p>
                     <div className="flex flex-wrap gap-1.5 md:gap-2">
                       {viewProject.tech_stack && viewProject.tech_stack.split(',').map((t: string, i: number) => (
                         <span key={`tech-${i}`} className="px-2.5 py-1.5 md:px-3 md:py-1.5 bg-white/5 rounded-md text-[10px] md:text-xs text-slate-300 border border-white/10 font-medium tracking-wide">
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
