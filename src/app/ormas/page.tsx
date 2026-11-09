// ============================================================
// Dashboard Portal Ormas
// ============================================================
import { Suspense } from "react";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { Dokumen } from "@prisma/client";
import { verifikasiTokenSesiOrmas, NAMA_COOKIE_SESI_ORMAS } from "@/lib/ormas-auth";
import { logoutOrmasAction } from "./logout/actions";
import {
  BATAS_UKURAN_PDF_BYTE,
  LABEL_JENIS_DOKUMEN,
  URUTAN_JENIS_DOKUMEN,
} from "@/lib/konstanta";
import UploadDokumenForm from "./UploadDokumenForm";

export default function DashboardOrmasPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs font-medium text-blue-200">SIDOMAS</p>
            <h1 className="text-lg font-bold text-white">Portal Ormas</h1>
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
        <div key={n} className="h-16 animate-pulse rounded-xl bg-slate-200" />
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
        <p className="text-sm font-medium text-white">{sesi?.nama}</p>
        <p className="text-xs text-blue-200">{sesi?.kodeOrmas}</p>
      </div>
      <form action={logoutOrmasAction}>
        <button
          type="submit"
          className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white transition hover:bg-white/20"
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

  const jumlahLengkap = petaDokumen.size;
  const totalWajib = URUTAN_JENIS_DOKUMEN.length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            5 Dokumen Wajib
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Format PDF, maksimal {Math.round(BATAS_UKURAN_PDF_BYTE / 1024)} KB
            per file.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
          🔒 Terbatas: hanya ormas ini &amp; admin yang bisa melihat
        </span>
      </div>

      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${(jumlahLengkap / totalWajib) * 100}%` }}
        />
      </div>
      <p className="mb-6 text-xs text-slate-500">
        {jumlahLengkap}/{totalWajib} dokumen sudah diunggah
      </p>

      <div className="space-y-3">
        {URUTAN_JENIS_DOKUMEN.map((jenis) => {
          const dokumen = petaDokumen.get(jenis);
          return (
            <div
              key={jenis}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div
                  className={
                    dokumen
                      ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
                      : "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400"
                  }
                >
                  📄
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
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
              </div>
              <UploadDokumenForm jenis={jenis} sudahAda={Boolean(dokumen)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
