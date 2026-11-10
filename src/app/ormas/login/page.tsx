"use client";
import Link from "next/link";
import { useActionState } from "react";
import { loginOrmasAction, type HasilLogin } from "./actions";

const kondisiAwal: HasilLogin = {};

export default function HalamanLoginOrmas() {
  const [state, formAction, sedangMemproses] = useActionState(
    loginOrmasAction,
    kondisiAwal
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-4 inline-block text-sm font-medium text-[#B9C2D4] hover:text-white"
        >
          &larr; Kembali ke beranda
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-xl">
          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-bold text-emas-terang">
            O
          </div>
          <p className="mt-3 text-xs font-medium text-emas">SIDOMAS</p>
          <h1 className="mt-1 font-judul text-xl font-bold text-foreground">
            Login Ormas
          </h1>
          <p className="mt-1 text-sm text-teks-redup">
            Username &amp; password harian didapat dari admin Bakesbangpol.
            Password berganti otomatis setiap hari.
          </p>

          <form action={formAction} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="username"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                className="w-full rounded-md border border-garis px-3 py-2 text-sm text-foreground outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                placeholder="ormas-001"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-foreground"
              >
                Password Hari Ini
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-md border border-garis px-3 py-2 text-sm text-foreground outline-none focus:border-navy focus:ring-1 focus:ring-navy"
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
              className="w-full rounded-md bg-navy py-2 text-sm font-medium text-white transition hover:bg-navy-terang disabled:opacity-60"
            >
              {sedangMemproses ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-[#B9C2D4]">
          Lupa username/password? Hubungi admin Bakesbangpol.
        </p>
      </div>
    </div>
  );
}
