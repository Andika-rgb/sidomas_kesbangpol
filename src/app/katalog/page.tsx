import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import PublicHeader from "../PublicHeader";
import KatalogFilter from "./KatalogFilter";

export default function KatalogOrmasPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader halamanAktif="katalog" />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-1 font-judul text-xl font-bold text-foreground">
          Katalog Organisasi Kemasyarakatan
        </h1>
        <Suspense fallback={<KerangkaKatalog />}>
          <IsiKatalog />
        </Suspense>
      </main>
    </div>
  );
}

function KerangkaKatalog() {
  return (
    <div>
      <div className="mb-6 h-10 w-full animate-pulse rounded-md bg-garis/40" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="h-24 animate-pulse rounded-lg border border-garis bg-white"
          />
        ))}
      </div>
    </div>
  );
}

async function IsiKatalog() {
  const daftarOrmas = await prisma.ormas.findMany({
    where: { status: "AKTIF", tampilDiKatalog: true },
    orderBy: { nama: "asc" },
    select: {
      id: true,
      nama: true,
      kategori: true,
      kemantren: true,
      logoUrl: true,
      namaKetua: true,
      namaSekretaris: true,
      namaBendahara: true,
    },
  });

  return (
    <>
      <p className="mb-6 text-sm text-teks-redup">
        {daftarOrmas.length} ormas terdaftar dan aktif di Kota Yogyakarta.
      </p>
      <KatalogFilter daftarOrmas={daftarOrmas} />
    </>
  );
}
