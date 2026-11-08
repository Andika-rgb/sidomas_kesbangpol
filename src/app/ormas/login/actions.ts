"use server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cekPasswordOrmas } from "@/lib/ormas-auth";
import { buatTokenSesiOrmas, NAMA_COOKIE_SESI_ORMAS } from "@/lib/ormas-auth";
import {
  sudahTerlaluBanyakPercobaanOrmas,
  catatLoginOrmasGagal,
  catatLoginOrmasBerhasil,
} from "@/lib/rate-limit";

export type HasilLogin = { error?: string };

export async function loginOrmasAction(
  _state: HasilLogin,
  formData: FormData
): Promise<HasilLogin> {
  const username = String(formData.get("username") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    return { error: "Username dan password wajib diisi." };
  }

  const daftarHeader = await headers();
  const ip =
    daftarHeader.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;

  if (await sudahTerlaluBanyakPercobaanOrmas(username)) {
    return {
      error: "Terlalu banyak percobaan login gagal. Coba lagi dalam 15 menit.",
    };
  }

  const ormas = await prisma.ormas.findUnique({
    where: { usernamePortal: username },
  });

  const passwordCocok = ormas
    ? cekPasswordOrmas(ormas.kodeOrmas, password)
    : false;

  if (!ormas || !passwordCocok) {
    await catatLoginOrmasGagal(username, ip);
    return { error: "Username atau password salah." };
  }

  const token = await buatTokenSesiOrmas({
    ormasId: ormas.id,
    kodeOrmas: ormas.kodeOrmas,
    nama: ormas.nama,
    usernamePortal: ormas.usernamePortal,
  });

  const cookieStore = await cookies();
  cookieStore.set(NAMA_COOKIE_SESI_ORMAS, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  await catatLoginOrmasBerhasil(ormas.id, ormas.nama, ip);

  redirect("/ormas");
}
