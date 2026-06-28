"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in, redirect to admin dashboard
  useEffect(() => {
    const checkLogin = () => {
      const isSessionActive = localStorage.getItem('motrek_admin_logged_in') === 'true';
      if (isSessionActive) {
        router.push('/admin');
      }
    };
    checkLogin();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Deteksi jika ENV belum di-set di hosting (Vercel)
    const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                          process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
                          !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
                          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder');

    try {
      // 1. Try local credential fallback first for easy sandbox testing
      if (email === 'admin@motrekaja.com' && password === 'admin123') {
        localStorage.setItem('motrek_admin_logged_in', 'true');
        localStorage.setItem('motrek_admin_email', email);
        router.push('/admin');
        return;
      }

      if (isPlaceholder) {
        setErrorMsg('Supabase belum terkonfigurasi di Vercel. Silakan tambahkan Environment Variables NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di dashboard Vercel Anda.');
        setIsLoading(false);
        return;
      }

      // 2. Try Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If local credentials didn't match and Supabase login failed, show error
        setErrorMsg(error.message || 'Email atau password salah.');
      } else if (data?.user) {
        localStorage.setItem('motrek_admin_logged_in', 'true');
        localStorage.setItem('motrek_admin_email', data.user.email || email);
        router.push('/admin');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan sistem. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] px-6">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-[#2D2D2D] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Motrek Aja<span className="text-[var(--color-accent)]">.</span>
          </h1>
          <p className="text-[var(--color-muted)] text-sm">Admin Portal & Dashboard</p>
        </div>

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6 border border-red-500/30 text-center"
          >
            {errorMsg}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-muted)] mb-2">
              Email
            </label>
            <input 
              type="email" 
              id="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              placeholder="admin@motrekaja.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--color-muted)] mb-2">
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full py-3" disabled={isLoading}>
            {isLoading ? 'Mengautentikasi...' : 'Masuk Ke Dashboard'}
          </Button>
        </form>

      </motion.div>
    </div>
  );
}
