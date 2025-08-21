"use client";
import React from "react";
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
  ChevronDown,
  ChevronUp,
  FileText,
  MessageSquare,
} from "lucide-react";
import Head from "next/head";

export default function DataLogbook() {
  const router = useRouter();
  const [logbooks, setLogbooks] = useState([]);
  const [pendaftar, setPendaftar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [logbooksMahasiswa, setLogbooksMahasiswa] = useState([]);
  const [selectedLogbook, setSelectedLogbook] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [pembimbingList, setPembimbingList] = useState([]); // Tambahkan state untuk pembimbing

  // Format tanggal ke bahasa Indonesia
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Format datetime
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Fungsi untuk mendapatkan nama pembimbing dari ID
  const getPembimbingName = (id) => {
    const pembimbing = pembimbingList.find((p) => p._id === id);
    return pembimbing ? pembimbing.nama : "Belum ada";
  };

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
          pembimbing: item.pembimbing, // Simpan ID pembimbing
          pembimbingName: getPembimbingName(item.pembimbing), // Dapatkan nama pembimbing
          mahasiswaData: item, // Simpan data lengkap mahasiswa
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
  }, [router, pembimbingList]); // Tambahkan pembimbingList ke dependency

  // Fetch data pembimbing (diambil dari datamagang.js)
  const fetchPembimbing = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pembimbing");
      setPembimbingList(res.data);
    } catch (error) {
      console.error("Error fetching pembimbing:", error);
      toast.error("Gagal memuat data pembimbing");
    }
  };

  // Panggil fetchPembimbing saat komponen mount
  useEffect(() => {
    fetchPembimbing();
  }, []);

  // Fetch logbooks mahasiswa - SIMPLE VERSION
  const fetchLogbooksMahasiswa = async (mahasiswaId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token tidak ditemukan");
        return;
      }

      console.log("🔍 Fetching logbooks for mahasiswa:", mahasiswaId);

      // Gunakan endpoint yang sama untuk admin dan pembimbing
      const res = await axios.get(
        `http://localhost:5000/api/logbook/mahasiswa/${mahasiswaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Success! Found", res.data.length, "logbooks");
      setLogbooksMahasiswa(res.data);
    } catch (error) {
      console.error("💥 Error details:", error);

      if (error.response?.status === 403) {
        toast.error("Tidak memiliki akses ke logbook mahasiswa ini");
      } else if (error.response?.status === 404) {
        toast.error("Endpoint tidak ditemukan");
      } else {
        toast.error("Gagal memuat logbook mahasiswa");
      }

      setLogbooksMahasiswa([]);
    }
  };

  // Handle view detail mahasiswa
  const handleViewMahasiswaDetail = async (mahasiswa) => {
    setSelectedMahasiswa(mahasiswa);
    await fetchLogbooksMahasiswa(mahasiswa.id);
  };

  // Handle view logbook detail
  const handleViewLogbookDetail = (logbook) => {
    setSelectedLogbook(logbook);
    setCommentText(logbook.comment || "");
  };

  // Toggle expand row
  const toggleRowExpand = (mahasiswaId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [mahasiswaId]: !prev[mahasiswaId],
    }));
  };

  const filteredLogbooks = logbooks.filter(
    (l) =>
      l.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.institusi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.pembimbingName?.toLowerCase().includes(searchTerm.toLowerCase()) // Gunakan pembimbingName untuk pencarian
  );

  // Handle submit comment - UNTUK ADMIN DAN PEMBIMBING
  const handleSubmitComment = async () => {
    if (!selectedLogbook || !commentText.trim()) return;

    try {
      const token = localStorage.getItem("token");

      // Untuk admin, gunakan endpoint yang sama dengan pembimbing
      await axios.patch(
        `http://localhost:5000/api/logbook/${selectedLogbook._id}/comment`,
        { comment: commentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Komentar berhasil ditambahkan");

      // Update logbook dengan komentar baru
      setSelectedLogbook({
        ...selectedLogbook,
        comment: commentText,
        status: "dikomentari",
      });

      // Refresh logbooks
      if (selectedMahasiswa) {
        await fetchLogbooksMahasiswa(selectedMahasiswa.id);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      if (error.response?.status === 403) {
        toast.error("Anda tidak memiliki izin untuk memberikan komentar");
      } else {
        toast.error("Gagal menambahkan komentar");
      }
    }
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
        <title>Data Logbook | Kominfo Palembang</title>
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
                    Status Logbook
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredLogbooks.map((l) => (
                  <React.Fragment key={l.id}>
                    <tr className="hover:bg-gray-50 transition-colors">
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
                        {l.pembimbingName || "-"} {/* Gunakan pembimbingName */}
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
                          <button
                            onClick={() => handleViewMahasiswaDetail(l)}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            <BookOpen size={16} />
                            <span className="text-sm">Lihat Logbook</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
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

      {/* Modal Detail Mahasiswa dengan Logbook */}
      {selectedMahasiswa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Logbook Mahasiswa - {selectedMahasiswa.nama}
                </h3>
                <button
                  onClick={() => setSelectedMahasiswa(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  aria-label="Tutup modal"
                >
                  &times;
                </button>
              </div>

              {/* Info Mahasiswa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Nama</h4>
                  <p className="text-gray-800 font-medium">
                    {selectedMahasiswa.nama}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="text-gray-800">{selectedMahasiswa.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Institusi
                  </h4>
                  <p className="text-gray-800">{selectedMahasiswa.institusi}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Pembimbing
                  </h4>
                  <p className="text-gray-800">
                    {selectedMahasiswa.pembimbingName || "-"}{" "}
                    {/* Update di sini */}
                  </p>
                </div>
              </div>

              {/* Daftar Logbook */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Daftar Logbook
                </h4>

                {logbooksMahasiswa.length > 0 ? (
                  <div className="space-y-3">
                    {logbooksMahasiswa.map((logbook) => (
                      <div
                        key={logbook._id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleViewLogbookDetail(logbook)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-800">
                              {logbook.title || "Logbook Aktivitas"}
                            </h5>
                            <p className="text-sm text-gray-500">
                              {formatDateTime(
                                logbook.tanggal || logbook.createdAt
                              )}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {logbook.comment ? (
                              <CheckCircle
                                className="text-green-500 mr-2"
                                size={16}
                              />
                            ) : (
                              <Clock
                                className="text-yellow-500 mr-2"
                                size={16}
                              />
                            )}
                            <span
                              className={`text-xs font-medium ${
                                logbook.comment
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {logbook.comment ? "Terkomentar" : "Menunggu"}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {logbook.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="mx-auto mb-2" size={32} />
                    <p>Belum ada logbook untuk mahasiswa ini</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedMahasiswa(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Logbook dengan Komentar */}
      {selectedLogbook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Detail Logbook
                </h3>
                <button
                  onClick={() => setSelectedLogbook(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                  aria-label="Tutup modal"
                >
                  &times;
                </button>
              </div>

              {/* Info Logbook */}
              <div className="mb-6">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500">Tanggal</h4>
                  <p className="text-gray-800">
                    {formatDateTime(
                      selectedLogbook.tanggal || selectedLogbook.createdAt
                    )}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500">
                    Judul Kegiatan
                  </h4>
                  <p className="text-gray-800 font-medium">
                    {selectedLogbook.title || "Aktivitas Harian"}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500">
                    Deskripsi Kegiatan
                  </h4>
                  <div className="bg-gray-50 p-4 rounded mt-1">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {selectedLogbook.content}
                    </p>
                  </div>
                </div>

                {selectedLogbook.report && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500">
                      Laporan Terlampir
                    </h4>
                    <a
                      href={`http://localhost:5000${
                        selectedLogbook.report.startsWith("/") ? "" : "/"
                      }${selectedLogbook.report}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      onClick={(e) => {
                        e.preventDefault();
                        const cleanPath = selectedLogbook.report.replace(
                          /^\/+/,
                          ""
                        );
                        window.open(
                          `http://localhost:5000/${cleanPath}`,
                          "_blank"
                        );
                      }}
                    >
                      <FileText size={16} />
                      <span>Download Laporan</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Komentar Sebelumnya */}
              {selectedLogbook.comment && (
                <div className="border-t pt-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Komentar Pembimbing
                  </h4>
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {selectedLogbook.comment}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedLogbook(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
