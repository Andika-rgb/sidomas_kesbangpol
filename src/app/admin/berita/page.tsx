import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Berita } from "@prisma/client";
import FormTambahBerita from "./FormTambahBerita";
import { TombolTogglePublikasi, TombolHapusBerita } from "./TombolBerita";

export default function AdminBeritaPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <p className="text-xs font-medium text-blue-200">
            <Link href="/admin" className="hover:text-white">
              &larr; Kembali ke Dashboard
            </Link>
          </p>
          <h1 className="text-lg font-bold text-white">
            Berita &amp; Informasi
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <FormTambahBerita />

        <h2 className="mb-3 mt-10 text-sm font-semibold text-slate-700">
          Semua Berita
        </h2>
        <Suspense fallback={<p className="text-slate-500">Memuat...</p>}>
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
    return <p className="text-sm text-slate-500">Belum ada berita.</p>;
  }

  return (
    <div className="space-y-3">
      {daftar.map((berita: Berita) => (
        <div
          key={berita.id}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
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
                <p className="font-medium text-slate-900">{berita.judul}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                  {berita.isi}
                </p>
              </div>
            </div>
            <span
              className={
                berita.dipublikasikan
                  ? "shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700"
                  : "shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500"
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
