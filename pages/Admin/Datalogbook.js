"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import AdminLayout from "@/components/layouts/AdminLayouts";
import {
  BookOpen,
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
} from "lucide-react";
import Head from "next/head";

export default function DataLogbook() {
  const router = useRouter();
  const [logbooks, setLogbooks] = useState([]);
  const [pendaftar, setPendaftar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch data pendaftaran
        const pendaftarResponse = await axios.get(
          "http://localhost:5000/api/pendaftaran",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPendaftar(pendaftarResponse.data);

        // Format data untuk logbook
        const formattedData = pendaftarResponse.data.map((item) => ({
          id: item._id,
          nama: item.nama || item.namaLengkap,
          email: item.email,
          institusi: item.institusi || item.universitas,
          periode:
            item.mulai && item.selesai
              ? `${new Date(item.mulai).toLocaleDateString(
                  "id-ID"
                )} - ${new Date(item.selesai).toLocaleDateString("id-ID")}`
              : "-",
          jumlahLogbook: item.logbooks ? item.logbooks.length : 0,
          status:
            item.logbooks && item.logbooks.length > 0 ? "tersedia" : "none",
          pembimbing: item.pembimbing?.nama || "Belum ada",
        }));

        setLogbooks(formattedData);
      } catch (error) {
        console.error("Error fetching logbooks:", error);
        toast.error("Gagal memuat data logbook");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const filteredLogbooks = logbooks.filter(
    (l) =>
      l.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.institusi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.pembimbing?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewLogbook = (id) => {
    router.push(`/admin/logbooks/${id}`);
  };

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
      <Head>
        <title>Data Logbook| Kominfo Palembang</title>
      </Head>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Data Logbook Magang
            </h1>
            <p className="text-gray-500 text-sm">
              Kelola logbook peserta magang
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
                placeholder="Cari peserta, institusi, atau pembimbing..."
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="hidden md:inline">Total:</span>
              <span className="font-medium text-gray-700">
                {filteredLogbooks.length} Peserta
              </span>
            </div>
          </div>
        </div>

        {filteredLogbooks.length > 0 ? (
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
                    Pembimbing
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
                {filteredLogbooks.map((l) => (
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
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {l.pembimbing || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar size={14} className="text-gray-400" />
                        {l.periode || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {l.status === "tersedia" ? (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FileCheck size={14} className="mr-1" />
                          {l.jumlahLogbook} Logbook
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <FileX size={14} className="mr-1" />
                          Belum Ada
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {l.hasReport ? (
                          <>
                            <button
                              onClick={() => handleViewReport(l.laporan)}
                              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            >
                              <Eye size={16} />
                              <span className="text-sm">Lihat</span>
                            </button>
                            <button
                              onClick={() => handleDownloadReport(l.laporan)}
                              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            >
                              <Download size={16} />
                              <span className="text-sm">Unduh</span>
                            </button>
                            {l.status === "pending" && (
                              <button
                                onClick={() => handleVerify(l.id)}
                                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                              >
                                <CheckCircle size={16} />
                                <span className="text-sm">Verifikasi</span>
                              </button>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-400 px-3 py-2">
                            -
                          </span>
                        )}
                        {/* Tombol Lihat Logbook */}
                        <button
                          onClick={() =>
                            router.push(`/admin/logbook-mahasiswa/${l.id}`)
                          }
                          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                        >
                          <BookOpen size={16} />
                          <span className="text-sm">Logbook</span>
                        </button>
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
                : "Belum ada logbook yang tersedia"}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
