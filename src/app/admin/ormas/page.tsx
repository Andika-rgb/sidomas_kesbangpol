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

export default function AdminDaftarOrmasPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-medium text-emerald-700">
              <Link href="/admin">&larr; Kembali ke Dashboard</Link>
            </p>
            <h1 className="text-lg font-bold text-zinc-900">Kelola Ormas</h1>
          </div>
          <Link
            href="/admin/ormas/baru"
            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            + Tambah Ormas
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Suspense fallback={<p className="text-zinc-500">Memuat...</p>}>
          <TabelOrmas />
        </Suspense>
      </main>
    </div>
  );
}

async function TabelOrmas() {
  const daftarOrmas = await prisma.ormas.findMany({
    orderBy: { kodeOrmas: "asc" },
    include: { dokumen: true },
  });

  if (daftarOrmas.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
        Belum ada ormas. Klik &quot;+ Tambah Ormas&quot; untuk mulai.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase text-zinc-500">
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
              <tr key={ormas.id} className="border-b border-zinc-100">
                <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                  {ormas.kodeOrmas}
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900">
                  {ormas.nama}
                </td>
                <td className="px-4 py-3 text-zinc-600">{ormas.kategori}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      sudahLengkap
                        ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700"
                        : "rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700"
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
  );
}
