"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen pt-12">
      <div className="container mx-auto px-6 lg:px-8 py-16 md:py-24">
        
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Cerita di Balik <br/><span className="text-[var(--color-accent)]">Motrek Aja.</span></h1>
            <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-6">
              Berawal dari passion untuk mengabadikan momen-momen kecil yang sering terlewatkan, Motrek Aja tumbuh menjadi studio fotografi premium yang mendedikasikan diri pada seni bercerita melalui lensa.
            </p>
            <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-8">
              Filosofi kami sederhana: setiap subjek memiliki cahaya alaminya sendiri, dan tugas kami adalah menangkapnya pada saat yang paling tepat. Kami tidak sekadar memotret, kami mengawetkan emosi dan waktu.
            </p>
            <Button href="/portfolio" variant="primary">Lihat Karya Kami</Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] md:h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          >
            <Image 
              src="/images/specialized_ride_1.jpg" 
              alt="Fotografer beraksi" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </motion.div>
        </div>

        {/* Vision & Mission */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[var(--color-secondary)] rounded-3xl p-10 md:p-16 border border-white/5 mb-24"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-[var(--color-foreground)]">Visi Kami</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">
                Menjadi standar emas dalam industri fotografi premium, di mana setiap karya yang dihasilkan tidak hanya indah secara visual, tetapi juga memiliki kedalaman emosional yang tak lekang oleh waktu.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4 text-[var(--color-foreground)]">Misi Kami</h2>
              <ul className="list-disc list-inside text-[var(--color-muted)] space-y-2">
                <li>Menghadirkan pelayanan yang personal dan eksklusif.</li>
                <li>Memanfaatkan teknologi dan teknik fotografi terkini.</li>
                <li>Menjaga integritas dan orisinalitas dalam setiap sesi pemotretan.</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Team / Founder */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-16">Tim Fotografer</h2>
          <div className="flex justify-center">
            <div className="max-w-sm">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-6 border-4 border-[var(--color-secondary)]">
                <Image 
                  src="/images/riding_pandawa_2.jpg" 
                  alt="Founder" 
                  fill
                  sizes="192px"
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Budi Santoso</h3>
              <p className="text-[var(--color-accent)] font-medium mb-4">Lead Photographer & Founder</p>
              <p className="text-[var(--color-muted)] leading-relaxed">
                Dengan pengalaman lebih dari 10 tahun di industri kreatif, Budi memimpin Motrek Aja dengan visi sinematik dan perhatian luar biasa pada detail.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
