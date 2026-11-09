import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";

// Font judul: Sora -- tegas & geometris, dipakai di heading/wordmark.
const fontJudul = Sora({
  variable: "--font-judul",
  subsets: ["latin"],
  weight: ["500", "700"],
});

// Font isi: Inter -- netral & gampang dibaca, dipakai di teks biasa.
const fontInti = Inter({
  variable: "--font-inti",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIDOMAS — Bakesbangpol Kota Yogyakarta",
  description:
    "Sistem Digitalisasi Data Organisasi Kemasyarakatan, Badan Kesatuan Bangsa dan Politik Kota Yogyakarta.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${fontJudul.variable} ${fontInti.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
