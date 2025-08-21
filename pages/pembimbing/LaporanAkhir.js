import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import PembimbingLayout from "@/components/layouts/PembimbingLayout";
import {
  FileText,
  Search,
  Frown,
  Calendar,
  User,
  Eye,
  FileCheck,
  Clock,
  FileX,
} from "lucide-react";
import Head from "next/head";

export default function DataLaporanAkhir() {
  const router = useRouter();
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Ambil data user dari localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData && userData.role) {
      setUserRole(userData.role);
      setUserId(userData.id || userData._id);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Token tidak ditemukan. Silakan login kembali.");
          setLoading(false);
          return;
        }

        let apiUrl = "http://localhost:5000/api/pendaftaran";

        // Jika user adalah pembimbing, ambil hanya mahasiswa bimbingannya
        if (userRole === "pembimbing" && userId) {
          apiUrl = `http://localhost:5000/api/pembimbing/${userId}/mahasiswa`;
        }

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Format data sesuai response
        const dataToFormat = response.data;
        const formattedData = dataToFormat.map((item) => ({
          id: item._id,
          nama: item.nama,
          email: item.email,
          institusi: item.institusi,
          mulai: item.mulai,
          selesai: item.selesai,
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
          pembimbing: item.pembimbing || null,
          admin: item.admin || null,
          laporanVerified: item.laporanVerified || false,
          laporanVerificationDate: item.laporanVerificationDate || null,
        }));

        setLaporan(formattedData);
      } catch (error) {
        console.error("Error fetching laporan:", error);
        if (error.response?.status === 401) {
          toast.error("Sesi telah berakhir. Silakan login kembali.");
          router.push("/login");
        } else if (error.response?.status === 403) {
          toast.error("Anda tidak memiliki akses ke data ini.");
        } else {
          toast.error("Gagal memuat data laporan. Silakan coba lagi.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchData();
    }
  }, [router, userRole, userId]);

  const filteredLaporan = laporan.filter(
    (l) =>
      l.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.institusi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewReport = (filename) => {
    if (!filename) {
      toast.error("File laporan tidak tersedia");
      return;
    }

    const decodedFilename = decodeURIComponent(filename);
    window.open(
      `http://localhost:5000/api/download-laporan/${decodedFilename}`,
      "_blank"
    );
  };

  const handleViewDetail = (laporan) => {
    setSelectedLaporan(laporan);
  };

  const handleVerification = async (verifier) => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem("token");

      // Data yang sangat sederhana untuk menghindari error 500
      const requestData = {
        verifier: verifier,
      };

      // Endpoint untuk verifikasi laporan
      const endpoint = `http://localhost:5000/api/pendaftaran/${selectedLaporan.id}/verify-laporan`;

      const response = await axios.patch(endpoint, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Jika verifikasi berhasil, update state
      if (response.status === 200) {
        // Update local state berdasarkan verifier
        const updatedLaporan = laporan.map((item) =>
          item.id === selectedLaporan.id
            ? {
                ...item,
                status: verifier === "admin" ? "verified" : item.status,
                pembimbing:
                  verifier === "pembimbing"
                    ? {
                        ...item.pembimbing,
                        status: "verified",
                      }
                    : item.pembimbing,
                admin:
                  verifier === "admin"
                    ? {
                        ...item.admin,
                        status: "verified",
                      }
                    : item.admin,
                laporanVerified:
                  verifier === "admin" ? true : item.laporanVerified,
                laporanVerificationDate: new Date().toISOString(),
              }
            : item
        );

        setLaporan(updatedLaporan);

        // Update selectedLaporan untuk modal
        setSelectedLaporan((prev) => ({
          ...prev,
          status: verifier === "admin" ? "verified" : prev.status,
          pembimbing:
            verifier === "pembimbing"
              ? {
                  ...prev.pembimbing,
                  status: "verified",
                }
              : prev.pembimbing,
          admin:
            verifier === "admin"
              ? {
                  ...prev.admin,
                  status: "verified",
                }
              : prev.admin,
          laporanVerified: verifier === "admin" ? true : prev.laporanVerified,
          laporanVerificationDate: new Date().toISOString(),
        }));

        toast.success(`Laporan berhasil diverifikasi oleh ${verifier}`);
      }
    } catch (error) {
      console.error("Error verifying report:", error);

      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Sesi telah berakhir. Silakan login kembali.");
          router.push("/login");
        } else if (error.response.status === 403) {
          toast.error("Anda tidak memiliki izin untuk melakukan verifikasi.");
        } else if (error.response.status === 404) {
          toast.error("Endpoint verifikasi tidak ditemukan.");
        } else if (error.response.status === 500) {
          toast.error("Terjadi kesalahan server. Silakan coba lagi nanti.");
        } else {
          toast.error("Gagal memverifikasi laporan.");
        }
      } else {
        toast.error("Terjadi kesalahan jaringan. Silakan coba lagi.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

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
      <Head>
        <title>Data Laporan Akhir | Kominfo Palembang</title>
      </Head>
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
              {userRole === "pembimbing"
                ? "Kelola laporan akhir mahasiswa bimbingan Anda"
                : "Kelola laporan akhir peserta magang"}
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
                {filteredLaporan.length}{" "}
                {userRole === "pembimbing" ? "Mahasiswa" : "Peserta"}
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
                    {userRole === "pembimbing" ? "Mahasiswa" : "Peserta"}
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
                              onClick={() => handleViewDetail(l)}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Lihat Detail"
                            >
                              Detail
                            </button>
                            <button
                              onClick={() => handleViewReport(l.laporan)}
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Lihat Laporan"
                            >
                              <Eye size={18} />
                            </button>
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
                ? `Tidak ada ${
                    userRole === "pembimbing" ? "mahasiswa" : "peserta"
                  } yang cocok dengan pencarian Anda`
                : "Belum ada laporan yang tersedia"}
            </p>
          </div>
        )}
      </div>

      {/* Modal Detail Laporan */}
      {selectedLaporan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Detail Laporan Akhir
                </h3>
                <button
                  onClick={() => setSelectedLaporan(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Data Peserta */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Nama Lengkap
                    </h4>
                    <p className="text-gray-800 font-medium">
                      {selectedLaporan.nama}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p className="text-gray-800">{selectedLaporan.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Institusi
                    </h4>
                    <p className="text-gray-800">{selectedLaporan.institusi}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Status Laporan
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedLaporan.status === "verified"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedLaporan.status === "verified"
                        ? "Terverifikasi"
                        : "Menunggu Verifikasi"}
                    </span>
                  </div>
                </div>

                {/* Data Periode dan Upload */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Periode Magang
                    </h4>
                    <p className="text-gray-800">{selectedLaporan.periode}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Tanggal Upload Laporan
                    </h4>
                    <p className="text-gray-800">
                      {new Date(
                        selectedLaporan.tanggalUpload
                      ).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  {selectedLaporan.laporanVerificationDate && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Tanggal Verifikasi
                      </h4>
                      <p className="text-gray-800">
                        {new Date(
                          selectedLaporan.laporanVerificationDate
                        ).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Verifikasi Pembimbing */}
              {selectedLaporan.pembimbing && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Status Pembimbing
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {selectedLaporan.pembimbing.nama}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedLaporan.pembimbing.divisi}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedLaporan.pembimbing.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedLaporan.pembimbing.status === "verified"
                          ? "Terverifikasi"
                          : "Belum Diverifikasi"}
                      </span>
                      {selectedLaporan.pembimbing.status !== "verified" &&
                        userRole === "pembimbing" && (
                          <button
                            onClick={() => handleVerification("pembimbing")}
                            disabled={isUpdating}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50"
                          >
                            {isUpdating ? "Memproses..." : "Verifikasi"}
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tombol Preview Laporan */}
              {selectedLaporan.hasReport && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Preview Laporan
                  </h4>
                  <button
                    onClick={() => handleViewReport(selectedLaporan.laporan)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Eye size={16} />
                    Preview Laporan
                  </button>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedLaporan(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PembimbingLayout>
  );
}
