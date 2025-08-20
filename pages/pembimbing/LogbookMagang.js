"use client";

import React from "react";
import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import PembimbingLayout from "../../components/layouts/PembimbingLayout";
import axios from "axios";
import { toast } from "react-toastify";
import {
  UserCircle2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PembimbingLogbook() {
  const [pembimbing, setPembimbing] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [mahasiswaBimbingan, setMahasiswaBimbingan] = useState([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [logbooksMahasiswa, setLogbooksMahasiswa] = useState([]);
  const [selectedLogbook, setSelectedLogbook] = useState(null);
  const [commentText, setCommentText] = useState("");
  const router = useRouter();

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

  // Fetch data pembimbing
  useEffect(() => {
    const fetchPembimbing = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/pembimbing", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPembimbing(res.data);
      } catch (error) {
        toast.error("Gagal memuat data pembimbing");
        console.error("Error fetching pembimbing:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPembimbing();
  }, []);

  // Fetch data mahasiswa bimbingan
  const fetchMahasiswa = async (pembimbingId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/pembimbing/${pembimbingId}/mahasiswa`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMahasiswaBimbingan(res.data);
    } catch (error) {
      toast.error("Gagal memuat data mahasiswa");
      console.error("Error fetching mahasiswa:", error);
      setMahasiswaBimbingan([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch logbooks mahasiswa - IMPROVED
  const fetchLogbooksMahasiswa = async (mahasiswaId) => {
    try {
      console.log("Fetching logbooks for mahasiswa:", mahasiswaId);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token tidak ditemukan");
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/logbook/mahasiswa/${mahasiswaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Logbooks response:", res.data);
      setLogbooksMahasiswa(res.data);
    } catch (error) {
      console.error("Error details:", error);
      console.error("Error response:", error.response?.data);

      if (error.response?.status === 403) {
        toast.error("Anda tidak memiliki akses ke logbook mahasiswa ini");
      } else if (error.response?.status === 404) {
        toast.error(
          "Endpoint tidak ditemukan. Pastikan server sudah diupdate."
        );
      } else {
        toast.error("Gagal memuat logbook mahasiswa");
      }
      setLogbooksMahasiswa([]);
    }
  };

  // Handle view detail mahasiswa
  const handleViewMahasiswaDetail = async (mahasiswa) => {
    setSelectedMahasiswa(mahasiswa);
    await fetchLogbooksMahasiswa(mahasiswa._id);
  };

  // Handle view logbook detail
  const handleViewLogbookDetail = (logbook) => {
    setSelectedLogbook(logbook);
    setCommentText(logbook.comment || "");
  };

  // Handle submit comment
  const handleSubmitComment = async () => {
    if (!selectedLogbook || !commentText.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/logbook/${selectedLogbook._id}/comment`,
        { comment: commentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Komentar berhasil ditambahkan");
      setSelectedLogbook({ ...selectedLogbook, comment: commentText });

      // Refresh logbooks
      if (selectedMahasiswa) {
        await fetchLogbooksMahasiswa(selectedMahasiswa._id);
      }
    } catch (error) {
      toast.error("Gagal menambahkan komentar");
      console.error("Error adding comment:", error);
    }
  };

  // Toggle expand row
  const toggleRowExpand = (pembimbingId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [pembimbingId]: !prev[pembimbingId],
    }));

    if (!expandedRows[pembimbingId]) {
      fetchMahasiswa(pembimbingId);
    }
  };

  return (
    <PembimbingLayout>
      <Head>
        <title>Logbook Magang | Kominfo Palembang</title>
        <meta
          name="description"
          content="Kelola Logbook magang Kominfo Palembang"
        />
      </Head>

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="text-blue-600" size={28} />
          Logbook Magang
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola dan beri komentar pada logbook mahasiswa bimbingan
        </p>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Pembimbing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Divisi
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mahasiswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && pembimbing.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : pembimbing.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data pembimbing
                  </td>
                </tr>
              ) : (
                pembimbing.map((item) => (
                  <React.Fragment key={item._id}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleRowExpand(item._id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserCircle2 className="text-blue-600" size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.nama}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.divisi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.jumlahMahasiswa || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            item.status === "aktif"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRowExpand(item._id);
                            }}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label={
                              expandedRows[item._id] ? "Tutup" : "Buka"
                            }
                          >
                            {expandedRows[item._id] ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedRows[item._id] && (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 bg-gray-50">
                          <div className="pl-14">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Mahasiswa Bimbingan ({mahasiswaBimbingan.length})
                            </h4>
                            {mahasiswaBimbingan.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nama
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Institusi
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Periode
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {mahasiswaBimbingan.map((mhs) => (
                                      <tr key={mhs._id}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                          <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() =>
                                              handleViewMahasiswaDetail(mhs)
                                            }
                                          >
                                            {mhs.nama}
                                          </button>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                          {mhs.email || "-"}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                          {mhs.institusi}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                          {mhs.mulai && mhs.selesai
                                            ? `${formatDate(
                                                mhs.mulai
                                              )} - ${formatDate(mhs.selesai)}`
                                            : "Belum ditentukan"}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                          <span
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                              mhs.status === "disetujui"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }`}
                                          >
                                            {mhs.status || "pending"}
                                          </span>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                                          <button
                                            onClick={() =>
                                              handleViewMahasiswaDetail(mhs)
                                            }
                                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-all shadow-sm border border-blue-200 text-sm font-medium"
                                          >
                                            <BookOpen size={16} />
                                            <span>Lihat Logbook</span>
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                {isLoading
                                  ? "Memuat data..."
                                  : "Tidak ada mahasiswa bimbingan"}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
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
                    Program Studi
                  </h4>
                  <p className="text-gray-800">
                    {selectedMahasiswa.prodi || "-"}
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
                      href={`http://localhost:5000/uploads/logbooks/${selectedLogbook.report}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FileText size={16} />
                      <span>Download Laporan</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Form Komentar */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Beri Komentar
                </h4>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Tulis komentar atau masukan untuk mahasiswa..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <MessageSquare size={16} />
                    <span>Simpan Komentar</span>
                  </button>
                </div>
              </div>

              {/* Komentar Sebelumnya */}
              {selectedLogbook.comment && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Komentar Sebelumnya
                  </h4>
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {selectedLogbook.comment}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6">
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
    </PembimbingLayout>
  );
}
