// ============================================================
// Dashboard Admin (masih kerangka awal)
// ============================================================
// Halaman ini TERKUNCI -- cuma bisa diakses kalau sudah login,
// karena middleware.ts (di folder paling luar project) mengecek
// cookie sesi SEBELUM request sampai ke halaman ini.
//
// Statistik, kelola data ormas, dll akan ditambah di tahap
// berikutnya. Untuk sekarang, cuma tampilkan nama admin yang
// login + tombol logout, buat buktikan sistem login-nya jalan.
// ============================================================
import { Suspense } from "react";
import { cookies } from "next/headers";
import { verifikasiTokenSesiAdmin, NAMA_COOKIE_SESI_ADMIN } from "@/lib/auth";
import { logoutAdminAction } from "./logout/actions";

export default function DashboardAdminPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-medium text-emerald-700">SIDOMAS</p>
            <h1 className="text-lg font-bold text-zinc-900">
              Dashboard Admin
            </h1>
          </div>
          <Suspense fallback={null}>
            <InfoAdminDanLogout />
          </Suspense>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
          Statistik, kelola ormas, dan fitur lainnya akan menyusul di tahap
          berikutnya.
        </div>
      </main>
    </div>
  );
}

// Dipisah jadi komponen sendiri + dibungkus <Suspense> karena baca
// cookies() dianggap "data runtime" oleh Next.js 16 (lihat catatan
// yang sama di src/app/page.tsx).
async function InfoAdminDanLogout() {
  const cookieStore = await cookies();
  const token = cookieStore.get(NAMA_COOKIE_SESI_ADMIN)?.value;
  const sesi = token ? await verifikasiTokenSesiAdmin(token) : null;

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium text-zinc-900">
          {sesi?.nama ?? "Admin"}
        </p>
        <p className="text-xs text-zinc-500">{sesi?.email}</p>
      </div>
      <form action={logoutAdminAction}>
        <button
          type="submit"
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-100"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
