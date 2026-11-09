// ============================================================
// Validasi ISI file (magic bytes), bukan cuma ekstensi/nama file
// ============================================================
// Nama file & ekstensi gampang dipalsukan (tinggal ganti nama
// "virus.exe" jadi "virus.pdf"). Supaya aman, kita cek beberapa
// byte pertama file -- setiap format file punya "tanda tangan"
// sendiri di awal isinya.
// ============================================================

/** File PDF asli selalu diawali teks "%PDF-" */
export function apakahPdfValid(buffer: Buffer): boolean {
  return buffer.subarray(0, 5).toString("utf-8") === "%PDF-";
}

/**
 * Kenali jenis gambar dari ISI file. Mengembalikan mime type
 * ("image/png", "image/jpeg", "image/webp") kalau valid, atau
 * null kalau bukan salah satu dari itu.
 */
export function jenisGambarDariIsi(buffer: Buffer): string | null {
  if (buffer.subarray(0, 8).toString("hex") === "89504e470d0a1a0a") {
    return "image/png";
  }
  if (buffer.subarray(0, 3).toString("hex") === "ffd8ff") {
    return "image/jpeg";
  }
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

/** Ekstensi file yang sesuai untuk sebuah mime type gambar. */
export function ekstensiDariMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/webp") return "webp";
  return "bin";
}
