"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if already logged in (Supabase or Demo session)
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push('/admin');
        return;
      }
      
      const demoLogged = sessionStorage.getItem('motrek_admin_logged');
      if (demoLogged === 'true') {
        router.push('/admin');
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // 1. Try Supabase Auth first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // 2. If it fails, check if the email/password matches the fallback demo credentials
        // This is extremely helpful for immediate testing without setting up Supabase Auth yet.
        if (email === 'admin@motrekaja.com' && password === 'admin123') {
          sessionStorage.setItem('motrek_admin_logged', 'true');
          sessionStorage.setItem('motrek_admin_mode', 'demo');
          router.push('/admin');
          return;
        }
        
        // Return the actual Supabase error if not matching demo creds
        throw error;
      }

      if (data.user) {
        sessionStorage.setItem('motrek_admin_logged', 'true');
        sessionStorage.removeItem('motrek_admin_mode'); // Real database mode
        router.push('/admin');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Email atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemo = () => {
    setEmail('admin@motrekaja.com');
    setPassword('admin123');
    setIsDemoMode(true);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#EAB308]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#EAB308]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#2D2D2D] rounded-3xl border border-white/5 p-8 md:p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Motrek Aja<span className="text-[#EAB308]">.</span>
          </h1>
          <p className="text-[#9CA3AF] text-sm">Masuk ke Dashboard Administrator</p>
        </div>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Gagal Masuk</p>
              <p className="opacity-95">{errorMessage}</p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-[#9CA3AF]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-[#9CA3AF]/50 focus:outline-none focus:border-[#EAB308] transition-colors"
                placeholder="admin@motrekaja.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-[#9CA3AF]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-[#9CA3AF]/50 focus:outline-none focus:border-[#EAB308] transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-[#9CA3AF] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#EAB308] hover:bg-[#EAB308]/90 text-black font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-[#EAB308]/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Memproses...' : 'Masuk Sekarang'}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <span className="relative bg-[#2D2D2D] px-4 text-xs text-[#9CA3AF]/70 uppercase tracking-wider">
            atau gunakan akun demo
          </span>
        </div>

        <button
          onClick={handleUseDemo}
          type="button"
          className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl transition-colors border border-white/5 flex items-center justify-center gap-2 text-sm"
        >
          Gunakan Kredensial Demo
        </button>
        {isDemoMode && (
          <p className="text-[11px] text-center text-[#EAB308] mt-3 font-medium">
            Kredensial diisi otomatis: admin@motrekaja.com / admin123
          </p>
        )}
      </motion.div>
    </div>
  );
}
