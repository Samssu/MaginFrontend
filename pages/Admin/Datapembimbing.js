"use client";

import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layouts/AdminLayouts";
import axios from "axios";
import { toast } from "react-toastify";
import {
  UserCircle2,
  MoreVertical,
  Users,
  CheckCircle,
  XCircle,
  Activity,
  Plus,
  RotateCw,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function Pembimbing() {
  const [pembimbing, setPembimbing] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    divisi: "",
  });
  const [selectedPembimbing, setSelectedPembimbing] = useState(null);
  const [mahasiswaBimbingan, setMahasiswaBimbingan] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    aktif: 0,
    nonaktif: 0,
    kapasitasPenuh: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

  const handleViewMahasiswaDetail = (mahasiswa) => {
    setSelectedMahasiswa(mahasiswa);
  };
  const [showLogbookModal, setShowLogbookModal] = useState(false);
  const [showLaporanModal, setShowLaporanModal] = useState(false);
  const [selectedMahasiswaForReport, setSelectedMahasiswaForReport] =
    useState(null);

  const handleViewLogbook = (mahasiswa) => {
    setSelectedMahasiswaForReport(mahasiswa);
    setShowLogbookModal(true);
  };

  const handleViewLaporan = (mahasiswa) => {
    setSelectedMahasiswaForReport(mahasiswa);
    setShowLaporanModal(true);
  };

  useEffect(() => {
    fetchPembimbing();
  }, []);

  const fetchPembimbing = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5000/api/pembimbing");
      setPembimbing(res.data);
      calculateStats(res.data);
    } catch (error) {
      toast.error("Gagal memuat data pembimbing");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (data) => {
    const aktif = data.filter((p) => p.status === "aktif").length;
    const nonaktif = data.filter((p) => p.status === "tidak aktif").length;
    const kapasitasPenuh = data.filter((p) => p.jumlahMahasiswa >= 5).length;

    setStats({
      total: data.length,
      aktif,
      nonaktif,
      kapasitasPenuh,
    });
  };

  const fetchMahasiswa = async (pembimbingId) => {
    try {
      setIsLoading(true);
      console.log("Fetching mahasiswa for pembimbing:", pembimbingId);

      const res = await axios.get(
        `http://localhost:5000/api/pembimbing/${pembimbingId}/mahasiswa`
      );

      console.log("Received data:", res.data);
      setMahasiswaBimbingan(res.data);
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        config: error.config,
      });
      toast.error(
        error.response?.data?.message || "Gagal memuat data mahasiswa"
      );
      setMahasiswaBimbingan([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Validasi
      if (!form.nama || !form.email || !form.password || !form.divisi) {
        toast.error("Semua field wajib diisi");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/pembimbing",
        form
      );

      toast.success("Pembimbing berhasil ditambahkan");
      await fetchPembimbing();

      setShowModal(false);
      setForm({
        nama: "",
        email: "",
        password: "",
        divisi: "",
      });
    } catch (err) {
      console.error("Error details:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Gagal menambahkan pembimbing";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      setIsLoading(true);
      const newStatus = currentStatus === "aktif" ? "tidak aktif" : "aktif";
      await axios.patch(`http://localhost:5000/api/pembimbing/${id}/status`, {
        status: newStatus,
      });
      toast.success(`Status pembimbing diubah menjadi ${newStatus}`);
      fetchPembimbing();
    } catch (err) {
      toast.error("Gagal mengubah status pembimbing");
    } finally {
      setIsLoading(false);
    }
  };

  const deletePembimbing = async (id) => {
    if (!confirm("Yakin ingin menghapus pembimbing ini?")) return;

    try {
      setIsLoading(true);
      await axios.delete(`http://localhost:5000/api/pembimbing/${id}`);
      toast.success("Pembimbing berhasil dihapus");
      fetchPembimbing();
    } catch (err) {
      toast.error("Gagal menghapus pembimbing");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRowExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    if (!expandedRows[id]) {
      fetchMahasiswa(id);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Data Pembimbing | Kominfo Palembang</title>
      </Head>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <UserCircle2 className="text-blue-600" size={28} />
          Data Pembimbing Magang
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola data pembimbing magang di Kominfo Palembang
        </p>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Users className="text-blue-600" size={20} />}
          title="Total Pembimbing"
          value={stats.total}
          color="blue"
        />
        <StatCard
          icon={<CheckCircle className="text-green-600" size={20} />}
          title="Aktif"
          value={stats.aktif}
          color="green"
        />
        <StatCard
          icon={<XCircle className="text-red-600" size={20} />}
          title="Nonaktif"
          value={stats.nonaktif}
          color="red"
        />
        <StatCard
          icon={<Activity className="text-yellow-600" size={20} />}
          title="Kapasitas Penuh"
          value={stats.kapasitasPenuh}
          color="yellow"
        />
      </div>
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Cari pembimbing..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
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
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>Tambah Pembimbing</span>
        </button>
      </div>
      {/* Data Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
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
                      <RotateCw className="animate-spin text-blue-500" />
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
                  <>
                    <tr
                      key={item._id}
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
                              toggleStatus(item._id, item.status);
                            }}
                            className="text-gray-500 hover:text-blue-600"
                            title={
                              item.status === "aktif"
                                ? "Nonaktifkan"
                                : "Aktifkan"
                            }
                          >
                            {item.status === "aktif" ? (
                              <ToggleRight className="text-green-500" />
                            ) : (
                              <ToggleLeft className="text-red-500" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePembimbing(item._id);
                            }}
                            className="text-gray-500 hover:text-red-600"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRowExpand(item._id);
                            }}
                            className="text-gray-500 hover:text-gray-700"
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
                                        Telepon
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Institusi
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Prodi
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Periode
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
                                          {mhs.telepon || "-"}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                          {mhs.institusi}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                          {mhs.prodi}
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
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                          {mhs.mulai && mhs.selesai
                                            ? `${new Date(
                                                mhs.mulai
                                              ).toLocaleDateString()} - ${new Date(
                                                mhs.selesai
                                              ).toLocaleDateString()}`
                                            : "Belum ditentukan"}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                                          {/* Tombol Detail */}
                                          <button
                                            className="text-blue-600 hover:text-blue-800"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleViewMahasiswaDetail(mhs);
                                            }}
                                          >
                                            Detail
                                          </button>

                                          {/* Tombol Logbook dengan Link */}
                                          <Link
                                            href={`/admin/DataLogbook?id=${
                                              mhs._id
                                            }&nama=${encodeURIComponent(
                                              mhs.nama
                                            )}`}
                                            className="text-green-600 hover:text-green-800"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            Logbook
                                          </Link>

                                          {/* Tombol Laporan dengan Link */}
                                          <Link
                                            href={`/admin/DataLaporanAkhir?id=${
                                              mhs._id
                                            }&nama=${encodeURIComponent(
                                              mhs.nama
                                            )}`}
                                            className="text-purple-600 hover:text-purple-800"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            Laporan
                                          </Link>
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
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMahasiswa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Detail Mahasiswa Bimbingan
                </h3>
                <button
                  onClick={() => setSelectedMahasiswa(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Data Pribadi */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Nama Lengkap
                    </h4>
                    <p className="text-gray-800 font-medium">
                      {selectedMahasiswa.nama}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p className="text-gray-800">
                      {selectedMahasiswa.email || "-"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Nomor Telepon
                    </h4>
                    <p className="text-gray-800">
                      {selectedMahasiswa.telepon || "-"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Alamat
                    </h4>
                    <p className="text-gray-800 whitespace-pre-line">
                      {selectedMahasiswa.alamat || "-"}
                    </p>
                  </div>
                </div>

                {/* Data Akademik */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Institusi
                    </h4>
                    <p className="text-gray-800">
                      {selectedMahasiswa.institusi}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Program Studi
                    </h4>
                    <p className="text-gray-800">{selectedMahasiswa.prodi}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Semester
                    </h4>
                    <p className="text-gray-800">
                      {selectedMahasiswa.semester}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Status
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedMahasiswa.status === "disetujui"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedMahasiswa.status || "pending"}
                    </span>
                  </div>
                </div>

                {/* Data Magang */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Periode Magang
                    </h4>
                    <p className="text-gray-800">
                      {selectedMahasiswa.mulai && selectedMahasiswa.selesai
                        ? `${new Date(
                            selectedMahasiswa.mulai
                          ).toLocaleDateString()} - ${new Date(
                            selectedMahasiswa.selesai
                          ).toLocaleDateString()}`
                        : "Belum ditentukan"}
                    </p>
                  </div>
                  {selectedMahasiswa.pembimbing && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Pembimbing
                      </h4>
                      <div className="mt-1 p-3 bg-gray-50 rounded">
                        <p className="font-medium">
                          {selectedMahasiswa.pembimbing.nama}
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedMahasiswa.pembimbing.divisi}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
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
      {/* Add Pembimbing Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Tambah Pembimbing
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Pembimbing
                  </label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Divisi
                  </label>
                  <select
                    value={form.divisi}
                    onChange={(e) =>
                      setForm({ ...form, divisi: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih Divisi</option>
                    <option>Teknik Informatika</option>
                    <option>Sistem Informasi</option>
                    <option>Ilmu Komputer</option>
                    <option>Teknologi Informasi</option>
                    <option>Manajemen Informatika</option>
                    <option>Teknik Komputer</option>
                    <option>Rekayasa Perangkat Lunak</option>
                    <option>Jaringan Komputer</option>
                    <option>Multimedia</option>
                    <option>Komputer Akuntansi</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <RotateCw className="animate-spin" size={18} />
                    )}
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// Di dalam komponen StatCard (tambahkan jika belum ada)
const StatCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

  const textColor = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow flex items-center">
      <div className={`p-3 rounded-full mr-4 ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className={`text-2xl font-bold ${textColor[color]}`}>{value}</div>
      </div>
    </div>
  );
};
