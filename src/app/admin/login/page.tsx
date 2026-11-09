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
import Link from "next/link";
import { useActionState } from "react";
import { loginAdminAction, type HasilLogin } from "./actions";

const kondisiAwal: HasilLogin = {};

export default function HalamanLoginAdmin() {
  const [state, formAction, sedangMemproses] = useActionState(
    loginAdminAction,
    kondisiAwal
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-4 inline-block text-sm font-medium text-blue-200 hover:text-white"
        >
          &larr; Kembali ke beranda
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-xl">
          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-sm font-bold text-white">
            A
          </div>
          <p className="mt-3 text-xs font-medium text-blue-800">SIDOMAS</p>
          <h1 className="mt-1 text-xl font-bold text-slate-900">
            Login Admin
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Khusus untuk admin Bakesbangpol Kota Yogyakarta.
          </p>

          <form action={formAction} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
                placeholder="admin@jogjakota.go.id"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              {/* TODO: tombol "Lupa password?" menyusul setelah fitur
                  reset password via email selesai dibuat. */}
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
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
              className="w-full rounded-md bg-blue-900 py-2 text-sm font-medium text-white transition hover:bg-blue-800 disabled:opacity-60"
            >
              {sedangMemproses ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-blue-200">
          Mencari login ormas?{" "}
          <Link href="/ormas/login" className="font-medium text-white underline">
            Klik di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
