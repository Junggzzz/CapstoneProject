"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { 
  Image as ImageIcon, 
  BookOpen, 
  Inbox, 
  Database, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  AlertTriangle, 
  FileCode,
  ExternalLink,
  Info
} from 'lucide-react';

// Fallback portfolio data
const INITIAL_PORTFOLIO = [
  { id: '1',  url: '/images/best_1.jpg',  title: 'AHI Trip Bali – Konvoi di Jalan Raya',   category: 'Event'    },
  { id: '2',  url: '/images/best_2.jpg',  title: 'AHI Trip Bali – Day 4 Adventure',         category: 'Event'    },
  { id: '3',  url: '/images/best_3.jpg',  title: 'Batur International Trail Run – Finish',  category: 'Sports'   },
  { id: '4',  url: '/images/best_4.jpg',  title: 'Batur Trail Run – Pack Run',               category: 'Sports'   },
  { id: '5',  url: '/images/best_5.jpg',  title: 'Batur Trail Run – Race Day',               category: 'Sports'   },
  { id: '6',  url: '/images/best_6.jpg',  title: 'Batur Trail Run – Solo Sprint',            category: 'Sports'   },
  { id: '7',  url: '/images/best_7.jpg',  title: 'Batur Trail Run – Group Run Savanna',      category: 'Sports'   },
  { id: '8',  url: '/images/best_8.jpg',  title: 'Riding Pandawa-Melasti – On The Road',     category: 'Sports'   },
];

// Fallback journals data
const INITIAL_JOURNALS = [
  { 
    id: '1', 
    title: 'Merekam Momen Magis di Bali', 
    excerpt: 'Di balik layar sesi pre-wedding eksklusif kami di pantai Melasti, menangkap golden hour yang sempurna dengan pasangan yang luar biasa.', 
    date: '12 Mei 2026', 
    imageUrl: '/images/best_14.jpg',
    videoUrl: '' 
  },
  { 
    id: '2', 
    title: 'Komersial Produk Premium', 
    excerpt: 'Tantangan pencahayaan studio untuk menonjolkan tekstur dan detail produk jam tangan mewah.', 
    date: '28 April 2026', 
    imageUrl: '/images/best_16.jpg',
    videoUrl: '' 
  },
];

