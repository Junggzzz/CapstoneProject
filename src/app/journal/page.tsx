"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

// Dummy fallback data
const FALLBACK_JOURNALS = [
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

export default function JournalPage() {
  const [journals, setJournals] = useState(FALLBACK_JOURNALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJournals() {
      try {
        const { data, error } = await supabase
          .from('journals')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Could not fetch journals, using fallback.', error);
          const localJ = localStorage.getItem('demo_journals');
          if (localJ) {
            setJournals(JSON.parse(localJ));
          }
        } else if (data && data.length > 0) {
          setJournals(data);
        } else {
          // If connection works but table is empty, check demo data
          const localJ = localStorage.getItem('demo_journals');
          if (localJ) {
            setJournals(JSON.parse(localJ));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchJournals();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Jurnal & Cerita
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[var(--color-muted)] text-lg leading-relaxed"
          >
            Intip proses kreatif, cerita di balik layar, dan pandangan kami tentang seni fotografi.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-accent)]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {journals.map((journal, index) => (
              <motion.article 
                key={journal.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[var(--color-secondary)] border border-white/5 rounded-3xl overflow-hidden group hover:border-[var(--color-accent)]/30 transition-colors"
              >
                <div className="relative h-[300px] w-full overflow-hidden">
                  <Image 
                    src={journal.imageUrl} 
                    alt={journal.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium text-[var(--color-accent)]">
                    Behind the Scene
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-[var(--color-muted)] text-sm mb-3">{journal.date}</p>
                  <h2 className="text-2xl font-bold mb-4 group-hover:text-[var(--color-accent)] transition-colors">{journal.title}</h2>
                  <p className="text-[var(--color-muted)] leading-relaxed mb-6">
                    {journal.excerpt}
                  </p>
                  <Button variant="outline" size="sm">Baca Selengkapnya</Button>
                </div>
              </motion.article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
