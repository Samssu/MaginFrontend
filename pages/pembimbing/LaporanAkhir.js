"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import PembimbingLayout from "@/components/layouts/PembimbingLayout";
import {
  FileText,
  ChevronRight,
  Search,
  Frown,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function LaporanAkhir() {
  const router = useRouter();
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          router.push("/login");
          return;
        }

        const response = await axios.get(`/api/pembimbing/${user.id}/laporan`);
        setLaporan(response.data);
      } catch (error) {
        console.error("Error fetching laporan:", error);
        toast.error("Gagal memuat data laporan");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const filteredLaporan = laporan.filter(
    (l) =>
      l.mahasiswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <FileText size={28} className="text-blue-600" />
          Laporan Akhir
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Verifikasi laporan akhir peserta magang
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari laporan..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredLaporan.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Peserta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Judul Laporan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Pengumpulan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLaporan.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {l.mahasiswa.nama}
                          </div>
                          <div className="text-sm text-gray-500">
                            {l.mahasiswa.nim}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {l.judul}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(l.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {l.status === "verified" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Terverifikasi
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Menunggu Verifikasi
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          router.push(`/pembimbing/laporanAkhir/${l.id}`)
                        }
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        Detail <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Frown className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Tidak ada laporan
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Tidak ditemukan hasil pencarian"
                : "Belum ada laporan yang perlu diverifikasi"}
            </p>
          </div>
        )}
      </div>
    </PembimbingLayout>
  );
}
