"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type HasilBerita = { error?: string };

export async function tambahBeritaAction(
  _state: HasilBerita,
  formData: FormData
): Promise<HasilBerita> {
  const judul = String(formData.get("judul") || "").trim();
  const isi = String(formData.get("isi") || "").trim();

  if (!judul || !isi) {
    return { error: "Judul dan isi berita wajib diisi." };
  }

  await prisma.berita.create({
    data: { judul, isi, dipublikasikan: true },
  });

  revalidatePath("/admin/berita");
  revalidatePath("/");
  return {};
}

export async function hapusBeritaAction(id: string) {
  await prisma.berita.delete({ where: { id } });
  revalidatePath("/admin/berita");
  revalidatePath("/");
}

export async function togglePublikasiBeritaAction(
  id: string,
  dipublikasikan: boolean
) {
  await prisma.berita.update({
    where: { id },
    data: { dipublikasikan },
  });
  revalidatePath("/admin/berita");
  revalidatePath("/");
}
