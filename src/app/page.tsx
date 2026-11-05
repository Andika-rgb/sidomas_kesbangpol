// ============================================================
// Halaman Beranda Publik - Katalog Ormas
// ============================================================
// Ini "Server Component" (halaman default di Next.js App Router).
// Artinya kode di sini jalan di SERVER (bukan di browser pengguna),
// jadi bisa langsung ambil data dari database dengan aman tanpa
// bikin API terpisah dulu.
// ============================================================
import { prisma } from "@/lib/prisma";
import type { Ormas } from "@prisma/client";

export default async function BerandaPage() {
  // Ambil semua ormas yang statusnya AKTIF (sudah terverifikasi admin)
  // Ormas yang masih MENUNGGU_VERIFIKASI atau NONAKTIF tidak tampil ke publik.
  const daftarOrmas = await prisma.ormas.findMany({
    where: { status: "AKTIF" },
    orderBy: { nama: "asc" },
  });

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6">
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
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">
            Direktori Organisasi Kemasyarakatan
          </h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            {daftarOrmas.length} ormas terdaftar
          </span>
        </div>

        {daftarOrmas.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
            Belum ada data ormas aktif.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {daftarOrmas.map((ormas: Ormas) => (
              <div
                key={ormas.id}
                className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <span className="inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                  {ormas.kategori}
                </span>
                <h3 className="mt-2 text-base font-semibold text-zinc-900">
                  {ormas.nama}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">
                  Kemantren {ormas.kemantren}
                </p>
                <p className="mt-2 text-sm text-zinc-600">{ormas.alamat}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-xs text-zinc-400">
        &copy; {new Date().getFullYear()} Bakesbangpol Kota Yogyakarta — SIDOMAS
      </footer>
    </div>
  );
}
