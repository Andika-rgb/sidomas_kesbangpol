"use client";
// ============================================================
// Tombol "Lihat Password Hari Ini" di daftar ormas (khusus admin)
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
      <span className="rounded bg-sage-bg px-2 py-1 font-mono text-xs font-medium text-sage-teks">
        {info}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={lihat}
      disabled={memuat}
      className="text-xs font-medium text-navy underline hover:text-navy-terang"
    >
      {memuat ? "Memuat..." : "Lihat password hari ini"}
    </button>
  );
}
