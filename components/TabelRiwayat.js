"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Edit,
  Download,
  Save,
  XCircle,
  FileText,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  X,
  AlertTriangle,
  Upload,
  Eye,
  User,
} from "lucide-react";

export default function TabelRiwayat() {
  const [riwayat, setRiwayat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [showLaporanModal, setShowLaporanModal] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [laporanFile, setLaporanFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Anda harus login terlebih dahulu");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/riwayat", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Data dari API:", res.data);
      setRiwayat(res.data);
    } catch (err) {
      toast.error("Gagal mengambil data riwayat");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleEditClick = (item) => {
    setEditFormData({
      _id: item._id,
      nama: item.nama,
      email: item.email,
      institusi: item.institusi,
      prodi: item.prodi,
      semester: item.semester,
      mulai: item.mulai,
      selesai: item.selesai,
      tujuan: item.tujuan,
      divisi: item.divisi,
      alamat: item.alamat,
      noHp: item.noHp,
      jenisKelamin: item.jenisKelamin,
      ttl: item.ttl,
      tanggalLahir: item.tanggalLahir,
      jenjang: item.jenjang,
      ipk: item.ipk,
      pembimbing: item.pembimbing || "",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      // Tambahkan semua field text ke formData
      Object.keys(editFormData).forEach((key) => {
        if (key !== "_id" && typeof editFormData[key] !== "object") {
          formData.append(key, editFormData[key]);
        }
      });

      // Tambahkan file-file yang baru diupload
      const fileFields = [
        "suratPengantar",
        "foto",
        "cv",
        "ktpAtauKtm",
        "transkrip",
        "rekomendasi",
      ];
      fileFields.forEach((field) => {
        if (editFormData[field] instanceof File) {
          formData.append(field, editFormData[field]);
        }
      });

      formData.append("status", "pending");
      formData.append("updatedAt", new Date().toISOString());

      await axios.put(
        `http://localhost:5000/api/pendaftaran/${editFormData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(
        "Perubahan berhasil disimpan. Status diubah menjadi pending untuk ditinjau ulang."
      );
      setShowEditModal(false);
      fetchData();
    } catch (err) {
      console.error("Edit error:", err);
      toast.error("Gagal menyimpan perubahan");
    }
  };

  const handleDownload = async (filename) => {
    if (!filename) {
      toast.error("File tidak tersedia");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/download/${filename}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      // Cek jika response error
      if (response.status !== 200) {
        throw new Error("File tidak ditemukan di server");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download error:", error);
      toast.error(
        error.response?.data?.message ||
          "Gagal mengunduh file. File mungkin tidak ada di server."
      );
    }
  };

  const handleLaporanUpload = async (pendaftaranId) => {
    if (!laporanFile) {
      toast.error("Silakan pilih file laporan terlebih dahulu");
      return;
    }

    setIsUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("laporan", laporanFile);

      await axios.post(
        `http://localhost:5000/api/pendaftaran/${pendaftaranId}/laporan`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Laporan akhir berhasil diupload");
      setShowLaporanModal(false);
      setLaporanFile(null);
      fetchData();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Gagal mengupload laporan");
    } finally {
      setIsUploading(false);
    }
  };

  const previewLaporan = (file) => {
    setSelectedLaporan(file);
    setShowLaporanModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "disetujui":
        return <CheckCircle className="text-green-500 mr-1" size={16} />;
      case "ditolak":
        return <X className="text-red-500 mr-1" size={16} />;
      case "perbaiki":
      case "pending":
        return <AlertTriangle className="text-yellow-500 mr-1" size={16} />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (riwayat.length === 0) {
    return (
      <div className="p-6 text-center bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Riwayat Pendaftaran Magang
        </h1>
        <p className="text-gray-500">
          Anda belum memiliki riwayat pendaftaran magang
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-blue-600" size={24} />
            Riwayat Pendaftaran Magang
          </h1>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Periode Magang
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
              {riwayat.map((item, index) => (
                <>
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => toggleRowExpand(item._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-gray-400" size={16} />
                        <span>
                          {formatDate(item.mulai)} - {formatDate(item.selesai)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === "disetujui"
                              ? "bg-green-100 text-green-800"
                              : item.status === "ditolak"
                              ? "bg-red-100 text-red-800"
                              : item.status === "perbaiki" ||
                                item.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {getStatusIcon(item.status)}
                          {item.status === "pending"
                            ? "Menunggu Review"
                            : item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowExpand(item._id);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {expandedRow === item._id ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              item.status === "perbaiki" ||
                              item.status === "pending" ||
                              item.status === "ditolak"
                            ) {
                              handleEditClick(item);
                            }
                          }}
                          className={`inline-flex items-center px-3 py-1 border text-xs font-medium rounded-md ${
                            item.status === "perbaiki" ||
                            item.status === "pending" ||
                            item.status === "ditolak"
                              ? "border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100"
                              : "border-gray-300 text-gray-500 bg-gray-100 cursor-not-allowed"
                          }`}
                          disabled={
                            !(
                              item.status === "perbaiki" ||
                              item.status === "pending" ||
                              item.status === "ditolak"
                            )
                          }
                        >
                          <Edit className="mr-1" size={14} />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(item.suratBalasan);
                          }}
                          className={`inline-flex items-center px-3 py-1 border text-xs font-medium rounded-md ${
                            item.status === "disetujui" && item.suratBalasan
                              ? "border-purple-300 text-purple-700 bg-purple-50 hover:bg-purple-100"
                              : "border-gray-300 text-gray-500 bg-gray-100 cursor-not-allowed"
                          }`}
                          disabled={
                            item.status !== "disetujui" || !item.suratBalasan
                          }
                        >
                          <Download className="mr-1" size={14} />
                          Surat Balasan
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === item._id && (
                    <tr className="bg-gray-50">
                      <td colSpan="5" className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-3 text-lg">
                              Detail Pendaftaran
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-gray-500">Nama Lengkap</p>
                                  <p className="font-medium">
                                    {item.nama || "-"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Email</p>
                                  <p className="font-medium">
                                    {item.email || "-"}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-gray-500">
                                    Tempat/Tanggal Lahir
                                  </p>
                                  <p className="font-medium">
                                    {item.ttl || "-"} /{" "}
                                    {formatDate(item.tanggalLahir)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Jenis Kelamin</p>
                                  <p className="font-medium">
                                    {item.jenisKelamin || "-"}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <p className="text-gray-500">Alamat</p>
                                <p className="font-medium">
                                  {item.alamat || "-"}
                                </p>
                              </div>

                              <div>
                                <p className="text-gray-500">No. HP</p>
                                <p className="font-medium">
                                  {item.noHp || "-"}
                                </p>
                              </div>

                              <div className="border-t border-gray-200 pt-3 mt-3">
                                <h5 className="font-medium text-gray-700 mb-2">
                                  Pendidikan
                                </h5>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-gray-500">Institusi</p>
                                    <p className="font-medium">
                                      {item.institusi || "-"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">
                                      Program Studi
                                    </p>
                                    <p className="font-medium">
                                      {item.prodi || "-"}
                                    </p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                  <div>
                                    <p className="text-gray-500">Jenjang</p>
                                    <p className="font-medium">
                                      {item.jenjang || "-"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Semester</p>
                                    <p className="font-medium">
                                      {item.semester || "-"}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <p className="text-gray-500">IPK</p>
                                  <p className="font-medium">
                                    {item.ipk || "-"}
                                  </p>
                                </div>
                              </div>

                              <div className="border-t border-gray-200 pt-3 mt-3">
                                <h5 className="font-medium text-gray-700 mb-2">
                                  Magang
                                </h5>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-gray-500">Divisi</p>
                                    <p className="font-medium">
                                      {item.divisi || "-"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">
                                      Tujuan Magang
                                    </p>
                                    <p className="font-medium">
                                      {item.tujuan || "-"}
                                    </p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                  <div>
                                    <p className="text-gray-500">
                                      Tanggal Mulai
                                    </p>
                                    <p className="font-medium">
                                      {formatDate(item.mulai)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">
                                      Tanggal Selesai
                                    </p>
                                    <p className="font-medium">
                                      {formatDate(item.selesai)}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="border-t border-gray-200 pt-3 mt-3">
                                <h5 className="font-medium text-gray-700 mb-2">
                                  Dokumen Pendaftaran
                                </h5>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-gray-500">
                                      Surat Pengantar
                                    </p>
                                    {item.suratPengantar ? (
                                      <button
                                        onClick={() =>
                                          handleDownload(item.suratPengantar)
                                        }
                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                      >
                                        <FileText className="mr-1" size={14} />
                                        Unduh
                                      </button>
                                    ) : (
                                      <p className="text-gray-400">-</p>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-gray-500">
                                      Curriculum Vitae (CV)
                                    </p>
                                    {item.cv ? (
                                      <button
                                        onClick={() => handleDownload(item.cv)}
                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                      >
                                        <FileText className="mr-1" size={14} />
                                        Unduh
                                      </button>
                                    ) : (
                                      <p className="text-gray-400">-</p>
                                    )}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                  <div>
                                    <p className="text-gray-500">Pas Foto</p>
                                    {item.foto ? (
                                      <button
                                        onClick={() =>
                                          handleDownload(item.foto)
                                        }
                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                      >
                                        <FileText className="mr-1" size={14} />
                                        Unduh
                                      </button>
                                    ) : (
                                      <p className="text-gray-400">-</p>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-gray-500">KTP/KTM</p>
                                    {item.ktpAtauKtm ? (
                                      <button
                                        onClick={() =>
                                          handleDownload(item.ktpAtauKtm)
                                        }
                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                      >
                                        <FileText className="mr-1" size={14} />
                                        Unduh
                                      </button>
                                    ) : (
                                      <p className="text-gray-400">-</p>
                                    )}
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                  <div>
                                    <p className="text-gray-500">
                                      Transkrip Nilai
                                    </p>
                                    {item.transkrip ? (
                                      <button
                                        onClick={() =>
                                          handleDownload(item.transkrip)
                                        }
                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                      >
                                        <FileText className="mr-1" size={14} />
                                        Unduh
                                      </button>
                                    ) : (
                                      <p className="text-gray-400">-</p>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-gray-500">
                                      Surat Rekomendasi
                                    </p>
                                    {item.rekomendasi ? (
                                      <button
                                        onClick={() =>
                                          handleDownload(item.rekomendasi)
                                        }
                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                      >
                                        <FileText className="mr-1" size={14} />
                                        Unduh
                                      </button>
                                    ) : (
                                      <p className="text-gray-400">-</p>
                                    )}
                                  </div>
                                </div>

                                {/* Ganti bagian pembimbing dengan: */}
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                  <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <User className="text-gray-400" size={16} />
                                    Pembimbing
                                  </h5>
                                  {item.pembimbing ? (
                                    <>
                                      <p className="font-medium">
                                        {item.pembimbing.nama ||
                                          `Pembimbing (ID: ${item.pembimbing})`}
                                      </p>
                                      {item.pembimbing.divisi && (
                                        <p className="text-sm text-gray-500 mt-1">
                                          Divisi: {item.pembimbing.divisi}
                                        </p>
                                      )}
                                    </>
                                  ) : (
                                    <p className="text-gray-500">
                                      Belum ditentukan
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="mb-6">
                              <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-1">
                                {item.status === "disetujui" && (
                                  <CheckCircle
                                    className="text-green-500"
                                    size={16}
                                  />
                                )}
                                {item.status === "ditolak" && (
                                  <X className="text-red-500" size={16} />
                                )}
                                {item.status === "perbaiki" && (
                                  <AlertTriangle
                                    className="text-yellow-500"
                                    size={16}
                                  />
                                )}
                                {item.status === "pending" && (
                                  <AlertCircle
                                    className="text-gray-500"
                                    size={16}
                                  />
                                )}
                                Informasi Status
                              </h4>
                              <div
                                className={`p-3 rounded-lg ${
                                  item.status === "disetujui"
                                    ? "bg-green-50 border border-green-200"
                                    : item.status === "ditolak"
                                    ? "bg-red-50 border border-red-200"
                                    : item.status === "perbaiki"
                                    ? "bg-yellow-50 border border-yellow-200"
                                    : "bg-gray-50 border border-gray-200"
                                }`}
                              >
                                {item.status === "disetujui" && (
                                  <>
                                    <p className="font-medium text-green-700">
                                      Pendaftaran Anda telah disetujui!
                                    </p>
                                    <p className="text-green-600 mt-1">
                                      Selamat! Pendaftaran magang Anda telah
                                      diterima. Silakan unduh surat balasan
                                      resmi di atas.
                                    </p>
                                    {item.suratBalasan && (
                                      <button
                                        onClick={() =>
                                          handleDownload(item.suratBalasan)
                                        }
                                        className="mt-2 inline-flex items-center px-3 py-1 border border-green-300 text-xs font-medium rounded-md text-green-700 bg-white hover:bg-green-50"
                                      >
                                        <Download className="mr-1" size={12} />
                                        Unduh Surat Balasan
                                      </button>
                                    )}
                                    {!item.laporanAkhir && (
                                      <div className="mt-4">
                                        <button
                                          onClick={() => {
                                            setSelectedLaporan(null);
                                            setShowLaporanModal(true);
                                          }}
                                          className="inline-flex items-center px-3 py-1 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                                        >
                                          <Upload className="mr-1" size={12} />
                                          Kirim Laporan Akhir
                                        </button>
                                        <p className="text-xs text-gray-500 mt-1">
                                          Anda hanya bisa mengirim laporan akhir
                                          sekali. Pastikan file sudah benar
                                          sebelum mengupload.
                                        </p>
                                      </div>
                                    )}
                                  </>
                                )}

                                {item.status === "disetujui" &&
                                  item.certificate && (
                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                      <h4 className="font-medium text-gray-700 mb-3">
                                        Sertifikat Magang
                                      </h4>
                                      <button
                                        onClick={() =>
                                          handleDownload(item.certificate)
                                        }
                                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                                      >
                                        <FileText className="mr-1" size={14} />
                                        Unduh Sertifikat
                                      </button>
                                      <p className="text-xs text-gray-500 mt-2">
                                        Sertifikat resmi magang dari Kominfo
                                        Palembang
                                      </p>
                                    </div>
                                  )}
                                {item.status === "disetujui" &&
                                  !item.certificate && (
                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                      <h4 className="font-medium text-gray-700 mb-3">
                                        Sertifikat Magang
                                      </h4>
                                      <button
                                        disabled
                                        className="flex items-center text-gray-400 text-sm cursor-not-allowed"
                                      >
                                        <FileText className="mr-1" size={14} />
                                        Sertifikat Belum Tersedia
                                      </button>
                                      <p className="text-xs text-gray-500 mt-2">
                                        Sertifikat akan tersedia setelah admin
                                        menguploadnya
                                      </p>
                                    </div>
                                  )}
                                {item.status === "ditolak" && (
                                  <>
                                    <p className="font-medium text-red-700">
                                      Pendaftaran Anda ditolak
                                    </p>
                                    {item.komentar && (
                                      <>
                                        <p className="text-red-600 mt-1">
                                          Alasan penolakan:
                                        </p>
                                        <p className="text-red-600 font-medium">
                                          {item.komentar}
                                        </p>
                                      </>
                                    )}
                                    <p className="text-red-600 mt-2">
                                      Anda dapat mengedit pendaftaran dan
                                      mengajukan kembali setelah memperbaiki
                                      masalah yang disebutkan.
                                    </p>
                                  </>
                                )}
                                {item.status === "perbaiki" && (
                                  <>
                                    <p className="font-medium text-yellow-700">
                                      Perlu Perbaikan
                                    </p>
                                    {item.komentar && (
                                      <>
                                        <p className="text-yellow-600 mt-1">
                                          Permintaan perbaikan:
                                        </p>
                                        <p className="text-yellow-600 font-medium">
                                          {item.komentar}
                                        </p>
                                      </>
                                    )}
                                    <p className="text-yellow-600 mt-2">
                                      Silakan perbaiki data dan submit. Status
                                      akan berubah menjadi pending setelah
                                      diperbaiki.
                                    </p>
                                    <button
                                      onClick={() => handleEditClick(item)}
                                      className="mt-3 inline-flex items-center px-3 py-1 border border-yellow-300 text-xs font-medium rounded-md text-yellow-700 bg-white hover:bg-yellow-50"
                                    >
                                      <Edit className="mr-1" size={12} />
                                      Perbaiki Data
                                    </button>
                                  </>
                                )}
                                {item.status === "pending" && (
                                  <>
                                    <p className="font-medium text-yellow-700">
                                      Pendaftaran dalam proses review
                                    </p>
                                    <p className="text-yellow-600 mt-1">
                                      Pendaftaran Anda sedang dalam proses
                                      peninjauan oleh admin. Harap tunggu
                                      pemberitahuan lebih lanjut.
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>

                            {item.status === "disetujui" &&
                              item.laporanAkhir && (
                                <div className="border-t border-gray-200 pt-4">
                                  <h4 className="font-medium text-gray-700 mb-3">
                                    Laporan Akhir
                                  </h4>
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() =>
                                        handleDownload(item.laporanAkhir)
                                      }
                                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                      <FileText className="mr-1" size={14} />
                                      Unduh Laporan
                                    </button>
                                    <button
                                      onClick={() =>
                                        previewLaporan(item.laporanAkhir)
                                      }
                                      className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
                                    >
                                      <Eye className="mr-1" size={14} />
                                      Preview
                                    </button>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-2">
                                    Laporan akhir telah dikirim pada:{" "}
                                    {formatDate(item.laporanUploadDate)}
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Edit Pendaftaran
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
                <form onSubmit={handleEditSubmit} className="space-y-6">
                  {/* Personal Information Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-lg text-gray-700 mb-4">
                      Informasi Pribadi
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Lengkap*
                        </label>
                        <input
                          type="text"
                          value={editFormData.nama || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              nama: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email*
                        </label>
                        <input
                          type="email"
                          value={editFormData.email || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          No. HP
                        </label>
                        <input
                          type="text"
                          value={editFormData.noHp || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              noHp: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jenis Kelamin
                        </label>
                        <select
                          value={editFormData.jenisKelamin || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              jenisKelamin: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Pilih Jenis Kelamin</option>
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tempat Lahir
                        </label>
                        <input
                          type="text"
                          value={editFormData.ttl || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              ttl: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Tempat Lahir"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tanggal Lahir
                        </label>
                        <input
                          type="date"
                          value={editFormData.tanggalLahir || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              tanggalLahir: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alamat
                        </label>
                        <textarea
                          value={editFormData.alamat || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              alamat: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Education Information Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-lg text-gray-700 mb-4">
                      Informasi Pendidikan
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Institusi*
                        </label>
                        <input
                          type="text"
                          value={editFormData.institusi || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              institusi: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Program Studi*
                        </label>
                        <input
                          type="text"
                          value={editFormData.prodi || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              prodi: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jenjang
                        </label>
                        <input
                          type="text"
                          value={editFormData.jenjang || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              jenjang: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Semester
                        </label>
                        <input
                          type="text"
                          value={editFormData.semester || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              semester: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          IPK
                        </label>
                        <input
                          type="text"
                          value={editFormData.ipk || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              ipk: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Internship Information Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-lg text-gray-700 mb-4">
                      Informasi Magang
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Divisi*
                        </label>
                        <input
                          type="text"
                          value={editFormData.divisi || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              divisi: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tujuan Magang
                        </label>
                        <input
                          type="text"
                          value={editFormData.tujuan || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              tujuan: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tanggal Mulai*
                        </label>
                        <input
                          type="date"
                          value={editFormData.mulai || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              mulai: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tanggal Selesai*
                        </label>
                        <input
                          type="date"
                          value={editFormData.selesai || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              selesai: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pembimbing
                        </label>
                        <input
                          type="text"
                          value={editFormData.pembimbing || ""}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              pembimbing: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nama Pembimbing"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Document Upload Section */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-lg text-gray-700 mb-4">
                      Dokumen Pendaftaran
                    </h4>
                    <div className="space-y-4">
                      {/* Surat Pengantar */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Surat Pengantar
                        </label>
                        <div className="flex items-center gap-4">
                          {editFormData.suratPengantar && (
                            <div className="flex items-center">
                              <FileText
                                className="text-blue-500 mr-2"
                                size={16}
                              />
                              <span className="text-sm text-gray-600">
                                {editFormData.suratPengantar}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDownload(editFormData.suratPengantar)
                                }
                                className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                              >
                                (Unduh)
                              </button>
                            </div>
                          )}
                          <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            {editFormData.suratPengantar
                              ? "Ganti File"
                              : "Pilih File"}
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  suratPengantar: e.target.files[0],
                                })
                              }
                              accept=".pdf,.doc,.docx"
                            />
                          </label>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Format: PDF/DOC/DOCX (Maks. 5MB)
                        </p>
                      </div>

                      {/* CV */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Curriculum Vitae (CV)
                        </label>
                        <div className="flex items-center gap-4">
                          {editFormData.cv && (
                            <div className="flex items-center">
                              <FileText
                                className="text-blue-500 mr-2"
                                size={16}
                              />
                              <span className="text-sm text-gray-600">
                                {editFormData.cv}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDownload(editFormData.cv)}
                                className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                              >
                                (Unduh)
                              </button>
                            </div>
                          )}
                          <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            {editFormData.cv ? "Ganti File" : "Pilih File"}
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  cv: e.target.files[0],
                                })
                              }
                              accept=".pdf,.doc,.docx"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Pas Foto */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pas Foto
                        </label>
                        <div className="flex items-center gap-4">
                          {editFormData.foto && (
                            <div className="flex items-center">
                              <FileText
                                className="text-blue-500 mr-2"
                                size={16}
                              />
                              <span className="text-sm text-gray-600">
                                {editFormData.foto}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDownload(editFormData.foto)
                                }
                                className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                              >
                                (Unduh)
                              </button>
                            </div>
                          )}
                          <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            {editFormData.foto ? "Ganti File" : "Pilih File"}
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  foto: e.target.files[0],
                                })
                              }
                              accept="image/*"
                            />
                          </label>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Format: JPG/PNG (Maks. 2MB)
                        </p>
                      </div>

                      {/* KTP/KTM */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          KTP/KTM
                        </label>
                        <div className="flex items-center gap-4">
                          {editFormData.ktpAtauKtm && (
                            <div className="flex items-center">
                              <FileText
                                className="text-blue-500 mr-2"
                                size={16}
                              />
                              <span className="text-sm text-gray-600">
                                {editFormData.ktpAtauKtm}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDownload(editFormData.ktpAtauKtm)
                                }
                                className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                              >
                                (Unduh)
                              </button>
                            </div>
                          )}
                          <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            {editFormData.ktpAtauKtm
                              ? "Ganti File"
                              : "Pilih File"}
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  ktpAtauKtm: e.target.files[0],
                                })
                              }
                              accept="image/*,.pdf"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Transkrip Nilai */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Transkrip Nilai
                        </label>
                        <div className="flex items-center gap-4">
                          {editFormData.transkrip && (
                            <div className="flex items-center">
                              <FileText
                                className="text-blue-500 mr-2"
                                size={16}
                              />
                              <span className="text-sm text-gray-600">
                                {editFormData.transkrip}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDownload(editFormData.transkrip)
                                }
                                className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                              >
                                (Unduh)
                              </button>
                            </div>
                          )}
                          <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            {editFormData.transkrip
                              ? "Ganti File"
                              : "Pilih File"}
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  transkrip: e.target.files[0],
                                })
                              }
                              accept=".pdf,.doc,.docx"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Surat Rekomendasi */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Surat Rekomendasi
                        </label>
                        <div className="flex items-center gap-4">
                          {editFormData.rekomendasi && (
                            <div className="flex items-center">
                              <FileText
                                className="text-blue-500 mr-2"
                                size={16}
                              />
                              <span className="text-sm text-gray-600">
                                {editFormData.rekomendasi}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDownload(editFormData.rekomendasi)
                                }
                                className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                              >
                                (Unduh)
                              </button>
                            </div>
                          )}
                          <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            {editFormData.rekomendasi
                              ? "Ganti File"
                              : "Pilih File"}
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  rekomendasi: e.target.files[0],
                                })
                              }
                              accept=".pdf,.doc,.docx"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <h3 className="font-medium text-gray-700 mb-1">Keterangan:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Klik pada baris untuk melihat detail pendaftaran</li>
              <li>
                Edit hanya tersedia untuk status{" "}
                <span className="font-medium">
                  "Pending", "Ditolak", atau "Perbaiki"
                </span>
              </li>
              <li>
                Download surat balasan hanya tersedia untuk status{" "}
                <span className="font-medium">"Disetujui"</span>
              </li>
              <li>
                Upload laporan akhir hanya bisa dilakukan sekali dan hanya
                tersedia untuk status{" "}
                <span className="font-medium">"Disetujui"</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
