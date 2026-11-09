// ============================================================
// Daftar nilai tetap (konstanta) yang dipakai di banyak tempat
// ============================================================
// Ditaruh di satu file supaya kalau ada perubahan (misal nambah
// kategori baru), cukup diubah di SINI SAJA, tidak perlu cari-cari
// di banyak file berbeda.
// ============================================================

export const DAFTAR_KATEGORI_ORMAS = [
  "Advokasi",
  "Keagamaan",
  "Sosial Ekonomi",
  "Kemanusiaan",
  "Kemahasiswaan",
  "Kepemudaan",
  "Kewaspadaan Dini",
  "Pendidikan",
  "Pengembangan SDM",
  "Penyuluhan Narkoba",
  "Sosial Budaya",
  "Sosial Kemasyarakatan",
  "Media",
  "Pembangunan",
  "Lain-lain",
] as const;

// 14 kemantren (dulu disebut "kecamatan") di Kota Yogyakarta
export const DAFTAR_KEMANTREN = [
  "Mantrijeron",
  "Kraton",
  "Mergangsan",
  "Umbulharjo",
  "Kotagede",
  "Gondokusuman",
  "Danurejan",
  "Pakualaman",
  "Gondomanan",
  "Ngampilan",
  "Wirobrajan",
  "Gedongtengen",
  "Jetis",
  "Tegalrejo",
] as const;

// Label untuk tiap jenis dokumen wajib, dipakai di form upload & katalog
export const LABEL_JENIS_DOKUMEN: Record<string, string> = {
  SK_PENGURUSAN: "SK Pengurusan",
  SURAT_KETERANGAN_DOMISILI: "Surat Keterangan Domisili",
  PROGRAM_KERJA: "Program Kerja",
  SALINAN_BADAN_HUKUM: "Salinan Badan Hukum",
  SKTO: "SKTO",
};

export const URUTAN_JENIS_DOKUMEN = [
  "SK_PENGURUSAN",
  "SURAT_KETERANGAN_DOMISILI",
  "PROGRAM_KERJA",
  "SALINAN_BADAN_HUKUM",
  "SKTO",
] as const;

// Batas ukuran file PDF: 500 KB (sesuai keterbatasan storage gratis kita)
export const BATAS_UKURAN_PDF_BYTE = 500 * 1024;

// Batas ukuran logo ormas (gambar), juga 500 KB
export const BATAS_UKURAN_LOGO_BYTE = 500 * 1024;
