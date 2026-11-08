"use client";
import { useActionState } from "react";
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
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <p className="text-emerald-600">✓ Ormas berhasil ditambahkan.</p>
          <p className="mt-2 text-sm text-zinc-500">
            Username &amp; password login portal bisa dilihat admin di
            halaman daftar ormas.
          </p>
          <Link
            href="/admin/ormas"
            className="mt-4 inline-block rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Kembali ke Daftar Ormas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium text-emerald-700">
          <Link href="/admin/ormas">&larr; Batal, kembali</Link>
        </p>
        <h1 className="mt-1 text-xl font-bold text-zinc-900">
          Tambah Ormas Baru
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Kode ormas &amp; username login portal akan dibuat otomatis oleh
          sistem.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <KolomTeks label="Nama Ormas *" name="nama" required />

          <div className="grid grid-cols-2 gap-4">
            <KolomSelect
              label="Kategori *"
              name="kategori"
              required
              opsi={DAFTAR_KATEGORI_ORMAS}
            />
            <KolomSelect
              label="Kemantren *"
              name="kemantren"
              required
              opsi={DAFTAR_KEMANTREN}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <KolomTeks label="Bentuk" name="bentuk" placeholder="Perkumpulan" />
            <KolomTeks label="Bidang Kegiatan" name="bidangKegiatan" />
          </div>

          <KolomTeks label="Email Ormas *" name="email" type="email" required />
          <KolomTextarea label="Alamat Kantor/Sekretariat *" name="alamat" required />

          <div className="border-t border-zinc-200 pt-4">
            <p className="mb-3 text-sm font-semibold text-zinc-700">
              Pengurus Inti
            </p>
            <div className="grid grid-cols-2 gap-4">
              <KolomTeks label="Nama Ketua" name="namaKetua" />
              <KolomTeks label="Nama Sekretaris" name="namaSekretaris" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <KolomTeks label="Nama Bendahara" name="namaBendahara" />
              <KolomTeks
                label="No. WA Ketua"
                name="nomorWaKetua"
                placeholder="081234567890"
              />
            </div>
          </div>

          <KolomTextarea label="Catatan Verifikasi (opsional)" name="catatanVerifikasi" />

          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              name="tampilDiKatalog"
              defaultChecked
              className="rounded border-zinc-300"
            />
            Tampilkan di katalog publik
          </label>

          {state.error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={sedangMemproses}
            className="w-full rounded-md bg-emerald-600 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {sedangMemproses ? "Menyimpan..." : "Simpan Ormas"}
          </button>
        </form>
      </div>
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
      <label className="mb-1 block text-sm font-medium text-zinc-700">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      />
    </div>
  );
}

function KolomTextarea({
  label,
  name,
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-700">
        {label}
      </label>
      <textarea
        name={name}
        required={required}
        rows={2}
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      />
    </div>
  );
}

function KolomSelect({
  label,
  name,
  required,
  opsi,
}: {
  label: string;
  name: string;
  required?: boolean;
  opsi: readonly string[];
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-700">
        {label}
      </label>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      >
        <option value="" disabled>
          Pilih...
        </option>
        {opsi.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
