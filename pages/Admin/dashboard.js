"use client";

import Head from "next/head";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AdminLayout from "../../components/layouts/AdminLayouts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import {
  UserPlus,
  FileText,
  CheckCircle,
  XCircle,
  Users,
  Clock,
  CheckSquare,
  BookOpen,
  Activity,
  RefreshCw,
  AlertCircle,
} from "react-feather";
import { toast } from "react-toastify";
import ProtectedRoute from "../../components/ProtectedRoute";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPendaftar: 0,
    totalDisetujui: 0,
    totalMenunggu: 0,
    totalLogbook: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pendaftaran");
      const data = res.data;

      // Calculate statistics from the data
      const totalPendaftar = data.length;
      const totalDisetujui = data.filter(
        (p) => p.status === "disetujui"
      ).length;
      const totalMenunggu = data.filter((p) => p.status === "pending").length;

      // For logbook count, you might need a separate API endpoint
      // Here we're just using a placeholder
      const totalLogbook = data.reduce(
        (acc, curr) => acc + (curr.logbooks ? curr.logbooks.length : 0),
        0
      );

      setStats({
        totalPendaftar,
        totalDisetujui,
        totalMenunggu,
        totalLogbook,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError("Gagal memuat statistik");
      toast.error("Gagal memuat data statistik", { position: "bottom-right" });
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    try {
      // Fetch recent activities - you might need to implement this endpoint
      const res = await axios.get(
        "http://localhost:5000/api/aktivitas-terbaru"
      );
      setActivities(res.data);
    } catch (err) {
      console.error("Failed to fetch activities:", err);
      setError("Gagal memuat aktivitas terbaru");
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchStats(), fetchActivities()]);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Gagal memuat data dashboard");
      toast.error("Gagal memuat data dashboard", { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  }, [fetchStats, fetchActivities]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const chartData = [
    { name: "Pendaftar", jumlah: stats.totalPendaftar },
    { name: "Disetujui", jumlah: stats.totalDisetujui },
    { name: "Menunggu", jumlah: stats.totalMenunggu },
    { name: "Logbook", jumlah: stats.totalLogbook },
  ];

  const formatTime = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "pendaftaran":
        return <UserPlus className="text-blue-500 w-5 h-5" />;
      case "logbook":
        return <FileText className="text-purple-500 w-5 h-5" />;
      case "disetujui":
        return <CheckCircle className="text-green-500 w-5 h-5" />;
      case "ditolak":
        return <XCircle className="text-red-500 w-5 h-5" />;
      default:
        return <Activity className="text-gray-500 w-5 h-5" />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminLayout>
        <Head>
          <title>Dashboard Admin | Kominfo Palembang</title>
        </Head>

        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-sky-500 text-white p-6 rounded-xl shadow flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Selamat Datang, Admin</h1>
              <p className="text-sm text-white/80 mt-1">
                Panel Kendali Magang Kominfo Palembang
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {lastUpdated && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  Terakhir diperbarui: {formatTime(lastUpdated)}
                </span>
              )}
              <button
                onClick={fetchAllData}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
                disabled={loading}
                aria-label="Refresh data"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Statistik Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={<Users className="text-blue-500" />}
              title="Total Pendaftar"
              value={stats.totalPendaftar}
              loading={loading}
            />
            <StatCard
              icon={<CheckSquare className="text-green-500" />}
              title="Disetujui"
              value={stats.totalDisetujui}
              loading={loading}
            />
            <StatCard
              icon={<Clock className="text-yellow-500" />}
              title="Menunggu"
              value={stats.totalMenunggu}
              loading={loading}
            />
            <StatCard
              icon={<BookOpen className="text-purple-500" />}
              title="Logbook"
              value={stats.totalLogbook}
              loading={loading}
            />
          </div>

          {/* Grafik Statistik */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Grafik Statistik</h2>
              <div className="text-sm text-gray-500">Data Real-time</div>
            </div>
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-pulse text-gray-400">
                    Memuat data grafik...
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="jumlah"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1000}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Aktivitas Terbaru */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Aktivitas Terbaru</h2>
              <span className="text-sm text-gray-500">
                {activities.length} aktivitas
              </span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center space-x-3"
                  >
                    <div className="rounded-full bg-gray-200 h-5 w-5"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              <ul className="space-y-3">
                {activities.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition"
                  >
                    <div className="flex-shrink-0">
                      {getActivityIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{item.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(item.timestamp).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="mx-auto w-8 h-8 mb-2" />
                <p>Tidak ada aktivitas terbaru</p>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

function StatCard({ icon, title, value, loading }) {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex items-center space-x-4 hover:shadow-md transition">
      <div className="p-3 rounded-full bg-gray-50 text-gray-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        {loading ? (
          <div className="h-6 w-12 bg-gray-200 rounded mt-1 animate-pulse"></div>
        ) : (
          <p className="text-xl font-bold text-gray-800">{value}</p>
        )}
      </div>
    </div>
  );
}
