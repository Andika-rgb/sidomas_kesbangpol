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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-7">
          <div>
            <p className="text-xs text-emas-terang">
              Badan Kesatuan Bangsa dan Politik Kota Yogyakarta
            </p>
            <h1 className="relative mt-1 inline-block font-judul text-2xl font-bold text-white sm:text-3xl">
              SIDOMAS
              <span className="absolute -bottom-1 left-0 h-[3px] w-10 bg-emas" />
            </h1>
            <p className="mt-2 text-sm text-[#B9C2D4]">
              Sistem Digitalisasi Data Organisasi Kemasyarakatan
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/ormas/login"
              className="rounded-md border border-emas px-4 py-2 text-sm font-medium text-emas-terang transition hover:bg-navy-terang"
            >
              Login Ormas
            </Link>
            <Link
              href="/admin/login"
              className="rounded-md bg-emas px-4 py-2 text-sm font-medium text-navy transition hover:brightness-110"
            >
              Login Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Berita & Informasi */}
        <section className="mb-12">
          <h2 className="mb-4 font-judul text-lg font-medium text-foreground">
            Berita &amp; Informasi
          </h2>
          <Suspense fallback={<KerangkaKotak jumlah={2} />}>
            <DaftarBerita />
          </Suspense>
        </section>

        {/* Direktori Ormas per kategori */}
        <section>
          <h2 className="mb-4 font-judul text-lg font-medium text-foreground">
            Direktori Organisasi Kemasyarakatan
          </h2>
          <Suspense fallback={<KerangkaKotak jumlah={4} />}>
            <DirektoriOrmas />
          </Suspense>
        </section>
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

async function DaftarBerita() {
  const daftarBerita = await prisma.berita.findMany({
    where: { dipublikasikan: true },
    orderBy: { createdAt: "desc" },
    take: 4,
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

async function DirektoriOrmas() {
  const daftarOrmas = await prisma.ormas.findMany({
    where: { status: "AKTIF", tampilDiKatalog: true },
    orderBy: { nama: "asc" },
  });

  if (daftarOrmas.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-garis bg-white p-10 text-center text-teks-redup">
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
            <span className="rounded bg-navy px-2.5 py-1 text-xs font-medium text-emas-terang">
              {kategori}
            </span>
            <span className="text-xs text-teks-redup">
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
  const inisial = ormas.nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((kata) => kata[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex gap-4 rounded-lg border border-garis bg-white p-5 transition hover:border-emas">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy font-judul text-sm font-medium text-emas-terang">
        {ormas.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ormas.logoUrl}
            alt={`Logo ${ormas.nama}`}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          inisial || "?"
        )}
      </div>
      <div>
        <h4 className="font-judul font-medium text-foreground">
          {ormas.nama}
        </h4>
        <p className="text-sm text-teks-redup">Kemantren {ormas.kemantren}</p>
        <dl className="mt-2 space-y-0.5 text-xs text-[#6B6355]">
          {ormas.namaKetua && (
            <div>
              <span className="text-teks-redup">Ketua:</span> {ormas.namaKetua}
            </div>
          )}
          {ormas.namaSekretaris && (
            <div>
              <span className="text-teks-redup">Sekretaris:</span>{" "}
              {ormas.namaSekretaris}
            </div>
          )}
          {ormas.namaBendahara && (
            <div>
              <span className="text-teks-redup">Bendahara:</span>{" "}
              {ormas.namaBendahara}
            </div>
          )}
        </dl>
        <span className="mt-2 inline-block rounded-full bg-sage-bg px-2 py-0.5 text-[10px] font-medium text-sage-teks">
          Aktif
        </span>
      </div>
    </div>
  );
}
