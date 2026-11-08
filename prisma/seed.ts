// ============================================================
// Data contoh (dummy) supaya waktu development kita ada data
// buat dicoba-coba, nggak perlu input manual satu-satu dulu.
// Jalankan dengan: npx prisma db seed
// ============================================================
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const dataOrmasContoh = [
    {
      kodeOrmas: "ORMAS-001",
      usernamePortal: "ormas-001",
      nama: "Karang Taruna Giwangan Maju",
      kategori: "Kepemudaan",
      kemantren: "Umbulharjo",
      alamat: "Jl. Giwangan No. 12, Yogyakarta",
      latitude: -7.8249,
      longitude: 110.3886,
      email: "karangtaruna.giwangan@example.id",
      namaKetua: "Budi Santoso",
      namaSekretaris: "Siti Aminah",
      namaBendahara: "Joko Prasetyo",
    },
    {
      kodeOrmas: "ORMAS-002",
      usernamePortal: "ormas-002",
      nama: "Majelis Taklim Nurul Iman",
      kategori: "Keagamaan",
      kemantren: "Gondokusuman",
      alamat: "Jl. Gondosuli No. 5, Yogyakarta",
      latitude: -7.7833,
      longitude: 110.3833,
      email: "majelis.nuruliman@example.id",
      namaKetua: "H. Ahmad Fauzi",
      namaSekretaris: "Dewi Lestari",
      namaBendahara: "Rina Wijaya",
    },
    {
      kodeOrmas: "ORMAS-003",
      usernamePortal: "ormas-003",
      nama: "Paguyuban Seni Budaya Mataram",
      kategori: "Sosial Budaya",
      kemantren: "Kraton",
      alamat: "Jl. Rotowijayan No. 3, Yogyakarta",
      latitude: -7.805,
      longitude: 110.3644,
      email: "paguyuban.mataram@example.id",
      namaKetua: "Raden Hadi Wijaya",
      namaSekretaris: "Sri Mulyani",
      namaBendahara: "Tono Sudarmono",
    },
  ];

  for (const data of dataOrmasContoh) {
    await prisma.ormas.upsert({
      where: { email: data.email },
      update: {},
      create: { ...data, status: "AKTIF", tampilDiKatalog: true },
    });
  }

  await prisma.berita.upsert({
    where: { id: "berita-contoh-1" },
    update: {},
    create: {
      id: "berita-contoh-1",
      judul: "Selamat Datang di SIDOMAS",
      isi: "Sistem Digitalisasi Data Organisasi Kemasyarakatan kini resmi digunakan oleh Bakesbangpol Kota Yogyakarta untuk mempermudah pendataan ormas.",
      dipublikasikan: true,
    },
  });

  console.log(
    `Berhasil menambahkan ${dataOrmasContoh.length} data ormas contoh + 1 berita.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
