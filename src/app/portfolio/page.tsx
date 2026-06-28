"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from '@/components/ui/Lightbox';
import { supabase } from '@/lib/supabase';

// ─────────────────────────────────────────────────────────────────────────────
// Fallback portfolio data – 20 curated best-of shots from all event folders
// ─────────────────────────────────────────────────────────────────────────────
const EVENTS_CONFIG = [
  { prefix: 'riding_pandawa',  title: 'Riding Pandawa-Melasti',            category: 'Sports'   },
  { prefix: 'running_passion',  title: 'Running for Passion',              category: 'Sports'   },
  { prefix: 'ahi_trip',         title: 'AHI Trip Bali',                    category: 'Event'    },
  { prefix: 'batur_trail',      title: 'Batur Trail Run',                  category: 'Sports'   },
  { prefix: 'specialized_ride', title: 'Specialized Day 1 Ride',           category: 'Sports'   },
  { prefix: 'trail_kantorun',   title: 'Trail Run Kantorun x Sradha Coffee', category: 'Event'   },
  { prefix: 'langit_birthday',  title: 'Langit 6th Birthday',              category: 'Portrait' },
  { prefix: 'simply_padel',     title: 'Simply Padel',                     category: 'Sports'   },
];

const FALLBACK_PORTFOLIO = EVENTS_CONFIG.flatMap((evt) => 
  Array.from({ length: 10 }, (_, idx) => ({
    id: `${evt.prefix}_${idx + 1}`,
    url: `/images/${evt.prefix}_${idx + 1}.jpg`,
    title: evt.title,
    category: evt.category
  }))
);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type PortfolioItem = { id: string; url: string; title: string; category: string };

