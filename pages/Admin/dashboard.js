"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/layouts/AdminLayouts";
import {
  Users,
  UserPlus,
  UserCheck,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [dataStatistik, setDataStatistik] = useState({
    totalPendaftar: 0,
    totalDisetujui: 0,
    totalMenunggu: 0,
    totalLogbook: 0,
  });

  const [aktivitasTerbaru, setAktivitasTerbaru] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/statistik"); // Sesuaikan dengan endpoint backend
        setDataStatistik(res.data);

        const resAktivitas = await axios.get(
          "http://localhost:5000/admin/aktivitas-terbaru"
        );
        setAktivitasTerbaru(resAktivitas.data);
      } catch (err) {
        console.error("Gagal mengambil data statistik:", err);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { name: "Pendaftar", jumlah: dataStatistik.totalPendaftar },
    { name: "Disetujui", jumlah: dataStatistik.totalDisetujui },
    { name: "Menunggu", jumlah: dataStatistik.totalMenunggu },
    { name: "Logbook", jumlah: dataStatistik.totalLogbook },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>

        {/* Statistik Box */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<UserPlus className="text-blue-600" />}
            title="Total Pendaftar"
            value={dataStatistik.totalPendaftar}
          />
          <StatCard
            icon={<UserCheck className="text-green-600" />}
            title="Disetujui"
            value={dataStatistik.totalDisetujui}
          />
          <StatCard
            icon={<Clock className="text-yellow-500" />}
            title="Menunggu"
            value={dataStatistik.totalMenunggu}
          />
          <StatCard
            icon={<FileText className="text-purple-600" />}
            title="Total Logbook"
            value={dataStatistik.totalLogbook}
          />
        </div>

        {/* Grafik */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">Grafik Statistik</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="jumlah" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h2>
          <ul className="space-y-2">
            {aktivitasTerbaru.map((item, index) => (
              <li key={index} className="flex items-center space-x-2 text-sm">
                {item.type === "pendaftaran" && (
                  <UserPlus className="text-blue-500 w-4 h-4" />
                )}
                {item.type === "logbook" && (
                  <FileText className="text-purple-500 w-4 h-4" />
                )}
                {item.type === "disetujui" && (
                  <CheckCircle className="text-green-500 w-4 h-4" />
                )}
                {item.type === "ditolak" && (
                  <XCircle className="text-red-500 w-4 h-4" />
                )}
                <span>{item.message}</span>
                <span className="text-gray-400 text-xs">
                  ({item.timestamp})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded shadow p-4 flex items-center space-x-4">
      <div className="p-2 rounded-full bg-gray-100">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
