import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Berita } from "@prisma/client";
import FormTambahBerita from "./FormTambahBerita";
import { TombolTogglePublikasi, TombolHapusBerita } from "./TombolBerita";

export default function AdminBeritaPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-navy">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <p className="text-xs font-medium text-[#B9C2D4]">
            <Link href="/admin" className="hover:text-white">
              &larr; Kembali ke Dashboard
            </Link>
          </p>
          <h1 className="font-judul text-lg font-bold text-white">
            Berita &amp; Informasi
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <FormTambahBerita />

        <h2 className="mb-3 mt-10 font-judul text-sm font-semibold text-foreground">
          Semua Berita
        </h2>
        <Suspense fallback={<p className="text-teks-redup">Memuat...</p>}>
          <DaftarBerita />
        </Suspense>
      </main>
    </div>
  );
}

async function DaftarBerita() {
  const daftar = await prisma.berita.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (daftar.length === 0) {
    return <p className="text-sm text-teks-redup">Belum ada berita.</p>;
  }

  return (
    <div className="space-y-3">
      {daftar.map((berita: Berita) => (
        <div
          key={berita.id}
          className="rounded-xl border border-garis bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              {berita.gambarUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={berita.gambarUrl}
                  alt={berita.judul}
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
              )}
              <div>
                <p className="font-judul font-medium text-foreground">
                  {berita.judul}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-teks-redup">
                  {berita.isi}
                </p>
              </div>
            </div>
            <span
              className={
                berita.dipublikasikan
                  ? "shrink-0 rounded-full bg-sage-bg px-2 py-0.5 text-xs text-sage-teks"
                  : "shrink-0 rounded-full bg-background px-2 py-0.5 text-xs text-teks-redup"
              }
            >
              {berita.dipublikasikan ? "Tampil" : "Disembunyikan"}
            </span>
          </div>
          <div className="mt-3 flex gap-4">
            <TombolTogglePublikasi
              id={berita.id}
              dipublikasikan={berita.dipublikasikan}
            />
            <TombolHapusBerita id={berita.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
