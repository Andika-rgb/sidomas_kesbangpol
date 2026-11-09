// ============================================================
// Admin - Daftar & Kelola Ormas
// ============================================================
import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Ormas, Dokumen } from "@prisma/client";
import { URUTAN_JENIS_DOKUMEN } from "@/lib/konstanta";

type OrmasDenganDokumen = Ormas & { dokumen: Dokumen[] };
import TombolLihatPassword from "./TombolLihatPassword";
import FilterKategori from "./FilterKategori";

export default function AdminDaftarOrmasPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs font-medium text-blue-200">
              <Link href="/admin" className="hover:text-white">
                &larr; Kembali ke Dashboard
              </Link>
            </p>
            <h1 className="text-lg font-bold text-white">Kelola Ormas</h1>
          </div>
          <Link
            href="/admin/ormas/baru"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-50"
          >
            + Tambah Ormas
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Suspense fallback={<p className="text-slate-500">Memuat...</p>}>
          <TabelOrmas searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}

async function TabelOrmas({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const kategoriAktif = kategori && kategori !== "Semua kategori" ? kategori : null;

  const daftarOrmas = await prisma.ormas.findMany({
    where: kategoriAktif ? { kategori: kategoriAktif } : undefined,
    orderBy: { kodeOrmas: "asc" },
    include: { dokumen: true },
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <FilterKategori kategoriAktif={kategoriAktif} />
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {daftarOrmas.length} ormas
        </span>
      </div>

      {daftarOrmas.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Belum ada ormas di kategori ini.{" "}
          <Link href="/admin/ormas/baru" className="text-blue-700 underline">
            + Tambah Ormas
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Kode</th>
                <th className="px-4 py-3">Nama Ormas</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Dokumen</th>
                <th className="px-4 py-3">Login Portal</th>
              </tr>
            </thead>
            <tbody>
              {daftarOrmas.map((ormas: OrmasDenganDokumen) => {
                const jumlahLengkap = ormas.dokumen.length;
                const totalWajib = URUTAN_JENIS_DOKUMEN.length;
                const sudahLengkap = jumlahLengkap >= totalWajib;

                return (
                  <tr
                    key={ormas.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600">
                        {ormas.kodeOrmas}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {ormas.nama}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                        {ormas.kategori}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          sudahLengkap
                            ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                            : "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
                        }
                      >
                        {jumlahLengkap}/{totalWajib} dokumen
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <TombolLihatPassword ormasId={ormas.id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
