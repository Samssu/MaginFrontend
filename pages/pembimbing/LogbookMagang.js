"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import PembimbingLayout from "@/components/layouts/PembimbingLayout";
import {
  BookOpen,
  Search,
  Frown,
  Calendar,
  CheckCircle,
  XCircle,
  User,
  GraduationCap,
  Building,
  UserCog,
  MessageSquare,
  Download,
} from "lucide-react";

export default function LogbookMagang() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mahasiswaId = searchParams.get("id");

  const [dataMagang, setDataMagang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [submittingComment, setSubmittingComment] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          router.push("/login");
          return;
        }

        const response = await axios.get(`/api/pembimbing/${user.id}/logbooks`);
        const data = response.data;

        setDataMagang(data);

        // Set mahasiswa yang dipilih berdasarkan ID dari URL atau mahasiswa pertama
        if (mahasiswaId && data.length > 0) {
          const selected = data.find(
            (item) => item.mahasiswa._id === mahasiswaId
          );
          setSelectedMahasiswa(selected || data[0]);
        } else if (data.length > 0) {
          setSelectedMahasiswa(data[0]);
        }
      } catch (error) {
        console.error("Error fetching logbooks:", error);
        toast.error("Gagal memuat data logbook");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, mahasiswaId]);

  const handleCommentChange = (logbookId, comment) => {
    setCommentInputs((prev) => ({
      ...prev,
      [logbookId]: comment,
    }));
  };

  const submitComment = async (logbookId) => {
    if (!commentInputs[logbookId]?.trim()) {
      toast.warning("Komentar tidak boleh kosong");
      return;
    }

    try {
      setSubmittingComment(true);
      const token = localStorage.getItem("token");

      await axios.post(
        `/api/logbook/${logbookId}/comment`,
        {
          comment: commentInputs[logbookId],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Komentar berhasil ditambahkan");

      // Refresh data
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.get(`/api/pembimbing/${user.id}/logbooks`);
      setDataMagang(response.data);

      // Clear comment input
      setCommentInputs((prev) => ({
        ...prev,
        [logbookId]: "",
      }));
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Gagal menambahkan komentar");
    } finally {
      setSubmittingComment(false);
    }
  };

  const downloadLogbook = async () => {
    if (!selectedMahasiswa) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `/api/pembimbing/logbook/export/${selectedMahasiswa.mahasiswa._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `logbook-${selectedMahasiswa.mahasiswa.nama}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Logbook berhasil diunduh");
    } catch (error) {
      console.error("Error downloading logbook:", error);
      toast.error("Gagal mengunduh logbook");
    }
  };

  const filteredLogbooks = selectedMahasiswa?.logbooks?.filter(
    (l) =>
      l.kegiatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.tanggal.toLowerCase().includes(searchTerm.toLowerCase())
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
          <BookOpen size={28} className="text-blue-600" />
          Logbook Magang
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Review dan verifikasi logbook peserta magang
        </p>
      </div>

      {/* Informasi Magang */}
      {dataMagang.length > 0 && selectedMahasiswa && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-4 md:p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="text-blue-200" size={18} />
                  <span className="text-sm md:text-base">Informasi Magang</span>
                </h2>
                <p className="text-blue-100 text-xs mt-1">
                  Detail peserta magang yang Anda bimbing
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={downloadLogbook}
                  className="bg-blue-700 text-white rounded-md px-3 py-2 text-sm flex items-center gap-1 hover:bg-blue-800"
                >
                  <Download size={16} />
                  Unduh Logbook
                </button>
                {dataMagang.length > 1 && (
                  <select
                    className="bg-blue-700 text-white rounded-md px-3 py-2 text-sm"
                    onChange={(e) => {
                      const selected = dataMagang[e.target.value];
                      setSelectedMahasiswa(selected);
                      router.push(
                        `/pembimbing/LogbookMagang?id=${selected.mahasiswa._id}`
                      );
                    }}
                    value={dataMagang.findIndex(
                      (item) =>
                        item.mahasiswa._id === selectedMahasiswa?.mahasiswa?._id
                    )}
                  >
                    {dataMagang.map((item, index) => (
                      <option key={index} value={index}>
                        {item.mahasiswa.nama}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 p-0">
            {/* Nama */}
            <div className="bg-blue-50 p-4 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center gap-3 h-full">
                <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <User className="text-blue-600" size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Nama</h3>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedMahasiswa?.mahasiswa?.nama || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Institusi */}
            <div className="bg-blue-50 p-4 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center gap-3 h-full">
                <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <GraduationCap className="text-blue-600" size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">
                    Institusi
                  </h3>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedMahasiswa?.mahasiswa?.institusi || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Divisi */}
            <div className="bg-blue-50 p-4 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center gap-3 h-full">
                <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <Building className="text-blue-600" size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">Divisi</h3>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedMahasiswa?.mahasiswa?.divisi || "Belum ditentukan"}
                  </p>
                </div>
              </div>
            </div>

            {/* Pembimbing */}
            <div className="bg-blue-50 p-4">
              <div className="flex items-center gap-3 h-full">
                <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <UserCog className="text-blue-600" size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">
                    Pembimbing
                  </h3>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedMahasiswa?.pembimbing?.nama || "Anda"}
                  </p>
                  {selectedMahasiswa?.pembimbing?.divisi && (
                    <p className="text-xs text-gray-500 mt-1">
                      Divisi: {selectedMahasiswa.pembimbing.divisi}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Periode Magang */}
            <div className="bg-blue-50 p-4 col-span-1 md:col-span-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                  <BookOpen className="text-blue-600" size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500">
                    Periode Magang
                  </h3>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(selectedMahasiswa?.periode?.mulai)} -{" "}
                    {formatDate(selectedMahasiswa?.periode?.selesai)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daftar Logbook dalam Tabel */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari logbook..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredLogbooks?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kegiatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Laporan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Komentar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogbooks.map((logbook) => (
                  <tr key={logbook._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(logbook.tanggal)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-md">{logbook.kegiatan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {logbook.report ? (
                        <a
                          href={`http://localhost:5000${logbook.report}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Lihat File
                        </a>
                      ) : (
                        <span className="text-gray-400">Tidak ada file</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          logbook.status === "verified"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {logbook.status === "verified"
                          ? "Terverifikasi"
                          : "Belum diverifikasi"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {logbook.comment || (
                        <span className="text-gray-400">
                          Belum ada komentar
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col gap-2">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Tambah komentar..."
                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                            value={commentInputs[logbook._id] || ""}
                            onChange={(e) =>
                              handleCommentChange(logbook._id, e.target.value)
                            }
                          />
                        </div>
                        <button
                          onClick={() => submitComment(logbook._id)}
                          disabled={submittingComment}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                        >
                          <MessageSquare size={12} />
                          {submittingComment ? "Mengirim..." : "Kirim Komentar"}
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
            <Frown className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Tidak ada logbook
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Tidak ditemukan hasil pencarian"
                : "Belum ada logbook yang perlu direview"}
            </p>
          </div>
        )}
      </div>
    </PembimbingLayout>
  );
}
