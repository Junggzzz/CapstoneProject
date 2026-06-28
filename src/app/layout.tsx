import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motrek Aja | Premium Photography",
  description: "Layanan jasa fotografi eksklusif untuk event, produk, dan personal. Abadikan momen terbaik Anda bersama Motrek Aja.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@200,300,400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[var(--color-background)] text-[var(--color-foreground)] min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-[80px]">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
