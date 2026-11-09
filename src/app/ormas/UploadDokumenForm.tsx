"use client";
import { useActionState } from "react";
import { uploadDokumenOrmasAction, type HasilUploadDokumen } from "./actions";

const kondisiAwal: HasilUploadDokumen = {};

export default function UploadDokumenForm({
  jenis,
  sudahAda,
}: {
  jenis: string;
  sudahAda: boolean;
}) {
  const [state, formAction, sedangProses] = useActionState(
    uploadDokumenOrmasAction,
    kondisiAwal
  );

  return (
    <form action={formAction} className="flex shrink-0 flex-col items-end gap-1">
      <input type="hidden" name="jenis" value={jenis} />
      <div className="flex items-center gap-2">
        <input
          type="file"
          name="file"
          accept="application/pdf"
          required
          className="max-w-[150px] text-xs text-slate-600 file:mr-2 file:rounded file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-xs"
        />
        <button
          type="submit"
          disabled={sedangProses}
          className="shrink-0 rounded-md bg-blue-900 px-3 py-1.5 text-sm text-white transition hover:bg-blue-800 disabled:opacity-60"
        >
          {sedangProses ? "Mengunggah..." : sudahAda ? "Ganti" : "Upload"}
        </button>
      </div>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
      {state.sukses && (
        <p className="text-xs text-emerald-600">Tersimpan ✓</p>
      )}
    </form>
  );
}
