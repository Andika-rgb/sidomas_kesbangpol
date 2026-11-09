// ============================================================
// Jembatan ke Google Drive (lewat Google Apps Script Web App)
// ============================================================
// PENTING: file ini HANYA boleh dipakai di Server Action atau
// Route Handler biasa -- JANGAN di proxy.ts (Edge Runtime), sama
// alasannya kayak src/lib/ormas-password.ts.
// ============================================================

type HasilUploadDrive = { fileId: string; namaFile: string };
type HasilUnduhDrive = {
  base64Data: string;
  mimeType: string;
  namaFile: string;
};

function ambilKonfigurasi() {
  const url = process.env.GOOGLE_SCRIPT_URL;
  const secret = process.env.GOOGLE_SCRIPT_SECRET;
  if (!url || !secret) {
    throw new Error(
      "GOOGLE_SCRIPT_URL / GOOGLE_SCRIPT_SECRET belum diisi di environment variable."
    );
  }
  return { url, secret };
}

/**
 * Upload satu file ke folder ormas (dibuat otomatis per kodeOrmas) di Drive.
 * Kalau `publikAtauTidak` true, file dibuat bisa dilihat siapa saja yang
 * punya link (dipakai untuk logo, BUKAN untuk dokumen PDF yang wajib privat).
 */
export async function uploadFileKeDrive(opsi: {
  kodeOrmas: string;
  filename: string;
  mimeType: string;
  buffer: Buffer;
  publikAtauTidak?: boolean;
}): Promise<HasilUploadDrive> {
  const { url, secret } = ambilKonfigurasi();

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret,
      action: "upload",
      kodeOrmas: opsi.kodeOrmas,
      filename: opsi.filename,
      mimeType: opsi.mimeType,
      base64Data: opsi.buffer.toString("base64"),
      public: Boolean(opsi.publikAtauTidak),
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(`Gagal upload ke Drive: ${data.error}`);
  return { fileId: data.fileId, namaFile: data.namaFile };
}

/** Hapus satu file dari Drive berdasarkan fileId-nya. */
export async function hapusFileDariDrive(fileId: string): Promise<void> {
  const { url, secret } = ambilKonfigurasi();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, action: "delete", fileId }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`Gagal hapus file di Drive: ${data.error}`);
}

/** Ambil isi file PRIVAT dari Drive (dipakai untuk unduh dokumen PDF). */
export async function unduhFileDariDrive(
  fileId: string
): Promise<HasilUnduhDrive> {
  const { url, secret } = ambilKonfigurasi();
  const tujuan = new URL(url);
  tujuan.searchParams.set("action", "download");
  tujuan.searchParams.set("fileId", fileId);
  tujuan.searchParams.set("secret", secret);

  const res = await fetch(tujuan.toString());
  const data = await res.json();
  if (data.error)
    throw new Error(`Gagal ambil file dari Drive: ${data.error}`);
  return data;
}

/** URL tampilan untuk logo yang sudah dibuat publik. */
export function urlLogoPublik(fileId: string): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w200`;
}
