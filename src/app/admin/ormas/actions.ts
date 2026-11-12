"use server";
import { prisma } from "@/lib/prisma";
import { passwordHariIni } from "@/lib/ormas-password";
import { uploadFileKeDrive, hapusFileDariDrive, urlLogoPublik } from "@/lib/google-drive";
import { jenisGambarDariIsi, ekstensiDariMime } from "@/lib/validasi-file";
import { BATAS_UKURAN_LOGO_BYTE } from "@/lib/konstanta";
import { revalidatePath } from "next/cache";

export type HasilTambahOrmas = { error?: string; sukses?: boolean };

/** Ubah isi field angka dari form jadi number, atau null kalau kosong/bukan angka. */
function angkaAtauNull(nilai: FormDataEntryValue | null): number | null {
  const teks = String(nilai || "").trim();
  if (!teks) return null;
  const angka = Number(teks);
  return Number.isFinite(angka) ? angka : null;
}

/** Buat kode ormas otomatis berikutnya, contoh: "ORMAS-001", "ORMAS-002", dst. */
async function kodeOrmasBerikutnya(): Promise<string> {
  const jumlah = await prisma.ormas.count();
  const nomor = jumlah + 1;
  return `ORMAS-${String(nomor).padStart(3, "0")}`;
}

/** Ambil fileId Drive dari URL thumbnail publik yang kita buat sendiri. */
function fileIdDariUrlLogo(logoUrl: string | null): string | null {
  if (!logoUrl) return null;
  const cocok = logoUrl.match(/[?&]id=([^&]+)/);
  return cocok ? cocok[1] : null;
}

/** Ambil & validasi field teks dari form ormas (dipakai tambah & edit). */
function ambilFieldOrmas(formData: FormData) {
  return {
    nama: String(formData.get("nama") || "").trim(),
    kategori: String(formData.get("kategori") || "").trim(),
    kemantren: String(formData.get("kemantren") || "").trim(),
    email: String(formData.get("email") || "").trim().toLowerCase(),
    alamat: String(formData.get("alamat") || "").trim(),
    bentuk: String(formData.get("bentuk") || "").trim() || null,
    bidangKegiatan: String(formData.get("bidangKegiatan") || "").trim() || null,
    namaKetua: String(formData.get("namaKetua") || "").trim() || null,
    namaSekretaris: String(formData.get("namaSekretaris") || "").trim() || null,
    namaBendahara: String(formData.get("namaBendahara") || "").trim() || null,
    nomorWaKetua: String(formData.get("nomorWaKetua") || "").trim() || null,
    catatanVerifikasi: String(formData.get("catatanVerifikasi") || "").trim() || null,
    keteranganValidasi: String(formData.get("keteranganValidasi") || "").trim() || null,
    legalJenis: String(formData.get("legalJenis") || "").trim() || null,
    legalNomor: String(formData.get("legalNomor") || "").trim() || null,
    legalTahun: angkaAtauNull(formData.get("legalTahun")),
    legalBerlakuSd: String(formData.get("legalBerlakuSd") || "").trim() || null,
    sktoNomor: String(formData.get("sktoNomor") || "").trim() || null,
    sktoTahun: angkaAtauNull(formData.get("sktoTahun")),
    sktoBerlakuSd: String(formData.get("sktoBerlakuSd") || "").trim() || null,
    status: String(formData.get("status") || "AKTIF") as
      | "AKTIF"
      | "MENUNGGU_VERIFIKASI"
      | "NONAKTIF",
    tampilDiKatalog: formData.get("tampilDiKatalog") === "on",
  };
}

export async function tambahOrmasAction(
  _state: HasilTambahOrmas,
  formData: FormData
): Promise<HasilTambahOrmas> {
  const field = ambilFieldOrmas(formData);

  if (!field.nama || !field.kategori || !field.kemantren || !field.email || !field.alamat) {
    return {
      error: "Nama, kategori, kemantren, email, dan alamat wajib diisi.",
    };
  }

  const kodeOrmas = await kodeOrmasBerikutnya();
  const usernamePortal = kodeOrmas.toLowerCase();

  // Logo opsional -- kalau diisi, divalidasi dari ISI filenya (bukan cuma
  // nama/ekstensi), lalu diunggah ke Drive sebagai file PUBLIK (khusus
  // logo boleh publik, beda dari dokumen PDF yang wajib privat).
  let logoUrl: string | null = null;
  const logoFile = formData.get("logo");
  if (logoFile instanceof File && logoFile.size > 0) {
    if (logoFile.size > BATAS_UKURAN_LOGO_BYTE) {
      return {
        error: `Ukuran logo maksimal ${Math.round(BATAS_UKURAN_LOGO_BYTE / 1024)} KB.`,
      };
    }
    const bufferLogo = Buffer.from(await logoFile.arrayBuffer());
    const mimeLogo = jenisGambarDariIsi(bufferLogo);
    if (!mimeLogo) {
      return { error: "Logo harus berupa gambar PNG, JPEG, atau WEBP yang valid." };
    }
    try {
      const hasilLogo = await uploadFileKeDrive({
        kodeOrmas,
        filename: `logo.${ekstensiDariMime(mimeLogo)}`,
        mimeType: mimeLogo,
        buffer: bufferLogo,
        publikAtauTidak: true,
      });
      logoUrl = urlLogoPublik(hasilLogo.fileId);
    } catch {
      return { error: "Gagal upload logo ke Drive. Coba lagi." };
    }
  }

  try {
    await prisma.ormas.create({
      data: { kodeOrmas, usernamePortal, logoUrl, ...field },
    });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code?: string }).code === "P2002") {
      return { error: "Email ormas ini sudah terdaftar." };
    }
    throw e;
  }

  revalidatePath("/admin/ormas");
  return { sukses: true };
}

