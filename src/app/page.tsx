// ============================================================
// Halaman Beranda Publik - Katalog Ormas
// ============================================================
// Ini "Server Component" (halaman default di Next.js App Router).
// Artinya kode di sini jalan di SERVER (bukan di browser pengguna),
// jadi bisa langsung ambil data dari database dengan aman tanpa
// bikin API terpisah dulu.
//
// Catatan: Next.js 16 punya fitur "Cache Components" yang aktif
// secara default. Intinya: bagian halaman yang mengambil data HIDUP
// (misal query ke database, yang datanya bisa berubah sewaktu-waktu)
// harus dibungkus <Suspense> supaya Next.js tahu "bagian ini boleh
// nyusul dimuat belakangan, nggak perlu nunggu sebelum tampil ke
// pengguna". Itu kenapa daftar ormasnya kita pisah jadi komponen
// sendiri (DaftarOrmas) di bawah, bukan ditaruh langsung di halaman.
// ============================================================
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import type { Ormas } from "@prisma/client";

export default function BerandaPage() {
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
        <h2 className="mb-6 text-lg font-semibold text-zinc-900">
          Direktori Organisasi Kemasyarakatan
        </h2>

        <Suspense fallback={<KerangkaMemuat />}>
          <DaftarOrmas />
        </Suspense>
      </main>

      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-xs text-zinc-400">
        &copy; {new Date().getFullYear()} Bakesbangpol Kota Yogyakarta — SIDOMAS
      </footer>
    </div>
  );
}

// Tampilan sementara (placeholder) selagi data ormas masih diambil dari database.
function KerangkaMemuat() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {[1, 2, 3, 4].map((n) => (
        <div
          key={n}
          className="h-28 animate-pulse rounded-lg border border-zinc-200 bg-white"
        />
      ))}
    </div>
  );
}

// Komponen ini yang benar-benar mengambil data ke database.
// Karena dibungkus <Suspense> di atas, Next.js bisa menampilkan
// kerangka halaman (header, judul) secara instan, lalu bagian
// ini "menyusul" begitu datanya siap.
async function DaftarOrmas() {
  // Ambil semua ormas yang statusnya AKTIF (sudah terverifikasi admin)
  // Ormas yang masih MENUNGGU_VERIFIKASI atau NONAKTIF tidak tampil ke publik.
  const daftarOrmas = await prisma.ormas.findMany({
    where: { status: "AKTIF" },
    orderBy: { nama: "asc" },
  });

  return (
    <>
      <div className="mb-6 flex justify-end">
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
    </>
  );
}
