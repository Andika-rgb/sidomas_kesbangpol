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
      nama: "Karang Taruna Giwangan Maju",
      kategori: "Pemuda",
      kemantren: "Umbulharjo",
      alamat: "Jl. Giwangan No. 12, Yogyakarta",
      latitude: -7.8249,
      longitude: 110.3886,
      email: "karangtaruna.giwangan@example.id",
    },
    {
      nama: "Majelis Taklim Nurul Iman",
      kategori: "Keagamaan",
      kemantren: "Gondokusuman",
      alamat: "Jl. Gondosuli No. 5, Yogyakarta",
      latitude: -7.7833,
      longitude: 110.3833,
      email: "majelis.nuruliman@example.id",
    },
    {
      nama: "Paguyuban Seni Budaya Mataram",
      kategori: "Sosial Budaya",
      kemantren: "Kraton",
      alamat: "Jl. Rotowijayan No. 3, Yogyakarta",
      latitude: -7.805,
      longitude: 110.3644,
      email: "paguyuban.mataram@example.id",
    },
  ];

  for (const data of dataOrmasContoh) {
    await prisma.ormas.upsert({
      where: { email: data.email },
      update: {},
      create: {
        ...data,
        status: "AKTIF",
        pengurus: {
          create: [
            { jabatan: "Ketua", nama: "Contoh Nama Ketua", urutan: 1 },
            { jabatan: "Sekretaris", nama: "Contoh Nama Sekretaris", urutan: 2 },
          ],
        },
      },
    });
  }

  console.log(`Berhasil menambahkan ${dataOrmasContoh.length} data ormas contoh.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