/**
 * Update data ormas yang sudah ada. ormasId di-"bind" duluan dari
 * EditOrmasForm.tsx (bukan ikut di formData), jadi urutan parameternya
 * ormasId dulu baru (prevState, formData) seperti pola useActionState.
 */
export async function updateOrmasAction(
  ormasId: string,
  _state: HasilTambahOrmas,
  formData: FormData
): Promise<HasilTambahOrmas> {
  const ormasLama = await prisma.ormas.findUnique({ where: { id: ormasId } });
  if (!ormasLama) return { error: "Ormas tidak ditemukan." };

  const field = ambilFieldOrmas(formData);
  if (!field.nama || !field.kategori || !field.kemantren || !field.email || !field.alamat) {
    return {
      error: "Nama, kategori, kemantren, email, dan alamat wajib diisi.",
    };
  }

  // Logo opsional -- kalau admin pilih file baru, logo LAMA dihapus dulu
  // dari Drive baru upload yang baru. Kalau tidak pilih file, logo lama
  // tetap dipakai (tidak disentuh sama sekali).
  let logoUrl = ormasLama.logoUrl;
  const logoFile = formData.get("logo");
  if (logoFile instanceof File && logoFile.size > 0) {
    if (logoFile.size > BATAS_UKURAN_LOGO_BYTE) {
      return {
        error: `Ukuran logo maksimal ${Math.round(BATAS_UKURAN_LOGO_BYTE / 1024)} KB.`,
      };
    }
    const bufferLogo = Buffer.from(await logoFile.arrayBuffer());
    const mimeLogo = jenisGambarDariIsi(bufferLogo);
    if (!mimeLogo) {
      return { error: "Logo harus berupa gambar PNG, JPEG, atau WEBP yang valid." };
    }
    try {
      const hasilLogo = await uploadFileKeDrive({
        kodeOrmas: ormasLama.kodeOrmas,
        filename: `logo.${ekstensiDariMime(mimeLogo)}`,
        mimeType: mimeLogo,
        buffer: bufferLogo,
        publikAtauTidak: true,
      });
      const fileIdLama = fileIdDariUrlLogo(ormasLama.logoUrl);
      if (fileIdLama) {
        try {
          await hapusFileDariDrive(fileIdLama);
        } catch {
          // logo lama gagal dihapus (mungkin sudah tidak ada) -- lanjut saja
        }
      }
      logoUrl = urlLogoPublik(hasilLogo.fileId);
    } catch {
      return { error: "Gagal upload logo baru ke Drive. Coba lagi." };
    }
  }

  try {
    await prisma.ormas.update({
      where: { id: ormasId },
      data: { logoUrl, ...field },
    });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && (e as { code?: string }).code === "P2002") {
      return { error: "Email ini sudah dipakai ormas lain." };
    }
    throw e;
  }

  revalidatePath("/admin/ormas");
  revalidatePath("/admin");
  revalidatePath("/katalog");
  revalidatePath("/");
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

/**
 * Hapus satu ormas beserta semua dokumen & logonya (di database MAUPUN
 * di Google Drive, supaya tidak ada file nyangkut yang makan kuota).
 * Dipanggil langsung dari tombol di AdminOrmasTable, bukan lewat form,
 * karena cuma 1 aksi tanpa input tambahan.
 */
export async function hapusOrmasAction(ormasId: string): Promise<void> {
  const ormas = await prisma.ormas.findUnique({
    where: { id: ormasId },
    include: { dokumen: true },
  });
  if (!ormas) return;

  const fileIdLogo = fileIdDariUrlLogo(ormas.logoUrl);
  const semuaFileId = [
    ...(fileIdLogo ? [fileIdLogo] : []),
    ...ormas.dokumen.map((d) => d.driveFileId),
  ];

  for (const fileId of semuaFileId) {
    try {
      await hapusFileDariDrive(fileId);
    } catch {
      // diamkan, lanjut ke file berikutnya
    }
  }

  await prisma.ormas.delete({ where: { id: ormasId } });

  revalidatePath("/admin/ormas");
  revalidatePath("/admin");
  revalidatePath("/katalog");
  revalidatePath("/");
}