type EventGroup = {
  eventName: string;
  category: string;
  photos: PortfolioItem[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function extractEventName(title: string): string {
  // Extract the part before " – " as the event name
  const sep = title.indexOf(' – ');
  return sep !== -1 ? title.substring(0, sep).trim() : title.trim();
}

function groupByEvent(items: PortfolioItem[]): EventGroup[] {
  const map = new Map<string, EventGroup>();
  for (const item of items) {
    const eventName = extractEventName(item.title);
    if (!map.has(eventName)) {
      map.set(eventName, { eventName, category: item.category, photos: [] });
    }
    map.get(eventName)!.photos.push(item);
  }
  return Array.from(map.values());
}

// ─────────────────────────────────────────────────────────────────────────────
// EventCarouselCard
// ─────────────────────────────────────────────────────────────────────────────
function EventCarouselCard({
  group,
  onPhotoClick,
}: {
  group: EventGroup;
  onPhotoClick: (photo: PortfolioItem) => void;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const total = group.photos.length;

  const goNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(1);
    setActiveSlide((p) => (p + 1) % total);
  }, [total]);

  const goPrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDirection(-1);
    setActiveSlide((p) => (p - 1 + total) % total);
  }, [total]);

  const goTo = useCallback((e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setDirection(idx > activeSlide ? 1 : -1);
    setActiveSlide(idx);
  }, [activeSlide]);

  const currentPhoto = group.photos[activeSlide];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '60%' : '-60%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0 }),
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-[var(--color-secondary)] rounded-2xl overflow-hidden border border-white/5 hover:border-[var(--color-accent)]/30 transition-colors duration-300 shadow-xl"
    >
      {/* ── Photo area ── */}
      <div
        className="relative aspect-[4/3] overflow-hidden cursor-pointer"
        onClick={() => onPhotoClick(currentPhoto)}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentPhoto.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={currentPhoto.url}
              alt={currentPhoto.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

        {/* Category badge */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="bg-[var(--color-accent)] text-black text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
            {group.category}
          </span>
        </div>

        {/* Photo count badge */}
        {total > 1 && (
          <div className="absolute top-3 right-3 pointer-events-none">
            <span className="bg-black/60 backdrop-blur text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-white/10">
              {activeSlide + 1} / {total}
            </span>
          </div>
        )}

        {/* Prev / Next arrows – shown on hover */}
        {total > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Foto sebelumnya"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[var(--color-accent)] hover:text-black hover:border-transparent z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={goNext}
              aria-label="Foto berikutnya"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur border border-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[var(--color-accent)] hover:text-black hover:border-transparent z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}

        {/* Click to expand hint */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-black/60 backdrop-blur text-white text-[10px] font-medium px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path d="M15 3.75H21V9.75H19.5V5.56L9.53 15.53L8.47 14.47L18.44 4.5H15V3.75Z" />
              <path d="M4.5 5.25C4.5 4.84 4.84 4.5 5.25 4.5H10.5V3H5.25C4.01 3 3 4.01 3 5.25V18.75C3 19.99 4.01 21 5.25 21H18.75C19.99 21 21 19.99 21 18.75V13.5H19.5V18.75C19.5 19.16 19.16 19.5 18.75 19.5H5.25C4.84 19.5 4.5 19.16 4.5 18.75V5.25Z" />
            </svg>
            Lihat Penuh
          </div>
        </div>
      </div>

      {/* ── Info area ── */}
      <div className="p-5">
        <h3 className="text-white font-semibold text-base leading-snug mb-1 line-clamp-1">
          {group.eventName}
        </h3>
        <p className="text-[var(--color-muted)] text-xs line-clamp-1">
          {total} Foto Pilihan
        </p>

        {/* Dot indicators */}
        {total > 1 && (
          <div className="flex items-center gap-1.5 mt-3">
            {group.photos.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => goTo(e, idx)}
                aria-label={`Foto ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeSlide
                    ? 'bg-[var(--color-accent)] w-5'
                    : 'bg-white/20 w-1.5 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(FALLBACK_PORTFOLIO);
  const [loading, setLoading] = useState(true);

  // Lightbox state – operates on the flat filtered list
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<PortfolioItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('*')
          .order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
          setPortfolio(data);
        }
      } catch {
        // keep fallback
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  // ── Categories ──────────────────────────────────────────────────────────
  const defaultOrder = ['Semua', 'Sports', 'Event', 'Wedding', 'Portrait', 'Commercial'];
  const uniqueCategories = Array.from(new Set(portfolio.map((item) => item.category)));
  const sortedCategories = ['Semua', ...uniqueCategories.filter((c) => c !== 'Semua')].sort((a, b) => {
    const iA = defaultOrder.indexOf(a), iB = defaultOrder.indexOf(b);
    if (iA !== -1 && iB !== -1) return iA - iB;
    if (iA !== -1) return -1;
    if (iB !== -1) return 1;
    return a.localeCompare(b);
  });

  // ── Filtered items & grouped events ─────────────────────────────────────
  const filteredItems =
    activeCategory === 'Semua' ? portfolio : portfolio.filter((i) => i.category === activeCategory);

  const eventGroups = groupByEvent(filteredItems);

  // ── Lightbox helpers ─────────────────────────────────────────────────────
  const openLightbox = (photo: PortfolioItem) => {
    // Show all photos of the same event in the lightbox
    const eventName = extractEventName(photo.title);
    const eventPhotos = filteredItems.filter((i) => extractEventName(i.title) === eventName);
    const idx = eventPhotos.findIndex((i) => i.id === photo.id);
    setLightboxImages(eventPhotos);
    setCurrentIndex(idx >= 0 ? idx : 0);
    setLightboxOpen(true);
  };

  const nextImage = () => setCurrentIndex((p) => (p + 1) % lightboxImages.length);
  const prevImage = () => setCurrentIndex((p) => (p - 1 + lightboxImages.length) % lightboxImages.length);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Karya Kami
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[var(--color-muted)] max-w-2xl mx-auto"
          >
            Koleksi visual yang menangkap esensi dan cerita di setiap momen.
          </motion.p>
        </div>

        {/* ── Category Filter ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12"
        >
          {sortedCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-[var(--color-accent)] text-black shadow-lg shadow-[var(--color-accent)]/20'
                  : 'bg-[var(--color-secondary)] text-[var(--color-muted)] hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* ── Event count label ── */}
        {!loading && (
          <motion.p
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-[var(--color-muted)] text-sm mb-8"
          >
            {eventGroups.length} kegiatan · {filteredItems.length} foto
          </motion.p>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-accent)]" />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {eventGroups.map((group) => (
                <EventCarouselCard
                  key={group.eventName}
                  group={group}
                  onPhotoClick={openLightbox}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Empty state ── */}
        {!loading && eventGroups.length === 0 && (
          <div className="text-center py-24 text-[var(--color-muted)]">
            <p className="text-xl">Belum ada karya dalam kategori ini.</p>
          </div>
        )}

      </div>

      {/* ── Lightbox ── */}
      <Lightbox
        images={lightboxImages}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  );
}
