// ============================================================
// Helper untuk autentikasi Admin
// ============================================================
// Isinya 3 hal:
// 1. Hash & cek password (pakai bcrypt, bukan simpan password asli)
// 2. Bikin & cek "tiket sesi login" (pakai JWT yang ditandatangani)
// 3. Nama cookie tempat tiket itu disimpan di browser
//
// Istilah "JWT" (JSON Web Token) = semacam "tiket digital" yang berisi
// info (misal: id admin, email) dan ditandatangani pakai kunci rahasia
// (AUTH_SECRET di .env), supaya kalau ada yang coba PALSUKAN tiketnya,
// sistem bisa tahu karena tanda tangannya nggak cocok.
// ============================================================
import bcrypt from "bcryptjs";
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

/** Ubah password asli jadi hash (satu arah, tidak bisa dibalik). */
export async function hashPassword(passwordAsli: string): Promise<string> {
  return bcrypt.hash(passwordAsli, 10);
}

/** Cek apakah password yang diketik user cocok dengan hash di database. */
export async function cekPassword(
  passwordAsli: string,
  hashTersimpan: string
): Promise<boolean> {
  return bcrypt.compare(passwordAsli, hashTersimpan);
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
