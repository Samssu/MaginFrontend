"use client";

import React from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/navigation"; // ← Import useRouter
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
} from "lucide-react";

export default function Pembimbing() {
  const router = useRouter(); // ← Inisialisasi router
  const [pembimbing, setPembimbing] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [mahasiswaBimbingan, setMahasiswaBimbingan] = useState([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

  // Format tanggal ke bahasa Indonesia
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Handle view detail mahasiswa
  const handleViewMahasiswaDetail = (mahasiswa) => {
    setSelectedMahasiswa(mahasiswa);
  };

  // Fetch data pembimbing
  useEffect(() => {
    const fetchPembimbing = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:5000/api/pembimbing");
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
      const res = await axios.get(
        `http://localhost:5000/api/pembimbing/${pembimbingId}/mahasiswa`
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
        <title>Data Peserta | Kominfo Palembang</title>
        <meta
          name="description"
          content="Kelola data peserta magang Kominfo Palembang"
        />
      </Head>

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <UserCircle2 className="text-blue-600" size={28} />
          Data Peserta Magang
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Kelola Data Peserta magang di Kominfo Palembang
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
                                          <div className="mt-6 flex justify-end gap-3">
                                            <Link
                                              href="/pembimbing/LogbookMagang"
                                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                                            >
                                              <BookOpen size={16} />
                                              Lihat Logbook
                                            </Link>
                                            <Link
                                              href="/pembimbing/LaporanAkhir"
                                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                                            >
                                              <FileText size={16} />
                                              Lihat Laporan
                                            </Link>
                                            <button
                                              onClick={() =>
                                                setSelectedMahasiswa(null)
                                              }
                                              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                            >
                                              Tutup
                                            </button>
                                          </div>
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

      {/* Modal Detail Mahasiswa */}
      {selectedMahasiswa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Detail Mahasiswa Bimbingan
                </h3>
                <button
                  onClick={() => setSelectedMahasiswa(null)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Tutup modal"
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
                        ? `${formatDate(
                            selectedMahasiswa.mulai
                          )} - ${formatDate(selectedMahasiswa.selesai)}`
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

              <div className="mt-6 flex justify-end gap-3">
                <Link
                  href="/pembimbing/LogbookMagang"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                >
                  <BookOpen size={16} />
                  Lihat Logbook
                </Link>
                <Link
                  href="/pembimbing/LaporanAkhir"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                >
                  <FileText size={16} />
                  Lihat Laporan
                </Link>
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
    </PembimbingLayout>
  );
}
