"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { useLang } from '../components/Providers';

export default function Projects() {
  const { t } = useLang();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [viewProject, setViewProject] = useState<any | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        
        if (Array.isArray(data)) {
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

  const getOptimizedUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('cloudinary.com') && !url.includes('q_auto')) {
      return url.replace('/upload/', '/upload/w_1000,q_auto,f_auto/');
    }
    return url;
  };

  const badgeColors = [
    'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
    'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
    'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
  ];

  const nextImage = (images: string[]) => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (images: string[]) => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-transparent p-4 md:p-10 pt-32 flex justify-center items-center relative z-10">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(16,185,129,0.5)]"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent p-4 sm:p-6 md:p-10 pt-24 md:pt-32 transition-colors duration-500 relative z-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-10 md:mb-16 uppercase tracking-tighter border-l-4 border-emerald-500 pl-4 md:pl-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
          {t('pro') || 'LAYİHƏLƏR'}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {projects.length === 0 ? (
            <p className="text-slate-500 col-span-full text-center text-lg">{t('no_projects') || 'Hələ heç bir proyekt yüklənməyib.'}</p>
          ) : (
            projects.map(proj => {
              const rawStats = `${proj.speed || ''},${proj.weight || ''}`.split(',').map(s => s.trim()).filter(s => s);
              const techList = proj.tech_stack ? proj.tech_stack.split(',').map((t: string) => t.trim()) : [];
              const images = proj.image ? proj.image.split(',') : [];
              const coverImage = images[0];

              return (
                <Tilt key={proj.id} tiltMaxAngleX={5} tiltMaxAngleY={5} className="w-full h-full">
                  <div 
                    className="bg-[#050b14]/80 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl group hover:border-emerald-500/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-500 flex flex-col h-full cursor-pointer relative" 
                    onClick={() => { setViewProject(proj); setCurrentImageIndex(0); }}
                  >
                    
                    <div className="w-full aspect-[4/3] bg-black overflow-hidden relative flex items-center justify-center p-3 border-b border-white/5">
                      <img 
                        src={getOptimizedUrl(coverImage)} 
                        loading="lazy"
                        className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-700 rounded-xl bg-black/40" 
                        alt={proj.title} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-transparent opacity-90"></div>
                      
                      {images.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-emerald-400">
                          <Layers size={14} />
                          <span className="text-[10px] font-bold">{images.length}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 md:p-6 flex-1 flex flex-col relative bg-gradient-to-b from-transparent to-[#02060d]">
                       <h3 className="text-xl md:text-2xl font-black text-white mb-3 drop-shadow-md group-hover:text-emerald-400 transition-colors">{proj.title}</h3>
                       <p className="text-slate-400 text-xs md:text-sm mb-5 line-clamp-3 flex-1 leading-relaxed">{proj.description}</p>
                       
                       {rawStats.length > 0 && (
                         <div className="flex flex-wrap gap-2 mb-5">
                           {rawStats.map((stat, i) => (
                             <span key={i} className={`px-2.5 py-1 border text-[10px] font-black rounded-lg uppercase tracking-wider ${badgeColors[i % badgeColors.length]}`}>
                               {stat}
                             </span>
                           ))}
                         </div>
                       )}

                       {techList.length > 0 && (
                         <div className="pt-4 border-t border-white/10">
                           <p className="text-[9px] text-emerald-500 font-mono uppercase tracking-widest mb-2 font-bold">{t('tech') || 'TEXNOLOGİYALAR'}</p>
                           <div className="flex flex-wrap gap-1.5">
                             {techList.map((tech: string, i: number) => (
                               <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/10 text-slate-300 text-[10px] rounded-md shadow-sm group-hover:border-white/20 transition-colors">
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

      <AnimatePresence>
        {viewProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-8 pt-20 md:pt-4">
            <div className="absolute inset-0" onClick={() => setViewProject(null)}></div>
            
            {/* ZİREHLİ MƏNTİQ: Modala SƏRT HÜNDÜRLÜK (h-[85vh] md:h-[80vh]) verdik. Ölçü heç vaxt dəyişməyəcək! */}
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative max-w-6xl w-full h-[85vh] md:h-[80vh] flex flex-col md:flex-row bg-[#050b14] border border-emerald-500/30 rounded-3xl md:rounded-[2rem] overflow-hidden z-10 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
              
              <button onClick={() => setViewProject(null)} className="absolute top-3 right-3 md:top-6 md:right-6 p-2 md:p-3 bg-black/50 md:bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-red-500 z-50 transition-colors border border-white/10">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              
              <div className="flex flex-col md:flex-row w-full h-full overflow-hidden">
                
                {/* SOL: SLIDER HİSSƏSİ (Şəkil üçün tam sabit qutu) */}
                <div className="w-full h-[45%] md:w-[55%] md:h-full border-b md:border-b-0 md:border-r border-white/10 bg-black relative flex items-center justify-center group overflow-hidden">
                  
                  {/* Şəkil tam olaraq absolute inset-0 ilə valideyn qutunu doldurur və əsla çərçivədən çıxmır */}
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={currentImageIndex}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                      src={getOptimizedUrl(viewProject.image.split(',')[currentImageIndex])} 
                      className="absolute inset-0 w-full h-full object-contain p-4 md:p-8 drop-shadow-2xl" 
                      alt={`${viewProject.title} - ${currentImageIndex + 1}`} 
                    />
                  </AnimatePresence>

                  {/* Oxlar və İndikatorlar */}
                  {viewProject.image.split(',').length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); prevImage(viewProject.image.split(',')); }} className="absolute left-2 md:left-4 p-2 md:p-3 bg-black/50 hover:bg-emerald-600 border border-white/10 rounded-full text-white backdrop-blur-md transition-all sm:opacity-0 sm:group-hover:opacity-100 z-20">
                        <ChevronLeft size={24} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); nextImage(viewProject.image.split(',')); }} className="absolute right-2 md:right-4 p-2 md:p-3 bg-black/50 hover:bg-emerald-600 border border-white/10 rounded-full text-white backdrop-blur-md transition-all sm:opacity-0 sm:group-hover:opacity-100 z-20">
                        <ChevronRight size={24} />
                      </button>
                      
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 px-3 py-2 rounded-full backdrop-blur-sm border border-white/10 z-20">
                        {viewProject.image.split(',').map((_: any, idx: number) => (
                          <button 
                            key={idx} 
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-emerald-400 w-4 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-white/30 hover:bg-white/60'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                {/* SAĞ: MƏLUMATLAR */}
                <div className="w-full h-[55%] md:w-[45%] md:h-full p-6 md:p-10 flex flex-col overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#0a1120] to-[#050b14]">
                  <h2 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-4 uppercase tracking-tighter pr-8 leading-tight shrink-0">{viewProject.title}</h2>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8">{viewProject.description}</p>
                  
                  <div className="flex flex-wrap gap-2 md:gap-3 mb-8 shrink-0">
                    {viewProject.speed && viewProject.speed.split(',').map((s: string, i: number) => (
                      <span key={`speed-${i}`} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl font-bold text-[10px] md:text-xs tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        {s.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/10 shrink-0">
                     <p className="text-[10px] text-emerald-500 font-mono uppercase tracking-widest mb-4 font-bold">{t('tech') || 'İŞLƏDİLƏN TEXNOLOGİYALAR'}</p>
                     <div className="flex flex-wrap gap-2">
                       {viewProject.tech_stack && viewProject.tech_stack.split(',').map((t: string, i: number) => (
                         <span key={`tech-${i}`} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 transition-colors rounded-lg text-xs text-slate-200 border border-white/10 font-medium tracking-wide">
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
