// ============================================================
// Bikin akun admin PERTAMA (buat login awal ke dashboard)
// ============================================================
// Jalankan dengan: npx tsx prisma/seed-admin.ts
//
// Script ini baca ADMIN_EMAIL & ADMIN_PASSWORD dari file .env
// (bukan ditulis langsung di kode), supaya password admin asli
// TIDAK PERNAH ikut ter-commit ke GitHub.
//
// Boleh dijalankan berkali-kali dengan aman: kalau emailnya sudah
// ada, password-nya akan di-update sesuai ADMIN_PASSWORD terbaru
// di .env (berguna kalau mau ganti password admin pertama ini).
// ============================================================
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const nama = process.env.ADMIN_NAMA || "Admin Bakesbangpol";

  if (!email || !password) {
    console.error(
      "ADMIN_EMAIL dan ADMIN_PASSWORD belum diisi di file .env.\n" +
        "Tambahkan dulu 2 baris ini ke .env, lalu jalankan ulang:\n\n" +
        '  ADMIN_EMAIL="admin@jogjakota.go.id"\n' +
        '  ADMIN_PASSWORD="passwordsementara123"\n'
    );
    process.exitCode = 1;
    return;
  }

  if (password.length < 8) {
    console.error("ADMIN_PASSWORD minimal 8 karakter demi keamanan.");
    process.exitCode = 1;
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, nama },
    create: {
      email,
      passwordHash,
      nama,
      role: "SUPERADMIN",
    },
  });

  console.log(`Akun admin siap dipakai:`);
  console.log(`  Email : ${admin.email}`);
  console.log(`  Nama  : ${admin.nama}`);
  console.log(`  Role  : ${admin.role}`);
  console.log(
    `\nSilakan login di /admin/login pakai email & password dari .env tadi.`
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
