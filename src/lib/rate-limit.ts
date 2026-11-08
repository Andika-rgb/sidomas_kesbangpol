// ============================================================
// Rate limiting untuk percobaan login
// ============================================================
// Tujuannya: cegah orang coba nebak-nebak password berkali-kali
// secara otomatis (serangan "brute force"). Caranya: kita hitung
// berapa kali percobaan GAGAL untuk email yang sama dalam 15 menit
// terakhir, dengan membaca tabel LogAktivitas yang sudah kita catat.
// Kalau sudah 5 kali gagal, email itu "dikunci sementara" 15 menit.
// ============================================================
import { prisma } from "@/lib/prisma";

const BATAS_PERCOBAAN_GAGAL = 5;
const JENDELA_WAKTU_MENIT = 15;

export async function sudahTerlaluBanyakPercobaan(
  email: string
): Promise<boolean> {
  const batasWaktu = new Date(Date.now() - JENDELA_WAKTU_MENIT * 60 * 1000);

  const jumlahGagal = await prisma.logAktivitas.count({
    where: {
      aksi: "LOGIN_ADMIN_GAGAL",
      aktorNama: email,
      createdAt: { gte: batasWaktu },
    },
  });

  return jumlahGagal >= BATAS_PERCOBAAN_GAGAL;
}

export async function catatLoginGagal(email: string, ip?: string) {
  await prisma.logAktivitas.create({
    data: {
      tipeAktor: "ADMIN",
      aktorNama: email,
      aksi: "LOGIN_ADMIN_GAGAL",
      ipAddress: ip,
    },
  });
}

export async function catatLoginBerhasil(
  adminId: string,
  email: string,
  ip?: string
) {
  await prisma.logAktivitas.create({
    data: {
      tipeAktor: "ADMIN",
      aktorId: adminId,
      aktorNama: email,
      aksi: "LOGIN_ADMIN_BERHASIL",
      ipAddress: ip,
    },
  });
}

// --- Versi untuk login ORMAS (polanya sama persis seperti admin) ---

export async function sudahTerlaluBanyakPercobaanOrmas(
  username: string
): Promise<boolean> {
  const batasWaktu = new Date(Date.now() - JENDELA_WAKTU_MENIT * 60 * 1000);
  const jumlahGagal = await prisma.logAktivitas.count({
    where: {
      aksi: "LOGIN_ORMAS_GAGAL",
      aktorNama: username,
      createdAt: { gte: batasWaktu },
    },
  });
  return jumlahGagal >= BATAS_PERCOBAAN_GAGAL;
}

export async function catatLoginOrmasGagal(username: string, ip?: string) {
  await prisma.logAktivitas.create({
    data: {
      tipeAktor: "ORMAS",
      aktorNama: username,
      aksi: "LOGIN_ORMAS_GAGAL",
      ipAddress: ip,
    },
  });
}

export async function catatLoginOrmasBerhasil(
  ormasId: string,
  namaOrmas: string,
  ip?: string
) {
  await prisma.logAktivitas.create({
    data: {
      tipeAktor: "ORMAS",
      aktorId: ormasId,
      aktorNama: namaOrmas,
      aksi: "LOGIN_ORMAS_BERHASIL",
      ipAddress: ip,
    },
  });
}
