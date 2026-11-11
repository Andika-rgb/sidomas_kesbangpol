// ============================================================
// Admin - Daftar & Kelola Ormas
// ============================================================
import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Ormas, Dokumen } from "@prisma/client";
import { DAFTAR_KATEGORI_ORMAS, URUTAN_JENIS_DOKUMEN } from "@/lib/konstanta";
import AdminOrmasTable, { type BarisOrmas } from "./AdminOrmasTable";

export default function AdminDaftarOrmasPage() {
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
          <IsiTabel />
        </Suspense>
      </main>
    </div>
  );
}

async function IsiTabel() {
  const daftarOrmas = await prisma.ormas.findMany({
    orderBy: { kodeOrmas: "asc" },
    include: { dokumen: true },
  });

  const totalWajib = URUTAN_JENIS_DOKUMEN.length;
  const baris: BarisOrmas[] = daftarOrmas.map(
    (ormas: Ormas & { dokumen: Dokumen[] }) => ({
      id: ormas.id,
      kodeOrmas: ormas.kodeOrmas,
      nama: ormas.nama,
      kategori: ormas.kategori,
      kemantren: ormas.kemantren,
      logoUrl: ormas.logoUrl,
      status: ormas.status,
      tampilDiKatalog: ormas.tampilDiKatalog,
      namaKetua: ormas.namaKetua,
      namaSekretaris: ormas.namaSekretaris,
      namaBendahara: ormas.namaBendahara,
      email: ormas.email,
      alamat: ormas.alamat,
      legalJenis: ormas.legalJenis,
      legalNomor: ormas.legalNomor,
      legalTahun: ormas.legalTahun,
      jumlahDokumen: ormas.dokumen.length,
      totalWajib,
    })
  );

  return <AdminOrmasTable daftar={baris} daftarKategori={DAFTAR_KATEGORI_ORMAS} />;
}
