-- CreateEnum
CREATE TYPE "JenisDokumen" AS ENUM ('SK_PENGURUSAN', 'SURAT_KETERANGAN_DOMISILI', 'PROGRAM_KERJA', 'SALINAN_BADAN_HUKUM', 'SKTO');

-- CreateEnum
CREATE TYPE "StatusOrmas" AS ENUM ('AKTIF', 'MENUNGGU_VERIFIKASI', 'NONAKTIF');

-- CreateEnum
CREATE TYPE "StatusPerubahan" AS ENUM ('PENDING', 'DISETUJUI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "RoleAdmin" AS ENUM ('SUPERADMIN', 'ADMIN');

-- CreateEnum
CREATE TYPE "TipeAktor" AS ENUM ('ADMIN', 'ORMAS', 'SISTEM');

-- CreateTable
CREATE TABLE "Ormas" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "kemantren" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "email" TEXT NOT NULL,
    "logoUrl" TEXT,
    "status" "StatusOrmas" NOT NULL DEFAULT 'MENUNGGU_VERIFIKASI',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ormas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengurus" (
    "id" TEXT NOT NULL,
    "ormasId" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengurus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dokumen" (
    "id" TEXT NOT NULL,
    "ormasId" TEXT NOT NULL,
    "jenis" "JenisDokumen" NOT NULL,
    "driveFileId" TEXT NOT NULL,
    "namaFile" TEXT NOT NULL,
    "ukuranByte" INTEGER,
    "tanggalUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalExpired" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dokumen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DokumenVersi" (
    "id" TEXT NOT NULL,
    "dokumenId" TEXT NOT NULL,
    "driveFileId" TEXT NOT NULL,
    "namaFile" TEXT NOT NULL,
    "nomorVersi" INTEGER NOT NULL,
    "digantiPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DokumenVersi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenAksesDokumen" (
    "id" TEXT NOT NULL,
    "dokumenId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dibuatOlehAdminId" TEXT,

    CONSTRAINT "TokenAksesDokumen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "RoleAdmin" NOT NULL DEFAULT 'ADMIN',
    "twoFactorSecret" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KredensialHarian" (
    "id" TEXT NOT NULL,
    "ormasId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "berlakuUntuk" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dibuatOlehAdminId" TEXT NOT NULL,

    CONSTRAINT "KredensialHarian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerubahanPending" (
    "id" TEXT NOT NULL,
    "ormasId" TEXT NOT NULL,
    "dataBaru" JSONB NOT NULL,
    "status" "StatusPerubahan" NOT NULL DEFAULT 'PENDING',
    "catatanAdmin" TEXT,
    "diajukanPada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diverifikasiPada" TIMESTAMP(3),
    "diverifikasiOlehId" TEXT,

    CONSTRAINT "PerubahanPending_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogAktivitas" (
    "id" TEXT NOT NULL,
    "tipeAktor" "TipeAktor" NOT NULL,
    "aktorId" TEXT,
    "aktorNama" TEXT NOT NULL,
    "aksi" TEXT NOT NULL,
    "detail" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogAktivitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PengaturanSistem" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "PengaturanSistem_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ormas_email_key" ON "Ormas"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dokumen_ormasId_jenis_key" ON "Dokumen"("ormasId", "jenis");

-- CreateIndex
CREATE UNIQUE INDEX "TokenAksesDokumen_token_key" ON "TokenAksesDokumen"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "KredensialHarian_username_key" ON "KredensialHarian"("username");

-- AddForeignKey
ALTER TABLE "Pengurus" ADD CONSTRAINT "Pengurus_ormasId_fkey" FOREIGN KEY ("ormasId") REFERENCES "Ormas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dokumen" ADD CONSTRAINT "Dokumen_ormasId_fkey" FOREIGN KEY ("ormasId") REFERENCES "Ormas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DokumenVersi" ADD CONSTRAINT "DokumenVersi_dokumenId_fkey" FOREIGN KEY ("dokumenId") REFERENCES "Dokumen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KredensialHarian" ADD CONSTRAINT "KredensialHarian_ormasId_fkey" FOREIGN KEY ("ormasId") REFERENCES "Ormas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerubahanPending" ADD CONSTRAINT "PerubahanPending_ormasId_fkey" FOREIGN KEY ("ormasId") REFERENCES "Ormas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
