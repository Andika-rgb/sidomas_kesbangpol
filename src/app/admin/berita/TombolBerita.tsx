"use client";
import { hapusBeritaAction, togglePublikasiBeritaAction } from "./actions";

export function TombolTogglePublikasi({
  id,
  dipublikasikan,
}: {
  id: string;
  dipublikasikan: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => togglePublikasiBeritaAction(id, !dipublikasikan)}
      className="text-xs font-medium text-blue-700 underline hover:text-blue-900"
    >
      {dipublikasikan ? "Sembunyikan" : "Tampilkan"}
    </button>
  );
}

export function TombolHapusBerita({ id }: { id: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (confirm("Yakin mau hapus berita ini?")) {
          hapusBeritaAction(id);
        }
      }}
      className="text-xs font-medium text-red-600 underline hover:text-red-700"
    >
      Hapus
    </button>
  );
}
