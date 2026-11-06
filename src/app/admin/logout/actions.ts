"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NAMA_COOKIE_SESI_ADMIN } from "@/lib/auth";

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete(NAMA_COOKIE_SESI_ADMIN);
  redirect("/admin/login");
}
