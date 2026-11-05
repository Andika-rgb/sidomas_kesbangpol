// ============================================================
// Koneksi ke database (Prisma Client) - versi "singleton"
// ============================================================
// Kenapa perlu file khusus kayak gini? Karena Next.js di mode
// development suka reload kode berkali-kali, dan kalau kita bikin
// `new PrismaClient()` di sembarang tempat, bisa kebuat BANYAK
// koneksi ke database sampai akhirnya error "too many connections".
// Trik di bawah ini memastikan cuma ada SATU koneksi yang dipakai
// ulang terus, baik waktu development maupun production.
//
// Catatan: mulai Prisma versi 7, PrismaClient WAJIB pakai "driver
// adapter" (di sini kita pakai @prisma/adapter-pg, khusus Postgres)
// supaya tahu cara benar-benar membuka koneksi ke database-nya.
// ============================================================
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function buatPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? buatPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
