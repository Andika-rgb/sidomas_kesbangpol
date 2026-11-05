// ============================================================
// Konfigurasi Prisma (format baru mulai Prisma versi 7)
// ============================================================
// File ini menggantikan "url" yang dulu ditulis langsung di
// prisma/schema.prisma. Sekarang URL koneksi database dibaca
// dari file .env lewat helper env() di bawah ini.
// ============================================================
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
