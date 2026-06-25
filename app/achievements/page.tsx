"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Grid } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { useLang } from '../components/Providers';

interface Certificate {
  id: number; 
  title: string; 
  image: string; 
  rank: 'gold' | 'silver' | 'bronze' | 'none'; 
  category_name?: string;
}

export default function Achievements() {
  const { t } = useLang();
  
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [viewGroup, setViewGroup] = useState<string | null>(null);
  const [viewCert, setViewCert] = useState<Certificate | null>(null);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const res = await fetch('/api/certificates');
        const data = await res.json();
        setCertificates(data || []);
      } catch (error) {
        console.error("Sertifikatlar yüklənmədi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  // ŞƏKİLLƏRİ İLDIRIM SÜRƏTİNDƏ AÇMAQ ÜÇÜN OPTİMİZASİYA FUNKSİYASI
  const getOptimizedUrl = (url?: string) => {
    if (!url) return '';
    // Əgər Cloudinary linkidirsə və hələ optimizasiya olunmayıbsa, ölçünü və çəkini kiçilt
    if (url.includes('cloudinary.com') && !url.includes('q_auto')) {
      return url.replace('/upload/', '/upload/w_800,q_auto,f_auto/');
    }
    return url;
  };

  // 1. Bütün sertifikatları ən yenidən ən köhnəyə doğru sıralayırıq
  const sortedAllCerts = [...certificates].sort((a, b) => b.id - a.id);

  // 2. Fərdi və Qrup sertifikatlarını ayırırıq
  const individualCerts = sortedAllCerts.filter(c => !c.category_name);
  const groupedCerts = sortedAllCerts.reduce((acc: any, cert) => {
    if (cert.category_name) {
      if (!acc[cert.category_name]) acc[cert.category_name] = [];
      acc[cert.category_name].push(cert);
    }
    return acc;
  }, {});

  // 3. EKRANDA GÖSTƏRİLƏCƏK HƏR ŞEYİ BİRLƏŞDİRİB VAXTA GÖRƏ SIRALAYIRIQ
  const displayItems: any[] = [];

  // Fərdiləri əlavə edirik
  individualCerts.forEach(cert => {
    displayItems.push({ type: 'individual', sortId: cert.id, data: cert });
  });

  // Qovluqları əlavə edirik (Qovluğun sırası içindəki ən yeni sertifikata görə təyin edilir)
  Object.keys(groupedCerts).forEach(groupName => {
    const certs = groupedCerts[groupName];
    const maxId = Math.max(...certs.map((c: any) => c.id));
    displayItems.push({ type: 'folder', sortId: maxId, name: groupName, certs });
  });

  // Nəhayət, hər şeyi ən son yüklənən ən üstdə (ən birinci) olmaqla sıralayırıq
  displayItems.sort((a, b) => b.sortId - a.sortId);

  if (loading) {
    return (
      <main className="min-h-screen bg-transparent p-4 md:p-10 pt-32 flex justify-center items-center">
        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent p-4 sm:p-6 md:p-10 pt-24 md:pt-32 transition-colors duration-500 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-10 md:mb-16 uppercase tracking-tighter border-l-4 border-cyan-500 pl-4 md:pl-6">
          {t('ach')}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-14">
          
          {/* BÜTÜN ELEMENTLƏR (Qovluqlar və Fərdilər qarışıq, eyni boyda və yüklənmə sırasıyla) */}
          {displayItems.map((item, index) => {
            
            if (item.type === 'folder') {
              const groupName = item.name;
              const certsInGroup = item.certs;
              const lastCert = certsInGroup[0]; 

              return (
                <div key={`folder-${index}`} className="group cursor-pointer flex flex-col mx-auto w-full max-w-[320px] sm:max-w-none" onClick={() => setViewGroup(groupName)}>
                  <div className="relative h-64 sm:h-72 lg:h-80 w-full">
                     <div className="absolute top-3 left-3 md:top-4 md:left-4 w-full h-full bg-slate-800/80 rounded-xl md:rounded-2xl rotate-3 z-0 border border-white/5 transition-colors"></div>
                     <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 w-full h-full bg-slate-900/80 rounded-xl md:rounded-2xl -rotate-2 z-10 border border-white/10 transition-colors"></div>
                     
                     <div className="relative z-20 w-full h-full p-[3px] md:p-[4px] liquid-led led-gold rounded-xl md:rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.03] cursor-pointer">
                        <div className="w-full h-full bg-[#050b14] rounded-[10px] md:rounded-[14px] overflow-hidden relative flex items-center justify-center p-3">
                          <img 
                            src={getOptimizedUrl(lastCert?.image)} 
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain opacity-60 group-hover:opacity-80 transition-opacity duration-500 grayscale group-hover:grayscale-0 bg-black/20 rounded-lg" 
                            alt="Folder Cover" 
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 rounded-[10px] md:rounded-[14px]"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/60 border border-white/10 backdrop-blur-md flex items-center justify-center text-white font-black text-lg md:text-xl shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                              +{certsInGroup.length}
                            </div>
                          </div>
                        </div>
                     </div>
                  </div>
                  <p className="mt-5 md:mt-6 text-center text-slate-700 dark:text-slate-300 font-bold text-xs md:text-sm uppercase tracking-wide">
                    {groupName} Kataloqu
                  </p>
                </div>
              );
            } 
            
            else {
              const cert = item.data;
              return (
                <div key={`cert-${cert.id}`} className="cursor-pointer flex flex-col mx-auto w-full max-w-[320px] sm:max-w-none" onClick={() => setViewCert(cert)}>
                  <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} className="h-64 sm:h-72 lg:h-80 w-full">
                    <div className={`relative w-full h-full p-[3px] md:p-[4px] liquid-led led-${cert.rank} rounded-xl md:rounded-2xl shadow-xl transition-all duration-300 hover:shadow-cyan-500/20`}>
                      <div className="w-full h-full bg-[#0d1527] rounded-[10px] md:rounded-[14px] overflow-hidden relative group flex items-center justify-center p-3 md:p-4">
                        <img 
                          src={getOptimizedUrl(cert.image)} 
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-contain opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500 rounded-md shadow-lg bg-black/20" 
                          alt={cert.title} 
                        />
                      </div>
                    </div>
                  </Tilt>
                  <p className="mt-4 md:mt-5 text-center text-slate-700 dark:text-slate-300 font-bold text-xs md:text-sm px-2">
                    {cert.title}
                  </p>
                </div>
              );
            }
            
          })}
        </div>
      </div>

      {/* MODAL 1: Kataloq Açıldıqda İçi */}
      <AnimatePresence>
        {viewGroup && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[110] bg-white/95 dark:bg-black/95 backdrop-blur-xl flex flex-col items-center justify-start md:justify-center p-4 md:p-10 pt-20 md:pt-10"
          >
            <div className="max-w-6xl w-full h-full flex flex-col md:max-h-[85vh]">
              <div className="flex justify-between items-center mb-6 md:mb-10 border-b border-slate-300 dark:border-slate-800 pb-4 shrink-0">
                <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2 md:gap-3 uppercase">
                  <Grid className="text-cyan-500 w-6 h-6 md:w-8 md:h-8" /> 
                  <span className="truncate max-w-[200px] sm:max-w-none">{viewGroup}</span>
                </h2>
                <button onClick={() => setViewGroup(null)} className="p-2 md:p-3 bg-slate-200 dark:bg-white/10 rounded-full text-slate-800 dark:text-white hover:bg-red-500 hover:text-white transition-colors">
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 overflow-y-auto pb-20 md:pb-10 pr-1 md:pr-4 custom-scrollbar">
                {groupedCerts[viewGroup].map((c: Certificate) => (
                  <div key={c.id} className="group cursor-pointer flex flex-col mx-auto w-full max-w-[320px] sm:max-w-none" onClick={() => setViewCert(c)}>
                    <div className={`relative w-full p-[2px] md:p-[3px] liquid-led led-${c.rank} rounded-xl`}>
                      <div className="bg-[#0d1527] rounded-[10px] overflow-hidden h-48 sm:h-56 flex items-center justify-center p-3">
                        <img 
                          src={getOptimizedUrl(c.image)} 
                          loading="lazy"
                          className="w-full h-full object-contain opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 rounded-sm bg-black/20" 
                          alt={c.title} 
                        />
                      </div>
                    </div>
                    <p className="text-slate-800 dark:text-white text-xs md:text-sm mt-3 md:mt-4 font-bold text-center opacity-80 group-hover:opacity-100 transition-opacity">
                      {c.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: İri Şəkil Görünüşü (Böyüdəndə Orijinal Keyfiyyət) */}
      <AnimatePresence>
        {viewCert && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          >
            <div className="absolute inset-0" onClick={() => setViewCert(null)}></div>
            <button onClick={() => setViewCert(null)} className="absolute top-4 right-4 md:top-10 md:right-10 p-2 md:p-4 bg-white/10 rounded-full text-white hover:bg-red-500 z-[130] transition-colors shadow-2xl">
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative max-w-5xl w-full z-10 flex justify-center">
              <img 
                src={viewCert.image} // İri ekranda şəklin xırtaxırt, ən təmiz versiyası açılır
                className="max-w-full max-h-[85vh] object-contain bg-[#050b14] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10" 
                alt={viewCert.title} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </main>
  );
}
