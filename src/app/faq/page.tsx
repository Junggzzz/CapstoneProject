"use client";

import { motion } from 'framer-motion';
import Accordion from '@/components/ui/Accordion';
import Button from '@/components/ui/Button';

const FAQ_ITEMS = [
  {
    question: "Bagaimana proses booking sesi pemotretan?",
    answer: "Anda dapat mengisi formulir inkuiri di halaman Booking atau langsung menghubungi kami via WhatsApp. Setelah menerima detail kebutuhan Anda, kami akan menjadwalkan konsultasi awal (online atau offline) untuk membahas konsep, ketersediaan jadwal, dan detail lainnya."
  },
  {
    question: "Berapa lama waktu pengerjaan (editing) foto?",
    answer: "Untuk sesi personal dan komersial standar, proses editing memakan waktu 7-14 hari kerja. Untuk event besar seperti pernikahan, preview (teaser) akan dikirim dalam 3 hari, dan hasil akhir (full gallery) akan diselesaikan dalam 30 hari kerja."
  },
  {
    question: "Apakah Motrek Aja menyediakan wardrobe atau MUA?",
    answer: "Kami fokus pada keahlian utama kami: fotografi. Namun, kami memiliki rekanan MUA (Makeup Artist) dan penyedia wardrobe profesional yang sering bekerjasama dengan kami dan dapat kami rekomendasikan sesuai dengan konsep sesi Anda."
  },
  {
    question: "Bagaimana dengan hak cipta foto?",
    answer: "Hak cipta foto tetap milik Motrek Aja sebagai kreator, yang memungkinkan kami menggunakannya untuk portofolio (kecuali disepakati lain dengan klausul NDA). Klien mendapatkan lisensi penggunaan penuh untuk kebutuhan personal. Untuk komersial, detail lisensi akan dicantumkan dalam kontrak terpisah."
  },
  {
    question: "Apakah melayani pemotretan di luar kota/luar negeri?",
    answer: "Tentu. Kami sering melakukan sesi di luar kota maupun luar negeri (destination shoot). Biaya akomodasi dan transportasi akan didiskusikan dan ditambahkan ke dalam kesepakatan akhir."
  },
  {
    question: "Berapa jumlah foto yang akan saya dapatkan?",
    answer: "Jumlah foto bergantung pada jenis sesi dan durasi. Sebagai gambaran, untuk sesi portrait 2 jam, Anda akan mendapatkan sekitar 30-50 foto editan premium. Semua file mentah (RAW) tidak kami berikan untuk menjaga standar kualitas warna dan tone khas Motrek Aja."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
        
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Pertanyaan Umum
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[var(--color-muted)] text-lg"
          >
            Temukan jawaban atas pertanyaan yang sering diajukan mengenai layanan kami.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16"
        >
          <Accordion items={FAQ_ITEMS} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-[var(--color-secondary)] p-10 rounded-3xl text-center border border-white/5"
        >
          <h2 className="text-2xl font-semibold mb-4">Masih Punya Pertanyaan?</h2>
          <p className="text-[var(--color-muted)] mb-8 max-w-lg mx-auto">
            Jika pertanyaan Anda belum terjawab di atas, jangan ragu untuk menghubungi kami secara langsung.
          </p>
          <Button href="/booking" variant="outline">Hubungi Kami</Button>
        </motion.div>

      </div>
    </div>
  );
}
