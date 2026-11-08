// ============================================================
// Autentikasi Ormas: hanya SESI LOGIN (JWT) di file ini.
// ============================================================
// PENTING -- kenapa perhitungan password harian TIDAK ada di sini:
// src/proxy.ts (penjaga pintu /admin & /ormas) WAJIB meng-import
// file ini untuk memverifikasi sesi, dan proxy.ts jalan di
// lingkungan terbatas "Edge Runtime" di Vercel. Edge Runtime TIDAK
// mendukung modul node:crypto. Kalau fungsi hitung-password (yang
// butuh node:crypto) digabung ke sini, SELURUH proxy akan crash
// setiap kali ada yang membuka halaman admin/ormas -- persis bug
// yang pernah terjadi di production.
//
// Jadi: fungsi hitung password harian ada di file terpisah,
// src/lib/ormas-password.ts, yang HANYA dipakai di Server Action
// (actions.ts), bukan di proxy.ts. File ini (ormas-auth.ts) hanya
// berisi JWT (pakai library "jose", yang aman dipakai di Edge).
// ============================================================
import { SignJWT, jwtVerify } from "jose";

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
