"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NAMA_COOKIE_SESI_ORMAS } from "@/lib/ormas-auth";

export async function logoutOrmasAction() {
  const cookieStore = await cookies();
  cookieStore.delete(NAMA_COOKIE_SESI_ORMAS);
  redirect("/ormas/login");
}
