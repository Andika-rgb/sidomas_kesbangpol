"use client";
// Dropdown filter kategori kecil. "use client" karena butuh onChange
// (submit form otomatis saat kategori dipilih) -- interaktivitas
// seperti ini tidak bisa langsung ditulis di Server Component.
import { DAFTAR_KATEGORI_ORMAS } from "@/lib/konstanta";

export default function FilterKategori({
  kategoriAktif,
}: {
  kategoriAktif: string | null;
}) {
  return (
    <form className="flex items-center gap-2 text-sm text-teks-redup">
      <span className="font-medium">Kategori:</span>
      <select
        name="kategori"
        defaultValue={kategoriAktif ?? "Semua kategori"}
        onChange={(e) => e.currentTarget.form?.submit()}
        className="rounded-md border border-garis bg-white px-3 py-1.5 text-sm text-foreground outline-none focus:border-navy focus:ring-1 focus:ring-navy"
      >
        <option>Semua kategori</option>
        {DAFTAR_KATEGORI_ORMAS.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
    </form>
  );
}
