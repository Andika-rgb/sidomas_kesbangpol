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
    <div className="min-h-screen bg-background">
      <header className="bg-navy">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs font-medium text-[#B9C2D4]">
              <Link href="/admin" className="hover:text-white">
                &larr; Kembali ke Dashboard
              </Link>
            </p>
            <h1 className="font-judul text-lg font-bold text-white">
              Kelola Ormas
            </h1>
          </div>
          <Link
            href="/admin/ormas/baru"
            className="rounded-md bg-emas px-4 py-2 text-sm font-medium text-navy hover:brightness-110"
          >
            + Tambah Ormas
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Suspense fallback={<p className="text-teks-redup">Memuat...</p>}>
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
        <span className="rounded-full bg-navy/10 px-3 py-1 text-xs font-medium text-navy">
          {daftarOrmas.length} ormas
        </span>
      </div>

      {daftarOrmas.length === 0 ? (
        <div className="rounded-xl border border-dashed border-garis bg-white p-10 text-center text-teks-redup">
          Belum ada ormas di kategori ini.{" "}
          <Link href="/admin/ormas/baru" className="text-navy underline">
            + Tambah Ormas
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-garis bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-garis bg-background text-left text-xs uppercase tracking-wide text-teks-redup">
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
                    className="border-b border-garis last:border-0 hover:bg-background"
                  >
                    <td className="px-4 py-3">
                      <span className="rounded bg-background px-1.5 py-0.5 font-mono text-xs text-teks-redup">
                        {ormas.kodeOrmas}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {ormas.nama}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-navy/10 px-2 py-0.5 text-xs text-navy">
                        {ormas.kategori}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          sudahLengkap
                            ? "rounded-full bg-sage-bg px-2 py-0.5 text-xs font-medium text-sage-teks"
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
