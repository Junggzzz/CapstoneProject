"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-[var(--color-secondary)] border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="text-2xl font-bold tracking-tight mb-4">
              Motrek Aja<span className="text-[var(--color-accent)]">.</span>
            </div>
            <p className="text-[var(--color-muted)] max-w-md leading-relaxed">
              Layanan jasa fotografi eksklusif untuk setiap momen berharga. Dari event, produk, hingga sesi personal, kami siap mengabadikan setiap emosi Anda dengan gaya sinematik.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Navigasi</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">Beranda</Link></li>
              <li><Link href="/portfolio" className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">Portofolio</Link></li>
              <li><Link href="/about" className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors">Tentang Kami</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Kontak Kami</h4>
            <ul className="space-y-3">
              <li className="text-[var(--color-muted)]">
                WhatsApp: <a href="https://wa.me/6285847487597" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent)] transition-colors">+62 858-4748-7597</a>
              </li>
              <li className="text-[var(--color-muted)]">
                Instagram: <a href="https://instagram.com/motrek.aja" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-accent)] transition-colors">@motrek.aja</a>
              </li>
              <li className="text-[var(--color-muted)]">
                Email: <a href="mailto:hello@motrekaja.com" className="hover:text-[var(--color-accent)] transition-colors">hello@motrekaja.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 mt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-[var(--color-muted)] text-sm">
          <p>&copy; {new Date().getFullYear()} Motrek Aja. Hak cipta dilindungi.</p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
