// ============================================================
// Dashboard Admin
// ============================================================
import { Suspense } from "react";
import { cookies } from "next/headers";
import { verifikasiTokenSesiAdmin, NAMA_COOKIE_SESI_ADMIN } from "@/lib/auth";
import { logoutAdminAction } from "./logout/actions";

export default function DashboardAdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-navy">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-xs font-medium text-emas-terang">SIDOMAS</p>
            <h1 className="font-judul text-lg font-bold text-white">
              Dashboard Admin
            </h1>
          </div>
          <Suspense fallback={null}>
            <InfoAdminDanLogout />
          </Suspense>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href="/admin/ormas"
            className="group rounded-xl border border-garis bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emas hover:shadow-md"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-navy/10 text-navy">
              🏢
            </div>
            <h3 className="font-judul font-semibold text-foreground">
              Kelola Ormas
            </h3>
            <p className="mt-1 text-sm text-teks-redup">
              Tambah ormas baru, lihat kelengkapan dokumen, dan kredensial
              login portal.
            </p>
          </a>
          <a
            href="/admin/berita"
            className="group rounded-xl border border-garis bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emas hover:shadow-md"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-navy/10 text-navy">
              📰
            </div>
            <h3 className="font-judul font-semibold text-foreground">
              Berita &amp; Informasi
            </h3>
            <p className="mt-1 text-sm text-teks-redup">
              Tulis dan kelola pengumuman yang tampil di halaman publik.
            </p>
          </a>
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-garis bg-white p-6 text-center text-sm text-teks-redup">
          Statistik, ekspor data, dan log aktivitas akan menyusul di tahap
          berikutnya.
        </div>
      </main>
    </div>
  );
}

async function InfoAdminDanLogout() {
  const cookieStore = await cookies();
  const token = cookieStore.get(NAMA_COOKIE_SESI_ADMIN)?.value;
  const sesi = token ? await verifikasiTokenSesiAdmin(token) : null;

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium text-white">
          {sesi?.nama ?? "Admin"}
        </p>
        <p className="text-xs text-[#B9C2D4]">{sesi?.email}</p>
      </div>
      <form action={logoutAdminAction}>
        <button
          type="submit"
          className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white transition hover:bg-white/20"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
