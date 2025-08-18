"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import AdminLayout from "@/components/layouts/AdminLayouts";
import {
  FileText,
  Search,
  Frown,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Eye,
  FileCheck,
  Clock,
  FileX,
  Download,
  BookOpen,
} from "lucide-react";

export default function DataLaporanAkhir() {
  const router = useRouter();
  const [laporan, setLaporan] = useState([]);
  const [pendaftar, setPendaftar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const pendaftarResponse = await axios.get(
          "http://localhost:5000/api/pendaftaran",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPendaftar(pendaftarResponse.data);

        const dataWithLaporan = pendaftarResponse.data.filter(
          (item) => item.laporanAkhir && item.status === "disetujui"
        );

        const formattedData = pendaftarResponse.data.map((item) => ({
          id: item._id,
          nama: item.nama,
          email: item.email,
          institusi: item.institusi,
          periode:
            item.mulai && item.selesai
              ? `${new Date(item.mulai).toLocaleDateString(
                  "id-ID"
                )} - ${new Date(item.selesai).toLocaleDateString("id-ID")}`
              : "-",
          laporan: item.laporanAkhir || null,
          tanggalUpload: item.laporanUploadDate || item.updatedAt,
          status: item.laporanVerified
            ? "verified"
            : item.laporanAkhir
            ? "pending"
            : "none",
          hasReport: !!item.laporanAkhir,
        }));

        setLaporan(formattedData);
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
      l.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.institusi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewReport = (filename) => {
    window.open(`http://localhost:5000/uploads/${filename}`, "_blank");
  };

  const handleVerify = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/pendaftaran/${id}/verify-laporan`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Laporan berhasil diverifikasi");
      // Update local state
      setLaporan(
        laporan.map((item) =>
          item.id === id ? { ...item, status: "verified" } : item
        )
      );
    } catch (error) {
      console.error("Error verifying:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Gagal memverifikasi laporan");
      }
    }
  };

  const handleDownloadReport = async (filename) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/download-laporan/${filename}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Gagal mengunduh laporan");
    }
  };
  const handleViewLogbook = (id) => {
    router.push(`/pembimbing/LogbookMagang?id=${id}`);
  };
  // Tambahkan tombol download di kolom aksi
  <button
    onClick={() => handleDownloadReport(l.laporan)}
    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
    title="Download Laporan"
  >
    <Download size={18} />
  </button>;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Data Laporan Akhir
            </h1>
            <p className="text-gray-500 text-sm">
              Kelola laporan akhir peserta magang
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={18} />
              </div>
              <input
                type="text"
                placeholder="Cari peserta atau institusi..."
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="hidden md:inline">Total:</span>
              <span className="font-medium text-gray-700">
                {filteredLaporan.length} Peserta
              </span>
            </div>
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
                    Institusi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredLaporan.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <User size={18} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {l.nama || "-"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {l.email || "-"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {l.institusi || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar size={14} className="text-gray-400" />
                        {l.periode || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {l.status === "verified" ? (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FileCheck size={14} className="mr-1" />
                          Terverifikasi
                        </div>
                      ) : l.status === "pending" ? (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock size={14} className="mr-1" />
                          Menunggu
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <FileX size={14} className="mr-1" />
                          Belum Upload
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {l.hasReport ? (
                          <>
                            <button
                              onClick={() => handleViewReport(l.laporan)}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Lihat Laporan"
                            >
                              <Eye size={18} />
                            </button>
                            {l.status === "pending" && (
                              <button
                                onClick={() => handleVerify(l.id)}
                                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                title="Verifikasi"
                              >
                                <CheckCircle size={18} />
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-400 px-3 py-2">
                            -
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <Frown size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Tidak ada data ditemukan
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              {searchTerm
                ? "Tidak ada peserta yang cocok dengan pencarian Anda"
                : "Belum ada laporan yang tersedia"}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
