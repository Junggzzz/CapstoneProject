"use client";

import Link from 'next/link';
import Button from '../ui/Button';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-md border-b border-white/5 h-[80px] flex items-center">
      <div className="container mx-auto px-6 lg:px-8 w-full flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tight">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            Motrek Aja<span className="text-[var(--color-accent)]">.</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className={`text-sm font-medium transition-colors hover:text-[var(--color-accent)] ${pathname === '/' ? 'text-[var(--color-accent)]' : 'text-[var(--color-foreground)]'}`}>Beranda</Link>
          <Link href="/portfolio" className={`text-sm font-medium transition-colors hover:text-[var(--color-accent)] ${pathname === '/portfolio' ? 'text-[var(--color-accent)]' : 'text-[var(--color-foreground)]'}`}>Portofolio</Link>
          <Link href="/about" className={`text-sm font-medium transition-colors hover:text-[var(--color-accent)] ${pathname === '/about' ? 'text-[var(--color-accent)]' : 'text-[var(--color-foreground)]'}`}>Tentang</Link>
        </nav>

        <div className="hidden md:block">
          <Button href="/booking" variant="primary" size="sm">Jadwalkan Sesi</Button>
        </div>
        
        {/* Mobile menu button could be added here */}
        <button className="md:hidden text-[var(--color-foreground)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
    </header>
  );
}
