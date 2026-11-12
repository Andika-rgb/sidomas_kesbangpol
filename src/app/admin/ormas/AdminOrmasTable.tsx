"use client";
import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  MagnifyingGlass,
  Eye,
  PencilSimple,
  Trash,
  CaretDown,
} from "@phosphor-icons/react";
import TombolLihatPassword from "./TombolLihatPassword";
import { hapusOrmasAction } from "./actions";

export type BarisOrmas = {
  id: string;
  kodeOrmas: string;
  nama: string;
  kategori: string;
  kemantren: string;
  logoUrl: string | null;
  status: string;
  tampilDiKatalog: boolean;
  namaKetua: string | null;
  namaSekretaris: string | null;
  namaBendahara: string | null;
  email: string;
  alamat: string;
  legalJenis: string | null;
  legalNomor: string | null;
  legalTahun: number | null;
  jumlahDokumen: number;
  totalWajib: number;
};

const SEMUA = "Semua";

export default function AdminOrmasTable({
  daftar,
  daftarKategori,
}: {
  daftar: BarisOrmas[];
  daftarKategori: readonly string[];
}) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState(SEMUA);
  const [statusDokumen, setStatusDokumen] = useState(SEMUA);
  const [dibuka, setDibuka] = useState<string | null>(null);

  const hasil = useMemo(() => {
    return daftar.filter((o) => {
      const cocokCari =
        o.nama.toLowerCase().includes(cari.toLowerCase()) ||
        o.kodeOrmas.toLowerCase().includes(cari.toLowerCase()) ||
        (o.namaKetua ?? "").toLowerCase().includes(cari.toLowerCase());
      const cocokKategori = kategori === SEMUA || o.kategori === kategori;
      const lengkap = o.jumlahDokumen >= o.totalWajib;
      const cocokStatus =
        statusDokumen === SEMUA ||
        (statusDokumen === "Lengkap" && lengkap) ||
        (statusDokumen === "Belum Lengkap" && !lengkap);
      return cocokCari && cocokKategori && cocokStatus;
    });
  }, [daftar, cari, kategori, statusDokumen]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <MagnifyingGlass
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-teks-redup"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Cari nama, ID, atau pengurus..."
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            className="w-full rounded-md border border-garis py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:border-navy focus:ring-1 focus:ring-navy"
          />
        </div>
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="rounded-md border border-garis bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        >
          <option value={SEMUA}>Semua kategori</option>
          {daftarKategori.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
        <select
          value={statusDokumen}
          onChange={(e) => setStatusDokumen(e.target.value)}
          className="rounded-md border border-garis bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        >
          <option value={SEMUA}>Semua status dokumen</option>
          <option>Lengkap</option>
          <option>Belum Lengkap</option>
        </select>
      </div>

      <p className="mb-3 text-xs text-teks-redup">
        Menampilkan {hasil.length} dari {daftar.length} ormas
      </p>

      {hasil.length === 0 ? (
        <div className="rounded-xl border border-dashed border-garis bg-white p-10 text-center text-teks-redup">
          Tidak ada ormas yang cocok.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-garis bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-garis bg-background text-left text-xs uppercase tracking-wide text-teks-redup">
              <tr>
                <th className="w-10 px-3 py-3"></th>
                <th className="px-2 py-3">Logo</th>
                <th className="px-2 py-3">ID Ormas</th>
                <th className="px-2 py-3">Nama Lengkap Ormas</th>
                <th className="px-2 py-3">Kategori</th>
                <th className="px-2 py-3">Pengurus</th>
                <th className="px-2 py-3">Status Dokumen</th>
                <th className="px-2 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {hasil.map((ormas) => (
                <BarisTabel
                  key={ormas.id}
                  ormas={ormas}
                  terbuka={dibuka === ormas.id}
                  onToggle={() =>
                    setDibuka((v) => (v === ormas.id ? null : ormas.id))
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function BarisTabel({
  ormas,
  terbuka,
  onToggle,
}: {
  ormas: BarisOrmas;
  terbuka: boolean;
  onToggle: () => void;
}) {
  const [sedangHapus, mulaiHapus] = useTransition();
  const lengkap = ormas.jumlahDokumen >= ormas.totalWajib;
  const inisial = ormas.nama
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0]?.toUpperCase())
    .join("");

  function hapus() {
    if (
      !confirm(
        `Yakin mau hapus "${ormas.nama}"? Semua dokumen & riwayatnya ikut terhapus dan tidak bisa dikembalikan.`
      )
    ) {
      return;
    }
    mulaiHapus(() => hapusOrmasAction(ormas.id));
  }

  return (
    <>
      <tr className="border-b border-garis last:border-0 hover:bg-background">
        <td className="px-3 py-3">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={terbuka}
            aria-label={`Lihat detail ${ormas.nama}`}
            className="text-teks-redup transition hover:text-navy"
          >
            <CaretDown
              size={16}
              weight="bold"
              className={terbuka ? "rotate-180 transition-transform" : "transition-transform"}
              aria-hidden="true"
            />
          </button>
        </td>
        <td className="px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-navy font-judul text-xs font-medium text-emas-terang">
            {ormas.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ormas.logoUrl}
                alt=""
                className="h-9 w-9 object-cover"
              />
            ) : (
              inisial || "?"
            )}
          </div>
        </td>
        <td className="px-2 py-3">
          <span className="rounded bg-background px-1.5 py-0.5 font-mono text-xs text-teks-redup">
            {ormas.kodeOrmas}
          </span>
        </td>
        <td className="px-2 py-3">
          <p className="font-medium text-foreground">{ormas.nama}</p>
          <p className="text-xs text-teks-redup">
            {ormas.status === "AKTIF" ? "Aktif" : ormas.status === "MENUNGGU_VERIFIKASI" ? "Menunggu Verifikasi" : "Nonaktif"}
            {" · "}
            {ormas.tampilDiKatalog ? "Tampil di katalog" : "Disembunyikan"}
          </p>
        </td>
        <td className="px-2 py-3">
          <span className="rounded-full bg-navy/10 px-2 py-0.5 text-xs text-navy">
            {ormas.kategori}
          </span>
        </td>
        <td className="px-2 py-3 text-xs text-[#6B6355]">
          {ormas.namaKetua && <div className="font-medium text-foreground">{ormas.namaKetua}</div>}
          {ormas.namaSekretaris && <div>{ormas.namaSekretaris}</div>}
          {ormas.namaBendahara && <div>{ormas.namaBendahara}</div>}
        </td>
        <td className="px-2 py-3">
          <span
            className={
              lengkap
                ? "rounded-full bg-sage-bg px-2 py-0.5 text-xs font-medium text-sage-teks"
                : "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
            }
          >
            {ormas.jumlahDokumen}/{ormas.totalWajib} dokumen
          </span>
        </td>
        <td className="px-2 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggle}
              title="Lihat detail"
              aria-label={`Lihat detail ${ormas.nama}`}
              className="rounded p-1.5 text-teks-redup transition hover:bg-background hover:text-navy"
            >
              <Eye size={16} aria-hidden="true" />
            </button>
            <Link
              href={`/admin/ormas/${ormas.id}/edit`}
              title="Edit ormas"
              aria-label={`Edit ${ormas.nama}`}
              className="rounded p-1.5 text-teks-redup transition hover:bg-background hover:text-navy"
            >
              <PencilSimple size={16} aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={hapus}
              disabled={sedangHapus}
              title="Hapus ormas"
              aria-label={`Hapus ${ormas.nama}`}
              className="rounded p-1.5 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
            >
              <Trash size={16} aria-hidden="true" />
            </button>
          </div>
        </td>
      </tr>
      {terbuka && (
        <tr className="border-b border-garis bg-background/60">
          <td colSpan={8} className="px-6 py-4">
            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
              <div>
                <p className="text-teks-redup">Email</p>
                <p className="text-foreground">{ormas.email}</p>
              </div>
              <div>
                <p className="text-teks-redup">Kemantren</p>
                <p className="text-foreground">{ormas.kemantren}</p>
              </div>
              <div>
                <p className="text-teks-redup">Legal Standing</p>
                <p className="text-foreground">
                  {ormas.legalJenis
                    ? `${ormas.legalJenis} ${ormas.legalNomor ?? ""} / ${ormas.legalTahun ?? "-"}`
                    : "Belum diisi"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-teks-redup">Alamat</p>
                <p className="text-foreground">{ormas.alamat}</p>
              </div>
              <div>
                <p className="mb-1 text-teks-redup">Login Portal</p>
                <TombolLihatPassword ormasId={ormas.id} />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
