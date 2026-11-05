# Panduan SIDOMAS (untuk kamu, si anak magang 😄)

Dokumen ini isinya catatan tiap tahap biar kamu nggak lupa "kenapa" sesuatu dibuat.

## Struktur Folder

```
src/
  app/
    (public)/      -> halaman yang bisa diakses semua orang (katalog ormas, peta sebaran)
    (admin)/admin/  -> halaman khusus admin Bakesbangpol (perlu login admin)
    (ormas)/portal/ -> halaman khusus portal ormas (perlu login ormas)
    api/            -> "route handler", tempat logika backend (cek login, simpan data, dll)
  components/
    ui/        -> komponen kecil yang dipakai berulang (tombol, input, kartu)
    public/    -> komponen khusus halaman publik
    admin/     -> komponen khusus dashboard admin
    ormas/     -> komponen khusus portal ormas
  lib/         -> fungsi bantuan (koneksi database, hash password, kirim email, dll)
prisma/
  schema.prisma -> "cetak biru" semua tabel database
```

Kenapa dipisah pakai folder `(public)`, `(admin)`, `(ormas)`? Di Next.js, folder
dengan tanda kurung `()` itu namanya **route group** — gunanya buat mengelompokkan
halaman tanpa folder itu muncul di URL, dan supaya tiap grup bisa punya "pintu
masuk" (middleware/layout) keamanan yang beda-beda. Jadi nanti gampang bikin
aturan: "semua yang di dalam `(admin)` wajib login sebagai admin dulu."

## Kenapa desain tabel database begini?

- **Ormas** = data inti tiap organisasi. Statusnya ada 3: `AKTIF` (tampil ke publik),
  `MENUNGGU_VERIFIKASI` (baru daftar sendiri), `NONAKTIF`.
- **Dokumen** = dokumen yang SEDANG berlaku. Isinya cuma *pointer* (ID) ke file di
  Google Drive, bukan file-nya sendiri — jadi database tetap ringan dan gratis.
- **DokumenVersi** = riwayat dokumen lama. Setiap kali dokumen diganti, versi lama
  dipindah ke sini dulu, baru yang baru masuk ke `Dokumen`. Jadi nggak pernah ada
  data hilang.
- **TokenAksesDokumen** = ini yang bikin PDF ormas AMAN. Alih-alih kasih link
  Google Drive yang bisa diakses siapa saja, sistem akan membuatkan "tiket masuk"
  sementara (token acak) yang expired dalam beberapa menit. Jadi nggak ada URL
  tetap yang bisa disebar orang lain.
- **KredensialHarian** = username+password portal ormas yang diganti tiap hari.
  Hanya admin yang bisa men-generate dan melihatnya (ormas dikasih tahu lewat
  cara offline, misal WhatsApp/telepon oleh admin — bukan lewat sistem, sesuai
  requirement "hanya admin yang bisa lihat kredensial itu").
- **PerubahanPending** = setiap kali ormas edit data dari portalnya, perubahan
  itu DITAMPUNG dulu di tabel ini (statusnya `PENDING`), BUKAN langsung menimpa
  data di tabel `Ormas`. Baru kalau admin klik "setujui", sistem menyalin data
  dari `PerubahanPending` ke tabel `Ormas` yang asli.
- **LogAktivitas** = jejak audit. Siapa ngapain, kapan, dari IP mana.

## Status progres

- [x] Project Next.js + TypeScript + Tailwind dibuat
- [x] Skema database (Prisma) dirancang — BELUM disambungkan ke database asli
- [ ] Setup akun Neon, Vercel, Resend (perlu persetujuan kamu dulu)
- [ ] Autentikasi admin & ormas
- [ ] Katalog publik
- [ ] dst (lihat task list)
