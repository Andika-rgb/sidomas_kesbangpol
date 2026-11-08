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
import type { Ormas, Berita } from "@prisma/client";
import { DAFTAR_KATEGORI_ORMAS } from "@/lib/konstanta";

export default function BerandaPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Badan Kesatuan Bangsa dan Politik Kota Yogyakarta
            </p>
            <h1 className="mt-1 text-2xl font-bold text-zinc-900 sm:text-3xl">
              SIDOMAS
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Sistem Digitalisasi Data Organisasi Kemasyarakatan
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/ormas/login"
              className="rounded-md border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              Login Ormas
            </Link>
            <Link
              href="/admin/login"
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Login Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Berita & Informasi */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Berita &amp; Informasi
          </h2>
          <Suspense fallback={<KerangkaKotak jumlah={2} />}>
            <DaftarBerita />
          </Suspense>
        </section>

        {/* Direktori Ormas per kategori */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            Direktori Organisasi Kemasyarakatan
          </h2>
          <Suspense fallback={<KerangkaKotak jumlah={4} />}>
            <DirektoriOrmas />
          </Suspense>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-xs text-zinc-400">
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
          className="h-24 animate-pulse rounded-lg border border-zinc-200 bg-white"
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
      <p className="text-sm text-zinc-500">Belum ada berita terbaru.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {daftarBerita.map((berita: Berita) => (
        <article
          key={berita.id}
          className="rounded-lg border border-zinc-200 bg-white p-4"
        >
          <h3 className="font-semibold text-zinc-900">{berita.judul}</h3>
          <p className="mt-1 text-sm text-zinc-600">{berita.isi}</p>
          <p className="mt-2 text-xs text-zinc-400">
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
  });

  if (daftarOrmas.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
        Belum ada data ormas aktif.
      </div>
    );
  }

  // Kelompokkan ormas berdasarkan kategorinya masing-masing.
  const berdasarkanKategori = new Map<string, Ormas[]>();
  for (const ormas of daftarOrmas) {
    const daftar = berdasarkanKategori.get(ormas.kategori) ?? [];
    daftar.push(ormas);
    berdasarkanKategori.set(ormas.kategori, daftar);
  }

  return (
    <div className="space-y-10">
      {DAFTAR_KATEGORI_ORMAS.filter((kategori) =>
        berdasarkanKategori.has(kategori)
      ).map((kategori) => (
        <div key={kategori}>
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-700">
              {kategori}
            </h3>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
              {berdasarkanKategori.get(kategori)!.length} ormas
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {berdasarkanKategori.get(kategori)!.map((ormas) => (
              <KartuOrmas key={ormas.id} ormas={ormas} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function KartuOrmas({ ormas }: { ormas: Ormas }) {
  return (
    <div className="flex gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-400">
        {ormas.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ormas.logoUrl}
            alt={`Logo ${ormas.nama}`}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          "Logo"
        )}
      </div>
      <div>
        <h4 className="font-semibold text-zinc-900">{ormas.nama}</h4>
        <p className="text-sm text-zinc-500">Kemantren {ormas.kemantren}</p>
        <dl className="mt-2 space-y-0.5 text-xs text-zinc-600">
          {ormas.namaKetua && (
            <div>
              <span className="text-zinc-400">Ketua:</span> {ormas.namaKetua}
            </div>
          )}
          {ormas.namaSekretaris && (
            <div>
              <span className="text-zinc-400">Sekretaris:</span>{" "}
              {ormas.namaSekretaris}
            </div>
          )}
          {ormas.namaBendahara && (
            <div>
              <span className="text-zinc-400">Bendahara:</span>{" "}
              {ormas.namaBendahara}
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
