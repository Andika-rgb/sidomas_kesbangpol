// ============================================================
// Proxy (dulu namanya "middleware" di versi Next.js sebelum 16)
// ============================================================
// File ini jalan SEBELUM request sampai ke halaman manapun di
// /admin/**. Tugasnya seperti "satpam di pintu masuk":
// - Kalau belum login & mau buka halaman admin -> lempar ke /admin/login
// - Kalau SUDAH login & malah buka /admin/login -> lempar ke /admin
//   (nggak masuk akal orang yang sudah login disuruh login lagi)
// ============================================================
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifikasiTokenSesiAdmin, NAMA_COOKIE_SESI_ADMIN } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(NAMA_COOKIE_SESI_ADMIN)?.value;
  const sesi = token ? await verifikasiTokenSesiAdmin(token) : null;

  const halamanLogin = pathname === "/admin/login";

  if (!sesi && !halamanLogin) {
    // Belum login, dan sedang coba buka halaman admin selain login.
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (sesi && halamanLogin) {
    // Sudah login, tapi malah buka halaman login -> arahkan ke dashboard.
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Proxy ini HANYA dijalankan untuk path yang dimulai dengan /admin
// (jadi tidak memperlambat halaman publik seperti katalog ormas).
export const config = {
  matcher: ["/admin/:path*"],
};
