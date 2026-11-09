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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
            ✓
          </div>
          <p className="font-semibold text-slate-900">
            Ormas berhasil ditambahkan
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Username &amp; password login portal bisa dilihat admin di
            halaman daftar ormas.
          </p>
          <Link
            href="/admin/ormas"
            className="mt-4 inline-block rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Kembali ke Daftar Ormas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium text-blue-800">
          <Link href="/admin/ormas" className="hover:text-blue-900">
            &larr; Batal, kembali
          </Link>
        </p>
        <h1 className="mt-1 text-xl font-bold text-slate-900">
          Tambah Ormas Baru
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Kode ormas &amp; username login portal akan dibuat otomatis oleh
          sistem.
        </p>

        <form action={formAction} className="mt-8 space-y-8">
          <SeksiForm judul="Identitas Ormas">
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
              <KolomTeks
                label="Bentuk"
                name="bentuk"
                placeholder="Perkumpulan"
              />
              <KolomTeks label="Bidang Kegiatan" name="bidangKegiatan" />
            </div>
          </SeksiForm>

          <SeksiForm judul="Nama Pengurus Inti">
            <div className="grid grid-cols-2 gap-4">
              <KolomTeks label="Nama Ketua" name="namaKetua" />
              <KolomTeks label="Nama Sekretaris" name="namaSekretaris" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <KolomTeks label="Nama Bendahara" name="namaBendahara" />
              <KolomTeks
                label="No. WA Ketua"
                name="nomorWaKetua"
                placeholder="081234567890"
              />
            </div>
          </SeksiForm>

          <SeksiForm judul="Kontak & Alamat">
            <KolomTeks
              label="Email Ormas *"
              name="email"
              type="email"
              required
            />
            <KolomTextarea
              label="Alamat Kantor/Sekretariat *"
              name="alamat"
              required
            />
          </SeksiForm>

          <SeksiForm judul="Catatan & Visibilitas">
            <KolomTextarea
              label="Catatan Verifikasi (opsional)"
              name="catatanVerifikasi"
            />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="tampilDiKatalog"
                defaultChecked
                className="rounded border-slate-300 text-blue-700 focus:ring-blue-700"
              />
              Tampilkan di katalog publik
            </label>
          </SeksiForm>

          {state.error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={sedangMemproses}
            className="w-full rounded-md bg-blue-900 py-2.5 text-sm font-medium text-white transition hover:bg-blue-800 disabled:opacity-60"
          >
            {sedangMemproses ? "Menyimpan..." : "Simpan Ormas"}
          </button>
        </form>
      </div>
    </div>
  );
}

function SeksiForm({
  judul,
  children,
}: {
  judul: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-4 border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-wide text-blue-900">
        {judul}
      </h2>
      <div className="space-y-4">{children}</div>
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
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
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
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        name={name}
        required={required}
        rows={2}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
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
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
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
