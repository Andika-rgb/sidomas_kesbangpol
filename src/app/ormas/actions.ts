"use server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  verifikasiTokenSesiOrmas,
  NAMA_COOKIE_SESI_ORMAS,
} from "@/lib/ormas-auth";
import { uploadFileKeDrive } from "@/lib/google-drive";
import { apakahPdfValid } from "@/lib/validasi-file";
import {
  BATAS_UKURAN_PDF_BYTE,
  LABEL_JENIS_DOKUMEN,
  URUTAN_JENIS_DOKUMEN,
} from "@/lib/konstanta";
import { revalidatePath } from "next/cache";

export type HasilUploadDokumen = { error?: string; sukses?: boolean };

type JenisDokumenValid = (typeof URUTAN_JENIS_DOKUMEN)[number];

function jenisValid(nilai: unknown): nilai is JenisDokumenValid {
  return URUTAN_JENIS_DOKUMEN.includes(nilai as JenisDokumenValid);
}

export async function uploadDokumenOrmasAction(
  _state: HasilUploadDokumen,
  formData: FormData
): Promise<HasilUploadDokumen> {
  // 1. Pastikan yang upload benar-benar ormas yang sedang login
  const cookieStore = await cookies();
  const token = cookieStore.get(NAMA_COOKIE_SESI_ORMAS)?.value;
  const sesi = token ? await verifikasiTokenSesiOrmas(token) : null;
  if (!sesi) {
    return { error: "Sesi sudah habis, silakan login ulang." };
  }

  // 2. Validasi jenis dokumen & file-nya
  const jenis = String(formData.get("jenis") || "");
  if (!jenisValid(jenis)) {
    return { error: "Jenis dokumen tidak dikenali." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Pilih file PDF dulu." };
  }
  if (file.size > BATAS_UKURAN_PDF_BYTE) {
    return {
      error: `Ukuran file maksimal ${Math.round(
        BATAS_UKURAN_PDF_BYTE / 1024
      )} KB.`,
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!apakahPdfValid(buffer)) {
    return { error: "File ini bukan PDF yang valid (cek ulang isinya)." };
  }

  // 3. Upload ke Drive (folder khusus ormas ini, PRIVAT -- bukan publik)
  const namaFile = `${jenis}.pdf`;
  let hasilDrive;
  try {
    hasilDrive = await uploadFileKeDrive({
      kodeOrmas: sesi.kodeOrmas,
      filename: namaFile,
      mimeType: "application/pdf",
      buffer,
    });
  } catch {
    return { error: "Gagal terhubung ke penyimpanan Drive. Coba lagi." };
  }

  // 4. Simpan di database -- kalau sudah ada dokumen jenis ini sebelumnya,
  //    versi lamanya disimpan dulu ke riwayat (tidak ditimpa begitu saja)
  const dokumenLama = await prisma.dokumen.findUnique({
    where: { ormasId_jenis: { ormasId: sesi.ormasId, jenis } },
  });

  if (dokumenLama) {
    const jumlahVersiLama = await prisma.dokumenVersi.count({
      where: { dokumenId: dokumenLama.id },
    });
    await prisma.dokumenVersi.create({
      data: {
        dokumenId: dokumenLama.id,
        driveFileId: dokumenLama.driveFileId,
        namaFile: dokumenLama.namaFile,
        nomorVersi: jumlahVersiLama + 1,
      },
    });
    await prisma.dokumen.update({
      where: { id: dokumenLama.id },
      data: {
        driveFileId: hasilDrive.fileId,
        namaFile: hasilDrive.namaFile,
        ukuranByte: file.size,
        tanggalUpload: new Date(),
      },
    });
  } else {
    await prisma.dokumen.create({
      data: {
        ormasId: sesi.ormasId,
        jenis,
        driveFileId: hasilDrive.fileId,
        namaFile: hasilDrive.namaFile,
        ukuranByte: file.size,
      },
    });
  }

  await prisma.logAktivitas.create({
    data: {
      tipeAktor: "ORMAS",
      aktorId: sesi.ormasId,
      aktorNama: sesi.nama,
      aksi: "UPLOAD_DOKUMEN",
      detail: `Mengunggah ${LABEL_JENIS_DOKUMEN[jenis]}`,
    },
  });

  revalidatePath("/ormas");
  return { sukses: true };
}
