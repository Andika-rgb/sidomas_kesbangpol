"use server";
import { prisma } from "@/lib/prisma";
import { passwordHariIni } from "@/lib/ormas-password";
import { revalidatePath } from "next/cache";

export type HasilTambahOrmas = { error?: string; sukses?: boolean };

/** Buat kode ormas otomatis berikutnya, contoh: "ORMAS-001", "ORMAS-002", dst. */
async function kodeOrmasBerikutnya(): Promise<string> {
  const jumlah = await prisma.ormas.count();
  const nomor = jumlah + 1;
  return `ORMAS-${String(nomor).padStart(3, "0")}`;
}

export async function tambahOrmasAction(
  _state: HasilTambahOrmas,
  formData: FormData
): Promise<HasilTambahOrmas> {
  const nama = String(formData.get("nama") || "").trim();
  const kategori = String(formData.get("kategori") || "").trim();
  const kemantren = String(formData.get("kemantren") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const alamat = String(formData.get("alamat") || "").trim();

  if (!nama || !kategori || !kemantren || !email || !alamat) {
    return {
      error:
        "Nama, kategori, kemantren, email, dan alamat wajib diisi.",
    };
  }

  const kodeOrmas = await kodeOrmasBerikutnya();
  const usernamePortal = kodeOrmas.toLowerCase();

  try {
    await prisma.ormas.create({
      data: {
        kodeOrmas,
        usernamePortal,
        nama,
        kategori,
        kemantren,
        email,
        alamat,
        bentuk: String(formData.get("bentuk") || "").trim() || null,
        bidangKegiatan:
          String(formData.get("bidangKegiatan") || "").trim() || null,
        namaKetua: String(formData.get("namaKetua") || "").trim() || null,
        namaSekretaris:
          String(formData.get("namaSekretaris") || "").trim() || null,
        namaBendahara:
          String(formData.get("namaBendahara") || "").trim() || null,
        nomorWaKetua:
          String(formData.get("nomorWaKetua") || "").trim() || null,
        catatanVerifikasi:
          String(formData.get("catatanVerifikasi") || "").trim() || null,
        status: "AKTIF",
        tampilDiKatalog: formData.get("tampilDiKatalog") === "on",
      },
    });
  } catch (e: unknown) {
    if (
      e &&
      typeof e === "object" &&
      "code" in e &&
      (e as { code?: string }).code === "P2002"
    ) {
      return { error: "Email ormas ini sudah terdaftar." };
    }
    throw e;
  }

  revalidatePath("/admin/ormas");
  return { sukses: true };
}

/**
 * Hitung password HARI INI untuk satu ormas. Dipanggil langsung dari
 * komponen client (lihat TombolLihatPassword.tsx) -- bukan lewat form,
 * karena cuma perlu dipanggil + tampilkan hasilnya, tidak reload halaman.
 */
export async function lihatPasswordHariIniAction(
  ormasId: string
): Promise<{ username: string; password: string } | { error: string }> {
  const ormas = await prisma.ormas.findUnique({ where: { id: ormasId } });
  if (!ormas) return { error: "Ormas tidak ditemukan." };
  return {
    username: ormas.usernamePortal,
    password: passwordHariIni(ormas.kodeOrmas),
  };
}
