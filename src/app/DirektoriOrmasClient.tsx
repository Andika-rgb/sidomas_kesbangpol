"use client";
// ============================================================
// Bagian "Direktori Organisasi Kemasyarakatan" di halaman publik
// ============================================================
// Dipisah jadi Client Component supaya dropdown filter kategori
// bisa langsung menyaring tampilan tanpa reload halaman (semua
// datanya sudah diambil sekali oleh Server Component di page.tsx,
// di sini cuma tinggal disaring dan ditampilkan ulang).
// ============================================================
import { useMemo, useState } from "react";
import { DAFTAR_KATEGORI_ORMAS } from "@/lib/konstanta";

export type OrmasRingkas = {
  id: string;
  kodeOrmas: string;
  nama: string;
  kategori: string;
  kemantren: string;
  logoUrl: string | null;
  namaKetua: string | null;
  namaSekretaris: string | null;
  namaBendahara: string | null;
};

export default function DirektoriOrmasClient({
  daftarOrmas,
}: {
  daftarOrmas: OrmasRingkas[];
}) {
  const [kategoriTerpilih, setKategoriTerpilih] = useState("Semua kategori");

  const kategoriTersedia = useMemo(() => {
    const adaIsinya = new Set(daftarOrmas.map((o) => o.kategori));
    return DAFTAR_KATEGORI_ORMAS.filter((k) => adaIsinya.has(k));
  }, [daftarOrmas]);

  const ormasTersaring = useMemo(() => {
    if (kategoriTerpilih === "Semua kategori") return daftarOrmas;
    return daftarOrmas.filter((o) => o.kategori === kategoriTerpilih);
  }, [daftarOrmas, kategoriTerpilih]);

  const berdasarkanKategori = useMemo(() => {
    const peta = new Map<string, OrmasRingkas[]>();
    for (const ormas of ormasTersaring) {
      const daftar = peta.get(ormas.kategori) ?? [];
      daftar.push(ormas);
      peta.set(ormas.kategori, daftar);
    }
    return peta;
  }, [ormasTersaring]);

  if (daftarOrmas.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        Belum ada data ormas aktif.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <span className="font-medium">Kategori:</span>
          <select
            value={kategoriTerpilih}
            onChange={(e) => setKategoriTerpilih(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          >
            <option>Semua kategori</option>
            {kategoriTersedia.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
          {ormasTersaring.length} ormas ditampilkan
        </span>
      </div>

      <div className="space-y-10">
        {DAFTAR_KATEGORI_ORMAS.filter((kategori) =>
          berdasarkanKategori.has(kategori)
        ).map((kategori) => (
          <div key={kategori}>
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-sm font-bold uppercase tracking-wide text-blue-900">
                {kategori}
              </h3>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                {berdasarkanKategori.get(kategori)!.length} ormas
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {berdasarkanKategori.get(kategori)!.map((ormas) => (
                <KartuOrmas key={ormas.id} ormas={ormas} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KartuOrmas({ ormas }: { ormas: OrmasRingkas }) {
  return (
    <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-xs font-medium text-blue-300">
        {ormas.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ormas.logoUrl}
            alt={`Logo ${ormas.nama}`}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          "Logo"
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-slate-900">{ormas.nama}</h4>
          <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-500">
            {ormas.kodeOrmas}
          </span>
        </div>
        <p className="text-sm text-slate-500">Kemantren {ormas.kemantren}</p>
        <dl className="mt-2 space-y-0.5 text-xs text-slate-600">
          {ormas.namaKetua && (
            <div>
              <span className="text-slate-400">Ketua:</span> {ormas.namaKetua}
            </div>
          )}
          {ormas.namaSekretaris && (
            <div>
              <span className="text-slate-400">Sekretaris:</span>{" "}
              {ormas.namaSekretaris}
            </div>
          )}
          {ormas.namaBendahara && (
            <div>
              <span className="text-slate-400">Bendahara:</span>{" "}
              {ormas.namaBendahara}
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