// Fallback inquiries data
const INITIAL_INQUIRIES = [
  {
    id: '1',
    name: 'Andi Pratama',
    email: 'andi.pratama@example.com',
    booking_date: '2026-07-15',
    message: 'Saya ingin memesan sesi foto olahraga batur trail run untuk kelompok lari kami.',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Citra Kirana',
    email: 'citra@example.com',
    booking_date: '2026-08-20',
    message: 'Halo Motrek Aja, apakah melayani pemotretan komersil produk fashion luar ruangan?',
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

const CATEGORIES = ['Event', 'Sports', 'Wedding', 'Portrait', 'Commercial'];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'journals' | 'inquiries' | 'setup'>('portfolio');
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'supabase' | 'demo'>('supabase');

  // Authenticated state
  const [authenticated, setAuthenticated] = useState(false);

  // Db diagnostic states
  const [diagnostics, setDiagnostics] = useState({
    portfolioTable: false,
    inquiriesTable: false,
    journalsTable: false,
  });

  // Data states
  const [portfolioList, setPortfolioList] = useState<any[]>([]);
  const [journalsList, setJournalsList] = useState<any[]>([]);
  const [inquiriesList, setInquiriesList] = useState<any[]>([]);

  // Modals state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<any | null>(null);
  const [photoForm, setPhotoForm] = useState({ title: '', category: 'Event', url: '' });

  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState<any | null>(null);
  const [journalForm, setJournalForm] = useState({ title: '', excerpt: '', imageUrl: '', videoUrl: '', date: '' });

  useEffect(() => {
    // Auth & diagnostic checks
    const checkAuthAndFetch = async () => {
      const isLogged = sessionStorage.getItem('motrek_admin_logged') === 'true';
      if (!isLogged) {
        router.push('/admin/login');
        return;
      }
      setAuthenticated(true);

      const savedMode = sessionStorage.getItem('motrek_admin_mode') || 'supabase';
      setMode(savedMode as 'supabase' | 'demo');

      if (savedMode === 'demo') {
        // Load from LocalStorage or Fallback initial data
        const localP = localStorage.getItem('demo_portfolio');
        const localJ = localStorage.getItem('demo_journals');
        const localI = localStorage.getItem('demo_inquiries');

        setPortfolioList(localP ? JSON.parse(localP) : INITIAL_PORTFOLIO);
        setJournalsList(localJ ? JSON.parse(localJ) : INITIAL_JOURNALS);
        setInquiriesList(localI ? JSON.parse(localI) : INITIAL_INQUIRIES);
        setLoading(false);
      } else {
        // Run database check
        try {
          const { data: pData, error: pErr } = await supabase.from('portfolio').select('*');
          const { data: iData, error: iErr } = await supabase.from('inquiries').select('*');
          const { data: jData, error: jErr } = await supabase.from('journals').select('*');

          const diag = {
            portfolioTable: !pErr,
            inquiriesTable: !iErr,
            journalsTable: !jErr,
          };
          setDiagnostics(diag);

          // If tables don't exist in Supabase database, fall back or suggest setup tab
          if (pErr || iErr || jErr) {
            console.warn("Database not fully ready, tables missing. Directing to setup diagnostics.");
            setActiveTab('setup');
            // Populate lists with Initial Fallback for visual rendering
            setPortfolioList(INITIAL_PORTFOLIO);
            setJournalsList(INITIAL_JOURNALS);
            setInquiriesList(INITIAL_INQUIRIES);
          } else {
            setPortfolioList(pData || []);
            setInquiriesList(iData || []);
            setJournalsList(jData || []);
          }
        } catch (err) {
          console.error("Supabase load error:", err);
          setActiveTab('setup');
        } finally {
          setLoading(false);
        }
      }
    };

    checkAuthAndFetch();
  }, [router]);

  // Persist local demo data
  const saveDemoData = (type: 'portfolio' | 'journals' | 'inquiries', data: any[]) => {
    localStorage.setItem(`demo_${type}`, JSON.stringify(data));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem('motrek_admin_logged');
    sessionStorage.removeItem('motrek_admin_mode');
    router.push('/admin/login');
  };

  // --- PORTFOLIO OPERATIONS ---
  const handleOpenPhotoModal = (photo: any = null) => {
    if (photo) {
      setEditingPhoto(photo);
      setPhotoForm({ title: photo.title, category: photo.category, url: photo.url });
    } else {
      setEditingPhoto(null);
      setPhotoForm({ title: '', category: 'Event', url: '/images/best_1.jpg' });
    }
    setIsPhotoModalOpen(true);
  };

  const handleSavePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'demo') {
      let updatedList = [...portfolioList];
      if (editingPhoto) {
        updatedList = updatedList.map(item => 
          item.id === editingPhoto.id ? { ...item, ...photoForm } : item
        );
      } else {
        const newItem = {
          id: Date.now().toString(),
          ...photoForm
        };
        updatedList = [newItem, ...updatedList];
      }
      setPortfolioList(updatedList);
      saveDemoData('portfolio', updatedList);
      setIsPhotoModalOpen(false);
    } else {
      setLoading(true);
      try {
        if (editingPhoto) {
          const { error } = await supabase
            .from('portfolio')
            .update({ title: photoForm.title, category: photoForm.category, url: photoForm.url })
            .eq('id', editingPhoto.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('portfolio')
            .insert([{ title: photoForm.title, category: photoForm.category, url: photoForm.url }]);
          if (error) throw error;
        }

        // Refresh data
        const { data } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
        setPortfolioList(data || []);
        setIsPhotoModalOpen(false);
      } catch (err: any) {
        alert("Gagal menyimpan foto ke Supabase: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto portofolio ini?")) return;

    if (mode === 'demo') {
      const updatedList = portfolioList.filter(item => item.id !== id);
      setPortfolioList(updatedList);
      saveDemoData('portfolio', updatedList);
    } else {
      setLoading(true);
      try {
        const { error } = await supabase.from('portfolio').delete().eq('id', id);
        if (error) throw error;

        // Refresh data
        const { data } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
        setPortfolioList(data || []);
      } catch (err: any) {
        alert("Gagal menghapus foto dari Supabase: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // --- JOURNAL OPERATIONS ---
  const handleOpenJournalModal = (journal: any = null) => {
    if (journal) {
      setEditingJournal(journal);
      setJournalForm({ 
        title: journal.title, 
        excerpt: journal.excerpt, 
        imageUrl: journal.imageUrl || journal.image_url || '', 
        videoUrl: journal.videoUrl || journal.video_url || '',
        date: journal.date 
      });
    } else {
      setEditingJournal(null);
      setJournalForm({ title: '', excerpt: '', imageUrl: '/images/best_14.jpg', videoUrl: '', date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) });
    }
    setIsJournalModalOpen(true);
  };

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'demo') {
      let updatedList = [...journalsList];
      if (editingJournal) {
        updatedList = updatedList.map(item => 
          item.id === editingJournal.id ? { ...item, ...journalForm } : item
        );
      } else {
        const newItem = {
          id: Date.now().toString(),
          ...journalForm
        };
        updatedList = [newItem, ...updatedList];
      }
      setJournalsList(updatedList);
      saveDemoData('journals', updatedList);
      setIsJournalModalOpen(false);
    } else {
      setLoading(true);
      try {
        const dbPayload = {
          title: journalForm.title,
          excerpt: journalForm.excerpt,
          date: journalForm.date,
          imageUrl: journalForm.imageUrl,
          videoUrl: journalForm.videoUrl || null
        };

        if (editingJournal) {
          const { error } = await supabase
            .from('journals')
            .update(dbPayload)
            .eq('id', editingJournal.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('journals')
            .insert([dbPayload]);
          if (error) throw error;
        }

        // Refresh data
        const { data } = await supabase.from('journals').select('*').order('created_at', { ascending: false });
        setJournalsList(data || []);
        setIsJournalModalOpen(false);
      } catch (err: any) {
        alert("Gagal menyimpan jurnal ke Supabase: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteJournal = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel jurnal ini?")) return;

    if (mode === 'demo') {
      const updatedList = journalsList.filter(item => item.id !== id);
      setJournalsList(updatedList);
      saveDemoData('journals', updatedList);
    } else {
      setLoading(true);
      try {
        const { error } = await supabase.from('journals').delete().eq('id', id);
        if (error) throw error;

        // Refresh data
        const { data } = await supabase.from('journals').select('*').order('created_at', { ascending: false });
        setJournalsList(data || []);
      } catch (err: any) {
        alert("Gagal menghapus jurnal dari Supabase: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // --- INQUIRIES OPERATIONS ---
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus inquiry ini?")) return;

    if (mode === 'demo') {
      const updatedList = inquiriesList.filter(item => item.id !== id);
      setInquiriesList(updatedList);
      saveDemoData('inquiries', updatedList);
    } else {
      setLoading(true);
      try {
        const { error } = await supabase.from('inquiries').delete().eq('id', id);
        if (error) throw error;

        // Refresh data
        const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
        setInquiriesList(data || []);
      } catch (err: any) {
        alert("Gagal menghapus inquiry dari Supabase: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EAB308]"></div>
      </div>
    );
  }

  const SQL_SCRIPT = `-- SQL Script untuk Motrek Aja Database

-- 1. Tabel Portofolio Galeri
CREATE TABLE IF NOT EXISTS public.portfolio (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  url text NOT NULL
);

-- 2. Tabel Formulir Booking Inquiries
CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  booking_date date NOT NULL,
  message text NOT NULL
);

-- 3. Tabel Jurnal Cerita BTS
CREATE TABLE IF NOT EXISTS public.journals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  date text NOT NULL,
  "imageUrl" text NOT NULL,
  "videoUrl" text
);

-- Tambahkan Kebijakan Keamanan Row Level (Optional/Disable for easy test)
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.portfolio FOR SELECT USING (true);
CREATE POLICY "Allow admin modification" ON public.portfolio FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public insert" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read and write" ON public.inquiries FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow public read" ON public.journals FOR SELECT USING (true);
CREATE POLICY "Allow admin modification" ON public.journals FOR ALL TO authenticated USING (true);`;

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#F3F4F6] flex flex-col">
      {/* Top Header */}
      <header className="bg-[#2D2D2D] border-b border-white/5 py-4 px-6 md:px-8 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight">
            Motrek Aja <span className="text-[#EAB308] text-xs font-semibold px-2 py-0.5 rounded-full bg-[#EAB308]/15 border border-[#EAB308]/20">ADMIN</span>
          </h1>
          <span className="text-xs text-[#9CA3AF] border-l border-white/10 pl-4 hidden sm:inline">
            Mode: {mode === 'demo' ? '⚡ Simulasi (Local)' : '🔗 Terhubung Supabase'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {mode === 'demo' && (
            <button 
              onClick={() => {
                sessionStorage.setItem('motrek_admin_mode', 'supabase');
                window.location.reload();
              }}
              className="text-xs text-[#EAB308] border border-[#EAB308]/20 bg-[#EAB308]/5 px-3 py-1.5 rounded-lg hover:bg-[#EAB308]/10 transition-colors"
            >
              Ganti ke Supabase Mode
            </button>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 px-3 py-1.5 rounded-lg text-[#9CA3AF] hover:text-white transition-colors"
          >
            <LogOut size={14} />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-[#2D2D2D]/60 border-b md:border-b-0 md:border-r border-white/5 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'portfolio' 
                ? 'bg-[#EAB308] text-black shadow-lg shadow-[#EAB308]/10' 
                : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon size={18} />
            <span>Kelola Portofolio</span>
          </button>

          <button
            onClick={() => setActiveTab('journals')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'journals' 
                ? 'bg-[#EAB308] text-black shadow-lg shadow-[#EAB308]/10' 
                : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen size={18} />
            <span>Kelola Jurnal / BTS</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all relative ${
              activeTab === 'inquiries' 
                ? 'bg-[#EAB308] text-black shadow-lg shadow-[#EAB308]/10' 
                : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
            }`}
          >
            <Inbox size={18} />
            <span>Inkuiri / Booking</span>
            {inquiriesList.length > 0 && (
              <span className={`absolute right-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === 'inquiries' ? 'bg-black text-[#EAB308]' : 'bg-[#EAB308] text-black'}`}>
                {inquiriesList.length}
              </span>
            )}
          </button>

          <div className="pt-4 border-t border-white/5">
            <button
              onClick={() => setActiveTab('setup')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'setup' 
                  ? 'bg-white/10 text-white' 
                  : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
              }`}
            >
              <Database size={18} />
              <span>Status & SQL Setup</span>
            </button>
          </div>
        </aside>

        {/* Workspace Panels */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EAB308]"></div>
            </div>
          ) : (
            <>
              {/* PORTFOLIO TAB */}
              {activeTab === 'portfolio' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold">Galeri Portofolio</h2>
                      <p className="text-sm text-[#9CA3AF]">Tambahkan dan sesuaikan karya visual di galeri.</p>
                    </div>
                    <button 
                      onClick={() => handleOpenPhotoModal()}
                      className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black font-semibold px-4 py-2 rounded-xl flex items-center gap-2 text-sm shadow-md transition-colors"
                    >
                      <Plus size={16} />
                      <span>Tambah Foto</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {portfolioList.map((photo) => (
                      <div key={photo.id} className="bg-[#2D2D2D] rounded-2xl overflow-hidden border border-white/5 flex flex-col group">
                        <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={photo.url} 
                            alt={photo.title}
                            className="object-cover w-full h-full"
                          />
                          <span className="absolute top-2 left-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-[#EAB308]">
                            {photo.category}
                          </span>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <h3 className="font-semibold text-sm line-clamp-1 mb-3 text-[#F3F4F6]">{photo.title}</h3>
                          <div className="flex justify-between items-center pt-2 border-t border-white/5">
                            <button 
                              onClick={() => handleOpenPhotoModal(photo)}
                              className="text-xs text-[#9CA3AF] hover:text-white flex items-center gap-1 transition-colors"
                            >
                              <Edit2 size={12} />
                              <span>Ubah</span>
                            </button>
                            <button 
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                            >
                              <Trash2 size={12} />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* JOURNALS TAB */}
              {activeTab === 'journals' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold">Jurnal & Behind the Scene</h2>
                      <p className="text-sm text-[#9CA3AF]">Tulis cerita proses kreatif di balik pemotretan.</p>
                    </div>
                    <button 
                      onClick={() => handleOpenJournalModal()}
                      className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black font-semibold px-4 py-2 rounded-xl flex items-center gap-2 text-sm shadow-md transition-colors"
                    >
                      <Plus size={16} />
                      <span>Tulis Jurnal</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {journalsList.map((journal) => (
                      <div key={journal.id} className="bg-[#2D2D2D] rounded-2xl overflow-hidden border border-white/5 flex gap-4 p-4">
                        <div className="relative w-32 h-24 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={journal.imageUrl || journal.image_url} 
                            alt={journal.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-[#EAB308] font-medium">{journal.date}</span>
                            <h3 className="font-bold text-base mb-1 line-clamp-1">{journal.title}</h3>
                            <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">{journal.excerpt}</p>
                          </div>
                          <div className="flex gap-4 mt-2">
                            <button 
                              onClick={() => handleOpenJournalModal(journal)}
                              className="text-xs text-[#9CA3AF] hover:text-white flex items-center gap-1 transition-colors"
                            >
                              <Edit2 size={12} />
                              <span>Edit</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteJournal(journal.id)}
                              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                            >
                              <Trash2 size={12} />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* INQUIRIES TAB */}
              {activeTab === 'inquiries' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">Pesan Inkuiri Masuk</h2>
                    <p className="text-sm text-[#9CA3AF]">Daftar calon klien yang mengirimkan formulir booking.</p>
                  </div>

                  {inquiriesList.length === 0 ? (
                    <div className="bg-[#2D2D2D] border border-white/5 rounded-2xl p-12 text-center text-[#9CA3AF]">
                      <Inbox className="mx-auto mb-4 opacity-30" size={48} />
                      <p>Belum ada inquiries atau pesan masuk.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inquiriesList.map((inq) => (
                        <div key={inq.id} className="bg-[#2D2D2D] rounded-2xl border border-white/5 p-6 flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span className="font-bold text-lg text-white">{inq.name}</span>
                              <span className="text-sm text-[#9CA3AF]">{inq.email}</span>
                            </div>
                            <div className="inline-block bg-white/5 text-[#EAB308] text-xs font-semibold px-3 py-1 rounded-full">
                              Tanggal Sesi: {inq.booking_date}
                            </div>
                            <p className="text-sm text-[#9CA3AF] leading-relaxed pt-2 border-t border-white/5 mt-2">
                              {inq.message}
                            </p>
                          </div>
                          
                          <div className="flex md:flex-col justify-end items-end gap-3 mt-4 md:mt-0 flex-shrink-0">
                            <span className="text-[10px] text-[#9CA3AF]/60">
                              Diterima: {new Date(inq.created_at || Date.now()).toLocaleDateString('id-ID')}
                            </span>
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all mt-auto"
                            >
                              <Trash2 size={12} />
                              <span>Hapus Pesan</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* STATUS & SQL SETUP TAB */}
              {activeTab === 'setup' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">Diagnostik Database & SQL Inisialisasi</h2>
                    <p className="text-sm text-[#9CA3AF]">Status integrasi tabel database Supabase Anda.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`p-5 rounded-2xl border ${diagnostics.portfolioTable ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                      <h3 className="font-semibold mb-1">Tabel Portfolio</h3>
                      <p className="text-xs mb-3">{diagnostics.portfolioTable ? 'Tabel Ditemukan' : 'Tabel Belum Dibuat'}</p>
                      <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded">public.portfolio</span>
                    </div>

                    <div className={`p-5 rounded-2xl border ${diagnostics.inquiriesTable ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                      <h3 className="font-semibold mb-1">Tabel Inquiries</h3>
                      <p className="text-xs mb-3">{diagnostics.inquiriesTable ? 'Tabel Ditemukan' : 'Tabel Belum Dibuat'}</p>
                      <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded">public.inquiries</span>
                    </div>

                    <div className={`p-5 rounded-2xl border ${diagnostics.journalsTable ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                      <h3 className="font-semibold mb-1">Tabel Journals</h3>
                      <p className="text-xs mb-3">{diagnostics.journalsTable ? 'Tabel Ditemukan' : 'Tabel Belum Dibuat'}</p>
                      <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded">public.journals</span>
                    </div>
                  </div>

                  {(!diagnostics.portfolioTable || !diagnostics.inquiriesTable || !diagnostics.journalsTable) && mode === 'supabase' && (
                    <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 text-[#EAB308] p-5 rounded-2xl flex gap-3 text-sm leading-relaxed">
                      <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold mb-1">Inisialisasi Database Diperlukan</p>
                        <p className="opacity-90">
                          Situs web mendeteksi bahwa tabel-tabel di atas belum ada di database Supabase Anda. Anda dapat menyalin skrip SQL di bawah ini, masuk ke <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold inline-flex items-center gap-0.5 hover:opacity-80">Supabase Console <ExternalLink size={12} /></a>, pilih SQL Editor, tempel kode, lalu klik Run.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-[#2D2D2D] rounded-2xl border border-white/5 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <FileCode size={16} className="text-[#EAB308]" />
                        <span>Skrip SQL Inisialisasi Tabel</span>
                      </span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(SQL_SCRIPT);
                          alert("SQL script berhasil disalin ke clipboard!");
                        }}
                        className="text-xs bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-lg text-white transition-colors"
                      >
                        Salin Kode
                      </button>
                    </div>
                    <pre className="bg-black/30 p-4 rounded-xl text-xs overflow-x-auto text-[#9CA3AF] max-h-72">
                      <code>{SQL_SCRIPT}</code>
                    </pre>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </main>
      </div>

      {/* --- PHOTO MODAL --- */}
      <AnimatePresence>
        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#2D2D2D] border border-white/10 w-full max-w-lg rounded-3xl p-6 md:p-8 relative shadow-2xl"
            >
              <button 
                onClick={() => setIsPhotoModalOpen(false)}
                className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-bold mb-6 text-white">
                {editingPhoto ? 'Ubah Informasi Foto' : 'Tambah Foto Baru'}
              </h3>

              <form onSubmit={handleSavePhoto} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Judul Foto</label>
                  <input
                    type="text"
                    required
                    value={photoForm.title}
                    onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EAB308] transition-colors text-sm"
                    placeholder="Contoh: Batur Trail Run Sprint"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Kategori</label>
                    <select
                      value={photoForm.category}
                      onChange={(e) => setPhotoForm({ ...photoForm, category: e.target.value })}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EAB308] transition-colors text-sm"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">URL Gambar</label>
                    <input
                      type="text"
                      required
                      value={photoForm.url}
                      onChange={(e) => setPhotoForm({ ...photoForm, url: e.target.value })}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EAB308] transition-colors text-sm"
                      placeholder="/images/best_1.jpg"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsPhotoModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- JOURNAL MODAL --- */}
      <AnimatePresence>
        {isJournalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#2D2D2D] border border-white/10 w-full max-w-lg rounded-3xl p-6 md:p-8 relative shadow-2xl"
            >
              <button 
                onClick={() => setIsJournalModalOpen(false)}
                className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-bold mb-6 text-white">
                {editingJournal ? 'Ubah Informasi Jurnal' : 'Tulis Jurnal BTS Baru'}
              </h3>

              <form onSubmit={handleSaveJournal} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Judul Cerita</label>
                  <input
                    type="text"
                    required
                    value={journalForm.title}
                    onChange={(e) => setJournalForm({ ...journalForm, title: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EAB308] transition-colors text-sm"
                    placeholder="Merekam Momen Magis..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Kutipan / Deskripsi Singkat</label>
                  <textarea
                    required
                    rows={3}
                    value={journalForm.excerpt}
                    onChange={(e) => setJournalForm({ ...journalForm, excerpt: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EAB308] transition-colors text-sm resize-none"
                    placeholder="Ringkasan cerita di balik layar pemotretan..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Tanggal Rilis</label>
                    <input
                      type="text"
                      required
                      value={journalForm.date}
                      onChange={(e) => setJournalForm({ ...journalForm, date: e.target.value })}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EAB308] transition-colors text-sm"
                      placeholder="Contoh: 12 Mei 2026"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">URL Gambar Utama</label>
                    <input
                      type="text"
                      required
                      value={journalForm.imageUrl}
                      onChange={(e) => setJournalForm({ ...journalForm, imageUrl: e.target.value })}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EAB308] transition-colors text-sm"
                      placeholder="/images/best_14.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">URL Video (Opsional - YouTube / Vimeo / etc.)</label>
                  <input
                    type="text"
                    value={journalForm.videoUrl}
                    onChange={(e) => setJournalForm({ ...journalForm, videoUrl: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EAB308] transition-colors text-sm"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsJournalModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-sm hover:bg-white/5 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-[#EAB308] hover:bg-[#EAB308]/90 text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    Simpan Jurnal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
