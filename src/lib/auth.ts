// ============================================================
// Helper untuk autentikasi Admin: HANYA sesi login (JWT) di sini.
// ============================================================
// Istilah "JWT" (JSON Web Token) = semacam "tiket digital" yang berisi
// info (misal: id admin, email) dan ditandatangani pakai kunci rahasia
// (AUTH_SECRET di .env), supaya kalau ada yang coba PALSUKAN tiketnya,
// sistem bisa tahu karena tanda tangannya nggak cocok.
//
// PENTING -- kenapa hash/cek password (bcrypt) TIDAK ada di sini:
// src/proxy.ts WAJIB meng-import file ini untuk memverifikasi sesi,
// dan proxy.ts jalan di lingkungan terbatas "Edge Runtime" di Vercel.
// Supaya proxy.ts tetap seringan & seaman mungkin, fungsi bcrypt
// dipindah ke file terpisah: src/lib/admin-password.ts, yang hanya
// dipakai di Server Action (actions.ts) dan skrip seed admin.
// ============================================================
import { SignJWT, jwtVerify } from "jose";

export const NAMA_COOKIE_SESI_ADMIN = "sidomas_admin_session";

// Berapa lama sesi login admin bertahan sebelum harus login ulang.
const DURASI_SESI_DETIK = 60 * 60 * 8; // 8 jam

function ambilKunciRahasia() {
  const rahasia = process.env.AUTH_SECRET;
  if (!rahasia) {
    throw new Error(
      "AUTH_SECRET belum diisi di file .env. Generate dengan: openssl rand -base64 32"
    );
  }
  return new TextEncoder().encode(rahasia);
}

export type IsiSesiAdmin = {
  adminId: string;
  email: string;
  nama: string;
  role: "SUPERADMIN" | "ADMIN";
};

/** Bikin "tiket sesi" (JWT) baru untuk admin yang baru login. */
export async function buatTokenSesiAdmin(isi: IsiSesiAdmin): Promise<string> {
  return new SignJWT({ ...isi })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURASI_SESI_DETIK}s`)
    .sign(ambilKunciRahasia());
}

/**
 * Cek apakah token sesi (dari cookie) masih valid.
 * Mengembalikan isi sesinya kalau valid, atau `null` kalau tidak
 * valid/kedaluwarsa (misal dipalsukan atau sudah lebih dari 8 jam).
 */
export async function verifikasiTokenSesiAdmin(
  token: string
): Promise<IsiSesiAdmin | null> {
  try {
    const { payload } = await jwtVerify(token, ambilKunciRahasia());
    return payload as unknown as IsiSesiAdmin;
  } catch {
    return null;
  }
}
