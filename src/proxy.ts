// ============================================================
// Proxy (dulu namanya "middleware" di versi Next.js sebelum 16)
// ============================================================
// File ini jalan SEBELUM request sampai ke halaman manapun di
// /admin/** dan /ormas/**. Tugasnya seperti "satpam di 2 pintu
// masuk berbeda":
// - /admin/** dijaga pakai cookie sesi ADMIN
// - /ormas/** dijaga pakai cookie sesi ORMAS (terpisah total,
//   supaya ormas tidak mungkin "nyasar" lihat halaman admin)
// ============================================================
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifikasiTokenSesiAdmin, NAMA_COOKIE_SESI_ADMIN } from "@/lib/auth";
import {
  verifikasiTokenSesiOrmas,
  NAMA_COOKIE_SESI_ORMAS,
} from "@/lib/ormas-auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return jagaHalamanAdmin(request, pathname);
  }

  if (pathname.startsWith("/ormas")) {
    return jagaHalamanOrmas(request, pathname);
  }

  return NextResponse.next();
}

async function jagaHalamanAdmin(request: NextRequest, pathname: string) {
  const token = request.cookies.get(NAMA_COOKIE_SESI_ADMIN)?.value;
  const sesi = token ? await verifikasiTokenSesiAdmin(token) : null;
  const halamanLogin = pathname === "/admin/login";

  if (!sesi && !halamanLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  if (sesi && halamanLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

async function jagaHalamanOrmas(request: NextRequest, pathname: string) {
  const token = request.cookies.get(NAMA_COOKIE_SESI_ORMAS)?.value;
  const sesi = token ? await verifikasiTokenSesiOrmas(token) : null;
  const halamanLogin = pathname === "/ormas/login";

  if (!sesi && !halamanLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/ormas/login";
    return NextResponse.redirect(url);
  }
  if (sesi && halamanLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/ormas";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/ormas/:path*"],
};
