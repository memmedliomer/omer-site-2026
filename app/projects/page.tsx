"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Layers, ExternalLink, ArrowUpRight } from 'lucide-react';
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
          setProjects([...data].sort((a, b) => b.id - a.id));
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

  const nextImage = (images: string[]) => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (images: string[]) => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <main className="min-h-screen bg-transparent p-4 md:p-10 pt-28 md:pt-36 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 w-56 rounded-lg bg-white/5 animate-pulse mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden bg-white/[0.03] border border-white/5 animate-pulse">
                <div className="aspect-[4/3] bg-white/5" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-3/4 rounded bg-white/5" />
                  <div className="h-3 w-full rounded bg-white/5" />
                  <div className="h-3 w-5/6 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-transparent px-4 sm:px-6 md:px-10 pt-28 md:pt-36 pb-20 transition-colors duration-500 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* ── Page header ── */}
          <div className="mb-14 md:mb-20">
            <p className="text-[11px] font-mono tracking-[0.3em] text-emerald-500 uppercase mb-3">
              {t('portfolio') || 'Portfolio'}
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none">
              {t('pro') || 'Layihələr'}
            </h1>
            <div className="mt-5 h-px w-16 bg-emerald-500 opacity-60" />
          </div>

          {/* ── Grid ── */}
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-24">
              <p className="text-slate-500 text-lg">{t('no_projects') || 'Hələ heç bir proyekt yüklənməyib.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {projects.map((proj, index) => {
                const techList = proj.tech_stack
                  ? proj.tech_stack.split(',').map((s: string) => s.trim())
                  : [];
                const stats = proj.speed
                  ? proj.speed.split(',').map((s: string) => s.trim()).filter(Boolean)
                  : [];
                const images = proj.image ? proj.image.split(',') : [];
                const coverImage = images[0];

                return (
                  <Tilt
                    key={proj.id}
                    tiltMaxAngleX={4}
                    tiltMaxAngleY={4}
                    glareEnable={false}
                    className="w-full h-full"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                      className="group relative bg-[#080f1c] border border-white/[0.07] rounded-2xl overflow-hidden shadow-xl hover:border-emerald-500/40 hover:shadow-emerald-900/20 hover:shadow-2xl transition-all duration-500 flex flex-col h-full cursor-pointer"
                      onClick={() => { setViewProject(proj); setCurrentImageIndex(0); }}
                    >
                      {/* Image frame */}
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/60 flex items-center justify-center">
                        <img
                          src={getOptimizedUrl(coverImage)}
                          loading="lazy"
                          className="w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-[1.04] transition-all duration-700"
                          alt={proj.title}
                        />
                        {/* Bottom fade */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080f1c] via-[#080f1c]/20 to-transparent" />

                        {/* Multi-image badge */}
                        {images.length > 1 && (
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-full">
                            <Layers size={11} className="text-emerald-400" />
                            <span className="text-[10px] font-bold text-emerald-400 tabular-nums">
                              {images.length}
                            </span>
                          </div>
                        )}

                        {/* Hover arrow */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/40 rounded-full p-3">
                            <ArrowUpRight size={20} className="text-emerald-300" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col p-5 md:p-6">
                        <h3 className="text-lg md:text-xl font-black text-white mb-2 tracking-tight group-hover:text-emerald-300 transition-colors duration-300 line-clamp-1">
                          {proj.title}
                        </h3>
                        <p className="text-slate-400 text-[13px] leading-relaxed mb-5 line-clamp-3 flex-1">
                          {proj.description}
                        </p>

                        {/* Stats pills */}
                        {stats.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {stats.map((stat: string, i: number) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-md border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider"
                              >
                                {stat}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Tech chips */}
                        {techList.length > 0 && (
                          <div className="pt-4 border-t border-white/[0.06]">
                            <div className="flex flex-wrap gap-1.5">
                              {techList.slice(0, 5).map((tech: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] text-slate-400 text-[11px] rounded-md tracking-wide"
                                >
                                  {tech}
                                </span>
                              ))}
                              {techList.length > 5 && (
                                <span className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.08] text-slate-500 text-[11px] rounded-md">
                                  +{techList.length - 5}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </Tilt>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ── Project modal ── */}
      <AnimatePresence>
        {viewProject && (() => {
          const images = viewProject.image ? viewProject.image.split(',') : [];
          const techList = viewProject.tech_stack
            ? viewProject.tech_stack.split(',').map((s: string) => s.trim())
            : [];
          const stats = viewProject.speed
            ? viewProject.speed.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [];

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
              style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 1rem)' }}
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/85 backdrop-blur-md"
                onClick={() => setViewProject(null)}
              />

              {/* Panel */}
              <motion.div
                initial={{ scale: 0.97, y: 16, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.97, y: 16, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row bg-[#07101e] border border-white/10 rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] z-10"
              >
                {/* Close button */}
                <button
                  onClick={() => setViewProject(null)}
                  className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-red-500/80 hover:border-red-500/50 transition-all duration-200"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                {/* ── Left: Image slider ── */}
                <div className="relative w-full md:w-[56%] h-56 md:h-auto bg-black flex-shrink-0 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={getOptimizedUrl(images[currentImageIndex])}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 w-full h-full object-contain p-6 md:p-10"
                      alt={`${viewProject.title} – ${currentImageIndex + 1}`}
                    />
                  </AnimatePresence>

                  {/* Subtle vignette */}
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.5)]" />

                  {/* Slider controls */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(images); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 border border-white/10 text-white hover:bg-emerald-600 transition-colors z-20"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(images); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 border border-white/10 text-white hover:bg-emerald-600 transition-colors z-20"
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Dot indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full border border-white/10 z-20">
                        {images.map((_: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                            aria-label={`Image ${idx + 1}`}
                            className={`rounded-full transition-all duration-300 ${
                              idx === currentImageIndex
                                ? 'bg-emerald-400 w-4 h-1.5'
                                : 'bg-white/25 hover:bg-white/50 w-1.5 h-1.5'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Vertical divider (desktop) */}
                <div className="hidden md:block w-px bg-white/[0.07] flex-shrink-0" />

                {/* ── Right: Details ── */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-6 md:p-10 flex flex-col gap-6 min-h-0">

                  {/* Title + image count */}
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight uppercase pr-8">
                        {viewProject.title}
                      </h2>
                      {images.length > 1 && (
                        <span className="shrink-0 mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                          <Layers size={13} />
                          {currentImageIndex + 1}/{images.length}
                        </span>
                      )}
                    </div>
                    <div className="h-px w-10 bg-emerald-500/50" />
                  </div>

                  {/* Description */}
                  <p className="text-slate-300 text-[14px] leading-[1.8] -mt-2">
                    {viewProject.description}
                  </p>

                  {/* Stats */}
                  {stats.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {stats.map((stat: string, i: number) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 rounded-lg text-[11px] font-bold uppercase tracking-wider"
                        >
                          {stat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tech stack */}
                  {techList.length > 0 && (
                    <div className="pt-5 border-t border-white/[0.07]">
                      <p className="text-[10px] font-mono text-emerald-500 uppercase tracking-[0.2em] mb-3">
                        {t('tech') || 'Texnologiyalar'}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {techList.map((tech: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-white/[0.05] border border-white/10 text-slate-200 text-[12px] rounded-lg hover:bg-white/[0.08] hover:border-white/20 transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External link (if available) */}
                  {viewProject.link && (
                    <a
                      href={viewProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto self-start flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[13px] font-semibold rounded-xl hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={14} />
                      {t('view_project') || 'Layihəyə bax'}
                    </a>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}
