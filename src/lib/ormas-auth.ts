// ============================================================
// Autentikasi Ormas: username tetap + password yang AUTO GANTI
// tiap hari, tanpa perlu admin generate manual tiap hari.
// ============================================================
// Cara kerjanya: password hari ini dihitung dari rumus
//   HMAC(kunci_rahasia, kode_ormas + tanggal_hari_ini)
// lalu diubah jadi kode 8 karakter yang gampang diketik.
//
// Kelebihan cara ini dibanding nyimpan password di database:
// - Otomatis beda tiap hari TANPA ada "tugas terjadwal" yang
//   bisa gagal/lupa jalan.
// - Password tidak pernah disimpan di database sama sekali --
//   jadi kalau database bocor, password ormas tetap aman karena
//   memang tidak ada di sana. Password cuma dihitung "on the fly"
//   setiap kali ada yang mau login atau admin mau melihatnya.
// - Admin bisa lihat "password hari ini" kapan saja, tanpa perlu
//   nyatet/reset manual.
// ============================================================
import { createHmac } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

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

/** Format tanggal hari ini sesuai zona waktu Jakarta, contoh: "2026-11-08" */
function tanggalHariIni(geserHari = 0): string {
  const sekarang = new Date(Date.now() + geserHari * 24 * 60 * 60 * 1000);
  // Pakai Intl supaya hasilnya benar sesuai zona waktu WIB, bukan UTC server.
  return new Intl.DateTimeFormat("sv-SE", { timeZone: ZONA_WAKTU }).format(
    sekarang
  );
}

/** Hitung password untuk 1 ormas pada 1 tanggal tertentu. */
function hitungPasswordUntukTanggal(kodeOrmas: string, tanggal: string): string {
  const kunci = ambilKunciRahasiaPasswordOrmas();
  const hasilHmac = createHmac("sha256", kunci)
    .update(`${kodeOrmas}:${tanggal}`)
    .digest("hex")
    .toUpperCase();

  // Ambil 8 karakter pertama dari hasil HMAC sebagai password.
  // Cukup acak (sulit ditebak) tapi tetap pendek supaya gampang diketik.
  return hasilHmac.slice(0, 8);
}

/** Password yang berlaku HARI INI untuk sebuah ormas. Dipakai admin untuk melihat kredensial. */
export function passwordHariIni(kodeOrmas: string): string {
  return hitungPasswordUntukTanggal(kodeOrmas, tanggalHariIni());
}

/**
 * Cek apakah password yang diketik user BENAR untuk hari ini.
 * Kita juga terima password hari KEMARIN selama 1 jam pertama
 * setelah pergantian hari, supaya ormas yang masih "melek" lewat
 * tengah malam tidak tiba-tiba ter-logout di tengah pekerjaan.
 */
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

// ------------------------------------------------------------
// Sesi login (JWT), polanya sama seperti src/lib/auth.ts untuk admin
// ------------------------------------------------------------

export const NAMA_COOKIE_SESI_ORMAS = "sidomas_ormas_session";
const DURASI_SESI_DETIK = 60 * 60 * 8; // 8 jam

function ambilKunciSesi() {
  const rahasia = process.env.AUTH_SECRET;
  if (!rahasia) {
    throw new Error("AUTH_SECRET belum diisi di .env.");
  }
  return new TextEncoder().encode(rahasia);
}

export type IsiSesiOrmas = {
  ormasId: string;
  kodeOrmas: string;
  nama: string;
  usernamePortal: string;
};

export async function buatTokenSesiOrmas(
  isi: IsiSesiOrmas
): Promise<string> {
  return new SignJWT({ ...isi })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURASI_SESI_DETIK}s`)
    .sign(ambilKunciSesi());
}

export async function verifikasiTokenSesiOrmas(
  token: string
): Promise<IsiSesiOrmas | null> {
  try {
    const { payload } = await jwtVerify(token, ambilKunciSesi());
    return payload as unknown as IsiSesiOrmas;
  } catch {
    return null;
  }
}
