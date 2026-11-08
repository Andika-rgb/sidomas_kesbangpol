// ============================================================
// Perhitungan password HARIAN ormas (pakai node:crypto)
// ============================================================
// Sengaja dipisah dari src/lib/ormas-auth.ts!
//
// Kenapa? Karena src/proxy.ts (penjaga pintu /admin & /ormas)
// jalan di lingkungan terbatas bernama "Edge Runtime" di Vercel,
// yang TIDAK mendukung modul node:crypto. Kalau fungsi di file
// ini digabung ke ormas-auth.ts (yang dipakai proxy.ts), seluruh
// proxy akan CRASH setiap kali ada yang buka halaman admin/ormas.
//
// Jadi: file ini HANYA boleh dipakai di Server Action (actions.ts),
// JANGAN PERNAH di-import dari src/proxy.ts.
// ============================================================
import { createHmac } from "node:crypto";

const ZONA_WAKTU = "Asia/Jakarta";

function ambilKunciRahasiaPasswordOrmas() {
  const rahasia = process.env.ORMAS_PASSWORD_SECRET;
  if (!rahasia) {
    throw new Error(
      "ORMAS_PASSWORD_SECRET belum diisi di .env. Generate dengan: openssl rand -base64 32"
    );
  }
  return rahasia;
}

function tanggalHariIni(geserHari = 0): string {
  const sekarang = new Date(Date.now() + geserHari * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("sv-SE", { timeZone: ZONA_WAKTU }).format(
    sekarang
  );
}

function hitungPasswordUntukTanggal(kodeOrmas: string, tanggal: string): string {
  const kunci = ambilKunciRahasiaPasswordOrmas();
  const hasilHmac = createHmac("sha256", kunci)
    .update(`${kodeOrmas}:${tanggal}`)
    .digest("hex")
    .toUpperCase();
  return hasilHmac.slice(0, 8);
}

/** Password yang berlaku HARI INI untuk sebuah ormas. Dipakai admin untuk melihat kredensial. */
export function passwordHariIni(kodeOrmas: string): string {
  return hitungPasswordUntukTanggal(kodeOrmas, tanggalHariIni());
}

/** Cek apakah password yang diketik user benar untuk hari ini (atau kemarin, masa tenggang 1 hari). */
export function cekPasswordOrmas(
  kodeOrmas: string,
  passwordInput: string
): boolean {
  const input = passwordInput.trim().toUpperCase();
  const passwordBenarHariIni = hitungPasswordUntukTanggal(
    kodeOrmas,
    tanggalHariIni()
  );
  const passwordBenarKemarin = hitungPasswordUntukTanggal(
    kodeOrmas,
    tanggalHariIni(-1)
  );
  return input === passwordBenarHariIni || input === passwordBenarKemarin;
}
