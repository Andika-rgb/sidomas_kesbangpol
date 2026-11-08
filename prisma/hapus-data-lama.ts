// ============================================================
// Skrip SEKALI PAKAI: hapus data ormas contoh yang lama,
// supaya migrasi skema baru bisa jalan (kolom baru wajib diisi,
// tapi data lama belum punya nilainya).
//
// Jalankan: npx tsx prisma/hapus-data-lama.ts
// Setelah ini, nanti isi ulang pakai: npx prisma db seed
// ============================================================
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hasil = await prisma.ormas.deleteMany({});
  console.log(`Berhasil hapus ${hasil.count} data ormas lama.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
