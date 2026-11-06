"use client";
// ============================================================
// Halaman Login Admin
// ============================================================
// "use client" artinya komponen ini jalan di BROWSER pengguna
// (bukan server), karena kita butuh interaktivitas: form yang
// menampilkan pesan error tanpa reload halaman, tombol yang
// menunjukkan status "Memproses...", dll.
//
// `useActionState` adalah hook React untuk menghubungkan form
// ke Server Action (loginAdminAction) dan otomatis menangkap
// hasilnya (termasuk pesan error) tanpa kita tulis fetch/API manual.
// ============================================================
import { useActionState } from "react";
import { loginAdminAction, type HasilLogin } from "./actions";

const kondisiAwal: HasilLogin = {};

export default function HalamanLoginAdmin() {
  const [state, formAction, sedangMemproses] = useActionState(
    loginAdminAction,
    kondisiAwal
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-medium text-emerald-700">SIDOMAS</p>
        <h1 className="mt-1 text-xl font-bold text-zinc-900">
          Login Admin
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Khusus untuk admin Bakesbangpol Kota Yogyakarta.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="admin@jogjakota.go.id"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="••••••••"
            />
          </div>

          {state.error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={sedangMemproses}
            className="w-full rounded-md bg-emerald-600 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {sedangMemproses ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
