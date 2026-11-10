"use client";
import { useMemo, useState } from "react";
import { DAFTAR_KATEGORI_ORMAS } from "@/lib/konstanta";

type Ormas = {
  id: string;
  nama: string;
  kategori: string;
  kemantren: string;
  logoUrl: string | null;
  namaKetua: string | null;
  namaSekretaris: string | null;
  namaBendahara: string | null;
};

const SEMUA_KATEGORI = "Semua kategori";

export default function KatalogFilter({
  daftarOrmas,
}: {
  daftarOrmas: Ormas[];
}) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState(SEMUA_KATEGORI);

  const hasil = useMemo(() => {
    return daftarOrmas.filter((o) => {
      const cocokKategori =
        kategori === SEMUA_KATEGORI || o.kategori === kategori;
      const cocokCari = o.nama.toLowerCase().includes(cari.toLowerCase());
      return cocokKategori && cocokCari;
    });
  }, [daftarOrmas, cari, kategori]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Cari nama ormas..."
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          className="min-w-[200px] flex-1 rounded-md border border-garis px-3 py-2 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        />
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="rounded-md border border-garis bg-white px-3 py-2 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        >
          <option>{SEMUA_KATEGORI}</option>
          {DAFTAR_KATEGORI_ORMAS.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </div>

      <p className="mb-4 text-xs text-teks-redup">
        Menampilkan {hasil.length} dari {daftarOrmas.length} ormas
      </p>

      {hasil.length === 0 ? (
        <div className="rounded-lg border border-dashed border-garis bg-white p-10 text-center text-teks-redup">
          Tidak ada ormas yang cocok dengan pencarian ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {hasil.map((ormas) => (
            <KartuOrmas key={ormas.id} ormas={ormas} />
          ))}
        </div>
      )}
    </div>
  );
}

function KartuOrmas({ ormas }: { ormas: Ormas }) {
  const inisial = ormas.nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((kata) => kata[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex gap-4 rounded-lg border border-garis bg-white p-5 transition hover:border-emas">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy font-judul text-sm font-medium text-emas-terang">
        {ormas.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ormas.logoUrl}
            alt={`Logo ${ormas.nama}`}
            className="h-12 w-12 object-cover"
          />
        ) : (
          inisial || "?"
        )}
      </div>
      <div>
        <span className="mb-1 inline-block rounded bg-navy px-2 py-0.5 text-[10px] font-medium text-emas-terang">
          {ormas.kategori}
        </span>
        <h4 className="font-judul font-medium text-foreground">
          {ormas.nama}
        </h4>
        <p className="text-xs text-teks-redup">Kemantren {ormas.kemantren}</p>
        <dl className="mt-2 space-y-0.5 text-xs text-[#6B6355]">
          {ormas.namaKetua && (
            <div>
              <span className="text-teks-redup">Ketua:</span>{" "}
              {ormas.namaKetua}
            </div>
          )}
          {ormas.namaSekretaris && (
            <div>
              <span className="text-teks-redup">Sekretaris:</span>{" "}
              {ormas.namaSekretaris}
            </div>
          )}
          {ormas.namaBendahara && (
            <div>
              <span className="text-teks-redup">Bendahara:</span>{" "}
              {ormas.namaBendahara}
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
