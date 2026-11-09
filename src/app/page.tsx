// ============================================================
// Halaman Beranda Publik
// ============================================================
// Catatan Cache Components (Next.js 16): setiap bagian yang
// mengambil data dari database dipisah jadi komponen sendiri &
// dibungkus <Suspense>, supaya kerangka halaman (header, dll)
// bisa langsung tampil instan sementara datanya "menyusul".
// ============================================================
import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Berita } from "@prisma/client";
import DirektoriOrmasClient, {
  type OrmasRingkas,
} from "./DirektoriOrmasClient";

export default function BerandaPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <div>
            <p className="text-sm font-medium text-blue-200">
              Badan Kesatuan Bangsa dan Politik Kota Yogyakarta
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              SIDOMAS
            </h1>
            <p className="mt-1 text-sm text-blue-100">
              Sistem Digitalisasi Data Organisasi Kemasyarakatan
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/ormas/login"
              className="rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
            >
              Login Ormas
            </Link>
            <Link
              href="/admin/login"
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-50"
            >
              Login Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Berita & Informasi */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <span className="h-5 w-1.5 rounded-full bg-blue-800" />
            Berita &amp; Informasi
          </h2>
          <Suspense fallback={<KerangkaKotak jumlah={2} />}>
            <DaftarBerita />
          </Suspense>
        </section>

        {/* Direktori Ormas per kategori */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <span className="h-5 w-1.5 rounded-full bg-blue-800" />
            Direktori Organisasi Kemasyarakatan
          </h2>
          <Suspense fallback={<KerangkaKotak jumlah={4} />}>
            <DirektoriOrmas />
          </Suspense>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
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
          className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white"
        />
      ))}
    </div>
  );
}

async function DaftarBerita() {
  const daftarBerita = await prisma.berita.findMany({
    where: { dipublikasikan: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  if (daftarBerita.length === 0) {
    return (
      <p className="text-sm text-slate-500">Belum ada berita terbaru.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {daftarBerita.map((berita: Berita) => (
        <article
          key={berita.id}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          {berita.gambarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={berita.gambarUrl}
              alt={berita.judul}
              className="mb-3 h-32 w-full rounded-lg object-cover"
            />
          )}
          <h3 className="font-semibold text-slate-900">{berita.judul}</h3>
          <p className="mt-1 text-sm text-slate-600">{berita.isi}</p>
          <p className="mt-2 text-xs text-slate-400">
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

async function DirektoriOrmas() {
  const daftarOrmas = await prisma.ormas.findMany({
    where: { status: "AKTIF", tampilDiKatalog: true },
    orderBy: { nama: "asc" },
    select: {
      id: true,
      kodeOrmas: true,
      nama: true,
      kategori: true,
      kemantren: true,
      logoUrl: true,
      namaKetua: true,
      namaSekretaris: true,
      namaBendahara: true,
    },
  });

  return <DirektoriOrmasClient daftarOrmas={daftarOrmas as OrmasRingkas[]} />;
}
