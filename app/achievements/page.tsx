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
  category_name?: string; // Turso-dan gələn qrup adı
}

export default function Achievements() {
  const { t } = useLang();
  
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [viewGroup, setViewGroup] = useState<string | null>(null);
  const [viewCert, setViewCert] = useState<Certificate | null>(null);

  // Səhifə açılanda məlumatları Turso-dan çəkirik
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

  // Sertifikatları Qruplara (Kataloqlara) və Fərdilərə ayırırıq
  const individualCerts = certificates.filter(c => !c.category_name);
  
  // Qrupları avtomatik formalaşdıran ağıllı sistem
  const groupedCerts = certificates.reduce((acc: any, cert) => {
    if (cert.category_name) {
      if (!acc[cert.category_name]) acc[cert.category_name] = [];
      acc[cert.category_name].push(cert);
    }
    return acc;
  }, {});

  const groupNames = Object.keys(groupedCerts);

  if (loading) {
    return (
      <main className="min-h-screen bg-transparent p-10 pt-32 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent p-6 md:p-10 pt-32 transition-colors duration-500 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-16 uppercase tracking-tighter border-l-4 border-cyan-500 pl-6">
          {t('ach')}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          
          {/* DINAMİK QOVLUQLAR (KATALOQLAR) */}
          {groupNames.map(groupName => {
            const certsInGroup = groupedCerts[groupName];
            const lastCert = certsInGroup[0]; // Ən son yüklənən sertifikat

            return (
              <div key={groupName} className="group cursor-pointer flex flex-col" onClick={() => setViewGroup(groupName)}>
                <div className="relative h-64 md:h-72 w-full">
                   {/* 3D Dərinlik */}
                   <div className="absolute top-4 left-4 w-full h-full bg-slate-800/80 rounded-2xl rotate-6 z-0 border border-white/5 transition-colors"></div>
                   <div className="absolute top-2 left-2 w-full h-full bg-slate-900/80 rounded-2xl -rotate-3 z-10 border border-white/10 transition-colors"></div>
                   
                   {/* Əsas Qovluq */}
                   <div className="relative z-20 w-full h-full p-[4px] liquid-led led-gold rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.03] cursor-pointer">
                      <div className="w-full h-full bg-black rounded-[14px] overflow-hidden relative">
                        <img 
                          src={lastCert?.image} 
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 grayscale group-hover:grayscale-0" 
                          alt="Folder Cover" 
                        />
                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-black/60 border border-white/10 backdrop-blur-md flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                            +{certsInGroup.length}
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
                <p className="mt-6 text-center text-slate-700 dark:text-slate-300 font-bold text-sm uppercase tracking-wide">
                  {groupName} Kataloqu
                </p>
              </div>
            );
          })}

          {/* FƏRDİ SERTİFİKATLAR */}
          {individualCerts.map(cert => (
            <div key={cert.id} className="cursor-pointer flex flex-col" onClick={() => setViewCert(cert)}>
              <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} className="h-64 md:h-72 w-full">
                <div className={`relative w-full h-full p-[4px] liquid-led led-${cert.rank} rounded-2xl shadow-xl transition-all duration-300 hover:shadow-cyan-500/20`}>
                  <div className="w-full h-full bg-black rounded-[14px] overflow-hidden relative group">
                    <img 
                      src={cert.image} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                      alt={cert.title} 
                    />
                  </div>
                </div>
              </Tilt>
              <p className="mt-6 text-center text-slate-700 dark:text-slate-300 font-bold text-sm">
                {cert.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Kataloq Açıldıqda İçi */}
      <AnimatePresence>
        {viewGroup && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[110] bg-white/90 dark:bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="max-w-6xl w-full">
              <div className="flex justify-between items-center mb-10 border-b border-slate-300 dark:border-slate-800 pb-4">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase">
                  <Grid className="text-cyan-500" /> {viewGroup} Sertifikatları
                </h2>
                <button onClick={() => setViewGroup(null)} className="p-3 bg-slate-200 dark:bg-white/10 rounded-full text-slate-800 dark:text-white hover:bg-red-500 hover:text-white transition-colors">
                  <X />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {groupedCerts[viewGroup].map((c: Certificate) => (
                  <div key={c.id} className="group cursor-pointer flex flex-col" onClick={() => setViewCert(c)}>
                    <div className={`relative w-full p-[3px] liquid-led led-${c.rank} rounded-xl`}>
                      <div className="bg-black rounded-[10px] overflow-hidden">
                        <img src={c.image} className="w-full aspect-video object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" alt={c.title} />
                      </div>
                    </div>
                    <p className="text-slate-800 dark:text-white text-sm mt-4 font-bold text-center opacity-80 group-hover:opacity-100 transition-opacity">
                      {c.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: İri Şəkil Görünüşü */}
      <AnimatePresence>
        {viewCert && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          >
            <div className="absolute inset-0" onClick={() => setViewCert(null)}></div>
            <button onClick={() => setViewCert(null)} className="absolute top-6 right-6 md:top-10 md:right-10 p-3 md:p-4 bg-white/10 rounded-full text-white hover:bg-red-500 z-[130] transition-colors shadow-2xl">
              <X size={24} />
            </button>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative max-w-5xl w-full z-10 flex justify-center">
              <img src={viewCert.image} className="max-w-full max-h-[85vh] object-contain bg-[#050b14] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10" alt={viewCert.title} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </main>
  );
}