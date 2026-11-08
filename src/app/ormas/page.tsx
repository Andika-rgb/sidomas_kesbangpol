// ============================================================
// Dashboard Portal Ormas
// ============================================================
// Di sinilah tiap ormas nanti upload 5 dokumen wajibnya sendiri.
// Catatan: tombol upload masih "nonaktif sementara" karena
// penyimpanan filenya (Google Drive) belum kita sambungkan --
// itu langkah berikutnya. Kerangka halaman & datanya sudah jalan.
// ============================================================
import { Suspense } from "react";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { Dokumen } from "@prisma/client";
import { verifikasiTokenSesiOrmas, NAMA_COOKIE_SESI_ORMAS } from "@/lib/ormas-auth";
import { logoutOrmasAction } from "./logout/actions";
import {
  LABEL_JENIS_DOKUMEN,
  URUTAN_JENIS_DOKUMEN,
} from "@/lib/konstanta";

export default function DashboardOrmasPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-medium text-emerald-700">SIDOMAS</p>
            <h1 className="text-lg font-bold text-zinc-900">Portal Ormas</h1>
          </div>
          <Suspense fallback={null}>
            <InfoOrmasDanLogout />
          </Suspense>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Suspense fallback={<KerangkaMemuat />}>
          <DaftarDokumenOrmas />
        </Suspense>
      </main>
    </div>
  );
}

function KerangkaMemuat() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} className="h-16 animate-pulse rounded-lg bg-zinc-200" />
      ))}
    </div>
  );
}

async function InfoOrmasDanLogout() {
  const cookieStore = await cookies();
  const token = cookieStore.get(NAMA_COOKIE_SESI_ORMAS)?.value;
  const sesi = token ? await verifikasiTokenSesiOrmas(token) : null;

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium text-zinc-900">{sesi?.nama}</p>
        <p className="text-xs text-zinc-500">{sesi?.kodeOrmas}</p>
      </div>
      <form action={logoutOrmasAction}>
        <button
          type="submit"
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-100"
        >
          Logout
        </button>
      </form>
    </div>
  );
}

async function DaftarDokumenOrmas() {
  const cookieStore = await cookies();
  const token = cookieStore.get(NAMA_COOKIE_SESI_ORMAS)?.value;
  const sesi = token ? await verifikasiTokenSesiOrmas(token) : null;

  if (!sesi) {
    return (
      <p className="text-sm text-red-600">
        Sesi tidak valid, silakan login ulang.
      </p>
    );
  }

  const dokumenTersimpan = await prisma.dokumen.findMany({
    where: { ormasId: sesi.ormasId },
  });
  const petaDokumen = new Map<string, Dokumen>(
    dokumenTersimpan.map((d: Dokumen) => [d.jenis, d])
  );

  return (
    <div>
      <h2 className="mb-1 text-lg font-semibold text-zinc-900">
        5 Dokumen Wajib
      </h2>
      <p className="mb-6 text-sm text-zinc-500">
        Format PDF, maksimal 1 MB per file. Dokumen ini hanya bisa dilihat
        oleh ormas kamu sendiri dan admin Bakesbangpol.
      </p>

      <div className="space-y-3">
        {URUTAN_JENIS_DOKUMEN.map((jenis) => {
          const dokumen = petaDokumen.get(jenis);
          return (
            <div
              key={jenis}
              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4"
            >
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {LABEL_JENIS_DOKUMEN[jenis]}
                </p>
                {dokumen ? (
                  <p className="text-xs text-emerald-600">
                    Sudah diunggah &middot; {dokumen.namaFile}
                  </p>
                ) : (
                  <p className="text-xs text-red-500">Belum diunggah</p>
                )}
              </div>
              <button
                type="button"
                disabled
                title="Fitur upload akan aktif setelah Google Drive tersambung"
                className="cursor-not-allowed rounded-md bg-zinc-200 px-3 py-1.5 text-sm text-zinc-500"
              >
                Upload (segera)
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
