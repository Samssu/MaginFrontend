"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { jsPDF } from "jspdf";

// Correct way to import jspdf-autotable
let autoTable = require("jspdf-autotable");

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function Logbook({
  userId,
  periodeMulai,
  periodeSelesai,
  onEntryAdded,
}) {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState("right");
  const [searchTerm, setSearchTerm] = useState("");
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [userData, setUserData] = useState(null);
  const itemsPerPage = 5;
  const router = useRouter();

  const fetchLogs = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token tidak ditemukan. Silakan login kembali.");
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/logbook`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Token kedaluwarsa. Silakan login kembali.");
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post(
              `${API_BASE_URL}/api/refresh-token`,
              { refreshToken }
            );
            localStorage.setItem("token", refreshResponse.data.accessToken);
            fetchLogs();
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            toast.error("Refresh token gagal. Silakan login kembali.");
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } else {
        toast.error("Gagal mengambil data logbook.");
      }
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/api/pendaftaran/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Jika ada data riwayat dengan pembimbing, gunakan itu
      const riwayatResponse = await axios.get(`${API_BASE_URL}/api/riwayat`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const riwayatData =
        riwayatResponse.data.find((r) => r._id === userId) ||
        riwayatResponse.data[0];

      if (riwayatData?.pembimbing) {
        setUserData({
          ...response.data,
          pembimbing: riwayatData.pembimbing, // Gunakan data pembimbing dari riwayat
        });
      } else if (response.data.pembimbingId) {
        // Jika tidak ada di riwayat, fetch data pembimbing
        const pembimbingRes = await axios.get(
          `${API_BASE_URL}/api/pembimbing/${response.data.pembimbingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData({
          ...response.data,
          pembimbing: pembimbingRes.data,
        });
      } else {
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchUserData();
  }, [userId]);

  const handleNavigate = () => {
    router.push("/user/buatlogbook");
  };

  const filteredLogs = logs
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter(
      (log) =>
        log.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page === currentPage) return;
    setSlideDirection(page > currentPage ? "right" : "left");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsAnimating(false);
    }, 300);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return `${date.getDate()} ${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  const generatePDF = async () => {
    try {
      setPdfGenerating(true);

      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Header dokumen
      doc.setFont("helvetica");
      doc.setFontSize(16);
      doc.setTextColor(40);
      doc.text("LOGBOOK MAGANG", 105, 20, { align: "center" });

      // Informasi pengguna
      doc.setFontSize(12);
      const userInfoY = 30;
      doc.text(`Nama: ${userData?.nama || "-"}`, 20, userInfoY);
      doc.text(`Institusi: ${userData?.institusi || "-"}`, 20, userInfoY + 7);
      doc.text(`Divisi: ${userData?.divisi || "-"}`, 20, userInfoY + 14);

      // Hanya tampilkan nama pembimbing
      doc.text(
        `Pembimbing: ${userData?.pembimbing?.nama || "Belum ditentukan"}`,
        20,
        userInfoY + 21
      );

      doc.text(
        `Periode: ${formatDate(periodeMulai)} - ${formatDate(periodeSelesai)}`,
        20,
        userInfoY + 28
      );

      // Header tabel
      const headers = [
        [
          "No",
          "Tanggal",
          "Judul",
          "Isi Kegiatan",
          "File Laporan",
          "Komentar Pembimbing",
        ],
      ];

      // Data tabel
      const tableData = logs.map((log, index) => [
        index + 1,
        formatDate(log.tanggal || log.createdAt),
        log.title || "-",
        log.content || "-",
        log.report ? "Ada" : "Tidak Ada",
        log.comment || "-",
      ]);

      // Generate tabel
      autoTable(doc, {
        head: headers,
        body: tableData,
        startY: userInfoY + 35,
        margin: { horizontal: 20 },
        styles: {
          fontSize: 10,
          cellPadding: 3,
          valign: "middle",
          halign: "left",
          font: "helvetica",
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" },
          1: { cellWidth: 25 },
          2: { cellWidth: 30 },
          3: { cellWidth: 50 },
          4: { cellWidth: 25, halign: "center" },
          5: { cellWidth: 40 },
        },
        didDrawPage: function (data) {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(10);
          doc.text(
            `Halaman ${data.pageNumber} dari ${pageCount}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10
          );
        },
      });

      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (logs.length === 0) {
      toast.warning("Tidak ada data logbook untuk diunduh");
      return;
    }

    try {
      // Pastikan userData sudah terload
      if (!userData) {
        await fetchUserData();
      }

      const pdf = await generatePDF();
      const fileName = `Logbook_${
        userData?.nama?.replace(/\s+/g, "_") || "Magang"
      }.pdf`;
      pdf.save(fileName);
      toast.success("Logbook berhasil diunduh");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Gagal mengunduh logbook. Silakan coba lagi.");
    }
  };

  const handleDownload = (report) => {
    if (!report) {
      toast.info("Tidak ada file laporan");
      return;
    }
    window.open(`${API_BASE_URL}${report}`, "_blank");
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_BASE_URL}/api/logbook/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Logbook berhasil dihapus");
      setDeleteConfirmId(null);
      fetchLogs();
    } catch {
      toast.error("Gagal menghapus logbook");
    }
  };

  return (
    <div className="space-y-6 p-6 relative">
      {/* Header and Download Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="text-xl md:text-2xl text-gray-600 mb-8">
            <ol className="flex items-center space-x-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>{">"}</li>
              <li>
                <Link
                  href="/user/Logbook"
                  className="text-gray-800 font-semibold hover:text-blue-600 transition-colors"
                >
                  Logbook
                </Link>
              </li>
            </ol>
          </nav>
          <h1 className="text-2xl font-bold text-gray-800">Logbook Magang</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button
            onClick={handleDownloadPDF}
            disabled={pdfGenerating}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center gap-2"
          >
            {pdfGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Membuat PDF...</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>Unduh Logbook</span>
              </>
            )}
          </button>
          <button
            onClick={handleNavigate}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
          >
            <span>Buat Logbook</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Cari logbook..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Logbook Cards */}
      <div
        className={`transition-transform duration-300 ease-in-out ${
          isAnimating
            ? slideDirection === "right"
              ? "-translate-x-full opacity-0"
              : "translate-x-full opacity-0"
            : "translate-x-0 opacity-100"
        } space-y-4`}
      >
        {currentLogs.length > 0 ? (
          currentLogs.map((log, i) => (
            <div
              key={log._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {log?.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(log.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === log._id ? null : log._id)
                      }
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {openMenuId === log._id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                        <button
                          onClick={() => {
                            setDeleteConfirmId(log._id);
                            setOpenMenuId(null);
                          }}
                          className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          <span>Hapus</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Kegiatan:
                    </h4>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {log?.content}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Laporan:
                      </h4>
                      {log?.report ? (
                        <button
                          onClick={() => handleDownload(log.report)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Download size={18} />
                          <span>Unduh File</span>
                        </button>
                      ) : (
                        <span className="text-gray-400">Tidak ada laporan</span>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Komentar Pembimbing:
                      </h4>
                      <p className="text-gray-600">
                        {log?.comment || (
                          <span className="text-gray-400">
                            Belum ada komentar
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {i < currentLogs.length - 1 && (
                <div className="border-b border-gray-200 mx-6"></div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
            {searchTerm
              ? "Tidak ditemukan logbook yang sesuai"
              : "Belum ada data logbook"}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          Menampilkan {indexOfFirstItem + 1} sampai{" "}
          {Math.min(indexOfLastItem, filteredLogs.length)} dari{" "}
          {filteredLogs.length} entri
        </div>
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2">...</span>
            )}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                  currentPage === totalPages
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {totalPages}
              </button>
            )}

            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md text-center shadow-2xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Konfirmasi Hapus
            </h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus logbook ini? Aksi ini tidak
              dapat dibatalkan.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition font-medium flex items-center gap-2"
              >
                <Trash2 size={18} />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
