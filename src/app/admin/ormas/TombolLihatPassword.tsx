"use client";
// ============================================================
// Tombol "Lihat Password Hari Ini" di daftar ormas (khusus admin)
// ============================================================
// Komponen client kecil ini manggil Server Action langsung sebagai
// fungsi biasa (tanpa <form>), lalu tampilkan hasilnya di layar
// tanpa reload halaman. Sengaja tidak langsung ditampilkan dari
// awal (harus diklik dulu), supaya kalau ada orang lain lihat layar
// admin secara sekilas, password-nya tidak langsung kelihatan.
// ============================================================
import { useState } from "react";
import { lihatPasswordHariIniAction } from "./actions";

export default function TombolLihatPassword({
  ormasId,
}: {
  ormasId: string;
}) {
  const [info, setInfo] = useState<string | null>(null);
  const [memuat, setMemuat] = useState(false);

  async function lihat() {
    setMemuat(true);
    const hasil = await lihatPasswordHariIniAction(ormasId);
    setMemuat(false);
    if ("error" in hasil) {
      setInfo(hasil.error);
      return;
    }
    setInfo(`${hasil.username} / ${hasil.password}`);
  }

  if (info) {
    return (
      <span className="font-mono text-xs text-emerald-700">{info}</span>
    );
  }

  return (
    <button
      type="button"
      onClick={lihat}
      disabled={memuat}
      className="text-xs font-medium text-emerald-700 underline hover:text-emerald-800"
    >
      {memuat ? "Memuat..." : "Lihat password hari ini"}
    </button>
  );
}
