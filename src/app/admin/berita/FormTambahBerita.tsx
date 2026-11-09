"use client";
import { useActionState, useRef, useEffect } from "react";
import { tambahBeritaAction, type HasilBerita } from "./actions";

const kondisiAwal: HasilBerita = {};

export default function FormTambahBerita() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, sedangMemproses] = useActionState(
    tambahBeritaAction,
    kondisiAwal
  );

  useEffect(() => {
    if (!state.error) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-700">
        Tulis Berita Baru
      </h2>
      <form ref={formRef} action={formAction} className="space-y-3">
        <input
          name="judul"
          required
          placeholder="Judul berita"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
        />
        <textarea
          name="isi"
          required
          rows={4}
          placeholder="Isi berita..."
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
        />
        <p className="text-xs text-slate-400">
          Lampiran gambar untuk berita akan tersedia setelah integrasi Google
          Drive selesai.
        </p>
        {state.error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={sedangMemproses}
          className="rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {sedangMemproses ? "Menyimpan..." : "Terbitkan"}
        </button>
      </form>
    </div>
  );
}
