// ============================================================
// Hash & cek password Admin (pakai bcrypt)
// ============================================================
// Dipisah dari src/lib/auth.ts dengan alasan sama seperti
// src/lib/ormas-password.ts: supaya src/proxy.ts (yang jalan di
// Edge Runtime di Vercel) tidak perlu memuat library bcryptjs
// sama sekali -- proxy.ts cuma butuh verifikasi JWT, bukan
// hash/cek password.
//
// File ini HANYA dipakai di Server Action (actions.ts) dan skrip
// seed admin, JANGAN di-import dari src/proxy.ts.
// ============================================================
import bcrypt from "bcryptjs";

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
