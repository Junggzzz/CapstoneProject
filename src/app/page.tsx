"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';

const HERO_IMAGES = [
  { src: '/images/running_passion_1.jpg',  alt: 'Running for Passion' },
  { src: '/images/ahi_trip_1.jpg',         alt: 'AHI Trip Bali' },
  { src: '/images/specialized_ride_1.jpg', alt: 'Specialized Day 1 Ride' },
  { src: '/images/batur_trail_1.jpg',      alt: 'Batur Trail Run' },
  { src: '/images/simply_padel_1.jpg',     alt: 'Simply Padel' },
  { src: '/images/langit_birthday_1.jpg',  alt: 'Langit 6th Birthday' },
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] md:h-screen w-full overflow-hidden flex items-center justify-center">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image 
              src={HERO_IMAGES[currentImageIndex].src}
              alt={HERO_IMAGES[currentImageIndex].alt}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[var(--color-background)] pointer-events-none"></div>
          </motion.div>
        </AnimatePresence>

        <div className="container relative z-10 mx-auto px-6 lg:px-8 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
              Tersedia untuk Sesi Bulan Ini
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto"
          >
            Abadikan Momen <br />
            <span className="text-[var(--color-accent)] italic">Tanpa Batas</span> Waktu
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-lg md:text-xl text-[var(--color-foreground)]/80 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Layanan jasa fotografi eksklusif yang menangkap setiap emosi, detail, dan cerita di balik momen berharga Anda dengan gaya sinematik.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button href="/portfolio" variant="primary" size="lg">Lihat Karya Kami</Button>
            <Button href="/booking" variant="outline" size="lg">Jadwalkan Sesi</Button>
          </motion.div>
        </div>
      </section>

      {/* Highlight Section */}
      <section className="py-24 bg-[var(--color-background)]">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Spesialisasi Kami</h2>
            <p className="text-[var(--color-muted)] text-lg max-w-2xl mx-auto">Membawa standar tinggi untuk setiap kebutuhan visual Anda.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: '/images/specialized_ride_1.jpg', icon: '🚴', title: 'Sports Photography',   desc: 'Mengabadikan aksi dinamis, kecepatan, dan energi atlet dalam kompetisi olahraga.' },
              { img: '/images/ahi_trip_1.jpg',         icon: '🎉', title: 'Event Photography',    desc: 'Mendokumentasikan kemeriahan, momen penting, dan cerita dalam berbagai acara.' },
              { img: '/images/langit_birthday_1.jpg',  icon: '👤', title: 'Portrait Photography',   desc: 'Fotografi potret personal dan profil profesional yang memancarkan karakter otentik.' },
            ].map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group overflow-hidden rounded-2xl border border-white/5 hover:border-[var(--color-accent)]/40 transition-all duration-500 cursor-pointer"
              >
                {/* Background photo */}
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={service.img}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="text-3xl mb-3">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
                  <p className="text-[var(--color-muted)] text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-h-0 group-hover:max-h-24 overflow-hidden">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients & Testimonials Section */}
      <section className="py-24 bg-[var(--color-secondary)]">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Dipercaya Oleh</h2>
            <p className="text-[var(--color-muted)] text-lg">Klien yang telah bekerja sama dengan kami.</p>
          </motion.div>

          {/* Dummy Client Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 opacity-50 grayscale">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-center p-6 bg-black/20 rounded-xl">
                <span className="text-2xl font-bold tracking-widest text-[var(--color-muted)]">KLIEN {i}</span>
              </div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto bg-black/30 p-10 md:p-14 rounded-3xl relative overflow-hidden border border-white/5"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-[var(--color-accent)]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="text-center relative z-10">
              <div className="text-5xl text-[var(--color-accent)] mb-6">&quot;</div>
              <p className="text-xl md:text-3xl italic font-light mb-8 leading-relaxed">
                Hasil fotonya sangat memuaskan, tone warnanya sinematik seperti yang kami inginkan. Fotografer sangat profesional dan bisa menangkap momen candid dengan sempurna.
              </p>
              <div>
                <h4 className="font-semibold text-lg">Andi & Rina</h4>
                <p className="text-[var(--color-muted)]">Wedding Client</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black z-0">
          <Image 
            src="/images/running_passion_2.jpg" 
            alt="Motrek Aja CTA" 
            fill
            sizes="100vw"
            className="object-cover opacity-30"
          />
        </div>
        <div className="container mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto bg-[var(--color-background)]/80 backdrop-blur-xl p-12 md:p-16 rounded-3xl border border-white/10 shadow-2xl"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Siap untuk Berkolaborasi?</h2>
            <p className="text-lg md:text-xl text-[var(--color-muted)] mb-10 leading-relaxed">
              Ceritakan visi Anda, dan mari kita wujudkan dalam bentuk karya visual yang abadi dan berkelas.
            </p>
            <Button href="/booking" variant="primary" size="lg">Mulai Konsultasi</Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
