"use client";
import { useActionState, type ReactNode } from "react";
import Link from "next/link";
import { tambahOrmasAction, type HasilTambahOrmas } from "../actions";
import { DAFTAR_KATEGORI_ORMAS, DAFTAR_KEMANTREN } from "@/lib/konstanta";

const kondisiAwal: HasilTambahOrmas = {};

export default function HalamanTambahOrmas() {
  const [state, formAction, sedangMemproses] = useActionState(
    tambahOrmasAction,
    kondisiAwal
  );

  if (state.sukses) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-xl border border-garis bg-white p-8 text-center">
          <p className="font-judul font-medium text-sage-teks">
            ✓ Ormas berhasil ditambahkan.
          </p>
          <p className="mt-2 text-sm text-teks-redup">
            Username &amp; password login portal bisa dilihat admin di
            halaman daftar ormas.
          </p>
          <Link
            href="/admin/ormas"
            className="mt-4 inline-block rounded-md bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-terang"
          >
            Kembali ke Daftar Ormas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl border border-garis bg-white p-8">
        <p className="text-xs font-medium text-navy">
          <Link href="/admin/ormas">&larr; Batal, kembali</Link>
        </p>
        <h1 className="mt-1 font-judul text-xl font-bold text-foreground">
          Tambah Ormas Baru
        </h1>
        <p className="mt-1 text-sm text-teks-redup">
          Kode ormas &amp; username login portal akan dibuat otomatis oleh
          sistem.
        </p>

        <form action={formAction} className="mt-6 space-y-6">
          {/* Identitas Ormas */}
          <JudulSeksi>Identitas Ormas</JudulSeksi>
          <div className="grid grid-cols-2 gap-4">
            <KolomTeks label="Nama Ormas *" name="nama" required />
            <KolomFile
              label="Logo Ormas (opsional)"
              name="logo"
              catatan="Aktif setelah Google Drive tersambung"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <KolomSelect
              label="Bidang / Kategori *"
              name="kategori"
              required
              opsi={DAFTAR_KATEGORI_ORMAS}
            />
            <KolomTeks label="Bentuk" name="bentuk" placeholder="Mis. Perkumpulan, Yayasan" />
          </div>
          <KolomTeks
            label="Bidang Kegiatan"
            name="bidangKegiatan"
            placeholder=""
          />
          <div className="grid grid-cols-2 gap-4">
            <KolomTeks
              label="Keterangan Validasi"
              name="keteranganValidasi"
              placeholder="Mis. Valid / tanggal validasi"
            />
            <KolomSelect
              label="Kemantren *"
              name="kemantren"
              required
              opsi={DAFTAR_KEMANTREN}
            />
          </div>

          {/* Pengurus */}
          <JudulSeksi>Nama Pengurus</JudulSeksi>
          <div className="grid grid-cols-2 gap-4">
            <KolomTeks label="Ketua" name="namaKetua" />
            <KolomTeks label="Sekretaris" name="namaSekretaris" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <KolomTeks label="Bendahara" name="namaBendahara" />
            <KolomTeks
              label="Nomor Telepon / WhatsApp Ketua"
              name="nomorWaKetua"
              placeholder="081234567890"
            />
          </div>

          {/* Kontak dan Alamat */}
          <JudulSeksi>Kontak dan Alamat</JudulSeksi>
          <KolomTeks
            label="Email Ormas *"
            name="email"
            type="email"
            required
            placeholder="nama@contoh.id"
          />
          <KolomTextarea
            label="Alamat Kantor / Sekretariat *"
            name="alamat"
            required
            catatan="Tulis selengkap mungkin, dipakai untuk peta di halaman publik"
          />

          {/* Legal Standing */}
          <JudulSeksi>Legal Standing</JudulSeksi>
          <div className="grid grid-cols-2 gap-4">
            <KolomTeks label="Jenis" name="legalJenis" placeholder="Mis. Akta Notaris" />
            <KolomTeks label="Nomor" name="legalNomor" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <KolomTeks label="Tahun" name="legalTahun" type="number" placeholder="2021" />
            <KolomTeks
              label="Berlaku s/d"
              name="legalBerlakuSd"
              placeholder="Mis. 2026 / Seumur hidup"
            />
          </div>

          {/* SKTO */}
          <JudulSeksi>SKTO</JudulSeksi>
          <div className="grid grid-cols-2 gap-4">
            <KolomTeks label="Nomor" name="sktoNomor" />
            <KolomTeks label="Tahun" name="sktoTahun" type="number" placeholder="2024" />
          </div>
          <KolomTeks label="Berlaku s/d" name="sktoBerlakuSd" />

          {/* Status */}
          <JudulSeksi>Status</JudulSeksi>
          <div className="grid grid-cols-2 gap-4">
            <KolomSelect
              label="Status Operasional"
              name="status"
              opsi={["AKTIF", "MENUNGGU_VERIFIKASI", "NONAKTIF"]}
              nilaiAwal="AKTIF"
              labelOpsi={{
                AKTIF: "Aktif",
                MENUNGGU_VERIFIKASI: "Menunggu Verifikasi",
                NONAKTIF: "Nonaktif",
              }}
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Status Publikasi Katalog
              </label>
              <label className="flex h-[38px] items-center gap-2 rounded-md border border-garis px-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  name="tampilDiKatalog"
                  defaultChecked
                  className="rounded border-garis accent-navy"
                />
                Tampilkan di katalog publik
              </label>
            </div>
          </div>
          <KolomTextarea
            label="Catatan Verifikasi (opsional)"
            name="catatanVerifikasi"
          />

          {/* Dokumen PDF -- menyusul setelah Google Drive tersambung */}
          <JudulSeksi>Dokumen PDF Wajib (maks. 1 MB per file)</JudulSeksi>
          <p className="-mt-3 text-xs text-teks-redup">
            Upload dokumen untuk ormas ini baru bisa dipakai setelah Google
            Drive tersambung ke sistem (langkah berikutnya) — ormas juga bisa
            upload sendiri lewat portalnya setelah itu.
          </p>
          <div className="grid grid-cols-2 gap-4 opacity-50">
            <KolomFile label="SK Pengurusan *" name="dok_sk_pengurusan" catatan="Wajib diunggah" nonaktif />
            <KolomFile label="Surat Keterangan Domisili *" name="dok_sk_domisili" catatan="Wajib diunggah" nonaktif />
            <KolomFile label="Program Kerja *" name="dok_program_kerja" catatan="Wajib diunggah" nonaktif />
            <KolomFile label="Salinan Badan Hukum *" name="dok_badan_hukum" catatan="Wajib diunggah" nonaktif />
            <KolomFile label="SKTO *" name="dok_skto" catatan="Wajib diunggah" nonaktif />
          </div>

          {state.error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-garis pt-4">
            <Link
              href="/admin/ormas"
              className="rounded-md px-4 py-2 text-sm font-medium text-teks-redup hover:bg-background"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={sedangMemproses}
              className="rounded-md bg-navy px-5 py-2 text-sm font-medium text-white transition hover:bg-navy-terang disabled:opacity-60"
            >
              {sedangMemproses ? "Menyimpan..." : "Simpan Ormas"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function JudulSeksi({ children }: { children: ReactNode }) {
  return (
    <div className="border-t border-garis pt-4 first:border-t-0 first:pt-0">
      <p className="font-judul text-sm font-medium text-navy">{children}</p>
    </div>
  );
}

function KolomTeks({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-md border border-garis px-3 py-2 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
      />
    </div>
  );
}

function KolomTextarea({
  label,
  name,
  required,
  catatan,
}: {
  label: string;
  name: string;
  required?: boolean;
  catatan?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground">
        {label}
      </label>
      <textarea
        name={name}
        required={required}
        rows={2}
        className="w-full rounded-md border border-garis px-3 py-2 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
      />
      {catatan && <p className="mt-1 text-xs text-teks-redup">{catatan}</p>}
    </div>
  );
}

function KolomSelect({
  label,
  name,
  required,
  opsi,
  nilaiAwal = "",
  labelOpsi,
}: {
  label: string;
  name: string;
  required?: boolean;
  opsi: readonly string[];
  nilaiAwal?: string;
  labelOpsi?: Record<string, string>;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        name={name}
        required={required}
        defaultValue={nilaiAwal}
        className="w-full rounded-md border border-garis bg-white px-3 py-2 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
      >
        {!nilaiAwal && (
          <option value="" disabled>
            Pilih...
          </option>
        )}
        {opsi.map((o) => (
          <option key={o} value={o}>
            {labelOpsi?.[o] ?? o}
          </option>
        ))}
      </select>
    </div>
  );
}

function KolomFile({
  label,
  name,
  catatan,
  nonaktif,
}: {
  label: string;
  name: string;
  catatan?: string;
  nonaktif?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        name={name}
        type="file"
        accept={nonaktif ? undefined : "image/*"}
        disabled={nonaktif}
        className="w-full rounded-md border border-garis px-3 py-2 text-sm text-foreground file:mr-3 file:rounded file:border-0 file:bg-background file:px-3 file:py-1 file:text-xs disabled:cursor-not-allowed"
      />
      {catatan && <p className="mt-1 text-xs text-teks-redup">{catatan}</p>}
    </div>
  );
}
