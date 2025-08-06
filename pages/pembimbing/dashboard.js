"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import PembimbingLayout from "@/components/layouts/PembimbingLayout";
import {
  UserCircle2,
  Users,
  BookOpen,
  FileText,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";

export default function DashboardPembimbing() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalPesertaMagang: 0,
    aktif: 0,
    selesai: 0,
    totalLogbookMagang: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData) {
          router.push("/login");
          return;
        }
        setUser(userData);

        const mahasiswaRes = await axios.get(
          `/api/pembimbing/${userData.id}/mahasiswa`
        );
        const mahasiswa = mahasiswaRes.data;

        setStats({
          totalPesertaMagang: mahasiswa.length,
          aktif: mahasiswa.filter((m) => new Date(m.selesai) > new Date())
            .length,
          selesai: mahasiswa.filter((m) => new Date(m.selesai) <= new Date())
            .length,
          totalLogbookMagang: mahasiswa.reduce(
            (acc, curr) => acc + (curr.logbooks?.length || 0),
            0
          ),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Gagal memuat data dashboard");
        if (error.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <PembimbingLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PembimbingLayout>
    );
  }

  return (
    <PembimbingLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <UserCircle2 className="text-blue-600" size={28} />
          Dashboard Pembimbing Magang
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Selamat datang, {user?.name} - Divisi {user?.divisi}
        </p>
      </div>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users size={24} />}
          title="Total Peserta Magang"
          value={stats.totalPesertaMagang}
          trend="up"
          percentage="12%"
          color="blue"
        />
        <StatCard
          icon={<Clock size={24} />}
          title="Sedang Magang"
          value={stats.aktif}
          trend="up"
          percentage="5%"
          color="green"
        />
        <StatCard
          icon={<Calendar size={24} />}
          title="Selesai"
          value={stats.selesai}
          trend="down"
          percentage="3%"
          color="purple"
        />
        <StatCard
          icon={<BookOpen size={24} />}
          title="Total Logbook Magang"
          value={stats.totalLogbookMagang}
          trend="up"
          percentage="24%"
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-3 space-y-6">
          {/* Quick Access Cards */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Akses Cepat
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickActionCard
                icon={<Users size={20} />}
                title="Peserta Magang"
                description="Kelola daftar peserta magang"
                onClick={() => router.push("/pembimbing/PesertaMagang")}
                color="blue"
              />
              <QuickActionCard
                icon={<BookOpen size={20} />}
                title="Review Logbook Magang"
                description="Tinjau logbook peserta"
                onClick={() => router.push("/pembimbing/LogbookMagang")}
                color="green"
              />
              <QuickActionCard
                icon={<FileText size={20} />}
                title="Laporan Akhir"
                description="Verifikasi laporan akhir"
                onClick={() => router.push("/pembimbing/laporanAkhir")}
                color="purple"
              />
            </div>
          </div>
        </div>
      </div>
    </PembimbingLayout>
  );
}

// StatCard Component with improved design
const StatCard = ({ icon, title, value, trend, percentage, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  const trendClasses = {
    up: "text-green-500",
    down: "text-red-500",
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
      {trend && percentage && (
        <div className="mt-3 flex items-center">
          <span className={`text-sm font-medium ${trendClasses[trend]}`}>
            {trend === "up" ? "↑" : "↓"} {percentage}
          </span>
          <span className="text-xs text-gray-500 ml-1">vs bulan lalu</span>
        </div>
      )}
    </div>
  );
};

// QuickActionCard Component with improved design
const QuickActionCard = ({ icon, title, description, onClick, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all text-left ${colorClasses[color]}`}
    >
      <div className={`p-3 rounded-full ${colorClasses[color]}`}>{icon}</div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <ChevronRight className="text-gray-400" size={20} />
    </button>
  );
};
