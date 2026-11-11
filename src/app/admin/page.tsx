// ============================================================
// Dashboard Admin
// ============================================================
import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { Ormas } from "@prisma/client";
import { Buildings, Newspaper, CheckCircle, Clock } from "@phosphor-icons/react/dist/ssr";
import { URUTAN_JENIS_DOKUMEN } from "@/lib/konstanta";
import { verifikasiTokenSesiAdmin, NAMA_COOKIE_SESI_ADMIN } from "@/lib/auth";
import { logoutAdminAction } from "./logout/actions";
import { ChartOrmasPerKategori, ChartStatusDokumen } from "./DashboardCharts";

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
        <Suspense fallback={<KerangkaDashboard />}>
          <IsiDashboard />
        </Suspense>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/admin/ormas"
            className="flex items-center gap-3 rounded-xl border border-garis bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emas hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/10 text-navy">
              <Buildings size={20} weight="duotone" aria-hidden="true" />
            </span>
            <div>
              <p className="font-judul font-semibold text-foreground">
                Kelola Ormas
              </p>
              <p className="text-xs text-teks-redup">
                Data, dokumen, dan kredensial login
              </p>
            </div>
          </Link>
          <Link
            href="/admin/berita"
            className="flex items-center gap-3 rounded-xl border border-garis bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emas hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy/10 text-navy">
              <Newspaper size={20} weight="duotone" aria-hidden="true" />
            </span>
            <div>
              <p className="font-judul font-semibold text-foreground">
                Berita &amp; Informasi
              </p>
              <p className="text-xs text-teks-redup">
                Pengumuman untuk halaman publik
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-garis bg-white p-4 text-center text-xs text-teks-redup">
          Password Harian, Manajemen Admin, Ekspor Data, Log Aktivitas &amp;
          Pengaturan menyusul di tahap berikutnya.
        </div>
      </main>
    </div>
  );
}

function KerangkaDashboard() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-20 animate-pulse rounded-xl border border-garis bg-white" />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="h-56 animate-pulse rounded-xl border border-garis bg-white" />
        <div className="h-56 animate-pulse rounded-xl border border-garis bg-white" />
      </div>
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

async function IsiDashboard() {
  const semuaOrmas = await prisma.ormas.findMany({
    include: { dokumen: true },
    orderBy: { createdAt: "desc" },
  });

  const totalWajib = URUTAN_JENIS_DOKUMEN.length;
  const ormasTerdaftar = semuaOrmas.length;
  const ormasAktif = semuaOrmas.filter((o: Ormas) => o.status === "AKTIF").length;
  const belumLengkap = semuaOrmas.filter(
    (o: Ormas & { dokumen: unknown[] }) => o.dokumen.length < totalWajib
  ).length;
  const perluVerifikasi = semuaOrmas.filter(
    (o: Ormas) => o.status === "MENUNGGU_VERIFIKASI"
  ).length;

  const perKategori = new Map<string, number>();
  for (const o of semuaOrmas) {
    perKategori.set(o.kategori, (perKategori.get(o.kategori) ?? 0) + 1);
  }
  const dataKategori = Array.from(perKategori.entries())
    .map(([kategori, jumlah]) => ({ kategori, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah);

  const ormasTerbaru = semuaOrmas.slice(0, 5);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KartuStat label="Ormas Terdaftar" angka={ormasTerdaftar} />
        <KartuStat label="Ormas Aktif" angka={ormasAktif} warna="sage" />
        <KartuStat
          label="Belum Lengkap Dokumen"
          angka={belumLengkap}
          warna="amber"
        />
        <KartuStat
          label="Perlu Diverifikasi"
          angka={perluVerifikasi}
          warna="navy"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-garis bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-judul text-sm font-semibold text-foreground">
            Ormas per Kategori
          </h2>
          <ChartOrmasPerKategori data={dataKategori} />
        </div>
        <div className="rounded-xl border border-garis bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-judul text-sm font-semibold text-foreground">
            Distribusi Status Dokumen
          </h2>
          <ChartStatusDokumen
            lengkap={ormasTerdaftar - belumLengkap}
            belumLengkap={belumLengkap}
          />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-garis bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-judul text-sm font-semibold text-foreground">
          Ormas Terbaru
        </h2>
        {ormasTerbaru.length === 0 ? (
          <p className="text-sm text-teks-redup">Belum ada ormas.</p>
        ) : (
          <ul className="divide-y divide-garis">
            {ormasTerbaru.map((ormas: Ormas & { dokumen: unknown[] }) => {
              const lengkap = ormas.dokumen.length >= totalWajib;
              return (
                <li
                  key={ormas.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-xs text-teks-redup">
                      {ormas.kodeOrmas}
                    </span>
                    <span className="font-medium text-foreground">
                      {ormas.nama}
                    </span>
                  </div>
                  <span
                    className={
                      lengkap
                        ? "flex items-center gap-1 rounded-full bg-sage-bg px-2 py-0.5 text-xs font-medium text-sage-teks"
                        : "flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
                    }
                  >
                    {lengkap ? (
                      <CheckCircle size={12} weight="fill" aria-hidden="true" />
                    ) : (
                      <Clock size={12} weight="fill" aria-hidden="true" />
                    )}
                    {lengkap ? "Lengkap" : "Belum Lengkap"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function KartuStat({
  label,
  angka,
  warna = "navy",
}: {
  label: string;
  angka: number;
  warna?: "navy" | "sage" | "amber";
}) {
  const warnaTeks =
    warna === "sage"
      ? "text-sage-teks"
      : warna === "amber"
      ? "text-amber-700"
      : "text-navy";
  const warnaBorder =
    warna === "sage"
      ? "border-sage/40"
      : warna === "amber"
      ? "border-amber-300"
      : "border-garis";

  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm ${warnaBorder}`}>
      <p className="text-xs text-teks-redup">{label}</p>
      <p className={`mt-1 font-judul text-2xl font-bold ${warnaTeks}`}>
        {angka}
      </p>
    </div>
  );
}
