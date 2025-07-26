"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";

export default function Logbook() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const itemsPerPage = 5;
  const router = useRouter();

  const fetchLogs = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/logbook", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch {
      toast.error("Gagal mengambil data logbook.");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/logbook/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Logbook berhasil dihapus");
      setDeleteConfirmId(null);
      fetchLogs();
    } catch {
      toast.error("Gagal menghapus logbook");
    }
  };

  const handleDownload = (report) => {
    if (!report) {
      toast.info("Tidak ada file laporan");
      return;
    }
    window.open(`http://localhost:5000${report}`, "_blank");
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleNavigate = () => {
    router.push("/user/buatlogbook");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLogs = logs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(logs.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page === currentPage) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="space-y-10 p-4 relative">
      {/* Tombol Buat Logbook */}
      <div className="flex justify-end">
        <button
          onClick={handleNavigate}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Buat Logbook
        </button>
      </div>

      {/* Tabel Logbook */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-md">
        <table className="min-w-[1000px] w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-center">No</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Isi</th>
              <th className="px-4 py-3">Laporan (PDF)</th>
              <th className="px-4 py-3">Komentar</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody
            className={`bg-white divide-y divide-gray-200 transition-all duration-300 ease-in-out transform ${
              isAnimating
                ? "opacity-0 -translate-y-2"
                : "opacity-100 translate-y-0"
            }`}
          >
            {currentLogs.map((log, i) => (
              <tr key={log._id} className="hover:bg-gray-50 relative">
                <td className="px-4 py-3 text-center font-semibold">
                  {(currentPage - 1) * itemsPerPage + i + 1}
                </td>
                <td className="px-4 py-3">
                  {new Date(log.createdAt).toLocaleDateString("id-ID")}
                </td>
                <td className="px-4 py-3">{log?.user?.name || "-"}</td>
                <td className="px-4 py-3 font-semibold">{log?.title}</td>
                <td className="px-4 py-3 whitespace-pre-wrap">
                  {log?.content}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDownload(log?.report)}
                    className="text-blue-600 hover:underline"
                  >
                    {log?.report ? "Download" : "-"}
                  </button>
                </td>
                <td className="px-4 py-3">{log?.comment || "-"}</td>
                <td className="px-4 py-3 text-center relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === log._id ? null : log._id)
                    }
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {/* Dropdown menu */}
                  {openMenuId === log._id && (
                    <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded shadow-md z-10">
                      <button
                        onClick={() => {
                          setDeleteConfirmId(log._id);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded border ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center shadow-2xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Konfirmasi Hapus
            </h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus logbook ini?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
