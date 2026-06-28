"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            booking_date: formData.date, 
            message: formData.message 
          }
        ]);

      if (error) {
        console.error(error);
        setSubmitStatus('error');
      } else {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', date: '', message: '' });
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const waMessage = `Halo Motrek Aja, saya ingin berkonsultasi mengenai sesi pemotretan.`;
  const waLink = `https://wa.me/6281238199989?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center">
      <div className="container mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Info Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Mari Ciptakan <br/>Sesuatu yang <span className="text-[var(--color-accent)]">Luar Biasa.</span></h1>
            <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-10">
              Ceritakan visi Anda. Baik itu pernikahan impian, kampanye produk, atau potret personal, kami siap mendengarkan dan mewujudkannya dalam bingkai visual yang abadi.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-2xl flex-shrink-0">💬</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Konsultasi Langsung</h3>
                  <p className="text-[var(--color-muted)] mb-3">Butuh respons cepat? Hubungi kami langsung melalui WhatsApp.</p>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:text-white transition-colors font-medium">
                    Direct to WhatsApp &rarr;
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-2xl flex-shrink-0">✉️</div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email Kami</h3>
                  <p className="text-[var(--color-muted)]">hello@motrekaja.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[var(--color-secondary)] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">Formulir Inkuiri</h2>
            
            {submitStatus === 'success' && (
              <div className="bg-green-500/20 text-green-400 p-4 rounded-lg mb-6 border border-green-500/30">
                Terima kasih! Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6 border border-red-500/30">
                Terjadi kesalahan saat mengirim pesan. Silakan coba lagi atau gunakan WhatsApp.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--color-muted)] mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[var(--color-background)] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-muted)] mb-2">Alamat Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[var(--color-background)] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-[var(--color-muted)] mb-2">Perkiraan Tanggal Sesi</label>
                <input 
                  type="date" 
                  id="date" 
                  name="date" 
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-[var(--color-background)] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors style-color-scheme-dark"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--color-muted)] mb-2">Ceritakan Kebutuhan Anda</label>
                <textarea 
                  id="message" 
                  name="message" 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-[var(--color-background)] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
                  placeholder="Ceritakan detail sesi pemotretan yang Anda inginkan..."
                ></textarea>
              </div>

              <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
              </Button>
            </form>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
