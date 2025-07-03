import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetlifyTokenRedirect from "@/components/NetlifyTokenRedirect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARCADE HIMAFI ITB - Divisi Pengembangan Karier & Relasi Alumni",
  description: "Website resmi ARCADE HIMAFI ITB - Divisi Pengembangan Karier dan Relasi Alumni Himpunan Mahasiswa Fisika ITB. Temukan info karier, cerita alumni, dan koneksi profesional.",
  keywords: "ARCADE, HIMAFI, ITB, alumni, karier, fisika, networking, lowongan kerja, magang, beasiswa",
  authors: [{ name: "ARCADE HIMAFI ITB" }],
  openGraph: {
    title: "ARCADE HIMAFI ITB - Divisi Pengembangan Karier & Relasi Alumni",
    description: "Website resmi ARCADE HIMAFI ITB - Divisi Pengembangan Karier dan Relasi Alumni Himpunan Mahasiswa Fisika ITB.",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARCADE HIMAFI ITB - Divisi Pengembangan Karier & Relasi Alumni",
    description: "Website resmi ARCADE HIMAFI ITB - Divisi Pengembangan Karier dan Relasi Alumni Himpunan Mahasiswa Fisika ITB.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NetlifyTokenRedirect />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
