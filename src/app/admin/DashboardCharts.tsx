"use client";
// ============================================================
// Chart Dashboard Admin (Recharts)
// ============================================================
// "use client" wajib -- Recharts butuh ukuran browser (ResizeObserver)
// buat gambar grafiknya, jadi nggak bisa dirender di server.
// ============================================================
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const WARNA_NAVY = "#1B2A4A";
const WARNA_SAGE = "#5B7F6D";
const WARNA_EMAS = "#B38B2D";

export function ChartOrmasPerKategori({
  data,
}: {
  data: { kategori: string; jumlah: number }[];
}) {
  if (data.length === 0) {
    return (
      <p className="flex h-[220px] items-center justify-center text-sm text-teks-redup">
        Belum ada data.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="kategori"
          width={110}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          formatter={(nilai: number) => [`${nilai} ormas`, "Jumlah"]}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Bar dataKey="jumlah" fill={WARNA_NAVY} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ChartStatusDokumen({
  lengkap,
  belumLengkap,
}: {
  lengkap: number;
  belumLengkap: number;
}) {
  const data = [
    { nama: "Lengkap", nilai: lengkap, warna: WARNA_SAGE },
    { nama: "Belum Lengkap", nilai: belumLengkap, warna: WARNA_EMAS },
  ].filter((d) => d.nilai > 0);

  if (data.length === 0) {
    return (
      <p className="flex h-[220px] items-center justify-center text-sm text-teks-redup">
        Belum ada data.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="nilai"
          nameKey="nama"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={2}
        >
          {data.map((d) => (
            <Cell key={d.nama} fill={d.warna} />
          ))}
        </Pie>
        <Tooltip
          formatter={(nilai: number, nama: string) => [`${nilai} ormas`, nama]}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Legend
          verticalAlign="bottom"
          height={28}
          formatter={(nilai) => <span style={{ fontSize: 12 }}>{nilai}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
