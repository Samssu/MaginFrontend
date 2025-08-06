"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/layouts/AdminLayouts";
import { toast } from "react-toastify";
import Head from "next/head";

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

      // Handle file upload if approving
      let fileName = null;
      if (selectedAction.action === "disetujui" && fileBalasan) {
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
        ...(fileName && { suratBalasan: fileName }),
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
      toast.error("Pilih pembimbing terlebih dahulu", {
        position: "bottom-right",
      });
      return;
    }

    try {
      setIsLoading(true);

      // 1. Cek kapasitas pembimbing
      const pembimbingData = pembimbingList.find(
        (p) => p._id === selectedPembimbing
      );
      if (pembimbingData.jumlahMahasiswa >= 5) {
        toast.error(
          "Pembimbing ini sudah mencapai kapasitas maksimal (5 mahasiswa)",
          {
            position: "bottom-right",
          }
        );
        return;
      }

      // 2. Cek apakah mahasiswa sudah memiliki pembimbing
      const pendaftarData = pendaftar.find(
        (p) => p._id === selectedPendaftarId
      );
      if (pendaftarData.pembimbing) {
        // Jika sudah ada pembimbing, kurangi jumlah mahasiswa pembimbing sebelumnya
        await axios.patch(
          `http://localhost:5000/api/pembimbing/${pendaftarData.pembimbing}/kurangi-mahasiswa`
        );
      }

      // 3. Update pendaftaran data dengan pembimbing baru
      await axios.patch(
        `http://localhost:5000/api/pendaftaran/${selectedPendaftarId}`,
        {
          pembimbing: selectedPembimbing,
        }
      );

      // 4. Update jumlah mahasiswa pembimbing baru
      await axios.patch(
        `http://localhost:5000/api/pembimbing/${selectedPembimbing}/tambah-mahasiswa`
      );

      toast.success("Pembimbing berhasil ditambahkan/diubah", {
        position: "bottom-right",
      });
      fetchData();
      setShowPembimbingModal(false);
      setSelectedPembimbing("");
    } catch (error) {
      console.error("Error assigning pembimbing:", error);
      toast.error("Gagal menambahkan pembimbing", { position: "bottom-right" });
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

  return (
    <AdminLayout>
      <Head>
        <title>Data Magang | Kominfo Palembang</title>
      </Head>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          📋 Data Pendaftaran Magang
        </h1>
        <p className="text-gray-600">
          Kelola data pendaftaran magang di Kominfo Palembang
        </p>
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
      {/* Data Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
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
                    className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td
                      className="p-3 text-blue-600 hover:underline cursor-pointer"
                      onClick={() => setSelectedDetail(item)}
                    >
                      {item.nama}
                    </td>
                    <td className="p-3">{item.institusi}</td>
                    <td className="p-3">{item.semester}</td>
                    <td className="p-3">{item.prodi}</td>
                    <td className="p-3">{item.email}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
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
                    <td className="p-3">
                      {item.pembimbing ? (
                        <span className="text-sm text-gray-700">
                          {getPembimbingName(item.pembimbing)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Belum ada</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        {["disetujui", "ditolak", "perbaiki"].map((action) => (
                          <button
                            key={action}
                            onClick={() =>
                              setSelectedAction({ action, data: item })
                            }
                            disabled={item.status === action}
                            className={`${
                              action === "disetujui"
                                ? "bg-green-500 hover:bg-green-600"
                                : action === "ditolak"
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-blue-500 hover:bg-blue-600"
                            } text-white text-xs px-2 py-1 rounded disabled:opacity-50`}
                          >
                            {action === "disetujui"
                              ? "Setujui"
                              : action === "ditolak"
                              ? "Tolak"
                              : "Perbaiki"}
                          </button>
                        ))}
                        {item.status === "disetujui" && !item.pembimbing && (
                          <button
                            onClick={() => handleTambahPembimbing(item._id)}
                            className="bg-purple-500 hover:bg-purple-600 text-white text-xs px-2 py-1 rounded"
                          >
                            Tambah Pembimbing
                          </button>
                        )}
                        {item.status === "disetujui" && item.pembimbing && (
                          <button
                            onClick={() => handleTambahPembimbing(item._id)}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-2 py-1 rounded"
                          >
                            Ubah Pembimbing
                          </button>
                        )}
                        {item.status === "disetujui" && (
                          <button
                            onClick={() => {
                              setSelectedCertificatePendaftar(item);
                              setShowCertificateModal(true);
                            }}
                            className="bg-teal-500 hover:bg-teal-600 text-white text-xs px-2 py-1 rounded"
                          >
                            Tambah Sertifikat
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    {isLoading ? "Memuat data..." : "Tidak ada data ditemukan"}
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
                {Object.entries(selectedDetail).map(([key, value]) => (
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
                      <p className="text-gray-800 break-all">{value || "-"}</p>
                    )}
                  </div>
                ))}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                  <p className="text-gray-700">{selectedAction.data.nama}</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
                      .filter((p) => p.status === "aktif")
                      .map((pembimbing) => (
                        <option
                          key={pembimbing._id}
                          value={pembimbing._id}
                          disabled={pembimbing.jumlahMahasiswa >= 5}
                        >
                          {pembimbing.nama} - {pembimbing.divisi}
                          {pembimbing.jumlahMahasiswa >= 5
                            ? " (Kapasitas Penuh)"
                            : ` (${pembimbing.jumlahMahasiswa}/5)`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
