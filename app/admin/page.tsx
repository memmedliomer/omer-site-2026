"use client";

import { useState, useEffect } from 'react';
import { Shield, Lock, User, LogOut, MessageSquare, Folder, Award, Plus, Trash2, Edit2, Check, X, UploadCloud, Briefcase, Settings, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('messages');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  const [settingsData, setSettingsData] = useState<any>({});
  const [homeFile, setHomeFile] = useState<File | null>(null);
  const [contactFile, setContactFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [bioText, setBioText] = useState('');
  const [uploadingSettings, setUploadingSettings] = useState(false);
  
  const [newCategory, setNewCategory] = useState('');

  const [certTitle, setCertTitle] = useState('');
  const [certFile, setCertFile] = useState<File | null>(null);
  const [certRank, setCertRank] = useState('none');
  const [certCategory, setCertCategory] = useState('none');
  const [uploadingCert, setUploadingCert] = useState(false);

  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projFeatures, setProjFeatures] = useState(''); 
  const [projTech, setProjTech] = useState('');
  const [projFile, setProjFile] = useState<File | null>(null);
  const [uploadingProj, setUploadingProj] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') === 'true') setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      if (activeTab === 'messages') fetchMessages();
      if (activeTab === 'folders') fetchCategories();
      if (activeTab === 'certificates') { fetchCategories(); fetchCertificates(); }
      if (activeTab === 'projects') fetchProjects();
      if (activeTab === 'settings') fetchSettings();
    }
  }, [isLoggedIn, activeTab]);

  const fetchMessages = async () => { const res = await fetch('/api/messages'); const data = await res.json(); setMessages(Array.isArray(data) ? data : []); };
  const fetchCategories = async () => { const res = await fetch('/api/categories'); const data = await res.json(); setCategories(Array.isArray(data) ? data : []); };
  const fetchCertificates = async () => { const res = await fetch('/api/certificates'); const data = await res.json(); setCertificates(Array.isArray(data) ? data : []); };
  const fetchProjects = async () => { const res = await fetch('/api/projects'); const data = await res.json(); setProjects(Array.isArray(data) ? data : []); };
  const fetchSettings = async () => { 
    const res = await fetch('/api/settings'); 
    const data = await res.json(); 
    setSettingsData(data.error ? {} : data); 
    setBioText(data.bio || '');
  };

  const uploadToCloudinary = async (file: File, isCv: boolean = false) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: 'POST', body: formData });
    const data = await res.json();
    
    // Əgər CV və ya sertifikatdırsa, şəkli OLDUĞU KİMİ (orijinal enli formatda) saxla, kəsmə!
    // activeTab yoxlanışı və ya activeTab === 'certificates' bura təsir edir, ən rahatı:
    const isCertificate = activeTab === 'certificates';
    
    if (file.type.startsWith('image/') && !isCv && !isCertificate) {
       return data.secure_url.replace('/upload/', '/upload/c_fill,g_auto,w_800,h_800,f_auto,q_auto/');
    }
    return data.secure_url;
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newCategory }) });
    setNewCategory(''); fetchCategories();
  };

  // YENİ: KATALOQ SİLMƏ FUNKSİYASI
  const handleDeleteCategory = async (id: number) => {
    if(!confirm("Bu kataloqu silmək istədiyinizə əminsiniz? Kataloqun içindəki sertifikatlar silinməyəcək, fərdi sertifikatlara keçəcək.")) return;
    await fetch('/api/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchCategories();
  };

  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle || !certFile) return;
    setUploadingCert(true);
    try {
      const secureImageUrl = await uploadToCloudinary(certFile);
      await fetch('/api/certificates', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: certTitle, image: secureImageUrl, rank: certRank, category_id: certCategory }) });
      setCertTitle(''); setCertFile(null); setCertRank('none'); setCertCategory('none'); fetchCertificates();
    } catch (err) { alert("Xəta!"); } finally { setUploadingCert(false); }
  };

  const handleDeleteCertificate = async (id: number) => {
    if(!confirm("Bu sertifikatı silmək istədiyinizə əminsiniz?")) return;
    await fetch('/api/certificates', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchCertificates();
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projFile) return;
    setUploadingProj(true);
    try {
      const secureImageUrl = await uploadToCloudinary(projFile);
      await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: projTitle, description: projDesc, image: secureImageUrl, speed: projFeatures, weight: '', tech_stack: projTech }) });
      setProjTitle(''); setProjDesc(''); setProjFeatures(''); setProjTech(''); setProjFile(null); fetchProjects();
    } catch (err) { alert("Xəta!"); } finally { setUploadingProj(false); }
  };

  const handleDeleteProject = async (id: number) => {
    if(!confirm("Bu proyekti silmək istədiyinizə əminsiniz?")) return;
    await fetch('/api/projects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchProjects();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingSettings(true);
    try {
      let newHomeImage = settingsData.home_image;
      let newContactImage = settingsData.contact_image;
      let newCvLink = settingsData.cv_link;

      if (homeFile) newHomeImage = await uploadToCloudinary(homeFile);
      if (contactFile) newContactImage = await uploadToCloudinary(contactFile);
      if (cvFile) newCvLink = await uploadToCloudinary(cvFile, true); 

      await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ home_image: newHomeImage, contact_image: newContactImage, bio: bioText, cv_link: newCvLink }) });
      
      alert("Ayarlar uğurla yeniləndi!");
      fetchSettings(); setHomeFile(null); setContactFile(null); setCvFile(null);
    } catch (err) { alert("Xəta baş verdi!"); } finally { setUploadingSettings(false); }
  };

  const handleDeleteMessage = async (id: number) => {
    if(!confirm("Mesajı silmək istədiyinizə əminsiniz?")) return;
    await fetch('/api/messages', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchMessages();
  };
  const handleSaveEdit = async (id: number) => {
    await fetch('/api/messages', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, message: editContent }) });
    setEditingId(null); fetchMessages();
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }); const data = await res.json();
      if (data.success) { sessionStorage.setItem('adminAuth', 'true'); setIsLoggedIn(true); } else { setError(data.message); }
    } catch (err) { setError("Bağlantı xətası!"); } finally { setLoading(false); }
  };
  const handleLogout = () => { sessionStorage.removeItem('adminAuth'); setIsLoggedIn(false); };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#050b14] flex items-center justify-center p-4 relative z-[200]">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 w-full max-w-md bg-black/50 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl">
          <div className="flex flex-col items-center mb-6 md:mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-4"><Shield size={28} className="text-white" /></div>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-widest">Admin Panel</h1>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 sm:gap-5">
            <div className="relative"><User className="absolute left-4 top-3.5 text-slate-400" size={18} /><input type="text" placeholder="İstifadəçi adı" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 text-sm sm:text-base" /></div>
            <div className="relative"><Lock className="absolute left-4 top-3.5 text-slate-400" size={18} /><input type="password" placeholder="Şifrə" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 text-sm sm:text-base" /></div>
            {error && <p className="text-red-400 text-xs sm:text-sm text-center font-medium">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold uppercase transition-all shadow-lg mt-2 text-sm sm:text-base">Daxil Ol</button>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b14] flex flex-col md:flex-row text-white relative z-[200]">
      
      <div className="md:hidden flex items-center justify-between p-4 bg-black/80 border-b border-white/10 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center"><Shield size={16} className="text-black" /></div>
          <span className="font-black text-lg tracking-wider uppercase">Admin</span>
        </div>
        <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><LogOut size={20} /></button>
      </div>

      <div className="hidden md:flex w-64 bg-black/50 border-r border-white/10 backdrop-blur-xl p-6 flex-col h-screen sticky top-0 overflow-y-auto z-40">
        <div className="flex items-center gap-3 mb-10"><div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center"><Shield size={20} className="text-black" /></div><span className="font-black text-xl tracking-wider uppercase">Admin</span></div>
        <nav className="flex flex-col gap-2 flex-1">
          <button onClick={() => setActiveTab('messages')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'messages' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}><MessageSquare size={20} /> Mesajlar</button>
          <button onClick={() => setActiveTab('folders')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'folders' ? 'bg-cyan-600/20 text-cyan-400' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}><Folder size={20} /> Kataloqlar</button>
          <button onClick={() => setActiveTab('certificates')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'certificates' ? 'bg-purple-600/20 text-purple-400' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}><Award size={20} /> Sertifikatlar</button>
          <button onClick={() => setActiveTab('projects')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'projects' ? 'bg-emerald-600/20 text-emerald-400' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}><Briefcase size={20} /> Proyektlər</button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-amber-600/20 text-amber-400' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}><Settings size={20} /> Sayt Ayarları</button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors mt-6"><LogOut size={20} /> Çıxış</button>
      </div>

      <div className="flex-1 p-4 sm:p-6 md:p-10 pb-28 md:pb-10 overflow-y-auto w-full">
        
        {/* MESAJLAR */}
        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 border-b border-white/10 pb-4">Gələn Mesajlar</h2>
            <div className="flex flex-col gap-4">
              {messages.length === 0 ? <p className="text-slate-500 text-center p-8">Mesaj yoxdur.</p> : messages.map((msg) => (
                <div key={msg.id} className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-2xl shadow-lg group">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-3 mb-3 gap-3 sm:gap-0">
                    <h3 className="text-cyan-400 font-bold text-base sm:text-lg flex items-center gap-2"><User size={18}/> {msg.name}</h3>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-slate-300 font-mono text-xs sm:text-sm bg-black/50 px-2 sm:px-3 py-1 rounded-full">{msg.phone}</span>
                      <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                         <button onClick={() => { setEditingId(msg.id); setEditContent(msg.message); }} className="p-1.5 sm:p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors"><Edit2 size={16} /></button>
                         <button onClick={() => handleDeleteMessage(msg.id)} className="p-1.5 sm:p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                  {editingId === msg.id ? (
                    <div className="mt-2">
                      <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full bg-black/40 border border-cyan-500/50 rounded-xl p-3 sm:p-4 text-white focus:outline-none resize-none text-sm sm:text-base" rows={4} />
                      <div className="flex gap-2 mt-2 justify-end">
                        <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs sm:text-sm transition-colors"><X size={14}/> Ləğv et</button>
                        <button onClick={() => handleSaveEdit(msg.id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-xs sm:text-sm transition-colors"><Check size={14}/> Yadda saxla</button>
                      </div>
                    </div>
                  ) : ( <p className="text-slate-200 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">{msg.message}</p> )}
                  <span className="text-[10px] sm:text-xs text-slate-500 mt-4 block">Göndərildi: {new Date(msg.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* QOVLUQLAR (YENİLƏNDİ: SİLMƏ DÜYMƏSİ ƏLAVƏ EDİLDİ) */}
        {activeTab === 'folders' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 border-b border-white/10 pb-4">Kataloq İdarəetməsi</h2>
            <form onSubmit={handleCreateCategory} className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-10">
              <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Yeni Kataloq Adı" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 text-white focus:outline-none focus:border-cyan-500" required />
              <button type="submit" className="px-6 md:px-8 py-3 md:py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Plus size={20} /> Yarat</button>
            </form>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {categories.map((cat, i) => (
                <div key={i} className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl"><Folder size={20} className="sm:w-6 sm:h-6" /></div>
                    <span className="font-bold text-base sm:text-lg">{cat.name}</span>
                  </div>
                  {/* SİLMƏ DÜYMƏSİ */}
                  <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all sm:opacity-0 sm:group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SERTİFİKATLAR */}
        {activeTab === 'certificates' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 border-b border-white/10 pb-4">Sertifikat İdarəetməsi</h2>
            <form onSubmit={handleCreateCertificate} className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 mb-8 md:mb-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="flex flex-col gap-1.5 md:gap-2">
                <label className="text-xs md:text-sm text-slate-400">Sertifikatın Adı</label>
                <input type="text" required value={certTitle} onChange={(e) => setCertTitle(e.target.value)} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1.5 md:gap-2">
                <label className="text-xs md:text-sm text-slate-400">Şəkil Seç</label>
                <input type="file" accept="image/*" required onChange={(e) => setCertFile(e.target.files?.[0] || null)} className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs md:file:text-sm file:font-bold file:bg-purple-600/30 file:text-purple-400" />
              </div>
              <div className="flex flex-col gap-1.5 md:gap-2">
                <label className="text-xs md:text-sm text-slate-400">Çərçivə Rəngi</label>
                <select value={certRank} onChange={(e) => setCertRank(e.target.value)} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none appearance-none">
                  <option value="none">Sadə Çərçivə</option>
                  <option value="gold">Qızıl (Gold)</option>
                  <option value="silver">Gümüş (Silver)</option>
                  <option value="bronze">Bürünc (Bronze)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5 md:gap-2">
                <label className="text-xs md:text-sm text-slate-400">Qrup Seçimi</label>
                <select value={certCategory} onChange={(e) => setCertCategory(e.target.value)} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none appearance-none">
                  <option value="none">Fərdi Sertifikat</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <button type="submit" disabled={uploadingCert} className="md:col-span-2 py-3 md:py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                {uploadingCert ? "Yüklənir..." : <><UploadCloud size={20} /> Yüklə və Saxla</>}
              </button>
            </form>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {certificates.map((cert) => (
                <div key={cert.id} className="bg-black/40 border border-white/10 rounded-xl overflow-hidden group">
                  <div className={`h-40 w-full relative border-b-4 border-${cert.rank === 'gold' ? 'yellow-500' : cert.rank === 'silver' ? 'slate-300' : cert.rank === 'bronze' ? 'orange-600' : 'transparent'}`}>
                    <img src={cert.image} alt={cert.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    <button onClick={() => handleDeleteCertificate(cert.id)} className="absolute top-2 right-2 p-2 bg-red-600/80 text-white rounded-lg hover:bg-red-500 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                  </div>
                  <div className="p-3 md:p-4"><h3 className="font-bold text-sm md:text-base text-white truncate">{cert.title}</h3></div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PROYEKT İDARƏETMƏSİ */}
        {activeTab === 'projects' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 border-b border-white/10 pb-4 text-emerald-400">Proyekt İdarəetməsi</h2>
            <form onSubmit={handleCreateProject} className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 mb-8 md:mb-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="flex flex-col gap-1.5 md:gap-2">
                <label className="text-xs md:text-sm text-slate-400">Proyektin Adı</label>
                <input type="text" required value={projTitle} onChange={(e) => setProjTitle(e.target.value)} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none" />
              </div>
              <div className="flex flex-col gap-1.5 md:gap-2">
                <label className="text-xs md:text-sm text-slate-400">Şəkil Seç</label>
                <input type="file" accept="image/*" required onChange={(e) => setProjFile(e.target.files?.[0] || null)} className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs md:file:text-sm file:font-bold file:bg-emerald-600/30 file:text-emerald-400" />
              </div>
              <div className="flex flex-col gap-1.5 md:gap-2 md:col-span-2">
                <label className="text-xs md:text-sm text-slate-400">Qısa Təsvir</label>
                <textarea required value={projDesc} onChange={(e) => setProjDesc(e.target.value)} rows={3} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none resize-none" />
              </div>
              
              <div className="flex flex-col gap-1.5 md:gap-2 md:col-span-2">
                <label className="text-xs md:text-sm text-slate-400">Xüsusiyyətlər (Vergüllə ayır)</label>
                <input type="text" value={projFeatures} onChange={(e) => setProjFeatures(e.target.value)} placeholder="Məs: Sürət: 180, Çəki: 50g" className="bg-black/40 border border-emerald-500/30 rounded-xl px-4 py-3 md:py-4 text-white focus:border-emerald-500 outline-none shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]" />
              </div>
              
              <div className="flex flex-col gap-1.5 md:gap-2 md:col-span-2">
                <label className="text-xs md:text-sm text-slate-400">Texnologiyalar (Vergüllə ayır)</label>
                <input type="text" value={projTech} onChange={(e) => setProjTech(e.target.value)} placeholder="Məs: Python, Arduino" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none" />
              </div>
              <button type="submit" disabled={uploadingProj} className="md:col-span-2 py-3 md:py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                {uploadingProj ? "Yüklənir..." : <><Briefcase size={20} /> Proyekti Yüklə</>}
              </button>
            </form>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden relative group">
                  <div className="h-40 md:h-48 w-full relative">
                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                    <button onClick={() => handleDeleteProject(proj.id)} className="absolute top-2 right-2 md:top-3 md:right-3 p-2 bg-red-600/90 text-white rounded-lg hover:bg-red-500 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                  </div>
                  <div className="p-4 md:p-5"><h3 className="font-bold text-base md:text-xl text-white truncate">{proj.title}</h3></div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* AYARLAR TABI */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 border-b border-white/10 pb-4 text-amber-400">Sayt Ayarları</h2>
            <form onSubmit={handleSaveSettings} className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              
              <div className="flex flex-col gap-3 md:gap-4 md:col-span-2">
                <h3 className="text-base md:text-lg font-bold text-white">Haqqımda Mətni</h3>
                <textarea 
                  value={bioText} 
                  onChange={(e) => setBioText(e.target.value)} 
                  rows={4} 
                  className="bg-black/40 border border-amber-500/30 rounded-xl px-4 py-3 text-white focus:border-amber-500 outline-none resize-none text-sm md:text-base" 
                  placeholder="Haqqımda məlumatı buraya yazın..."
                />
              </div>

              <div className="flex flex-col gap-3 md:gap-4">
                <h3 className="text-base md:text-lg font-bold text-white">Ana Səhifə (3D Şəkil)</h3>
                <div className="w-full max-w-[200px] md:max-w-none aspect-[3/4] mx-auto md:mx-0 bg-black/50 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                  <img src={homeFile ? URL.createObjectURL(homeFile) : settingsData.home_image} className="w-full h-full object-cover opacity-80" alt="Home" />
                </div>
                <input type="file" accept="image/*" onChange={(e) => setHomeFile(e.target.files?.[0] || null)} className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs md:file:text-sm file:font-bold file:bg-amber-600/30 file:text-amber-400" />
              </div>

              <div className="flex flex-col gap-3 md:gap-4">
                <h3 className="text-base md:text-lg font-bold text-white">Əlaqə Səhifəsi (Profil Şəkli)</h3>
                <div className="w-32 h-32 md:w-48 md:h-48 mx-auto bg-black/50 rounded-full overflow-hidden border-4 border-white/10 flex items-center justify-center">
                  <img src={contactFile ? URL.createObjectURL(contactFile) : settingsData.contact_image} className="w-full h-full object-cover opacity-80" alt="Contact" />
                </div>
                <input type="file" accept="image/*" onChange={(e) => setContactFile(e.target.files?.[0] || null)} className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs md:file:text-sm file:font-bold file:bg-amber-600/30 file:text-amber-400 mt-auto" />
              </div>

              <div className="flex flex-col gap-3 md:gap-4 md:col-span-2 pt-6 border-t border-white/10">
                <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                  <FileText size={20} className="text-amber-400" /> 
                  CV Yüklə (PDF və ya Şəkil)
                </h3>
                {settingsData.cv_link && (
                  <a href={settingsData.cv_link} target="_blank" rel="noreferrer" className="text-sm text-amber-400 hover:underline mb-2 w-max">
                    Cari CV-yə bax (Download)
                  </a>
                )}
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,image/*" 
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)} 
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs md:file:text-sm file:font-bold file:bg-amber-600/30 file:text-amber-400" 
                />
                <p className="text-xs text-slate-500">PDF, Word sənədləri və ya Şəkil (JPG, PNG) formatları qəbul olunur.</p>
              </div>

              <button type="submit" disabled={uploadingSettings} className="md:col-span-2 py-3 md:py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 mt-2 md:mt-4 shadow-lg shadow-amber-600/20">
                {uploadingSettings ? "Yüklənir..." : <><Check size={20} /> Bütün Ayarları Yenilə</>}
              </button>
            </form>
          </motion.div>
        )}

      </div>

      {/* MOBİL ÜÇÜN ALT MENYU */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#050b14]/95 border-t border-white/10 backdrop-blur-xl p-2 pb-4 sm:pb-2 flex items-center justify-around z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <button onClick={() => setActiveTab('messages')} className={`p-3 rounded-xl transition-all ${activeTab === 'messages' ? 'bg-blue-600/20 text-blue-400 scale-110' : 'text-slate-500 hover:text-white'}`}>
          <MessageSquare size={22} />
        </button>
        <button onClick={() => setActiveTab('folders')} className={`p-3 rounded-xl transition-all ${activeTab === 'folders' ? 'bg-cyan-600/20 text-cyan-400 scale-110' : 'text-slate-500 hover:text-white'}`}>
          <Folder size={22} />
        </button>
        <button onClick={() => setActiveTab('certificates')} className={`p-3 rounded-xl transition-all ${activeTab === 'certificates' ? 'bg-purple-600/20 text-purple-400 scale-110' : 'text-slate-500 hover:text-white'}`}>
          <Award size={22} />
        </button>
        <button onClick={() => setActiveTab('projects')} className={`p-3 rounded-xl transition-all ${activeTab === 'projects' ? 'bg-emerald-600/20 text-emerald-400 scale-110' : 'text-slate-500 hover:text-white'}`}>
          <Briefcase size={22} />
        </button>
        <button onClick={() => setActiveTab('settings')} className={`p-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-amber-600/20 text-amber-400 scale-110' : 'text-slate-500 hover:text-white'}`}>
          <Settings size={22} />
        </button>
      </div>

    </div>
  );
}
