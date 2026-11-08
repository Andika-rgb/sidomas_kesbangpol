"use server";
// ============================================================
// Server Action untuk proses Login Admin
// ============================================================
// "use server" di baris paling atas berarti: fungsi di file ini
// SELALU jalan di server (komputer Vercel), TIDAK PERNAH dikirim
// ke browser pengguna. Jadi aman untuk cek password & baca database
// langsung dari sini, tanpa perlu bikin API route terpisah.
// ============================================================
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cekPassword } from "@/lib/admin-password";
import { buatTokenSesiAdmin, NAMA_COOKIE_SESI_ADMIN } from "@/lib/auth";
import {
  sudahTerlaluBanyakPercobaan,
  catatLoginGagal,
  catatLoginBerhasil,
} from "@/lib/rate-limit";

export type HasilLogin = {
  error?: string;
};

export async function loginAdminAction(
  _state: HasilLogin,
  formData: FormData
): Promise<HasilLogin> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  // Ambil alamat IP pengirim request, buat dicatat di log aktivitas.
  const daftarHeader = await headers();
  const ip =
    daftarHeader.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;

  // 1. Cek dulu: apakah email ini sudah terlalu banyak gagal login?
  if (await sudahTerlaluBanyakPercobaan(email)) {
    return {
      error:
        "Terlalu banyak percobaan login gagal. Coba lagi dalam 15 menit.",
    };
  }

  // 2. Cari akun admin dengan email ini.
  const admin = await prisma.admin.findUnique({ where: { email } });

  // 3. Cek password. Sengaja pakai pesan error yang SAMA baik email
  //    tidak ditemukan maupun password salah -- supaya orang jahat
  //    tidak bisa menebak-nebak "email mana saja yang terdaftar".
  const passwordCocok = admin
    ? await cekPassword(password, admin.passwordHash)
    : false;

  if (!admin || !passwordCocok) {
    await catatLoginGagal(email, ip);
    return { error: "Email atau password salah." };
  }

  // 4. Login berhasil -> bikin tiket sesi, simpan di cookie, catat log.
  const token = await buatTokenSesiAdmin({
    adminId: admin.id,
    email: admin.email,
    nama: admin.nama,
    role: admin.role,
  });

  const cookieStore = await cookies();
  cookieStore.set(NAMA_COOKIE_SESI_ADMIN, token, {
    httpOnly: true, // tidak bisa dibaca lewat JavaScript di browser (lebih aman)
    secure: process.env.NODE_ENV === "production", // wajib HTTPS saat production
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 jam, samakan dengan durasi di src/lib/auth.ts
  });

  await catatLoginBerhasil(admin.id, admin.email, ip);

  redirect("/admin");
}
