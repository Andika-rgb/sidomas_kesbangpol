-- Tambah kolom teks pendukung untuk Legal Standing, SKTO, dan keterangan
-- validasi pada tabel Ormas. Semua kolom nullable (boleh kosong), jadi
-- aman untuk data ormas yang sudah ada -- tidak ada data yang hilang.

ALTER TABLE "Ormas" ADD COLUMN "keteranganValidasi" TEXT;
ALTER TABLE "Ormas" ADD COLUMN "legalJenis" TEXT;
ALTER TABLE "Ormas" ADD COLUMN "legalNomor" TEXT;
ALTER TABLE "Ormas" ADD COLUMN "legalTahun" INTEGER;
ALTER TABLE "Ormas" ADD COLUMN "legalBerlakuSd" TEXT;
ALTER TABLE "Ormas" ADD COLUMN "sktoNomor" TEXT;
ALTER TABLE "Ormas" ADD COLUMN "sktoTahun" INTEGER;
ALTER TABLE "Ormas" ADD COLUMN "sktoBerlakuSd" TEXT;
