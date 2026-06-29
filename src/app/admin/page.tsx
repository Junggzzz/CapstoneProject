"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface PortfolioItem {
  id: string;
  url: string;
  title: string;
  category: string;
  created_at?: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  booking_date: string;
  message: string;
  status?: string;
  created_at?: string;
}

// Fallback local pictures options for quick testing
const EVENTS_PRESET_CONFIG = [
  { prefix: 'riding_pandawa' },
  { prefix: 'running_passion' },
  { prefix: 'ahi_trip' },
  { prefix: 'batur_trail' },
  { prefix: 'specialized_ride' },
  { prefix: 'trail_kantorun' },
  { prefix: 'langit_birthday' },
  { prefix: 'simply_padel' },
];

const LOCAL_PRESET_IMAGES = [
  ...EVENTS_PRESET_CONFIG.flatMap((evt) =>
    Array.from({ length: 10 }, (_, idx) => `/images/${evt.prefix}_${idx + 1}.jpg`)
  ),
  '/portofolio/weddingevent.png',
  '/portofolio/watchproduct.png',
  '/portofolio/personalportrait.png'
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'gallery' | 'categories' | 'inquiries'>('gallery');

  // Data States
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Grouping and filtering states
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('Semua');

  const toggleEvent = (title: string) => {
    setExpandedEvents(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formUrlPreset, setFormUrlPreset] = useState('');

  // File upload states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFilePreview, setUploadFilePreview] = useState<string>('');

  // Edit Event Name states
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [oldEventName, setOldEventName] = useState('');
  const [newEventName, setNewEventName] = useState('');

  // Category Modal / Form States
  const [newCategoryName, setNewCategoryName] = useState('');

  // Status Alerts
  const [statusMsg, setStatusMsg] = useState({ type: 'success' as 'success' | 'error', text: '' });

  // 1. Auth check
  useEffect(() => {
    const loggedIn = localStorage.getItem('motrek_admin_logged_in') === 'true';
    if (!loggedIn) {
      router.push('/admin/login');
    } else {
      setIsLoggedIn(true);
      setAdminEmail(localStorage.getItem('motrek_admin_email') || 'admin@motrekaja.com');
    }
  }, [router]);

  // 2. Fetch Data
  const fetchData = async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    try {
      // Fetch portfolio
      const { data: pData, error: pError } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!pError && pData) {
        setPortfolio(pData);
        // Extract unique categories for initialization if categories not loaded yet
        const uniqueCats = Array.from(new Set(pData.map(item => item.category)));
        // Pre-fill categories state with unique values, merging with defaults
        const defaultCats = ['Sports', 'Event', 'Wedding', 'Portrait', 'Commercial'];
        const mergedCats = Array.from(new Set([...defaultCats, ...uniqueCats]));
        setCategories(mergedCats);
      }

      // Fetch inquiries
      const { data: iData, error: iError } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!iError && iData) {
        setInquiries(iData);
      }
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('motrek_admin_logged_in');
    localStorage.removeItem('motrek_admin_email');
    router.push('/admin/login');
  };

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory(categories[0] || 'Wedding');
    setFormUrl('');
    setFormUrlPreset(LOCAL_PRESET_IMAGES[0]);
    setUploadFile(null);
    setUploadFilePreview('');
    setIsModalOpen(true);
  };

  // Open Modal for Add under specific Event
  const handleOpenAddModalForEvent = (eventName: string, category: string) => {
    setEditingItem(null);
    setFormTitle(eventName);
    setFormCategory(category);
    setFormUrl('');
    setFormUrlPreset(LOCAL_PRESET_IMAGES[0]);
    setUploadFile(null);
    setUploadFilePreview('');
    setIsModalOpen(true);
  };

  // Handle Event Name Edit Modal
  const handleOpenEditEventModal = (eventName: string) => {
    setOldEventName(eventName);
    setNewEventName(eventName);
    setIsEditEventModalOpen(true);
  };

  const handleSaveEventName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim()) {
      showStatus('error', 'Nama kegiatan tidak boleh kosong.');
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('portfolio')
        .update({ title: newEventName.trim() })
        .eq('title', oldEventName);

      if (error) throw error;
      showStatus('success', `Nama kegiatan berhasil diubah dari "${oldEventName}" menjadi "${newEventName}".`);
      setIsEditEventModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      showStatus('error', err.message || 'Gagal mengubah nama kegiatan.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle local file selection from device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Delete entire Event (all photos with same title)
  const handleDeleteEvent = async (eventName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus seluruh kegiatan "${eventName}" beserta semua fotonya?`)) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('title', eventName);
      if (error) throw error;
      showStatus('success', `Seluruh foto dari kegiatan "${eventName}" berhasil dihapus.`);
      fetchData();
    } catch (err: any) {
      console.error(err);
      showStatus('error', err.message || 'Gagal menghapus kegiatan.');
    } finally {
      setIsLoading(false);
    }
  };

  // Open Modal for Edit
  const handleOpenEditModal = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setUploadFile(null);
    setUploadFilePreview('');
    
    // Check if URL matches one of local presets
    if (LOCAL_PRESET_IMAGES.includes(item.url)) {
      setFormUrlPreset(item.url);
      setFormUrl('');
    } else {
      setFormUrlPreset('custom');
      setFormUrl(item.url);
    }
    setIsModalOpen(true);
  };

  // Save Portfolio Item (Create or Update)
  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formTitle || !formCategory) {
      showStatus('error', 'Semua field wajib diisi.');
      return;
    }

    let targetUrl = '';
    
    if (formUrlPreset === 'upload') {
      if (!uploadFile && !editingItem) {
        showStatus('error', 'Silakan pilih file gambar dari device Anda.');
        return;
      }
      if (uploadFile) {
        setIsLoading(true);
        try {
          // Coba upload ke Supabase Storage terlebih dahulu
          const fileExt = uploadFile.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('portfolio')
            .upload(filePath, uploadFile);

          if (!uploadError && uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('portfolio')
              .getPublicUrl(filePath);
            targetUrl = publicUrl;
          } else {
            // Gunakan Base64 data URL jika upload storage gagal
            targetUrl = uploadFilePreview;
          }
        } catch (err) {
          // Fallback ke Base64 data URL
          targetUrl = uploadFilePreview;
        } finally {
          setIsLoading(false);
        }
      } else if (editingItem) {
        targetUrl = editingItem.url;
      }
    } else {
      targetUrl = formUrlPreset === 'custom' ? formUrl : formUrlPreset;
    }

    if (!targetUrl) {
      showStatus('error', 'URL Gambar atau file upload tidak valid.');
      return;
    }

    try {
      if (editingItem) {
        // Edit Mode
        const { error } = await supabase
          .from('portfolio')
          .update({
            title: formTitle.trim(),
            category: formCategory,
            url: targetUrl
          })
          .eq('id', editingItem.id);

        if (error) throw error;
        showStatus('success', 'Foto portofolio berhasil diperbarui.');
      } else {
        // Create Mode
        const { error } = await supabase
          .from('portfolio')
          .insert([{
            title: formTitle.trim(),
            category: formCategory,
            url: targetUrl
          }]);

        if (error) throw error;
        showStatus('success', 'Foto portofolio baru berhasil ditambahkan.');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      showStatus('error', err.message || 'Gagal menyimpan data.');
    }
  };

  // Delete Portfolio Item
  const handleDeletePortfolio = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus foto portofolio ini?')) return;
    try {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showStatus('success', 'Foto portofolio berhasil dihapus.');
      fetchData();
    } catch (err: any) {
      console.error(err);
      showStatus('error', err.message || 'Gagal menghapus data.');
    }
  };

  // Add Custom Category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (categories.includes(newCategoryName.trim())) {
      showStatus('error', 'Kategori sudah ada.');
      return;
    }
    setCategories([...categories, newCategoryName.trim()]);
    setNewCategoryName('');
    showStatus('success', 'Kategori baru berhasil ditambahkan ke list dropdown.');
  };

  // Remove Category
  const handleRemoveCategory = (catToRemove: string) => {
    if (confirm(`Hapus kategori "${catToRemove}" dari daftar filter dashboard?`)) {
      setCategories(categories.filter(c => c !== catToRemove));
      showStatus('success', 'Kategori dihapus dari daftar dropdown.');
    }
  };

  // Delete Inquiry message
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data inkuiri ini?')) return;
    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showStatus('success', 'Inkuiri berhasil dihapus.');
      fetchData();
    } catch (err: any) {
      console.error(err);
      showStatus('error', err.message || 'Gagal menghapus inkuiri.');
    }
  };

  // Update Inquiry Status
  const handleUpdateInquiryStatus = async (id: string, currentStatus: string) => {
    let nextStatus = 'Pending';
    if (!currentStatus || currentStatus === 'Pending') {
      nextStatus = 'Sudah Dihubungi';
    } else if (currentStatus === 'Sudah Dihubungi') {
      nextStatus = 'Selesai';
    } else {
      nextStatus = 'Pending';
    }

    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: nextStatus })
        .eq('id', id);

      if (error) {
        console.warn('Supabase update failed (might be missing status column), updating local state only:', error);
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: nextStatus } : inq));
        showStatus('error', 'Status diubah lokal. Untuk menyimpan permanen, buat kolom "status" (text) pada tabel inquiries di Supabase.');
      } else {
        setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: nextStatus } : inq));
        showStatus('success', 'Status inkuiri berhasil diperbarui.');
      }
    } catch (err) {
      console.error(err);
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: nextStatus } : inq));
    }
  };

  // Seed default portfolio data into Supabase
  const handleSeedDefaultData = async () => {
    setIsLoading(true);
    try {
      const eventsConfig = [
        { prefix: 'riding_pandawa',  title: 'Riding Pandawa-Melasti',            category: 'Sports'   },
        { prefix: 'running_passion',  title: 'Running for Passion',              category: 'Sports'   },
        { prefix: 'ahi_trip',         title: 'AHI Trip Bali',                    category: 'Event'    },
        { prefix: 'batur_trail',      title: 'Batur Trail Run',                  category: 'Sports'   },
        { prefix: 'specialized_ride', title: 'Specialized Day 1 Ride',           category: 'Sports'   },
        { prefix: 'trail_kantorun',   title: 'Trail Run Kantorun x Sradha Coffee', category: 'Event'   },
        { prefix: 'langit_birthday',  title: 'Langit 6th Birthday',              category: 'Portrait' },
        { prefix: 'simply_padel',     title: 'Simply Padel',                     category: 'Sports'   },
      ];

      const defaultData = eventsConfig.flatMap((evt) => 
        Array.from({ length: 10 }, (_, idx) => ({
          url: `/images/${evt.prefix}_${idx + 1}.jpg`,
          title: evt.title,
          category: evt.category
        }))
      );

      // Hapus data seed sebelumnya agar tidak duplikat saat tombol diklik lagi
      await supabase
        .from('portfolio')
        .delete()
        .like('url', '/images/%');

      const { error } = await supabase
        .from('portfolio')
        .insert(defaultData);

      if (error) throw error;
      showStatus('success', 'Seed data portofolio default berhasil dimasukkan ke database!');
      fetchData();
    } catch (err: any) {
      console.error(err);
      showStatus('error', err.message || 'Gagal memasukkan data default.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper utility to show dynamic alerts
  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: 'success', text: '' }), 4000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] text-white">
        <div className="animate-pulse">Loading Admin Session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#F3F4F6] pt-[80px]">
      {/* Admin Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#2D2D2D] border-b border-white/5 h-[80px] flex items-center px-6 lg:px-12 justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Motrek Aja<span className="text-[var(--color-accent)]">.</span> <span className="text-xs uppercase bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2.5 py-1 rounded-full font-medium ml-2 border border-[var(--color-accent)]/20">Admin</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--color-muted)] hidden sm:inline">{adminEmail}</span>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-xl text-sm font-semibold transition-colors"
          >
            Keluar (Logout)
          </button>
        </div>
      </header>

      {/* Main Admin Panel Container */}
      <div className="container mx-auto px-6 lg:px-8 py-10">
        
        {/* Alerts */}
        <AnimatePresence>
          {statusMsg.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-xl border text-center ${
                statusMsg.type === 'success' 
                  ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}
            >
              {statusMsg.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Tabs Grid */}
        <div className="flex flex-wrap gap-4 border-b border-white/5 pb-6 mb-10">
          <button 
            onClick={() => setActiveTab('gallery')}
            className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all ${
              activeTab === 'gallery' 
                ? 'bg-[var(--color-accent)] text-black font-semibold' 
                : 'bg-[#2D2D2D] hover:bg-[#3d3d3d] text-[var(--color-muted)] hover:text-white'
            }`}
          >
            📸 Kelola Portofolio ({portfolio.length})
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all ${
              activeTab === 'categories' 
                ? 'bg-[var(--color-accent)] text-black font-semibold' 
                : 'bg-[#2D2D2D] hover:bg-[#3d3d3d] text-[var(--color-muted)] hover:text-white'
            }`}
          >
            🏷️ Kelola Kategori ({categories.length})
          </button>
          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`px-6 py-3 rounded-2xl text-sm font-medium transition-all ${
              activeTab === 'inquiries' 
                ? 'bg-[var(--color-accent)] text-black font-semibold' 
                : 'bg-[#2D2D2D] hover:bg-[#3d3d3d] text-[var(--color-muted)] hover:text-white'
            }`}
          >
            ✉️ Inkuiri Masuk ({inquiries.length})
          </button>
        </div>

        {/* Loading Indicator */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-accent)] mb-4"></div>
            <p className="text-[var(--color-muted)]">Mengambil data dari database...</p>
          </div>
        ) : (
          <div>
            {/* TAB 1: Gallery Management */}
            {activeTab === 'gallery' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Galeri Foto Portofolio</h2>
                    <p className="text-sm text-[var(--color-muted)]">Tambah, edit, atau hapus karya fotografi yang ditampilkan di situs utama.</p>
                  </div>
                  <Button variant="primary" onClick={handleOpenAddModal}>
                    + Tambah Foto Baru
                  </Button>
                </div>

                {portfolio.length === 0 ? (
                  <div className="bg-[#2D2D2D] border border-white/5 rounded-3xl p-12 text-center max-w-xl mx-auto">
                    <p className="text-lg text-[var(--color-muted)] mb-6">Belum ada karya foto portofolio di database Supabase Anda.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button variant="primary" onClick={handleOpenAddModal}>
                        + Tambah Manual
                      </Button>
                      <button 
                        onClick={handleSeedDefaultData}
                        className="px-6 py-3 bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/20 hover:border-[var(--color-accent)]/40 rounded-xl text-sm font-semibold transition-all"
                      >
                        🚀 Seed Data Default (80 Foto)
                      </button>
                    </div>
                  </div>
                ) : (() => {
                  // Group portfolio by title (Event Name)
                  const groupedPortfolio: Record<string, { category: string; photos: PortfolioItem[] }> = {};
                  portfolio.forEach(item => {
                    if (!groupedPortfolio[item.title]) {
                      groupedPortfolio[item.title] = {
                        category: item.category,
                        photos: []
                      };
                    }
                    groupedPortfolio[item.title].photos.push(item);
                  });

                  const eventNames = Object.keys(groupedPortfolio).sort();
                  const uniqueCats = Array.from(new Set(portfolio.map(item => item.category)));
                  const adminCategories = ['Semua', ...uniqueCats.filter(cat => cat !== 'Semua')];

                  const filteredEventNames = eventNames.filter(name => {
                    if (activeCategoryFilter === 'Semua') return true;
                    return groupedPortfolio[name].category === activeCategoryFilter;
                  });

                  return (
                    <div>
                      {/* Category Filters for Admin */}
                      <div className="flex flex-wrap gap-2 mb-8 bg-[#1A1A1A] p-2 rounded-2xl border border-white/5">
                        {adminCategories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setActiveCategoryFilter(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                              activeCategoryFilter === cat
                                ? 'bg-[var(--color-accent)] text-black font-semibold'
                                : 'text-[var(--color-muted)] hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {filteredEventNames.length === 0 ? (
                        <div className="bg-[#2D2D2D] border border-white/5 rounded-3xl p-12 text-center text-[var(--color-muted)]">
                          Tidak ada kegiatan dalam kategori ini.
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {filteredEventNames.map((name) => {
                            const group = groupedPortfolio[name];
                            const isExpanded = expandedEvents[name] !== false; // default expanded

                            return (
                              <div 
                                key={name}
                                className="bg-[#2D2D2D] border border-white/5 rounded-3xl overflow-hidden shadow-lg transition-all duration-300"
                              >
                                {/* Event Group Header */}
                                <div 
                                  onClick={() => toggleEvent(name)}
                                  className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 select-none"
                                >
                                  <div className="flex flex-wrap items-center gap-3">
                                    {/* Chevron indicator */}
                                    <svg 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      viewBox="0 0 20 20" 
                                      fill="currentColor" 
                                      className={`w-5 h-5 text-[var(--color-muted)] transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                                    >
                                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs font-bold uppercase tracking-widest bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2.5 py-1 rounded-full border border-[var(--color-accent)]/20">
                                      {group.category}
                                    </span>
                                    <h3 className="text-base font-bold text-white leading-tight">{name}</h3>
                                    <span className="bg-white/5 text-[var(--color-muted)] text-xs px-2.5 py-1 rounded-lg border border-white/5 font-semibold">
                                      {group.photos.length} Foto
                                    </span>
                                  </div>

                                  {/* Header actions */}
                                  <div className="flex items-center gap-2 self-stretch sm:self-auto" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      onClick={() => handleOpenEditEventModal(name)}
                                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-white text-xs font-semibold rounded-xl transition-colors"
                                    >
                                      ✍️ Edit Nama
                                    </button>
                                    <button
                                      onClick={() => handleOpenAddModalForEvent(name, group.category)}
                                      className="px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/95 text-black text-xs font-bold rounded-xl transition-all shadow-md shadow-[var(--color-accent)]/10"
                                    >
                                      ➕ Tambah Foto
                                    </button>
                                    <button
                                      onClick={() => handleDeleteEvent(name)}
                                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 hover:border-red-500/30 text-xs font-semibold rounded-xl transition-colors"
                                    >
                                      🗑️ Hapus Kegiatan
                                    </button>
                                  </div>
                                </div>

                                {/* Event Group Photos Grid */}
                                <AnimatePresence initial={false}>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="p-6 bg-[#1F1F1F]/40">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                          {group.photos.map((photo) => (
                                            <div 
                                              key={photo.id}
                                              className="group relative bg-[#2D2D2D] border border-white/5 rounded-2xl overflow-hidden shadow hover:border-white/10 transition-all flex flex-col justify-between"
                                            >
                                              <div className="relative aspect-[4/3] w-full bg-[#1A1A1A]">
                                                <Image 
                                                  src={photo.url} 
                                                  alt={name}
                                                  fill 
                                                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                                                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                                />
                                              </div>
                                              <div className="p-3 flex items-center justify-between gap-2 bg-[#2D2D2D]">
                                                <button 
                                                  onClick={() => handleOpenEditModal(photo)}
                                                  className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-bold transition-all border border-white/5 hover:border-white/20 text-center"
                                                >
                                                  ✍️ Edit
                                                </button>
                                                <button 
                                                  onClick={() => handleDeletePortfolio(photo.id)}
                                                  className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-[10px] font-bold transition-all border border-red-500/10 hover:border-red-500/30 text-center"
                                                  title="Hapus foto"
                                                >
                                                  🗑️
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 2: Category Management */}
            {activeTab === 'categories' && (
              <div className="max-w-3xl">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">Kategori Portofolio</h2>
                  <p className="text-sm text-[var(--color-muted)]">Kelola kategori yang digunakan untuk memfilter karya foto di galeri depan.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Category List */}
                  <div className="bg-[#2D2D2D] p-6 rounded-3xl border border-white/5">
                    <h3 className="text-lg font-bold mb-4 border-b border-white/5 pb-2">Daftar Kategori</h3>
                    <div className="space-y-3">
                      {categories.map((cat) => (
                        <div key={cat} className="flex justify-between items-center bg-[#1A1A1A] px-4 py-3 rounded-2xl border border-white/5">
                          <span className="font-medium text-white">{cat}</span>
                          <button 
                            onClick={() => handleRemoveCategory(cat)}
                            className="text-red-400 hover:text-red-300 text-xs px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add New Category */}
                  <div className="bg-[#2D2D2D] p-6 rounded-3xl border border-white/5 h-fit">
                    <h3 className="text-lg font-bold mb-4 border-b border-white/5 pb-2">Tambah Kategori Baru</h3>
                    <form onSubmit={handleAddCategory} className="space-y-4">
                      <div>
                        <label htmlFor="newCat" className="block text-xs font-medium text-[var(--color-muted)] mb-2">Nama Kategori</label>
                        <input 
                          type="text" 
                          id="newCat" 
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Contoh: Street, Wildlife, Landscape"
                          className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm"
                        />
                      </div>
                      <Button type="submit" variant="primary" className="w-full">
                        + Tambahkan Kategori
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Inquiries / Bookings submissions */}
            {activeTab === 'inquiries' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Pesan Inkuiri & Booking Masuk</h2>
                  <p className="text-sm text-[var(--color-muted)]">Lihat daftar calon klien yang menghubungi Anda melalui formulir pemesanan.</p>
                </div>

                {inquiries.length === 0 ? (
                  <div className="bg-[#2D2D2D] border border-white/5 rounded-3xl p-12 text-center text-[var(--color-muted)]">
                    Tidak ada inkuiri pesan masuk saat ini.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inq) => (
                      <div 
                        key={inq.id}
                        className="bg-[#2D2D2D] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6 hover:border-white/10 transition-colors"
                      >
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-lg font-bold text-white">{inq.name}</span>
                            <span className="text-xs text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-2.5 py-1 rounded-full border border-[var(--color-accent)]/20 font-medium">
                              {inq.booking_date ? `Sesi: ${inq.booking_date}` : 'Tanpa Tanggal'}
                            </span>

                            {/* Status Badge */}
                            {(() => {
                              const status = inq.status || 'Pending';
                              if (status === 'Sudah Dihubungi') {
                                return (
                                  <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full border border-yellow-400/20 font-medium">
                                    📞 Sudah Dihubungi
                                  </span>
                                );
                              }
                              if (status === 'Selesai') {
                                return (
                                  <span className="text-xs text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20 font-medium">
                                    ✅ Sesi Terjadwal
                                  </span>
                                );
                              }
                              return (
                                <span className="text-xs text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full border border-red-400/20 font-medium">
                                  ⏳ Belum Dihubungi
                                </span>
                              );
                            })()}

                            <span className="text-xs text-[var(--color-muted)]">
                              {inq.email}
                            </span>
                          </div>
                          <p className="text-[var(--color-muted)] leading-relaxed italic bg-[#1A1A1A] p-4 rounded-2xl border border-white/5 text-sm">
                            &quot;{inq.message}&quot;
                          </p>
                        </div>
                        <div className="flex md:flex-col justify-end items-end gap-3 self-end md:self-auto min-w-[140px]">
                          <button 
                            onClick={() => handleUpdateInquiryStatus(inq.id, inq.status || 'Pending')}
                            className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-white text-xs font-semibold rounded-xl text-center transition-colors"
                          >
                            🔄 Ubah Status
                          </button>
                          <button 
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 hover:border-red-500/30 text-xs font-semibold rounded-xl text-center transition-colors"
                          >
                            🗑️ Hapus Pesan
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* PORTFOLIO ITEM MODAL (ADD / EDIT) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#2D2D2D] w-full max-w-lg rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--color-muted)] hover:text-white text-xl"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-6 text-white">
              {editingItem ? 'Edit Karya Foto' : 'Tambah Foto Portofolio Baru'}
            </h3>

            <form onSubmit={handleSavePortfolio} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[var(--color-muted)] mb-2">Judul Foto</label>
                <input 
                  type="text" 
                  id="title" 
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm"
                  placeholder="Contoh: Batur Trail Run - High Action"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-[var(--color-muted)] mb-2">Kategori</label>
                <select 
                  id="category" 
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Image Preset / Custom URL / Upload Device Selection */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-muted)] mb-2">Pilih Sumber Gambar</label>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormUrlPreset(LOCAL_PRESET_IMAGES[0]);
                      setFormUrl('');
                    }}
                    className={`py-2 text-[10px] sm:text-xs font-semibold rounded-xl border transition-all ${
                      formUrlPreset !== 'custom' && formUrlPreset !== 'upload'
                        ? 'bg-[var(--color-accent)] text-black border-[var(--color-accent)]'
                        : 'bg-[#1A1A1A] text-[var(--color-muted)] border-white/10 hover:text-white'
                    }`}
                  >
                    Preset Lokal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormUrlPreset('upload');
                      setFormUrl('');
                    }}
                    className={`py-2 text-[10px] sm:text-xs font-semibold rounded-xl border transition-all ${
                      formUrlPreset === 'upload'
                        ? 'bg-[var(--color-accent)] text-black border-[var(--color-accent)]'
                        : 'bg-[#1A1A1A] text-[var(--color-muted)] border-white/10 hover:text-white'
                    }`}
                  >
                    Upload Device
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormUrlPreset('custom');
                      setFormUrl('');
                    }}
                    className={`py-2 text-[10px] sm:text-xs font-semibold rounded-xl border transition-all ${
                      formUrlPreset === 'custom'
                        ? 'bg-[var(--color-accent)] text-black border-[var(--color-accent)]'
                        : 'bg-[#1A1A1A] text-[var(--color-muted)] border-white/10 hover:text-white'
                    }`}
                  >
                    Custom URL
                  </button>
                </div>

                {formUrlPreset === 'upload' ? (
                  <div>
                    <label htmlFor="file-upload" className="block text-xs text-[var(--color-muted)] mb-2">Upload File Gambar</label>
                    <input 
                      type="file" 
                      id="file-upload"
                      accept="image/*"
                      required={!editingItem}
                      onChange={handleFileChange}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm"
                    />
                    {uploadFilePreview && (
                      <div className="mt-4 relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/5 bg-[#1A1A1A]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={uploadFilePreview} 
                          alt="File Preview" 
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                ) : formUrlPreset !== 'custom' ? (
                  <div>
                    <label htmlFor="preset" className="block text-xs text-[var(--color-muted)] mb-2">Pilih Foto Lokal</label>
                    <select
                      id="preset"
                      value={formUrlPreset}
                      onChange={(e) => setFormUrlPreset(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm"
                    >
                      {LOCAL_PRESET_IMAGES.map((img, idx) => (
                        <option key={img} value={img}>Foto Preset {idx + 1} ({img.split('/').pop()})</option>
                      ))}
                    </select>
                    {/* Live Preview of selected preset */}
                    <div className="mt-4 relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/5 bg-[#1A1A1A]">
                      <Image 
                        src={formUrlPreset} 
                        alt="Live Preview" 
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="url" className="block text-xs text-[var(--color-muted)] mb-2">Masukkan HTTP/HTTPS URL Gambar</label>
                    <input 
                      type="url" 
                      id="url" 
                      required={formUrlPreset === 'custom'}
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formUrl && (
                      <div className="mt-4 relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/5 bg-[#1A1A1A]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={formUrl} 
                          alt="Live Custom Preview"
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=600';
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/3 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-semibold transition-all border border-white/5 hover:border-white/20"
                >
                  Batal
                </button>
                <Button type="submit" variant="primary" className="w-2/3">
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan Ke Portofolio'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT EVENT NAME MODAL */}
      {isEditEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#2D2D2D] w-full max-w-md rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl relative">
            <button 
              onClick={() => setIsEditEventModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--color-muted)] hover:text-white text-xl"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 text-white">Edit Nama Kegiatan</h3>
            <p className="text-xs text-[var(--color-muted)] mb-6">
              Mengubah nama ini akan memperbarui nama kegiatan pada seluruh foto yang tergabung di dalamnya.
            </p>

            <form onSubmit={handleSaveEventName} className="space-y-6">
              <div>
                <label htmlFor="event-name-input" className="block text-sm font-medium text-[var(--color-muted)] mb-2">Nama Kegiatan</label>
                <input 
                  type="text" 
                  id="event-name-input" 
                  required
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm"
                  placeholder="Nama Kegiatan Baru"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={() => setIsEditEventModalOpen(false)}
                  className="w-1/3 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-semibold transition-all border border-white/5 hover:border-white/20"
                >
                  Batal
                </button>
                <Button type="submit" variant="primary" className="w-2/3">
                  Simpan Nama
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
