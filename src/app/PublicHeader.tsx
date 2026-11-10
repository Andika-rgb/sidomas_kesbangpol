import Link from "next/link";

export default function PublicHeader({
  halamanAktif,
}: {
  halamanAktif: "beranda" | "katalog";
}) {
  return (
    <header className="bg-navy">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="font-judul text-lg font-bold text-white">
          SIDOMAS
        </Link>
        <nav className="flex flex-wrap items-center gap-5 text-sm">
          <Link
            href="/"
            className={
              halamanAktif === "beranda"
                ? "border-b-2 border-emas pb-0.5 text-emas-terang"
                : "text-[#B9C2D4] transition hover:text-white"
            }
          >
            Beranda
          </Link>
          <Link
            href="/katalog"
            className={
              halamanAktif === "katalog"
                ? "border-b-2 border-emas pb-0.5 text-emas-terang"
                : "text-[#B9C2D4] transition hover:text-white"
            }
          >
            Katalog Ormas
          </Link>
          <Link
            href="/ormas/login"
            className="text-[#B9C2D4] transition hover:text-white"
          >
            Login Ormas
          </Link>
          <Link
            href="/admin/login"
            className="rounded-md bg-emas px-3 py-1.5 font-medium text-navy transition hover:brightness-110"
          >
            Login Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
