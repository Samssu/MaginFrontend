"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/layouts/AdminLayouts";
import { toast } from "react-toastify";
import Head from "next/head";
import * as XLSX from "xlsx";

export default function DataPendaftaran() {
  // State management
  const [pendaftar, setPendaftar] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Initialize filteredData here
  const [form, setForm] = useState({
    nama: "",
    institusi: "",
    semester: "",
    prodi: "",
    email: "",
    jenisKelamin: "",
    alamat: "",
    telepon: "",
    tanggalLahir: "",
    filePdf: "",
  });
  const [editId, setEditId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [komentar, setKomentar] = useState("");
  const [fileBalasan, setFileBalasan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    disetujui: 0,
    ditolak: 0,
    perbaiki: 0,
    pending: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPembimbingModal, setShowPembimbingModal] = useState(false);
  const [pembimbingList, setPembimbingList] = useState([]);
  const [selectedPembimbing, setSelectedPembimbing] = useState("");
  const [selectedPendaftarId, setSelectedPendaftarId] = useState(null);
  const itemsPerPage = 10;
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateFile, setCertificateFile] = useState(null);
  const [selectedCertificatePendaftar, setSelectedCertificatePendaftar] =
    useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
    fetchPembimbing();
  }, []);

  // Fetch pembimbing data
  const fetchPembimbing = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pembimbing");
      setPembimbingList(res.data);
    } catch (error) {
      console.error("Error fetching pembimbing:", error);
      toast.error("Gagal memuat data pembimbing");
    }
  };

  // Data fetching function
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5000/api/pendaftaran");
      setPendaftar(res.data);
      setFilteredData(res.data); // Initialize filteredData with the fetched data
      calculateStats(res.data); // Calculate stats after fetching
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Gagal memuat data pendaftar", { position: "bottom-right" });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (data) => {
    setStats({
      total: data.length,
      disetujui: data.filter((p) => p.status === "disetujui").length,
      ditolak: data.filter((p) => p.status === "ditolak").length,
      perbaiki: data.filter((p) => p.status === "perbaiki").length,
      pending: data.filter((p) => p.status === "pending").length,
    });
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await axios.put(`http://localhost:5000/api/pendaftaran/${editId}`, form);
      toast.success("Data berhasil diperbarui", { position: "bottom-right" });
      fetchData();
      resetForm();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.message || "Gagal menyimpan perubahan",
        { position: "bottom-right" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    if (!form.nama.trim()) {
      toast.error("Nama wajib diisi", { position: "bottom-right" });
      return false;
    }
    if (!form.email.trim()) {
      toast.error("Email wajib diisi", { position: "bottom-right" });
      return false;
    }
    return true;
  };

  // Reset form
  const resetForm = () => {
    setForm({
      nama: "",
      institusi: "",
      semester: "",
      prodi: "",
      email: "",
      jenisKelamin: "",
      alamat: "",
      telepon: "",
      tanggalLahir: "",
      filePdf: "",
    });
    setEditId(null);
  };

  // Action handlers
  const handleEdit = (data) => {
    setEditId(data._id);
    setForm(data);
    setSelectedAction(null);
  };

  const handleActionSubmit = async () => {
    if (!validateAction()) return;

    try {
      setIsLoading(true);

      // Handle file upload if approving - PASTIKAN INI DIEKSEKUSI
      let fileName = null;
      if (selectedAction.action === "disetujui") {
        if (!fileBalasan) {
          toast.error("Surat balasan wajib diunggah!", {
            position: "bottom-right",
          });
          setIsLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", fileBalasan);
        const uploadRes = await axios.post(
          "http://localhost:5000/api/upload-pdf",
          formData
        );
        fileName = uploadRes.data.fileName;
      }

      // Prepare payload
      const payload = {
        status: selectedAction.action,
        ...(komentar && { komentar }),
        ...(fileName && { suratBalasan: fileName }), // Pastikan ini terkirim
      };

      await axios.patch(
        `http://localhost:5000/api/pendaftaran/${selectedAction.data._id}/status`,
        payload
      );

      toast.success(`Status berhasil diubah`, { position: "bottom-right" });
      fetchData();
      resetAction();
    } catch (error) {
      console.error("Action error:", error);
      toast.error(error.response?.data?.message || "Gagal mengubah status", {
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Action validation
  const validateAction = () => {
    if (
      (selectedAction.action === "ditolak" ||
        selectedAction.action === "perbaiki") &&
      !komentar.trim()
    ) {
      toast.error("Komentar wajib diisi!", { position: "bottom-right" });
      return false;
    }
    if (selectedAction.action === "disetujui" && !fileBalasan) {
      toast.error("Surat balasan wajib diunggah!", {
        position: "bottom-right",
      });
      return false;
    }
    return true;
  };

  // Reset action state
  const resetAction = () => {
    setSelectedAction(null);
    setKomentar("");
    setFileBalasan(null);
  };

  const handleTambahPembimbing = (pendaftarId) => {
    setSelectedPendaftarId(pendaftarId);
    setShowPembimbingModal(true);
  };

  const submitPembimbing = async () => {
    if (!selectedPembimbing) {
      toast.error("Pilih pembimbing terlebih dahulu");
      return;
    }

    try {
      setIsLoading(true);

      // 1. Cek kapasitas pembimbing
      const pembimbingData = pembimbingList.find(
        (p) => p._id === selectedPembimbing
      );

      // Perbaikan: Cek status aktif dan kapasitas
      if (pembimbingData.status !== "aktif") {
        toast.error("Pembimbing tidak aktif");
        return;
      }

      if (pembimbingData.jumlahMahasiswa >= 5) {
        toast.error(
          "Pembimbing ini sudah mencapai kapasitas maksimal (5 mahasiswa)"
        );
        return;
      }

      // 2. Cek apakah mahasiswa sudah memiliki pembimbing
      const pendaftarData = pendaftar.find(
        (p) => p._id === selectedPendaftarId
      );

      if (pendaftarData.pembimbing) {
        // Jika sudah ada pembimbing, kurangi jumlah mahasiswa pembimbing sebelumnya
        try {
          await axios.patch(
            `http://localhost:5000/api/pembimbing/${pendaftarData.pembimbing}/kurangi-mahasiswa`
          );
        } catch (error) {
          console.error("Error mengurangi mahasiswa sebelumnya:", error);
          // Lanjutkan meskipun gagal mengurangi (bisa jadi pembimbing sudah dihapus)
        }
      }

      // 3. Update pendaftaran data dengan pembimbing baru - PERBAIKAN DI SINI
      await axios.patch(
        `http://localhost:5000/api/pendaftaran/${selectedPendaftarId}`,
        {
          pembimbing: selectedPembimbing, // Gunakan field yang benar
          status: "disetujui",
        }
      );

      // 4. Update jumlah mahasiswa pembimbing baru
      await axios.patch(
        `http://localhost:5000/api/pembimbing/${selectedPembimbing}/tambah-mahasiswa`
      );

      toast.success("Pembimbing berhasil ditambahkan/diubah");
      fetchData();
      setShowPembimbingModal(false);
      setSelectedPembimbing("");
    } catch (error) {
      console.error("Error assigning pembimbing:", error);

      // Tampilkan error yang lebih spesifik
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Gagal menambahkan pembimbing");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get pembimbing name by ID
  const getPembimbingName = (id) => {
    const pembimbing = pembimbingList.find((p) => p._id === id);
    return pembimbing ? pembimbing.nama : "Pembimbing tidak ditemukan";
  };

  // Filter data based on searchTerm
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredData(pendaftar); // Reset filter when search term is empty
    } else {
      const filtered = pendaftar.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1); // Reset page when filtering
  }, [searchTerm, pendaftar]);

  // Handle certificate upload
  const handleCertificateUpload = async () => {
    if (!certificateFile) {
      toast.error("Silakan pilih file sertifikat terlebih dahulu", {
        position: "bottom-right",
      });
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", certificateFile);

      const uploadRes = await axios.post(
        "http://localhost:5000/api/upload-certificate",
        formData
      );

      await axios.patch(
        `http://localhost:5000/api/pendaftaran/${selectedCertificatePendaftar._id}/certificate`,
        {
          certificate: uploadRes.data.fileName,
        }
      );

      toast.success("Sertifikat berhasil diupload", {
        position: "bottom-right",
      });
      fetchData();
      setShowCertificateModal(false);
      setCertificateFile(null);
    } catch (error) {
      console.error("Certificate upload error:", error);
      toast.error("Gagal mengupload sertifikat", {
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to download Excel report
  // Function to download Excel report
  const downloadExcelReport = async () => {
    try {
      setIsDownloading(true);

      // Get all data for the report
      const response = await axios.get("http://localhost:5000/api/pendaftaran");
      const allData = response.data;

      // Format data for Excel
      const formattedData = allData.map((item) => {
        // Get pembimbing name if exists
        const pembimbingName = item.pembimbing
          ? getPembimbingName(item.pembimbing)
          : "Belum ada pembimbing";

        return {
          ID: item._id || "",
          Email: item.email || "",
          Nama: item.nama || "",
          TTL: item.ttl || "",
          "Tanggal Lahir": item.tanggalLahir
            ? new Date(item.tanggalLahir).toLocaleDateString("id-ID")
            : "",
          "Jenis Kelamin": item.jenisKelamin || "",
          Alamat: item.alamat || "",
          "No HP": item.telepon || "",
          Institusi: item.institusi || "",
          "Program Studi": item.prodi || "",
          Jenjang: item.jenjang || "",
          Semester: item.semester || "",
          IPK: item.ipk || "",
          "Mulai Magang": item.mulai
            ? new Date(item.mulai).toLocaleDateString("id-ID")
            : "",
          "Selesai Magang": item.selesai
            ? new Date(item.selesai).toLocaleDateString("id-ID")
            : "",
          "Tujuan Magang": item.tujuan || "",
          Divisi: item.divisi || "",
          "Surat Pengantar": item.suratPengantar
            ? `http://localhost:5000/uploads/${item.suratPengantar}`
            : "",
          CV: item.cv ? `http://localhost:5000/uploads/${item.cv}` : "",
          Foto: item.foto ? `http://localhost:5000/uploads/${item.foto}` : "",
          "KTP/KTM": item.ktpAtauKtm
            ? `http://localhost:5000/uploads/${item.ktpAtauKtm}`
            : "",
          "Transkrip Nilai": item.transkrip
            ? `http://localhost:5000/uploads/${item.transkrip}`
            : "",
          "Surat Rekomendasi": item.rekomendasi
            ? `http://localhost:5000/uploads/${item.rekomendasi}`
            : "",
          Komentar: item.komentar || "",
          Status: item.status || "pending",
          Logbooks: item.logbooks ? JSON.stringify(item.logbooks) : "",
          Notifications: item.notifications
            ? JSON.stringify(item.notifications)
            : "",
          "Tanggal Upload Sertifikat": item.certificateUploadDate
            ? new Date(item.certificateUploadDate).toLocaleDateString("id-ID")
            : "",
          "Dibuat Pada": item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("id-ID")
            : "",
          "Diperbarui Pada": item.updatedAt
            ? new Date(item.updatedAt).toLocaleDateString("id-ID")
            : "",
          Versi: item.__v || "0",
          Pembimbing: pembimbingName,
          Sertifikat: item.certificate
            ? `http://localhost:5000/uploads/${item.certificate}`
            : "",
        };
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(formattedData);

      // Set column widths
      const colWidths = [
        { wch: 25 }, // ID
        { wch: 25 }, // Email
        { wch: 25 }, // Nama
        { wch: 25 }, // TTL
        { wch: 15 }, // Tanggal Lahir
        { wch: 15 }, // Jenis Kelamin
        { wch: 30 }, // Alamat
        { wch: 15 }, // No HP
        { wch: 25 }, // Institusi
        { wch: 20 }, // Program Studi
        { wch: 10 }, // Jenjang
        { wch: 10 }, // Semester
        { wch: 10 }, // IPK
        { wch: 15 }, // Mulai Magang
        { wch: 15 }, // Selesai Magang
        { wch: 30 }, // Tujuan Magang
        { wch: 20 }, // Divisi
        { wch: 40 }, // Surat Pengantar
        { wch: 40 }, // CV
        { wch: 40 }, // Foto
        { wch: 40 }, // KTP/KTM
        { wch: 40 }, // Transkrip Nilai
        { wch: 40 }, // Surat Rekomendasi
        { wch: 30 }, // Komentar
        { wch: 12 }, // Status
        { wch: 50 }, // Logbooks
        { wch: 50 }, // Notifications
        { wch: 20 }, // Tanggal Upload Sertifikat
        { wch: 15 }, // Dibuat Pada
        { wch: 15 }, // Diperbarui Pada
        { wch: 10 }, // Versi
        { wch: 25 }, // Pembimbing
        { wch: 40 }, // Sertifikat
      ];
      ws["!cols"] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Data Pendaftaran");

      // Generate current date for filename
      const currentDate = new Date().toISOString().split("T")[0];

      // Download the file
      XLSX.writeFile(wb, `rekap_pendaftaran_${currentDate}.xlsx`);

      toast.success("Rekap data berhasil diunduh", {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Gagal mengunduh rekap data", { position: "bottom-right" });
    } finally {
      setIsDownloading(false);
    }
  };

  // Function to download filtered data as Excel
  const downloadFilteredExcel = () => {
    try {
      setIsDownloading(true);

      // Format data for Excel
      const formattedData = filteredData.map((item) => {
        // Get pembimbing name if exists
        const pembimbingName = item.pembimbing
          ? getPembimbingName(item.pembimbing)
          : "Belum ada pembimbing";

        return {
          ID: item._id || "",
          Email: item.email || "",
          Nama: item.nama || "",
          TTL: item.ttl || "",
          "Tanggal Lahir": item.tanggalLahir
            ? new Date(item.tanggalLahir).toLocaleDateString("id-ID")
            : "",
          "Jenis Kelamin": item.jenisKelamin || "",
          Alamat: item.alamat || "",
          "No HP": item.telepon || "",
          Institusi: item.institusi || "",
          "Program Studi": item.prodi || "",
          Jenjang: item.jenjang || "",
          Semester: item.semester || "",
          IPK: item.ipk || "",
          "Mulai Magang": item.mulai
            ? new Date(item.mulai).toLocaleDateString("id-ID")
            : "",
          "Selesai Magang": item.selesai
            ? new Date(item.selesai).toLocaleDateString("id-ID")
            : "",
          "Tujuan Magang": item.tujuan || "",
          Divisi: item.divisi || "",
          "Surat Pengantar": item.suratPengantar
            ? `http://localhost:5000/uploads/${item.suratPengantar}`
            : "",
          CV: item.cv ? `http://localhost:5000/uploads/${item.cv}` : "",
          Foto: item.foto ? `http://localhost:5000/uploads/${item.foto}` : "",
          "KTP/KTM": item.ktpAtauKtm
            ? `http://localhost:5000/uploads/${item.ktpAtauKtm}`
            : "",
          "Transkrip Nilai": item.transkrip
            ? `http://localhost:5000/uploads/${item.transkrip}`
            : "",
          "Surat Rekomendasi": item.rekomendasi
            ? `http://localhost:5000/uploads/${item.rekomendasi}`
            : "",
          Komentar: item.komentar || "",
          Status: item.status || "pending",
          Logbooks: item.logbooks ? JSON.stringify(item.logbooks) : "",
          Notifications: item.notifications
            ? JSON.stringify(item.notifications)
            : "",
          "Tanggal Upload Sertifikat": item.certificateUploadDate
            ? new Date(item.certificateUploadDate).toLocaleDateString("id-ID")
            : "",
          "Dibuat Pada": item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("id-ID")
            : "",
          "Diperbarui Pada": item.updatedAt
            ? new Date(item.updatedAt).toLocaleDateString("id-ID")
            : "",
          Versi: item.__v || "0",
          Pembimbing: pembimbingName,
          Sertifikat: item.certificate
            ? `http://localhost:5000/uploads/${item.certificate}`
            : "",
        };
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(formattedData);

      // Set column widths
      const colWidths = [
        { wch: 25 }, // ID
        { wch: 25 }, // Email
        { wch: 25 }, // Nama
        { wch: 25 }, // TTL
        { wch: 15 }, // Tanggal Lahir
        { wch: 15 }, // Jenis Kelamin
        { wch: 30 }, // Alamat
        { wch: 15 }, // No HP
        { wch: 25 }, // Institusi
        { wch: 20 }, // Program Studi
        { wch: 10 }, // Jenjang
        { wch: 10 }, // Semester
        { wch: 10 }, // IPK
        { wch: 15 }, // Mulai Magang
        { wch: 15 }, // Selesai Magang
        { wch: 30 }, // Tujuan Magang
        { wch: 20 }, // Divisi
        { wch: 40 }, // Surat Pengantar
        { wch: 40 }, // CV
        { wch: 40 }, // Foto
        { wch: 40 }, // KTP/KTM
        { wch: 40 }, // Transkrip Nilai
        { wch: 40 }, // Surat Rekomendasi
        { wch: 30 }, // Komentar
        { wch: 12 }, // Status
        { wch: 50 }, // Logbooks
        { wch: 50 }, // Notifications
        { wch: 20 }, // Tanggal Upload Sertifikat
        { wch: 15 }, // Dibuat Pada
        { wch: 15 }, // Diperbarui Pada
        { wch: 10 }, // Versi
        { wch: 25 }, // Pembimbing
        { wch: 40 }, // Sertifikat
      ];
      ws["!cols"] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Data Pendaftaran");

      // Generate current date for filename
      const currentDate = new Date().toISOString().split("T")[0];
      const statusFilter =
        searchTerm && searchTerm !== "all" ? `_${searchTerm}` : "";

      // Download the file
      XLSX.writeFile(
        wb,
        `rekap_pendaftaran${statusFilter}_${currentDate}.xlsx`
      );

      toast.success("Data berhasil diunduh", { position: "bottom-right" });
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Gagal mengunduh data", { position: "bottom-right" });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Data Magang | Kominfo Palembang</title>
      </Head>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              📋 Data Pendaftaran Magang
            </h1>
            <p className="text-gray-600">
              Kelola data pendaftaran magang di Kominfo Palembang
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={downloadExcelReport}
              disabled={isDownloading || pendaftar.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Rekap
                </>
              )}
            </button>
            {filteredData.length > 0 &&
              filteredData.length !== pendaftar.length && (
                <button
                  onClick={downloadFilteredExcel}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Filtered
                </button>
              )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className={`p-4 rounded-lg shadow ${
              key === "disetujui" && value > 0
                ? "bg-green-50"
                : key === "ditolak" && value > 0
                ? "bg-red-50"
                : key === "perbaiki" && value > 0
                ? "bg-blue-50"
                : key === "pending" && value > 0
                ? "bg-yellow-50"
                : "bg-white"
            }`}
          >
            <div className="text-sm text-gray-500 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </div>
            <div
              className={`text-2xl font-bold ${
                key === "disetujui"
                  ? "text-green-600"
                  : key === "ditolak"
                  ? "text-red-600"
                  : key === "perbaiki"
                  ? "text-blue-600"
                  : key === "pending"
                  ? "text-yellow-600"
                  : "text-gray-800"
              }`}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Cari pendaftar..."
          className="flex-grow p-2 border rounded"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="p-2 border rounded"
          onChange={(e) => {
            const status = e.target.value;
            setSearchTerm(status === "all" ? "" : status);
            setCurrentPage(1);
          }}
        >
          <option value="all">Semua Status</option>
          <option value="disetujui">Disetujui</option>
          <option value="ditolak">Ditolak</option>
          <option value="perbaiki">Perbaiki</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      {/* Edit Form */}
      {editId && (
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            ✏️ Edit Data Pendaftar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(form).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                {key === "alamat" ? (
                  <textarea
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    rows={3}
                  />
                ) : key === "filePdf" ? (
                  value && (
                    <a
                      href={`http://localhost:5000/uploads/${value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-block mt-1"
                    >
                      📄 Lihat Dokumen
                    </a>
                  )
                ) : key === "pembimbing" ? (
                  <div className="p-2 bg-gray-100 rounded">
                    {value ? getPembimbingName(value) : "Belum ada pembimbing"}
                  </div>
                ) : (
                  <input
                    type={key === "tanggalLahir" ? "date" : "text"}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Modern Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Nama",
                  "Institusi",
                  "Semester",
                  "Prodi",
                  "Email",
                  "Status",
                  "Pembimbing",
                  "Aksi",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Nama dengan Avatar */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            onClick={() => setSelectedDetail(item)}
                          >
                            {item.nama}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {item.institusi}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {item.semester}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {item.prodi}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {item.email}
                    </td>

                    <td className="px-4 py- whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === "disetujui"
                            ? "bg-green-100 text-green-800"
                            : item.status === "ditolak"
                            ? "bg-red-100 text-red-800"
                            : item.status === "perbaiki"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status || "pending"}
                      </span>
                    </td>

                    <td className="px-4 py- whitespace-nowrap text-sm text-gray-500">
                      {item.pembimbing ? (
                        <span className="text-gray-700">
                          {getPembimbingName(item.pembimbing)}
                        </span>
                      ) : (
                        <span className="text-gray-400">Belum ada</span>
                      )}
                    </td>

                    {/* Tombol Aksi (Tetap sama seperti sebelumnya) */}
                    <td className="px-4 py- whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-wrap gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-all shadow-sm border border-yellow-200 text-sm font-medium"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          <span>Edit</span>
                        </button>

                        {/* Action Buttons */}
                        {["disetujui", "ditolak", "perbaiki"].map((action) => (
                          <button
                            key={action}
                            onClick={() =>
                              setSelectedAction({ action, data: item })
                            }
                            disabled={item.status === action}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all shadow-sm border text-sm font-medium ${
                              action === "disetujui"
                                ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                                : action === "ditolak"
                                ? "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"
                                : "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
                            } ${
                              item.status === action
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            {action === "disetujui" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : action === "ditolak" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            )}
                            <span>
                              {action === "disetujui"
                                ? "Setujui"
                                : action === "ditolak"
                                ? "Tolak"
                                : "Perbaiki"}
                            </span>
                          </button>
                        ))}

                        {/* Pembimbing Buttons */}
                        {item.status === "disetujui" && !item.pembimbing && (
                          <button
                            onClick={() => handleTambahPembimbing(item._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-all shadow-sm border border-purple-200 text-sm font-medium"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                              />
                            </svg>
                            <span>Tambah Pembimbing</span>
                          </button>
                        )}

                        {item.status === "disetujui" && item.pembimbing && (
                          <button
                            onClick={() => handleTambahPembimbing(item._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 transition-all shadow-sm border border-indigo-200 text-sm font-medium"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                              />
                            </svg>
                            <span>Ubah Pembimbing</span>
                          </button>
                        )}

                        {/* Sertifikat Button */}
                        {item.status === "disetujui" && (
                          <button
                            onClick={() => {
                              setSelectedCertificatePendaftar(item);
                              setShowCertificateModal(true);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-teal-100 text-teal-800 rounded-lg hover:bg-teal-200 transition-all shadow-sm border border-teal-200 text-sm font-medium"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>Tambah Sertifikat</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Memuat data...
                      </div>
                    ) : (
                      "Tidak ada data ditemukan"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Menampilkan{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  sampai{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredData.length)}
                  </span>{" "}
                  dari{" "}
                  <span className="font-medium">{filteredData.length}</span>{" "}
                  hasil
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">First</span>
                    &laquo;
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    &lsaquo;
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
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    &rsaquo;
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span className="sr-only">Last</span>
                    &raquo;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-sm"
            onClick={() => setSelectedDetail(null)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto z-10">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Detail Pendaftar
                </h3>
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedDetail).map(([key, value]) => {
                  // Skip fields yang berisi object atau array kompleks
                  if (
                    typeof value === "object" &&
                    value !== null &&
                    !Array.isArray(value)
                  ) {
                    return null;
                  }

                  // Handle array fields
                  if (Array.isArray(value)) {
                    return (
                      <div key={key} className="space-y-1">
                        <h4 className="text-sm font-medium text-gray-500 capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </h4>
                        <p className="text-gray-800 break-all">
                          {value.length > 0
                            ? `${value.length} items`
                            : "Tidak ada data"}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div key={key} className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </h4>
                      {typeof value === "string" && value.endsWith(".pdf") ? (
                        <a
                          href={`http://localhost:5000/uploads/${value}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          Lihat Dokumen
                        </a>
                      ) : key === "pembimbing" ? (
                        <p className="text-gray-800 break-all">
                          {value
                            ? getPembimbingName(value)
                            : "Belum ada pembimbing"}
                        </p>
                      ) : (
                        <p className="text-gray-800 break-all">
                          {value !== null && value !== undefined
                            ? value.toString()
                            : "-"}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Status Pendaftaran
                </h4>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      selectedDetail.status === "disetujui"
                        ? "bg-green-100 text-green-800"
                        : selectedDetail.status === "ditolak"
                        ? "bg-red-100 text-red-800"
                        : selectedDetail.status === "perbaiki"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedDetail.status || "pending"}
                  </span>
                  {selectedDetail.komentar && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Alasan: </span>
                      {selectedDetail.komentar}
                    </div>
                  )}
                </div>
              </div>

              {selectedDetail.pembimbing && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Informasi Pembimbing
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nama Pembimbing</p>
                      <p className="text-gray-800 font-medium">
                        {getPembimbingName(selectedDetail.pembimbing)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Divisi</p>
                      <p className="text-gray-800">
                        {pembimbingList.find(
                          (p) => p._id === selectedDetail.pembimbing
                        )?.divisi || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Action Modal */}
      {selectedAction && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedAction.action === "disetujui"
                    ? "Setujui Pendaftaran"
                    : selectedAction.action === "ditolak"
                    ? "Tolak Pendaftaran"
                    : "Perbaiki Pendaftaran"}
                </h3>
                <button
                  onClick={resetAction}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-medium">Nama Pendaftar:</p>
                  <p className="text-gray-700">{selectedAction?.data?.nama}</p>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    {selectedAction.action === "disetujui"
                      ? "Catatan (opsional)"
                      : "Alasan " + selectedAction.action}
                  </label>
                  <textarea
                    rows={3}
                    value={komentar}
                    onChange={(e) => setKomentar(e.target.value)}
                    className="w-full border p-2 rounded"
                    required={selectedAction.action !== "disetujui"}
                  />
                </div>

                {selectedAction.action === "disetujui" && (
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">
                      Surat Balasan (PDF){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setFileBalasan(e.target.files[0])}
                      className="block w-full border p-2 rounded"
                      required
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={resetAction}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleActionSubmit}
                    disabled={isLoading}
                    className={`px-4 py-2 text-white rounded disabled:opacity-50 ${
                      selectedAction.action === "disetujui"
                        ? "bg-green-600 hover:bg-green-700"
                        : selectedAction.action === "ditolak"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isLoading ? "Memproses..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Pembimbing Modal */}
      {showPembimbingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedPendaftarId &&
                  pendaftar.find((p) => p._id === selectedPendaftarId)
                    ?.pembimbing
                    ? "Ubah Pembimbing"
                    : "Tambahkan Pembimbing"}
                </h3>
                <button
                  onClick={() => setShowPembimbingModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Pembimbing
                  </label>
                  <select
                    value={selectedPembimbing}
                    onChange={(e) => setSelectedPembimbing(e.target.value)}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">-- Pilih Pembimbing --</option>
                    {pembimbingList
                      .filter((p) => p.status === "aktif") // Pastikan hanya yang aktif
                      .map((pembimbing) => (
                        <option
                          key={pembimbing._id}
                          value={pembimbing._id}
                          disabled={pembimbing.jumlahMahasiswa >= 5}
                        >
                          {pembimbing.nama} - {pembimbing.divisi}
                          {pembimbing.jumlahMahasiswa >= 5
                            ? " (Kapasitas Penuh)"
                            : ` (${pembimbing.jumlahMahasiswa || 0}/5)`}
                        </option>
                      ))}
                  </select>
                </div>

                {selectedPembimbing && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Detail Pembimbing
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Nama</p>
                        <p className="text-sm">
                          {
                            pembimbingList.find(
                              (p) => p._id === selectedPembimbing
                            )?.nama
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Divisi</p>
                        <p className="text-sm">
                          {
                            pembimbingList.find(
                              (p) => p._id === selectedPembimbing
                            )?.divisi
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="text-sm">
                          {pembimbingList.find(
                            (p) => p._id === selectedPembimbing
                          )?.status === "aktif"
                            ? "Aktif"
                            : "Tidak Aktif"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Kapasitas</p>
                        <p className="text-sm">
                          {pembimbingList.find(
                            (p) => p._id === selectedPembimbing
                          )?.jumlahMahasiswa || 0}
                          /5
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowPembimbingModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button
                    onClick={submitPembimbing}
                    disabled={isLoading || !selectedPembimbing}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isLoading ? "Memproses..." : "Simpan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Upload Sertifikat
                </h3>
                <button
                  onClick={() => {
                    setShowCertificateModal(false);
                    setCertificateFile(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-medium">Nama Pendaftar:</p>
                  <p className="text-gray-700">
                    {selectedCertificatePendaftar?.nama}
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    File Sertifikat (PDF){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setCertificateFile(e.target.files[0])}
                    className="block w-full border p-2 rounded"
                    required
                  />
                </div>

                {selectedCertificatePendaftar?.certificate && (
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="text-sm text-gray-600 mb-1">
                      Sertifikat saat ini:
                    </p>
                    <a
                      href={`http://localhost:5000/uploads/${selectedCertificatePendaftar.certificate}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Lihat Sertifikat
                    </a>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowCertificateModal(false);
                      setCertificateFile(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleCertificateUpload}
                    disabled={isLoading || !certificateFile}
                    className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
                  >
                    {isLoading ? "Mengupload..." : "Upload"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
