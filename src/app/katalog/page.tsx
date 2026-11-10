import { prisma } from "@/lib/prisma";
import PublicHeader from "../PublicHeader";
import KatalogFilter from "./KatalogFilter";

export default async function KatalogOrmasPage() {
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
    <div className="min-h-screen bg-background">
      <PublicHeader halamanAktif="katalog" />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-1 font-judul text-xl font-bold text-foreground">
          Katalog Organisasi Kemasyarakatan
        </h1>
        <p className="mb-6 text-sm text-teks-redup">
          {daftarOrmas.length} ormas terdaftar dan aktif di Kota Yogyakarta.
        </p>
        <KatalogFilter daftarOrmas={daftarOrmas} />
      </main>
    </div>
  );
}
