"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../components/Providers';
import { Send, User, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" className="md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function Contact() {
  const { lang } = useLang();
  
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      setShowSuccess(true);
      setFormData({ name: '', phone: '', message: '' });
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 4000);

    } catch (error) {
      console.error(error);
    }
  };

  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/200x200');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if(data && data.contact_image) setProfileImage(data.contact_image);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <main className="min-h-screen bg-transparent p-4 sm:p-6 pt-24 md:pt-32 transition-colors duration-500 relative flex flex-col items-center">
      
      {/* SƏLİQƏLİ BİLDİRİŞ EKRANI (TOAST) - Mobil üçün zirehləndi */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 md:top-24 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-md md:w-auto bg-green-500/20 border border-green-500/50 backdrop-blur-xl px-4 py-3 md:px-6 md:py-4 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.3)] flex items-center gap-3 md:gap-4"
          >
            <CheckCircle className="text-green-400 shrink-0" size={20} />
            <span className="text-white font-bold tracking-wide text-sm md:text-base">
              {lang === 'AZ' ? "Mesaj uğurla göndərildi! Təşəkkürlər." : "Message sent successfully! Thank you."}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="relative z-10 mb-8 md:mb-12">
        <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full p-1.5 bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_30px_rgba(6,182,212,0.4)] overflow-hidden flex items-center justify-center">
          <img 
            src={profileImage} 
            alt="Profile" 
            className="w-full h-full object-cover rounded-full bg-[#050b14]" 
          />
        </div>
      </motion.div>

      <div className="max-w-5xl w-full flex flex-col lg:flex-row gap-10 md:gap-12 z-10">
        
        {/* Sol Tərəf Sosial Medialar */}
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:w-1/3 flex flex-col items-center justify-center gap-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-4 text-center">{lang === 'AZ' ? "Mənimlə Əlaqə" : "Get in Touch"}</h2>
          <div className="flex lg:flex-col gap-4 md:gap-6">
            <a href="www.linkedin.com/in/mammadliomar" target="_blank" rel="noreferrer" className="group relative flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-[#0077b5] group-hover:text-white group-hover:border-[#0077b5] transition-all shadow-lg"><LinkedinIcon /></div>
            </a>
            <a href="https://github.com/memmedliomer" target="_blank" rel="noreferrer" className="group relative flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-[#333] dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-all shadow-lg"><GithubIcon /></div>
            </a>
            <a href="https://t.me/memmedli_001" target="_blank" rel="noreferrer" className="group relative flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:bg-[#0088cc] group-hover:text-white transition-all shadow-lg"><Send className="w-6 h-6 md:w-7 md:h-7 mr-1 mt-1" /></div>
            </a>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="lg:w-2/3">
          <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} className="w-full h-full" glareEnable={false}>
            <form onSubmit={handleSubmit} className="w-full h-full bg-black/40 border border-white/10 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col gap-5 md:gap-6">
              <div className="flex flex-col md:flex-row gap-5 md:gap-6">
                <div className="flex-1 relative">
                  <User className="absolute left-4 top-3.5 md:top-4 text-slate-500" size={20} />
                  <input type="text" required placeholder={lang === 'AZ' ? "Ad və Soyad" : "Full Name"} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 md:py-4 pl-12 pr-4 text-white text-sm md:text-base focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="flex-1 relative">
                  <Phone className="absolute left-4 top-3.5 md:top-4 text-slate-500" size={20} />
                  <input type="tel" required placeholder={lang === 'AZ' ? "Mobil Nömrə" : "Phone Number"} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 md:py-4 pl-12 pr-4 text-white text-sm md:text-base focus:outline-none focus:border-cyan-500" />
                </div>
              </div>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-3.5 md:top-4 text-slate-500" size={20} />
                <textarea required rows={4} placeholder={lang === 'AZ' ? "Mesajınızı bura yazın..." : "Write your message here..."} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 md:py-4 pl-12 pr-4 text-white text-sm md:text-base focus:outline-none focus:border-cyan-500 resize-none md:rows-5"></textarea>
              </div>
              <button type="submit" className="group relative w-full py-3.5 md:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold tracking-wide transition-all overflow-hidden hover:scale-[1.02] flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] mt-2 md:mt-0">
                <Send size={18} className="relative z-10 group-hover:translate-x-1 transition-transform md:w-5 md:h-5" />
                <span className="relative z-10 text-sm md:text-base">{lang === 'AZ' ? "Göndər" : "Send Message"}</span>
              </button>
            </form>
          </Tilt>
        </motion.div>
      </div>
    </main>
  );
}
