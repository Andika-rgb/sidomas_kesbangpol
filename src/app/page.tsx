// ============================================================
// Halaman Beranda Publik
// ============================================================
// Direktori ormas per kategori sekarang di halaman terpisah
// (/katalog) -- di sini cuma hero + pengumuman/berita.
// ============================================================
import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Berita } from "@prisma/client";
import { DAFTAR_KATEGORI_ORMAS, DAFTAR_KEMANTREN } from "@/lib/konstanta";
import PublicHeader from "./PublicHeader";

export default function BerandaPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader halamanAktif="beranda" />

      <Suspense fallback={<div className="h-[340px] animate-pulse bg-navy" />}>
        <Hero />
      </Suspense>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <h2 id="berita" className="mb-4 font-judul text-lg font-medium text-foreground">
          Semua Pengumuman &amp; Berita
        </h2>
        <Suspense fallback={<KerangkaKotak jumlah={4} />}>
          <DaftarBerita />
        </Suspense>
      </main>

      <footer className="border-t border-garis py-6 text-center text-xs text-teks-redup">
        &copy; <TahunSekarang /> Bakesbangpol Kota Yogyakarta — SIDOMAS
      </footer>
    </div>
  );
}

async function TahunSekarang() {
  "use cache";
  return new Date().getFullYear();
}

function KerangkaKotak({ jumlah }: { jumlah: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: jumlah }).map((_, i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-lg border border-garis bg-white"
        />
      ))}
    </div>
  );
}

async function Hero() {
  const [beritaTerbaru, jumlahOrmas] = await Promise.all([
    prisma.berita.findFirst({
      where: { dipublikasikan: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.ormas.count({ where: { status: "AKTIF", tampilDiKatalog: true } }),
  ]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-terang to-navy">
      {/* pola garis halus, bukan foto -- biar ringan & tetap elegan */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 26px)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 py-14 sm:py-20">
        <div className="max-w-xl">
          {beritaTerbaru ? (
            <>
              <span className="inline-block rounded-full bg-emas-terang px-3 py-1 text-xs font-medium text-navy">
                📢 Pengumuman Terbaru
              </span>
              <h1 className="mt-4 font-judul text-2xl font-bold leading-snug text-white sm:text-3xl">
                {beritaTerbaru.judul}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[#DCE2EE] sm:text-base">
                {beritaTerbaru.isi.length > 180
                  ? beritaTerbaru.isi.slice(0, 180) + "…"
                  : beritaTerbaru.isi}
              </p>
            </>
          ) : (
            <>
              <h1 className="font-judul text-2xl font-bold text-white sm:text-3xl">
                Selamat Datang di SIDOMAS
              </h1>
              <p className="mt-3 text-sm text-[#DCE2EE] sm:text-base">
                Sistem Digitalisasi Data Organisasi Kemasyarakatan, Badan
                Kesatuan Bangsa dan Politik Kota Yogyakarta.
              </p>
            </>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/katalog"
              className="rounded-md bg-emas px-5 py-2.5 text-sm font-medium text-navy transition hover:brightness-110"
            >
              Lihat Katalog Ormas
            </Link>
            <Link
              href="#berita"
              className="rounded-md border border-white/40 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Semua Pengumuman
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-5xl grid-cols-3 gap-3 px-6 pb-8 sm:gap-4">
        <KartuStatistik angka={jumlahOrmas} label="Ormas Terdaftar" />
        <KartuStatistik angka={DAFTAR_KATEGORI_ORMAS.length} label="Kategori" />
        <KartuStatistik angka={DAFTAR_KEMANTREN.length} label="Kemantren" />
      </div>
    </div>
  );
}

function KartuStatistik({ angka, label }: { angka: number; label: string }) {
  return (
    <div className="rounded-lg bg-white/95 p-4 text-center shadow-sm">
      <div className="font-judul text-xl font-bold text-navy">{angka}</div>
      <div className="mt-0.5 text-[11px] text-teks-redup">{label}</div>
    </div>
  );
}

async function DaftarBerita() {
  const daftarBerita = await prisma.berita.findMany({
    where: { dipublikasikan: true },
    orderBy: { createdAt: "desc" },
  });

  if (daftarBerita.length === 0) {
    return (
      <p className="text-sm text-teks-redup">Belum ada berita terbaru.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {daftarBerita.map((berita: Berita) => (
        <article
          key={berita.id}
          className="rounded-lg border border-garis bg-white p-4"
        >
          <h3 className="font-judul font-medium text-foreground">
            {berita.judul}
          </h3>
          <p className="mt-1 text-sm text-[#6B6355]">{berita.isi}</p>
          <p className="mt-2 text-xs text-teks-redup">
            {berita.createdAt.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </article>
      ))}
    </div>
  );
}
