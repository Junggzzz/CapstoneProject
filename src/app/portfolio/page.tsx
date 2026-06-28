"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Lightbox from '@/components/ui/Lightbox';
import { supabase } from '@/lib/supabase';

// Categories
const CATEGORIES = ['Semua', 'Sports', 'Event', 'Wedding', 'Portrait', 'Commercial'];

// Fallback portfolio data using local best-of images curated from all event folders
const FALLBACK_PORTFOLIO = [
  { id: '1',  url: '/images/best_1.jpg',  title: 'AHI Trip Bali – Konvoi di Jalan Raya',   category: 'Event'    },
  { id: '2',  url: '/images/best_2.jpg',  title: 'AHI Trip Bali – Day 4 Adventure',         category: 'Event'    },
  { id: '3',  url: '/images/best_3.jpg',  title: 'Batur International Trail Run – Finish',  category: 'Sports'   },
  { id: '4',  url: '/images/best_4.jpg',  title: 'Batur Trail Run – Pack Run',               category: 'Sports'   },
  { id: '5',  url: '/images/best_5.jpg',  title: 'Batur Trail Run – Race Day',               category: 'Sports'   },
  { id: '6',  url: '/images/best_6.jpg',  title: 'Batur Trail Run – Solo Sprint',            category: 'Sports'   },
  { id: '7',  url: '/images/best_7.jpg',  title: 'Batur Trail Run – Group Run Savanna',      category: 'Sports'   },
  { id: '8',  url: '/images/best_8.jpg',  title: 'Riding Pandawa-Melasti – On The Road',     category: 'Sports'   },
  { id: '9',  url: '/images/best_9.jpg',  title: 'Specialized Day 1 Ride – Cyclist Portrait',category: 'Sports'   },
  { id: '10', url: '/images/best_10.jpg', title: 'Trail Run Kantorun x Sradha Coffee',       category: 'Event'    },
  { id: '11', url: '/images/best_11.jpg', title: 'Running for Passion x Little Canggu – Bridge', category: 'Sports' },
  { id: '12', url: '/images/best_12.jpg', title: 'Running for Passion – Forest Trail Run',   category: 'Sports'   },
  { id: '13', url: '/images/best_13.jpg', title: 'Running for Passion – Female Runner',      category: 'Sports'   },
  { id: '14', url: '/images/best_14.jpg', title: 'Running for Passion – Joyful Sprint',      category: 'Sports'   },
  { id: '15', url: '/images/best_15.jpg', title: 'Simply Padel – Backhand Action',           category: 'Sports'   },
  { id: '16', url: '/images/best_16.jpg', title: 'Simply Padel – Overhead Serve',            category: 'Sports'   },
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [portfolio, setPortfolio] = useState<{ id: string; url: string; title: string; category: string }[]>(FALLBACK_PORTFOLIO);
  const [loading, setLoading] = useState(true);
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Could not fetch portfolio, using fallback.', error);
          const localP = localStorage.getItem('demo_portfolio');
          if (localP) {
            setPortfolio(JSON.parse(localP));
          }
        } else if (data && data.length > 0) {
          setPortfolio(data);
        } else {
          // If connection works but table is empty, check demo data
          const localP = localStorage.getItem('demo_portfolio');
          if (localP) {
            setPortfolio(JSON.parse(localP));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, []);

  const filteredPortfolio = activeCategory === 'Semua' 
    ? portfolio 
    : portfolio.filter(item => item.category === activeCategory);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredPortfolio.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredPortfolio.length) % filteredPortfolio.length);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-8">
        
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

        {/* Filter */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat 
                  ? 'bg-[var(--color-accent)] text-black shadow-lg shadow-[var(--color-accent)]/20' 
                  : 'bg-[var(--color-secondary)] text-[var(--color-muted)] hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-accent)]"></div>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPortfolio.map((item, index) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer bg-[var(--color-secondary)]"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-75"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-[var(--color-accent)] text-xs font-semibold uppercase tracking-wider mb-2">{item.category}</span>
                    <h3 className="text-white text-xl font-medium">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      <Lightbox 
        images={filteredPortfolio}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  );
}
