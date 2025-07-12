"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import AdminLayout from "../../components/layouts/AdminLayouts";
import axios from "axios";
import { Users, UserPlus, UserCheck, FileText } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState({});
  const [recent, setRecent] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.replace("/login");
    try {
      const decoded = jwt.decode(token);
      if (decoded.role !== "admin") throw Error();
      setAuthorized(true);
      fetchStats();
      fetchRecent();
    } catch {
      router.replace("/login");
    }
  }, [router]);

  const fetchStats = async () => {
    const { data } = await axios.get("/api/pendaftaran/stats");
    setStats(data);
  };

  const fetchRecent = async () => {
    const { data } = await axios.get("/api/pendaftaran/recent");
    setRecent(data);
  };

  if (!authorized)
    return (
      <div className="flex h-screen justify-center items-center">
        <p>Loading...</p>
      </div>
    );

  const cards = [
    {
      title: "Jumlah Pendaftar",
      value: stats.total,
      icon: <Users className="w-8 h-8 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      title: "Pengajuan Baru",
      value: stats.new,
      icon: <UserPlus className="w-8 h-8 text-purple-600" />,
      bg: "bg-purple-50",
    },
    {
      title: "Disetujui",
      value: stats.approved,
      icon: <UserCheck className="w-8 h-8 text-green-600" />,
      bg: "bg-green-50",
    },
    {
      title: "Ditolak",
      value: stats.rejected,
      icon: <FileText className="w-8 h-8 text-orange-600" />,
      bg: "bg-orange-50",
    },
  ];

  const chartData = stats.daily || [];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-gray-500">Selamat datang kembali 👋</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map((c, i) => (
          <div
            key={i}
            className={`p-5 rounded-xl shadow hover:shadow-lg transition border ${c.bg}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{c.title}</p>
                <p className="text-3xl font-bold">{c.value}</p>
              </div>
              <div className="p-2 bg-white rounded-full shadow-inner">
                {c.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Tren Pendaftaran (7 Hari Terakhir)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#4F46E5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h2>
          <ul className="space-y-4 max-h-64 overflow-y-auto">
            {recent.map((r) => (
              <li
                key={r._id}
                className="flex justify-between items-center py-2 border-b"
              >
                <div>
                  <p className="font-medium">{r.nama}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    r.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : r.status === "disetujui"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  } capitalize`}
                >
                  {r.status}
                </span>
              </li>
            ))}
            {recent.length === 0 && (
              <li className="text-center text-gray-500">
                Tidak ada aktivitas.
              </li>
            )}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
