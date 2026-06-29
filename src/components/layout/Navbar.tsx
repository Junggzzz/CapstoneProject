"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Otomatis tutup menu mobile jika rute halaman berubah
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-md border-b border-white/5 h-[80px] flex items-center">
      <div className="container mx-auto px-6 lg:px-8 w-full flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tight">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            Motrek Aja<span className="text-[var(--color-accent)]">.</span>
          </Link>
        </div>
        
        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className={`text-sm font-medium transition-colors hover:text-[var(--color-accent)] ${pathname === '/' ? 'text-[var(--color-accent)]' : 'text-[var(--color-foreground)]'}`}>Beranda</Link>
          <Link href="/portfolio" className={`text-sm font-medium transition-colors hover:text-[var(--color-accent)] ${pathname === '/portfolio' ? 'text-[var(--color-accent)]' : 'text-[var(--color-foreground)]'}`}>Portofolio</Link>
          <Link href="/about" className={`text-sm font-medium transition-colors hover:text-[var(--color-accent)] ${pathname === '/about' ? 'text-[var(--color-accent)]' : 'text-[var(--color-foreground)]'}`}>Tentang</Link>
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <Button href="/booking" variant="primary" size="sm">Jadwalkan Sesi</Button>
        </div>
        
        {/* Mobile menu hamburger toggle button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[var(--color-foreground)] focus:outline-none z-50 relative p-2"
          aria-label="Navigasi Menu"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[80px] bg-[var(--color-background)] z-40 flex flex-col px-8 py-12 md:hidden border-t border-white/5 space-y-8"
          >
            <nav className="flex flex-col gap-6">
              <Link href="/" className={`text-xl font-semibold transition-colors hover:text-[var(--color-accent)] ${pathname === '/' ? 'text-[var(--color-accent)]' : 'text-white'}`}>Beranda</Link>
              <Link href="/portfolio" className={`text-xl font-semibold transition-colors hover:text-[var(--color-accent)] ${pathname === '/portfolio' ? 'text-[var(--color-accent)]' : 'text-white'}`}>Portofolio</Link>
              <Link href="/about" className={`text-xl font-semibold transition-colors hover:text-[var(--color-accent)] ${pathname === '/about' ? 'text-[var(--color-accent)]' : 'text-white'}`}>Tentang</Link>
            </nav>
            <div className="pt-6 border-t border-white/5 w-full">
              <Button href="/booking" variant="primary" size="lg" className="w-full justify-center">
                Jadwalkan Sesi
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
