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

  // Sertifikatlar
  const [certTitle, setCertTitle] = useState('');
  const [certFile, setCertFile] = useState<File | null>(null);
  const [certRank, setCertRank] = useState('none');
  const [certCategory, setCertCategory] = useState('none');
  const [uploadingCert, setUploadingCert] = useState(false);

  const [editingCertId, setEditingCertId] = useState<number | null>(null);
  const [editCertTitle, setEditCertTitle] = useState('');
  const [editCertFile, setEditCertFile] = useState<File | null>(null);
  const [editCertRank, setEditCertRank] = useState('none');
  const [editCertCategory, setEditCertCategory] = useState('none');
  const [savingCertEdit, setSavingCertEdit] = useState(false);

  // Proyektlər
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projFeatures, setProjFeatures] = useState(''); 
  const [projTech, setProjTech] = useState('');
  const [projFile, setProjFile] = useState<File | null>(null);
  const [uploadingProj, setUploadingProj] = useState(false);

  const [editingProjId, setEditingProjId] = useState<number | null>(null);
  const [editProjTitle, setEditProjTitle] = useState('');
  const [editProjDesc, setEditProjDesc] = useState('');
  const [editProjFeatures, setEditProjFeatures] = useState('');
  const [editProjTech, setEditProjTech] = useState('');
  const [editProjFile, setEditProjFile] = useState<File | null>(null);
  const [savingProjEdit, setSavingProjEdit] = useState(false);

  // Mesajlar
  const [editingMsgId, setEditingMsgId] = useState<number | null>(null);
  const [editMsgContent, setEditMsgContent] = useState('');

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
    
    const isSpecialTab = activeTab === 'certificates' || activeTab === 'projects';
    if (file.type.startsWith('image/') && !isCv && !isSpecialTab) {
       return data.secure_url.replace('/upload/', '/upload/c_fill,g_auto,w_800,h_800,f_auto,q_auto/');
    }
    return data.secure_url;
  };

  // --- KATALOQLAR ---
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newCategory }) });
    setNewCategory(''); fetchCategories();
  };
  const handleDeleteCategory = async (id: number) => {
    if(!confirm("Bu kataloqu silmək istədiyinizə əminsiniz?")) return;
    await fetch('/api/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchCategories();
  };

  // --- SERTİFİKATLAR ---
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
    if(!confirm("Sertifikatı silmək istədiyinizə əminsiniz?")) return;
    await fetch('/api/certificates', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchCertificates();
  };
  const handleSaveCertEdit = async (id: number, oldImage: string) => {
    setSavingCertEdit(true);
    try {
      let finalImage = oldImage;
      if (editCertFile) finalImage = await uploadToCloudinary(editCertFile);
      await fetch('/api/certificates', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, title: editCertTitle, image: finalImage, rank: editCertRank, category_id: editCertCategory }) });
      setEditingCertId(null); fetchCertificates();
    } catch (err) { alert("Xəta!"); } finally { setSavingCertEdit(false); }
  };

  // --- PROYEKT REDAKTƏ ---
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
    if(!confirm("Proyekti silmək istədiyinizə əminsiniz?")) return;
    await fetch('/api/projects', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchProjects();
  };
  const handleSaveProjEdit = async (id: number, oldImage: string) => {
    setSavingProjEdit(true);
    try {
      let finalImage = oldImage;
      if (editProjFile) finalImage = await uploadToCloudinary(editProjFile);
      await fetch('/api/projects', { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ id, title: editProjTitle, description: editProjDesc, image: finalImage, speed: editProjFeatures, tech_stack: editProjTech }) 
      });
      setEditingProjId(null); fetchProjects();
    } catch (err) { alert("Xəta!"); } finally { setSavingProjEdit(false); }
  };

  // --- MESAJLAR VƏ AYARLAR ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault(); setUploadingSettings(true);
    try {
      let hImg = settingsData.home_image, cImg = settingsData.contact_image, cvL = settingsData.cv_link;
      if (homeFile) hImg = await uploadToCloudinary(homeFile);
      if (contactFile) cImg = await uploadToCloudinary(contactFile);
      if (cvFile) cvL = await uploadToCloudinary(cvFile, true);
      await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ home_image: hImg, contact_image: cImg, bio: bioText, cv_link: cvL }) });
      alert("Yeniləndi!"); fetchSettings();
    } catch (err) { alert("Xəta!"); } finally { setUploadingSettings(false); }
  };
  const handleSaveMsgEdit = async (id: number) => {
    await fetch('/api/messages', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, message: editMsgContent }) });
    setEditingMsgId(null); fetchMessages();
  };

  // --- LOGIN LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) }); const data = await res.json();
      if (data.success) { sessionStorage.setItem('adminAuth', 'true'); setIsLoggedIn(true); } else { setError(data.message); }
    } catch (err) { setError("Xəta!"); } finally { setLoading(false); }
  };
  const handleLogout = () => { sessionStorage.removeItem('adminAuth'); setIsLoggedIn(false); };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#050b14] flex items-center justify-center p-4 relative z-[200]">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 w-full max-w-md bg-black/50 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl">
          <div className="flex flex-col items-center mb-6 md:mb-8"><div className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-4"><Shield size={28} className="text-white" /></div><h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-widest">Admin Panel</h1></div>
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
        <div className="flex items-center gap-2"><div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center"><Shield size={16} className="text-black" /></div><span className="font-black text-lg tracking-wider uppercase">Admin</span></div>
        <button onClick={handleLogout} className="p-2 text-red-400"><LogOut size={20} /></button>
      </div>

      <div className="hidden md:flex w-64 bg-black/50 border-r border-white/10 p-6 flex-col h-screen sticky top-0 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10"><div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center"><Shield size={20} className="text-black" /></div><span className="font-black text-xl tracking-wider uppercase">Admin</span></div>
        <nav className="flex flex-col gap-2 flex-1 text-sm">
          <button onClick={() => setActiveTab('messages')} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'messages' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400'}`}><MessageSquare size={20} /> Mesajlar</button>
          <button onClick={() => setActiveTab('folders')} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'folders' ? 'bg-cyan-600/20 text-cyan-400' : 'text-slate-400'}`}><Folder size={20} /> Kataloqlar</button>
          <button onClick={() => setActiveTab('certificates')} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'certificates' ? 'bg-purple-600/20 text-purple-400' : 'text-slate-400'}`}><Award size={20} /> Sertifikatlar</button>
          <button onClick={() => setActiveTab('projects')} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'projects' ? 'bg-emerald-600/20 text-emerald-400' : 'text-slate-400'}`}><Briefcase size={20} /> Proyektlər</button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'settings' ? 'bg-amber-600/20 text-amber-400' : 'text-slate-400'}`}><Settings size={20} /> Ayarlar</button>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 mt-6"><LogOut size={20} /> Çıxış</button>
      </div>

      <div className="flex-1 p-4 sm:p-10 pb-24 md:pb-10 overflow-y-auto">
        
        {/* MESSAGES */}
        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-black mb-6 border-b border-white/10 pb-4">Gələn Mesajlar</h2>
            <div className="flex flex-col gap-4">
              {messages.length === 0 ? <p className="text-slate-500 text-center p-8">Mesaj yoxdur.</p> : messages.map((msg) => (
                <div key={msg.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl group">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-cyan-400 font-bold flex items-center gap-2"><User size={16}/> {msg.name}</h3>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                       <button onClick={() => { setEditingMsgId(msg.id); setEditMsgContent(msg.message); }} className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg"><Edit2 size={14} /></button>
                       <button onClick={() => { if(confirm("Silinsin?")) fetch('/api/messages',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:msg.id})}).then(()=>fetchMessages()); }} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {editingMsgId === msg.id ? (
                    <div className="flex flex-col gap-2">
                      <textarea value={editMsgContent} onChange={(e) => setEditMsgContent(e.target.value)} className="w-full bg-black/40 border border-cyan-500/50 rounded-xl p-3 text-white text-sm" rows={3} />
                      <div className="flex gap-2 justify-end"><button onClick={()=>setEditingMsgId(null)} className="px-3 py-1 bg-slate-700 rounded text-xs">X</button><button onClick={()=>handleSaveMsgEdit(msg.id)} className="px-3 py-1 bg-green-600 rounded text-xs tracking-widest uppercase font-bold">OK</button></div>
                    </div>
                  ) : <p className="text-slate-300 text-sm leading-relaxed">{msg.message}</p>}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* FOLDERS */}
        {activeTab === 'folders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-black mb-6 border-b border-white/10 pb-4">Kataloqlar</h2>
            <form onSubmit={handleCreateCategory} className="flex gap-2 mb-8">
              <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Yeni ad" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3" />
              <button type="submit" className="px-6 bg-cyan-600 rounded-xl font-bold"><Plus size={20}/></button>
            </form>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group">
                  <div className="flex items-center gap-3"><Folder className="text-cyan-400" /> <span className="font-bold">{cat.name}</span></div>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="opacity-0 group-hover:opacity-100 text-red-400"><Trash2 size={18}/></button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CERTIFICATES */}
        {activeTab === 'certificates' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-black mb-6 border-b border-white/10 pb-4">Sertifikatlar</h2>
            <form onSubmit={handleCreateCertificate} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" required value={certTitle} onChange={(e) => setCertTitle(e.target.value)} placeholder="Ad" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3" />
              <input type="file" accept="image/*" required onChange={(e) => setCertFile(e.target.files?.[0] || null)} className="bg-black/40 border border-white/10 rounded-xl px-4 py-2" />
              <select value={certRank} onChange={(e) => setCertRank(e.target.value)} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3">
                <option value="none">Sadə</option><option value="gold">Qızıl</option><option value="silver">Gümüş</option><option value="bronze">Bürünc</option>
              </select>
              <select value={certCategory} onChange={(e) => setCertCategory(e.target.value)} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3">
                <option value="none">Fərdi</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button type="submit" disabled={uploadingCert} className="md:col-span-2 py-4 bg-purple-600 rounded-xl font-bold uppercase tracking-widest">{uploadingCert ? '...' : 'YÜKLƏ'}</button>
            </form>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {certificates.map((cert) => (
                <div key={cert.id} className="relative group">
                  {editingCertId === cert.id ? (
                    <div className="bg-black/80 border border-purple-500 rounded-xl p-3 flex flex-col gap-2 z-10 relative">
                       <input type="text" value={editCertTitle} onChange={(e)=>setEditCertTitle(e.target.value)} className="bg-white/5 p-2 text-xs rounded" />
                       <input type="file" accept="image/*" onChange={(e)=>setEditCertFile(e.target.files?.[0] || null)} className="text-[10px]" />
                       <select value={editCertRank} onChange={(e)=>setEditCertRank(e.target.value)} className="bg-white/5 p-1 text-xs rounded">
                         <option value="none">Sadə</option><option value="gold">Qızıl</option><option value="silver">Gümüş</option><option value="bronze">Bürünc</option>
                       </select>
                       <select value={editCertCategory} onChange={(e)=>setEditCertCategory(e.target.value)} className="bg-white/5 p-1 text-xs rounded">
                         <option value="none">Fərdi</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                       <div className="flex gap-1"><button onClick={()=>setEditingCertId(null)} className="flex-1 py-1 bg-slate-700 text-[10px] rounded">X</button><button onClick={()=>handleSaveCertEdit(cert.id, cert.image)} disabled={savingCertEdit} className="flex-1 py-1 bg-green-600 text-[10px] rounded">OK</button></div>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                      <div className="h-40 relative">
                        <img src={cert.image} className="w-full h-full object-cover" alt="" />
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                           <button onClick={()=>{ setEditingCertId(cert.id); setEditCertTitle(cert.title); setEditCertRank(cert.rank); setEditCertCategory(cert.category_id?.toString() || 'none'); setEditCertFile(null); }} className="p-1.5 bg-blue-600 rounded"><Edit2 size={12}/></button>
                           <button onClick={()=>handleDeleteCertificate(cert.id)} className="p-1.5 bg-red-600 rounded"><Trash2 size={12}/></button>
                        </div>
                      </div>
                      <div className="p-3 text-xs font-bold truncate">{cert.title}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PROJECTS */}
        {activeTab === 'projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-black mb-6 border-b border-white/10 pb-4 text-emerald-400">Proyektlər</h2>
            <form onSubmit={handleCreateProject} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" required value={projTitle} onChange={(e) => setProjTitle(e.target.value)} placeholder="Ad" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3" />
                <input type="file" accept="image/*" required onChange={(e) => setProjFile(e.target.files?.[0] || null)} className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5" />
              </div>
              <textarea required value={projDesc} onChange={(e) => setProjDesc(e.target.value)} placeholder="Təsvir" rows={3} className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 resize-none" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={projFeatures} onChange={(e) => setProjFeatures(e.target.value)} placeholder="Xüsusiyyətlər (vergüllə)" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3" />
                <input type="text" value={projTech} onChange={(e) => setProjTech(e.target.value)} placeholder="Texnologiyalar (vergüllə)" className="bg-black/40 border border-white/10 rounded-xl px-4 py-3" />
              </div>
              <button type="submit" disabled={uploadingProj} className="py-4 bg-emerald-600 rounded-xl font-bold uppercase tracking-widest">{uploadingProj ? '...' : 'PROYEKTİ ƏLAVƏ ET'}</button>
            </form>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="relative group">
                  {editingProjId === proj.id ? (
                    <div className="bg-black/80 border border-emerald-500 rounded-3xl p-6 flex flex-col gap-3">
                       <div className="grid grid-cols-2 gap-3">
                         <input type="text" value={editProjTitle} onChange={(e)=>setEditProjTitle(e.target.value)} className="bg-white/5 p-3 rounded-xl text-sm" placeholder="Ad" />
                         <input type="file" accept="image/*" onChange={(e)=>setEditProjFile(e.target.files?.[0] || null)} className="text-xs mt-2" />
                       </div>
                       <textarea value={editProjDesc} onChange={(e)=>setEditProjDesc(e.target.value)} className="bg-white/5 p-3 rounded-xl text-sm resize-none" rows={3} placeholder="Təsvir" />
                       <div className="grid grid-cols-2 gap-3">
                         <input type="text" value={editProjFeatures} onChange={(e)=>setEditProjFeatures(e.target.value)} className="bg-white/5 p-3 rounded-xl text-sm" placeholder="Xüsusiyyətlər" />
                         <input type="text" value={editProjTech} onChange={(e)=>setEditProjTech(e.target.value)} className="bg-white/5 p-3 rounded-xl text-sm" placeholder="Texnologiyalar" />
                       </div>
                       <div className="flex gap-2"><button onClick={()=>setEditingProjId(null)} className="flex-1 py-2 bg-slate-700 rounded-xl uppercase font-bold text-xs">İPTAL</button><button onClick={()=>handleSaveProjEdit(proj.id, proj.image)} disabled={savingProjEdit} className="flex-1 py-2 bg-emerald-600 rounded-xl uppercase font-bold text-xs">{savingProjEdit ? '...' : 'YADDA SAXLA'}</button></div>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden flex flex-col sm:flex-row h-full">
                      <div className="sm:w-1/3 h-40 sm:h-auto relative">
                        <img src={proj.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                         <div className="flex justify-between items-start mb-2">
                           <h3 className="font-bold text-lg text-emerald-400">{proj.title}</h3>
                           <div className="flex gap-2">
                             <button onClick={()=>{ setEditingProjId(proj.id); setEditProjTitle(proj.title); setEditProjDesc(proj.description); setEditProjFeatures(proj.speed || ''); setEditProjTech(proj.tech_stack || ''); setEditProjFile(null); }} className="p-2 bg-blue-600/20 text-blue-400 rounded-lg"><Edit2 size={14}/></button>
                             <button onClick={()=>handleDeleteProject(proj.id)} className="p-2 bg-red-600/20 text-red-400 rounded-lg"><Trash2 size={14}/></button>
                           </div>
                         </div>
                         <p className="text-slate-400 text-xs line-clamp-2 mb-4">{proj.description}</p>
                         <div className="mt-auto pt-3 border-t border-white/5 text-[10px] text-slate-500 italic">ID: {proj.id}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-black mb-6 border-b border-white/10 pb-4 text-amber-400">Sayt Ayarları</h2>
            <form onSubmit={handleSaveSettings} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 grid grid-cols-1 gap-10">
              <div className="flex flex-col gap-4">
                <h3 className="font-bold">Haqqımda Mətni</h3>
                <textarea value={bioText} onChange={(e) => setBioText(e.target.value)} rows={4} className="bg-black/40 border border-white/10 rounded-xl p-4 text-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div><h3 className="font-bold mb-3">Ana Səhifə Şəkli</h3><input type="file" accept="image/*" onChange={(e) => setHomeFile(e.target.files?.[0] || null)} className="bg-black/40 p-2 rounded w-full" /></div>
                <div><h3 className="font-bold mb-3">Əlaqə Səhifəsi Şəkli</h3><input type="file" accept="image/*" onChange={(e) => setContactFile(e.target.files?.[0] || null)} className="bg-black/40 p-2 rounded w-full" /></div>
              </div>
              <div className="pt-6 border-t border-white/10">
                <h3 className="font-bold mb-4">CV Faylı (PDF)</h3>
                <input type="file" accept=".pdf,image/*" onChange={(e) => setCvFile(e.target.files?.[0] || null)} className="bg-black/40 p-2 rounded w-full" />
              </div>
              <button type="submit" disabled={uploadingSettings} className="py-4 bg-amber-600 rounded-xl font-bold uppercase">{uploadingSettings ? 'YÜKLƏNİR...' : 'AYARLARI YADDA SAXLA'}</button>
            </form>
          </motion.div>
        )}

      </div>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#050b14]/95 border-t border-white/10 backdrop-blur-xl p-2 flex items-center justify-around z-50">
        <button onClick={() => setActiveTab('messages')} className={`p-3 rounded-xl ${activeTab === 'messages' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-500'}`}><MessageSquare size={22} /></button>
        <button onClick={() => setActiveTab('folders')} className={`p-3 rounded-xl ${activeTab === 'folders' ? 'bg-cyan-600/20 text-cyan-400' : 'text-slate-500'}`}><Folder size={22} /></button>
        <button onClick={() => setActiveTab('certificates')} className={`p-3 rounded-xl ${activeTab === 'certificates' ? 'bg-purple-600/20 text-purple-400' : 'text-slate-500'}`}><Award size={22} /></button>
        <button onClick={() => setActiveTab('projects')} className={`p-3 rounded-xl ${activeTab === 'projects' ? 'bg-emerald-600/20 text-emerald-400' : 'text-slate-500'}`}><Briefcase size={22} /></button>
        <button onClick={() => setActiveTab('settings')} className={`p-3 rounded-xl ${activeTab === 'settings' ? 'bg-amber-600/20 text-amber-400' : 'text-slate-500'}`}><Settings size={22} /></button>
      </div>
    </div>
  );
}
